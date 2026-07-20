"use client";

import { useState } from "react";
import { Button, Card, Stack, Text } from "@sanity/ui";
import { useClient, useFormValue, type ObjectInputProps } from "sanity";

type FileFieldValue = { asset?: { _ref?: string } };
const API_VERSION = "2024-01-01";

const LABELS = [
  "Position",
  "Location",
  "Employment Type",
  "Reports To",
  "Experience",
  "Department",
] as const;

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const WORK_MODES = ["On-site", "Hybrid", "Remote"];

const NOISE_LINE = /^GCG Recruitment\s*\|\s*\d+$/i;
const HEADING_LINE =
  /^\d+\.\s+\S|^about\s|^role purpose\b|minimum qualifications|preferred experience|core competencies|performance scorecard|success measures|application requirements|^kpi\b/i;
const BULLET_LINE = /^[●•*-]\s+/;

// A boundary marker for where the header table's last field (Department) ends and the
// narrative body begins. Wider than HEADING_LINE's line-start anchors since this is
// matched against a flattened, single-line string.
const BODY_BOUNDARY = /\babout [a-z]|\brole purpose\b|\bminimum qualifications\b|\d\.\s+[a-z]/i;

// Table rows can't be trusted to reconstruct as one visual line per row — a wrapped cell's
// first line can land in the same y-bucket as the *previous* row instead of its own label,
// misattributing text (see extractPdfText). pdfjs's natural item order follows real reading
// order regardless of that, so search a flattened, whitespace-collapsed version of the text
// instead: find each label in sequence (advancing the search cursor past each match so a
// stray later occurrence of a label word can't be picked up early), and bound the last
// label's value with the next label match or the first narrative-section boundary — never
// left open-ended, otherwise Department would swallow the rest of the document as its value.
function extractLabelledFields(flatText: string) {
  const normalized = flatText.replace(/\s+/g, " ").trim();
  const matches: { label: string; index: number; end: number }[] = [];
  let searchFrom = 0;

  for (const label of LABELS) {
    const re = new RegExp(`\\b${label}\\b\\s*[:\\-|]?\\s*`, "i");
    const rest = normalized.slice(searchFrom);
    const m = re.exec(rest);
    if (!m) continue;
    const index = searchFrom + m.index;
    const end = index + m[0].length;
    matches.push({ label, index, end });
    searchFrom = end;
  }

  const fields: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    let boundary = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
    const boundaryMatch = BODY_BOUNDARY.exec(normalized.slice(current.end, boundary));
    if (boundaryMatch) boundary = current.end + boundaryMatch.index;
    const value = normalized.slice(current.end, boundary).trim();
    if (value) fields[current.label] = value;
  }

  return fields;
}

// Skips past the header table in the row-grouped lines and returns everything from the
// first recognisable narrative section heading onward, for the description body.
function extractBodyText(lines: string[]) {
  const startIndex = lines.findIndex((line) => HEADING_LINE.test(line));
  return startIndex === -1 ? "" : lines.slice(startIndex).join("\n");
}

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

function makeBlock(text: string, extra: Record<string, unknown> = {}) {
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
    ...extra,
  };
}

// Row-grouped PDF lines split a single wrapped paragraph across several lines, so
// consecutive non-heading, non-bullet lines are merged back into one paragraph block
// (flushed whenever a heading or bullet line breaks the run).
function buildDescriptionBlocks(bodyText: string) {
  const lines = bodyText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line === "" || !NOISE_LINE.test(line));

  const blocks: ReturnType<typeof makeBlock>[] = [];
  let paragraph: string[] = [];
  let canAppendToBullet = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(makeBlock(paragraph.join(" ")));
    paragraph = [];
    canAppendToBullet = false;
  };

  for (const line of lines) {
    if (line === "") {
      flushParagraph();
      canAppendToBullet = false;
      continue;
    }

    const isBullet = BULLET_LINE.test(line);
    const isHeading = !isBullet && HEADING_LINE.test(line);

    if (isBullet) {
      flushParagraph();
      blocks.push(makeBlock(line.replace(BULLET_LINE, ""), { listItem: "bullet", level: 1 }));
      canAppendToBullet = true;
    } else if (isHeading) {
      flushParagraph();
      blocks.push(makeBlock(line, { style: "h4" }));
      canAppendToBullet = false;
    } else {
      if (canAppendToBullet && blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        const lastChild = lastBlock.children[0];
        lastChild.text = (lastChild.text + " " + line).trim();
      } else {
        paragraph.push(line);
        canAppendToBullet = false;
      }
    }
  }
  flushParagraph();

  return blocks;
}

function findFirst(text: string, list: string[]) {
  return list.find((option) => text.toLowerCase().includes(option.toLowerCase()));
}

