"use client";

import { useState } from "react";
import { Button, Card, Stack, Text } from "@sanity/ui";
import { set, useClient, useFormValue, type ObjectInputProps } from "sanity";

type FileFieldValue = { asset?: { _ref?: string } };

const API_VERSION = "2024-01-01";

// Renders page 1 of the document's uploaded PDF to a canvas, client-side
// (pdfjs-dist), then uploads the result as a real Sanity image asset —
// no server-side PDF-rendering infra needed, since this only ever runs
// inside the Studio (a browser environment) when an editor clicks the
// button.
async function renderPdfFirstPageToBlob(pdfUrl: string): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`Couldn't fetch the PDF (${res.status}).`);
  const buffer = await res.arrayBuffer();

  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await doc.getPage(1);

  const targetWidth = 800;
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas isn't supported in this browser.");

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Couldn't convert the rendered page to an image."));
    }, "image/png");
  });
}

export function CoverImageInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion: API_VERSION });
  const file = useFormValue(["file"]) as FileFieldValue | undefined;
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const fileAssetId = file?.asset?._ref;

  const handleGenerate = async () => {
    if (!fileAssetId) return;
    setStatus("working");
    setError(null);

    try {
      const fileAsset = await client.getDocument(fileAssetId);
      const pdfUrl = fileAsset?.url as string | undefined;
      if (!pdfUrl) throw new Error("Couldn't resolve the PDF's URL.");

      const blob = await renderPdfFirstPageToBlob(pdfUrl);
      const imageAsset = await client.assets.upload("image", blob, {
        filename: "cover-from-pdf.png",
      });

      props.onChange(
        set({
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        }),
      );
      setStatus("idle");
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
              No cover image? Generate one from page 1 of the PDF above.
            </Text>
            <Button
              text={
                status === "working"
                  ? "Generating…"
                  : "Generate thumbnail from PDF"
              }
              tone="primary"
              disabled={status === "working"}
              onClick={handleGenerate}
            />
            {status === "error" && (
              <Text size={1} style={{ color: "var(--card-critical-fg-color, #e03)" }}>
                {error}
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
