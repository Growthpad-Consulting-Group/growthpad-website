import { useState, useEffect } from "react";
import { useFormValue, PatchEvent, set, unset } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function blocksToText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children as { text?: string }[]).map((c) => c.text ?? "").join(""))
    .join(" ");
}

function countKeyword(text: string, kw: string): number {
  if (!kw) return 0;
  return (text.toLowerCase().match(new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractHeadings(blocks: PortableTextBlock[]) {
  return blocks
    .filter((b) => b._type === "block" && /^h[1-6]$/.test((b as { style?: string }).style ?? ""))
    .map((b) => ({ style: (b as { style?: string }).style ?? "" }));
}

function extractLinks(blocks: PortableTextBlock[]) {
  const links: { href: string }[] = [];
  for (const block of blocks) {
    if (block._type !== "block") continue;
    for (const def of (block as { markDefs?: { _type: string; href?: string }[] }).markDefs ?? []) {
      if (def._type === "link" && def.href) links.push({ href: def.href });
    }
  }
  return links;
}

function extractImages(blocks: PortableTextBlock[]) {
  return blocks.filter((b) => b._type === "image").map((b) => ({ alt: (b as { alt?: string }).alt }));
}

// ─── checks ─────────────────────────────────────────────────────────────────

type Check = { label: string; pass: boolean; info: string };

function runChecks(opts: {
  kw: string; seoTitle: string; seoDesc: string; slug: string;
  blocks: PortableTextBlock[];
}): Check[] {
  const { kw, seoTitle, seoDesc, slug, blocks } = opts;
  const bodyText = blocksToText(blocks).toLowerCase();
  const words = wordCount(bodyText);
  const headings = extractHeadings(blocks);
  const links = extractLinks(blocks);
  const images = extractImages(blocks);
  const internalLinks = links.filter((l) => !l.href.startsWith("http") || l.href.includes("growthpad.co.ke"));
  const externalLinks = links.filter((l) => l.href.startsWith("http") && !l.href.includes("growthpad.co.ke"));
  const imagesWithoutAlt = images.filter((i) => !i.alt?.trim());
  const h2h3 = headings.filter((h) => h.style === "h2" || h.style === "h3");
  const kwDensity = words > 0 && kw ? (countKeyword(bodyText, kw) / words) * 100 : 0;
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen = sentences.length > 0 ? words / sentences.length : 0;
  const firstParaText = (blocks.find((b) => b._type === "block" && (b as { style?: string }).style === "normal")
    ?.children as { text?: string }[] | undefined)?.map((c) => c.text ?? "").join("").toLowerCase() ?? "";

  const noKw = kw.length === 0;

  return [
    { label: "Focus keyword set", pass: !noKw, info: noKw ? "No focus keyword entered" : `"${kw}"` },
    { label: "Keyword in SEO title", pass: !noKw && seoTitle.toLowerCase().includes(kw), info: noKw ? "Set a focus keyword first" : seoTitle.toLowerCase().includes(kw) ? "Found in title" : "Not found in SEO title" },
    { label: "Keyword in URL slug", pass: !noKw && slug.includes(kw.replace(/\s+/g, "-")), info: noKw ? "Set a focus keyword first" : slug.includes(kw.replace(/\s+/g, "-")) ? "Found in slug" : "Not found in slug" },
    { label: "Keyword in first paragraph", pass: !noKw && firstParaText.includes(kw), info: noKw ? "Set a focus keyword first" : firstParaText.includes(kw) ? "Found in opening paragraph" : "Not found in first paragraph" },
    { label: "Keyword in meta description", pass: !noKw && seoDesc.toLowerCase().includes(kw), info: noKw ? "Set a focus keyword first" : seoDesc.toLowerCase().includes(kw) ? "Found in description" : "Not found in meta description" },
    { label: "Keyword density (0.5–2.5%)", pass: !noKw && kwDensity >= 0.5 && kwDensity <= 2.5, info: noKw ? "Set a focus keyword first" : `${kwDensity.toFixed(2)}% (${countKeyword(bodyText, kw)} of ${words} words)` },
    { label: "SEO title length (30–60 chars)", pass: seoTitle.length >= 30 && seoTitle.length <= 60, info: `${seoTitle.length} characters` },
    { label: "Meta description length (120–160 chars)", pass: seoDesc.length >= 120 && seoDesc.length <= 160, info: `${seoDesc.length} characters` },
    { label: "Content length (≥ 300 words)", pass: words >= 300, info: `${words} words` },
    { label: "H2 or H3 headings present", pass: h2h3.length > 0, info: h2h3.length > 0 ? `${h2h3.length} subheading${h2h3.length > 1 ? "s" : ""} found` : "No H2/H3 headings in content" },
    { label: "All images have alt text", pass: images.length === 0 || imagesWithoutAlt.length === 0, info: images.length === 0 ? "No images in content" : imagesWithoutAlt.length === 0 ? `${images.length} image${images.length > 1 ? "s" : ""}, all have alt text` : `${imagesWithoutAlt.length} missing alt text` },
    { label: "Internal link present", pass: internalLinks.length > 0, info: internalLinks.length > 0 ? `${internalLinks.length} internal link${internalLinks.length > 1 ? "s" : ""}` : "No internal links found" },
    { label: "External link present", pass: externalLinks.length > 0, info: externalLinks.length > 0 ? `${externalLinks.length} external link${externalLinks.length > 1 ? "s" : ""}` : "No external links found" },
    { label: "Readability (avg ≤ 20 words/sentence)", pass: avgSentenceLen <= 20, info: `Avg ${avgSentenceLen.toFixed(1)} words per sentence` },
    { label: "Schema markup", pass: true, info: "Article schema applied automatically via page metadata" },
  ];
}

// ─── component ──────────────────────────────────────────────────────────────

type InputProps = {
  id: string;
  onChange: (event: PatchEvent) => void;
};

export function SeoAnalysis({ id, onChange }: InputProps) {
  const [tab, setTab] = useState<"general" | "social">("general");

  // Read live values from the form
  const title = useFormValue(["title"]) as string | undefined;
  const slugValue = useFormValue(["slug"]) as { current?: string } | undefined;
  const seoTitleStored = useFormValue(["seoTitle"]) as string | undefined;
  const seoDescStored = useFormValue(["seoDescription"]) as string | undefined;
  const focusKeywordStored = useFormValue(["focusKeyword"]) as string | undefined;
  const content = useFormValue(["content"]) as PortableTextBlock[] | undefined;
  const excerpt = useFormValue(["excerpt"]) as string | undefined;
  const coverImage = useFormValue(["coverImage"]) as { asset?: { _ref?: string } } | undefined;

  // Local editable state — initialised from stored values, edits patch on blur
  const [localKw, setLocalKw] = useState(focusKeywordStored ?? "");
  const [localTitle, setLocalTitle] = useState(seoTitleStored ?? "");
  const [localSlug, setLocalSlug] = useState(slugValue?.current ?? "");
  const [localDesc, setLocalDesc] = useState(seoDescStored ?? "");
  const [kwInput, setKwInput] = useState("");

  // Sync all local state when Sanity loads the stored values (first render may be empty)
  useEffect(() => { if (focusKeywordStored) setLocalKw(focusKeywordStored); }, [focusKeywordStored]);
  useEffect(() => { if (seoTitleStored) setLocalTitle(seoTitleStored); }, [seoTitleStored]);
  useEffect(() => { if (slugValue?.current) setLocalSlug(slugValue.current); }, [slugValue?.current]);
  useEffect(() => { if (seoDescStored) setLocalDesc(seoDescStored); }, [seoDescStored]);

  // Patch helpers — write back to Sanity document fields
  function patchField(fieldName: string, value: string) {
    onChange(PatchEvent.from(value ? set(value, [fieldName]) : unset([fieldName])));
  }

  function patchSlug(value: string) {
    onChange(PatchEvent.from(value ? set({ current: value }, ["slug"]) : unset(["slug"])));
  }

  // Derived display values
  const kw = localKw.trim().toLowerCase();
  const seoTitle = localTitle || title || "";
  const seoDesc = localDesc || excerpt || "";
  const slug = localSlug || slugValue?.current || "";
  const blocks = content ?? [];

  const checks = runChecks({ kw, seoTitle, seoDesc, slug, blocks });
  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  const scoreColor = score >= 70 ? "#0a7c42" : score >= 40 ? "#b45309" : "#b91c1c";
  const scoreBg = score >= 70 ? "#dcfce7" : score >= 40 ? "#fef3c7" : "#fee2e2";

  const displayUrl = `growthpad.co.ke/blog/${slug}`;

  const assetRef = coverImage?.asset?._ref ?? "";
  const ogImageUrl = assetRef
    ? `https://cdn.sanity.io/images/ebeq7cmu/production/${assetRef.replace("image-", "").replace(/-([a-z]+)$/, ".$1")}?w=1200&h=630&fit=crop`
    : null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 14, color: "#111", borderTop: "1px solid #e5e7eb", paddingTop: 24, marginTop: 8 }}>

      {/* Score row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: scoreBg, color: scoreColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, flexShrink: 0, border: `3px solid ${scoreColor}` }}>
          {score}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>SEO Score</div>
          <div style={{ color: "#555", marginTop: 2, fontSize: 13 }}>{passed} of {checks.length} checks passed</div>
          <div style={{ marginTop: 6, height: 6, width: 220, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, background: scoreColor, borderRadius: 4, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* Focus keyword */}
      <Section title="Focus Keyword">
        <input
          type="text"
          value={localKw}
          placeholder="e.g. digital marketing Kenya"
          onChange={(e) => setLocalKw(e.target.value)}
          onBlur={() => patchField("focusKeyword", localKw.trim())}
          style={inputStyle}
        />
        <p style={hintStyle}>The primary keyword this post targets. Drives all SEO checks below.</p>
      </Section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 16 }}>
        {(["general", "social"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 18px", fontSize: 13, fontWeight: 600, border: "none",
              background: "none", cursor: "pointer", textTransform: "capitalize",
              color: tab === t ? "#f05d23" : "#888",
              borderBottom: tab === t ? "2px solid #f05d23" : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            {t === "general" ? "General" : "Social"}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <>
          {/* SERP Preview */}
          <Section title="Search Preview">
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", background: "#fff", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{displayUrl}</div>
              <div style={{ fontSize: 18, color: "#1a0dab", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {seoTitle.slice(0, 60)}{seoTitle.length > 60 ? "…" : ""}
              </div>
              <div style={{ color: "#4d5156", marginTop: 4, lineHeight: 1.5, fontSize: 13 }}>
                {seoDesc.slice(0, 160)}{seoDesc.length > 160 ? "…" : ""}
              </div>
            </div>
          </Section>

          {/* Editable Title */}
          <Section title="SEO Title">
            <input
              type="text"
              value={localTitle}
              placeholder={title ?? "Post title"}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => patchField("seoTitle", localTitle.trim())}
              style={inputStyle}
            />
            <CharBar value={seoTitle.length} min={30} max={60} />
            <p style={hintStyle}>Shown as the clickable headline in Google. Falls back to post title if empty.</p>
          </Section>

          {/* Editable Slug */}
          <Section title="Permalink">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#888", flexShrink: 0 }}>growthpad.co.ke/blog/</span>
              <input
                type="text"
                value={localSlug}
                placeholder="post-slug"
                onChange={(e) => setLocalSlug(slugify(e.target.value))}
                onBlur={() => patchSlug(localSlug)}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <CharBar value={slug.length} min={20} max={75} />
            <p style={hintStyle}>The URL of this post. Keep it short and keyword-rich.</p>
          </Section>

          {/* Editable Description */}
          <Section title="Meta Description">
            <textarea
              value={localDesc}
              placeholder={excerpt ?? "Write a compelling meta description…"}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => patchField("seoDescription", localDesc.trim())}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
            <CharBar value={seoDesc.length} min={120} max={160} />
            <p style={hintStyle}>Shown below the title in search results. Falls back to excerpt if empty.</p>
          </Section>
        </>
      )}

      {tab === "social" && (
        <Section title="Open Graph Preview">
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#f9fafb", marginBottom: 12 }}>
            {ogImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ogImageUrl} alt="OG" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13 }}>
                No cover image — set one above
              </div>
            )}
            <div style={{ padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>growthpad.co.ke</div>
              <div style={{ fontWeight: 600, marginTop: 2, fontSize: 14 }}>{seoTitle.slice(0, 60)}{seoTitle.length > 60 ? "…" : ""}</div>
              <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{seoDesc.slice(0, 100)}{seoDesc.length > 100 ? "…" : ""}</div>
            </div>
          </div>
          <p style={hintStyle}>OG title and description are pulled from your SEO Title and Meta Description above. Set a cover image to control the preview image.</p>
        </Section>
      )}

      {/* SEO Checks */}
      <Section title="SEO Checks">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 10px", borderRadius: 6, background: c.pass ? "#f0fdf4" : "#fef2f2" }}>
              <span style={{ fontSize: 14, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{c.pass ? "✅" : "❌"}</span>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{c.label}</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 1 }}>{c.info}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6b7280", marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function CharBar({ value, min, max }: { value: number; min: number; max: number }) {
  const over = value > max;
  const under = value < min;
  const color = over ? "#b91c1c" : under ? "#b45309" : "#0a7c42";
  const pct = Math.min((value / (max * 1.15)) * 100, 100);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 3 }}>
        <span>{value} characters</span>
        <span style={{ color, fontWeight: 600 }}>{over ? `${value - max} over limit` : under ? `${min - value} more needed` : "✓ Good length"}</span>
      </div>
      <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.2s" }} />
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 6,
  border: "1px solid #d1d5db", outline: "none", boxSizing: "border-box",
  background: "#fff", color: "#111", fontFamily: "system-ui, sans-serif",
};

const hintStyle: React.CSSProperties = {
  margin: "5px 0 0", fontSize: 11, color: "#9ca3af", lineHeight: 1.4,
};
