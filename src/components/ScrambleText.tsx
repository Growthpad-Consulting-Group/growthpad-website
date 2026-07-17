"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

class TextScramble {
  el: HTMLElement;
  chars = '!<>-_\\/[]{}—=+*^?#________';
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
  frameRequest = 0;
  frame = 0;
  resolve?: (value: unknown) => void;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 120); // Increased from 40
      const end = start + Math.floor(Math.random() * 120); // Increased from 40
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update = () => {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length && this.resolve) {
      this.resolve(null);
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  };

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function ScrambleText({
  text,
  className = "",
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<TextScramble | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = ref.current;
    if (!element) return;

    // Initialize with empty string first
    element.innerText = "";
    fxRef.current = new TextScramble(element);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        if (!hasAnimatedRef.current && fxRef.current) {
          hasAnimatedRef.current = true;
          gsap.delayedCall(delay, () => {
            fxRef.current?.setText(text);
          });
        }
      },
      once: true,
    });

    return () => {
      trigger.kill();
      if (fxRef.current) {
        cancelAnimationFrame(fxRef.current.frameRequest);
      }
    };
  }, [text, delay]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
    />
  );
}