import { useFormValue } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function blocksToText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) =>
      (b.children as { text?: string }[]).map((c) => c.text ?? "").join(""),
    )
    .join(" ");
}

function countKeyword(text: string, kw: string): number {
  if (!kw) return 0;
  return (text.toLowerCase().match(new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractHeadings(blocks: PortableTextBlock[]): { style: string; text: string }[] {
  return blocks
    .filter((b) => b._type === "block" && /^h[1-6]$/.test((b as { style?: string }).style ?? ""))
    .map((b) => ({
      style: (b as { style?: string }).style ?? "",
      text: (b.children as { text?: string }[]).map((c) => c.text ?? "").join(""),
    }));
}

function extractLinks(blocks: PortableTextBlock[]): { href: string }[] {
  const links: { href: string }[] = [];
  for (const block of blocks) {
    if (block._type !== "block") continue;
    const markDefs = (block as { markDefs?: { _type: string; href?: string }[] }).markDefs ?? [];
    for (const def of markDefs) {
      if (def._type === "link" && def.href) links.push({ href: def.href });
    }
  }
  return links;
}

function extractImages(blocks: PortableTextBlock[]): { alt?: string }[] {
  return blocks
    .filter((b) => b._type === "image")
    .map((b) => ({ alt: (b as { alt?: string }).alt }));
}

// ─── scoring ────────────────────────────────────────────────────────────────

type Check = { label: string; pass: boolean; info: string };

function runChecks(doc: {
  title?: string;
  slug?: { current?: string };
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  content?: PortableTextBlock[];
  excerpt?: string;
}): Check[] {
  const kw = (doc.focusKeyword ?? "").trim().toLowerCase();
  const seoTitle = (doc.seoTitle ?? doc.title ?? "").trim();
  const seoDesc = (doc.seoDescription ?? "").trim();
  const slug = doc.slug?.current ?? "";
  const blocks = doc.content ?? [];
  const bodyText = blocksToText(blocks).toLowerCase();
  const words = wordCount(bodyText);
  const headings = extractHeadings(blocks);
  const links = extractLinks(blocks);
  const images = extractImages(blocks);
  const internalLinks = links.filter((l) => !l.href.startsWith("http") || l.href.includes("growthpad.co.ke"));
  const externalLinks = links.filter((l) => l.href.startsWith("http") && !l.href.includes("growthpad.co.ke"));
  const imagesWithoutAlt = images.filter((i) => !i.alt?.trim());
  const h2h3 = headings.filter((h) => h.style === "h2" || h.style === "h3");
  const kwDensity = words > 0 ? (countKeyword(bodyText, kw) / words) * 100 : 0;

  // Flesch-Kincaid approximation: avg sentence length
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen = sentences.length > 0 ? words / sentences.length : 0;
  const readabilityPass = avgSentenceLen <= 20;

  const firstParagraph = blocks.find(
    (b) => b._type === "block" && (b as { style?: string }).style === "normal",
  );
  const firstParaText = firstParagraph
    ? (firstParagraph.children as { text?: string }[]).map((c) => c.text ?? "").join("").toLowerCase()
    : "";

  return [
    {
      label: "Focus keyword set",
      pass: kw.length > 0,
      info: kw.length > 0 ? `"${kw}"` : "No focus keyword entered",
    },
    {
      label: "Keyword in SEO title",
      pass: kw.length > 0 && seoTitle.toLowerCase().includes(kw),
      info: kw.length === 0 ? "Set a focus keyword first" : seoTitle.toLowerCase().includes(kw) ? "Found in title" : "Not found in SEO title",
    },
    {
      label: "Keyword in URL slug",
      pass: kw.length > 0 && slug.includes(kw.replace(/\s+/g, "-")),
      info: kw.length === 0 ? "Set a focus keyword first" : slug.includes(kw.replace(/\s+/g, "-")) ? "Found in slug" : "Not found in slug",
    },
    {
      label: "Keyword in first paragraph",
      pass: kw.length > 0 && firstParaText.includes(kw),
      info: kw.length === 0 ? "Set a focus keyword first" : firstParaText.includes(kw) ? "Found in opening paragraph" : "Not found in first paragraph",
    },
    {
      label: "Keyword in meta description",
      pass: kw.length > 0 && seoDesc.toLowerCase().includes(kw),
      info: kw.length === 0 ? "Set a focus keyword first" : seoDesc.toLowerCase().includes(kw) ? "Found in description" : "Not found in meta description",
    },
    {
      label: "Keyword density (0.5–2.5%)",
      pass: kw.length > 0 && kwDensity >= 0.5 && kwDensity <= 2.5,
      info: kw.length === 0 ? "Set a focus keyword first" : `${kwDensity.toFixed(2)}% (${countKeyword(bodyText, kw)} occurrences in ${words} words)`,
    },
    {
      label: "SEO title length (30–60 chars)",
      pass: seoTitle.length >= 30 && seoTitle.length <= 60,
      info: `${seoTitle.length} characters`,
    },
    {
      label: "Meta description length (120–160 chars)",
      pass: seoDesc.length >= 120 && seoDesc.length <= 160,
      info: `${seoDesc.length} characters`,
    },
    {
      label: "Content length (≥ 300 words)",
      pass: words >= 300,
      info: `${words} words`,
    },
    {
      label: "H2 or H3 headings present",
      pass: h2h3.length > 0,
      info: h2h3.length > 0 ? `${h2h3.length} subheading${h2h3.length > 1 ? "s" : ""} found` : "No H2/H3 headings in content",
    },
    {
      label: "All images have alt text",
      pass: images.length === 0 || imagesWithoutAlt.length === 0,
      info: images.length === 0 ? "No images in content" : imagesWithoutAlt.length === 0 ? `${images.length} image${images.length > 1 ? "s" : ""}, all have alt text` : `${imagesWithoutAlt.length} image${imagesWithoutAlt.length > 1 ? "s" : ""} missing alt text`,
    },
    {
      label: "Internal link present",
      pass: internalLinks.length > 0,
      info: internalLinks.length > 0 ? `${internalLinks.length} internal link${internalLinks.length > 1 ? "s" : ""}` : "No internal links found",
    },
    {
      label: "External link present",
      pass: externalLinks.length > 0,
      info: externalLinks.length > 0 ? `${externalLinks.length} external link${externalLinks.length > 1 ? "s" : ""}` : "No external links found",
    },
    {
      label: "Readability (avg ≤ 20 words/sentence)",
      pass: readabilityPass,
      info: `Avg ${avgSentenceLen.toFixed(1)} words per sentence`,
    },
    {
      label: "Schema markup reminder",
      pass: true,
      info: "Article schema is applied automatically via page metadata",
    },
  ];
}

// ─── component ──────────────────────────────────────────────────────────────

// Used as components.input on a dummy string field — lives inside the form
// so useFormValue has access to FormValueProvider.
export function SeoAnalysis() {
  const title = useFormValue(["title"]) as string | undefined;
  const slug = useFormValue(["slug"]) as { current?: string } | undefined;
  const seoTitle = useFormValue(["seoTitle"]) as string | undefined;
  const seoDescription = useFormValue(["seoDescription"]) as string | undefined;
  const focusKeyword = useFormValue(["focusKeyword"]) as string | undefined;
  const content = useFormValue(["content"]) as PortableTextBlock[] | undefined;
  const excerpt = useFormValue(["excerpt"]) as string | undefined;
  const coverImage = useFormValue(["coverImage"]) as { asset?: { _ref?: string } } | undefined;

  const checks = runChecks({ title, slug, seoTitle, seoDescription, focusKeyword, content, excerpt });
  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  const displayTitle = (seoTitle ?? title ?? "").trim() || "Post title will appear here";
  const displayDesc = (seoDescription ?? excerpt ?? "").trim() || "Meta description will appear here.";
  const displaySlug = slug?.current ?? "post-slug";
  const displayUrl = `growthpad.co.ke/blog/${displaySlug}`;

  const scoreColor = score >= 70 ? "#0a7c42" : score >= 40 ? "#b45309" : "#b91c1c";
  const scoreBg = score >= 70 ? "#dcfce7" : score >= 40 ? "#fef3c7" : "#fee2e2";

  // OG image URL from Sanity CDN
  const assetRef = coverImage?.asset?._ref ?? "";
  const ogImageUrl = assetRef
    ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ebeq7cmu"}/production/${assetRef.replace("image-", "").replace(/-([a-z]+)$/, ".$1")}?w=1200&h=630&fit=crop`
    : null;

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif", fontSize: "14px", color: "#111" }}>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: scoreBg, color: scoreColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", fontWeight: 700, flexShrink: 0,
          border: `3px solid ${scoreColor}`,
        }}>
          {score}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "16px" }}>SEO Score</div>
          <div style={{ color: "#555", marginTop: 2 }}>{passed} of {checks.length} checks passed</div>
          <div style={{
            marginTop: 6, height: 6, width: 200, background: "#e5e7eb", borderRadius: 4, overflow: "hidden",
          }}>
            <div style={{ height: "100%", width: `${score}%`, background: scoreColor, borderRadius: 4, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* Google SERP Preview */}
      <Section title="Google Search Preview">
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", background: "#fff" }}>
          <div style={{ fontSize: "12px", color: "#555", marginBottom: 4 }}>{displayUrl}</div>
          <div style={{
            fontSize: "18px", color: "#1a0dab", fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: "100%",
          }}>
            {displayTitle.slice(0, 60)}{displayTitle.length > 60 ? "…" : ""}
          </div>
          <div style={{ color: "#4d5156", marginTop: 4, lineHeight: 1.5 }}>
            {displayDesc.slice(0, 160)}{displayDesc.length > 160 ? "…" : ""}
          </div>
        </div>
        <CharBar label="Title" value={displayTitle.length} min={30} max={60} />
        <CharBar label="Description" value={displayDesc.length} min={120} max={160} />
      </Section>

      {/* OG Preview */}
      <Section title="Open Graph Preview">
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#f9fafb" }}>
          {ogImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ogImageUrl} alt="OG preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13 }}>
              No cover image set
            </div>
          )}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>growthpad.co.ke</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{displayTitle.slice(0, 60)}{displayTitle.length > 60 ? "…" : ""}</div>
            <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{displayDesc.slice(0, 100)}{displayDesc.length > 100 ? "…" : ""}</div>
          </div>
        </div>
      </Section>

      {/* Checks */}
      <Section title="SEO Checks">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 6, background: c.pass ? "#f0fdf4" : "#fef2f2" }}>
              <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>{c.pass ? "✅" : "❌"}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{c.label}</div>
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
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#374151", marginBottom: 10, borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function CharBar({ label, value, min, max }: { label: string; value: number; min: number; max: number }) {
  const over = value > max;
  const under = value < min;
  const color = over || under ? "#b45309" : "#0a7c42";
  const pct = Math.min((value / (max * 1.2)) * 100, 100);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value} / {max} chars {over ? "(too long)" : under ? "(too short)" : "✓"}</span>
      </div>
      <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
