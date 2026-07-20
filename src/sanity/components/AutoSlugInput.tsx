"use client";

import { useCallback, useEffect, useRef } from "react";
import { set, useFormValue, type SlugInputProps } from "sanity";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 96);
}

// Wraps Sanity's default slug input so it auto-fills from the sibling
// "title" field as you type — no manual "Generate" click, matching
// WordPress-style permalink behavior. Stops auto-syncing the moment the
// user edits the slug themselves, so a manual override always sticks.
export function AutoSlugInput(props: SlugInputProps) {
  const title = useFormValue(["title"]) as string | undefined;
  const touchedRef = useRef(Boolean(props.value?.current));
  const { onChange, value } = props;

  const handleChange = useCallback(
    (...args: Parameters<typeof onChange>) => {
      touchedRef.current = true;
      onChange(...args);
    },
    [onChange],
  );

  useEffect(() => {
    if (touchedRef.current || !title) return;
    const nextSlug = slugify(title);
    if (!nextSlug || value?.current === nextSlug) return;
    onChange(set({ current: nextSlug }));
  }, [title, onChange, value?.current]);

  return props.renderDefault({ ...props, onChange: handleChange });
}