function findEmail(text: string) {
  const m = /[\w.+-]+@[\w-]+\.[\w.-]+/.exec(text);
  return m?.[0] ?? null;
}

async function extractPdfText(url: string): Promise<{ flatText: string; lines: string[] }> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Couldn't fetch the document (${res.status}).`);
  const buffer = await res.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  const lines: string[] = [];
  const flatParts: string[] = [];
  const maxPages = Math.min(doc.numPages, 20);

  for (let p = 1; p <= maxPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as { str: string; transform: number[] }[];

    const rows = new Map<number, { x: number; str: string }[]>();
    for (const item of items) {
      if (!item.str.trim()) continue;
      flatParts.push(item.str);
      const y = Math.round(item.transform[5]);
      const bucketKey = [...rows.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
      if (!rows.has(bucketKey)) rows.set(bucketKey, []);
      rows.get(bucketKey)!.push({ x: item.transform[4], str: item.str });
    }

    const sortedY = [...rows.keys()].sort((a, b) => b - a);
    let prevY: number | null = null;
    for (const y of sortedY) {
      const rowItems = rows.get(y)!.sort((a, b) => a.x - b.x);
      const rowText = rowItems.map((i) => i.str).join(" ").trim();
      if (prevY !== null) {
        const diff = prevY - y;
        if (diff >= 17) {
          lines.push("");
        }
      }
      lines.push(rowText);
      prevY = y;
    }
  }

  return { flatText: flatParts.join(" "), lines };
}

async function extractDocxText(url: string): Promise<{ flatText: string; lines: string[] }> {
  const mammoth = await import("mammoth");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Couldn't fetch the document (${res.status}).`);
  const buffer = await res.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const lines = result.value
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim());
  return { flatText: result.value, lines };
}

export function JobDocumentExtractor(props: ObjectInputProps) {
  const client = useClient({ apiVersion: API_VERSION });
  const file = props.value as FileFieldValue | undefined;
  const documentId = useFormValue(["_id"]) as string | undefined;
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileAssetId = file?.asset?._ref;

  const handleExtract = async () => {
    if (!fileAssetId || !documentId) return;
    setStatus("working");
    setError(null);
    try {
      const fileAsset = await client.getDocument(fileAssetId);
      const fileUrl = fileAsset?.url as string | undefined;
      const originalFilename = (fileAsset?.originalFilename as string | undefined) ?? "";
      if (!fileUrl) throw new Error("Couldn't resolve the document's URL.");

      const isDocx = originalFilename.toLowerCase().endsWith(".docx");
      const { flatText, lines } = isDocx
        ? await extractDocxText(fileUrl)
        : await extractPdfText(fileUrl);
      const fields = extractLabelledFields(flatText);
      const bodyText = extractBodyText(lines);

      const patch: Record<string, unknown> = {};
      if (fields["Position"]) patch.title = fields["Position"];
      if (fields["Department"]) patch.department = fields["Department"];
      if (fields["Reports To"]) patch.reportsTo = fields["Reports To"];
      if (fields["Experience"]) patch.experience = fields["Experience"];
      if (fields["Location"]) patch.city = fields["Location"];
      if (fields["Employment Type"]) {
        patch.employmentType = findFirst(fields["Employment Type"], EMPLOYMENT_TYPES) ?? fields["Employment Type"];
      }
      const workMode = findFirst(flatText, WORK_MODES);
      if (workMode) patch.workMode = workMode;
      const email = findEmail(flatText);
      if (email) patch.applyUrl = `mailto:${email}`;
      const descriptionBlocks = buildDescriptionBlocks(bodyText);
      if (descriptionBlocks.length > 0) patch.description = descriptionBlocks;

      if (Object.keys(patch).length === 0) {
        throw new Error("Couldn't find any recognisable fields in this document.");
      }

      await client.patch(documentId).set(patch).commit();
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {fileAssetId && (
        <Card padding={3} radius={2} tone="transparent" border>
          <Stack space={3}>
            <Text size={1} muted>
              Extract title, department, reports to, experience, location, employment type, apply
              email, and the full job description body from this document into the fields below.
            </Text>
            <Button
              text={
                status === "working"
                  ? "Extracting…"
                  : status === "done"
                    ? "Extracted — run again"
                    : "Extract details from document"
              }
              tone="primary"
              disabled={status === "working"}
              onClick={handleExtract}
            />
            {status === "error" && (
              <Text size={1} style={{ color: "var(--card-critical-fg-color, #e03)" }}>
                {error}
              </Text>
            )}
            {status === "done" && (
              <Text size={1} style={{ color: "var(--card-positive-fg-color, #2a2)" }}>
                Fields updated below.
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
