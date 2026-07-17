"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

class TextScramble {
  el: HTMLElement;
  chars = '!<>-_\\/[]{}—=+*^?#________';
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
  frameRequest = 0;
  frame = 0;
  resolve?: (value: unknown) => void;
  originalText = "";

  constructor(el: HTMLElement) {
    this.el = el;
    this.originalText = el.innerText;
    // Initialize with empty text
    el.innerText = "";
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 80);
      const end = start + Math.floor(Math.random() * 80);
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

export default function ScrambleAllHeadings() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Find all h2 headings on the page
    const headings = document.querySelectorAll('h2');
    
    // Create a TextScramble instance for each heading
    const scramblers: TextScramble[] = [];
    
    headings.forEach((heading, index) => {
      const scrambler = new TextScramble(heading as HTMLElement);
      scramblers.push(scrambler);
      
      // Set up ScrollTrigger for each heading
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          // Stagger the animations slightly
          gsap.delayedCall(index * 0.1, () => {
            scrambler.setText(scrambler.originalText);
          });
        }
      });
    });

    // Cleanup
    return () => {
      scramblers.forEach(scrambler => {
        cancelAnimationFrame(scrambler.frameRequest);
      });
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return null; // This component doesn't render anything visible
}
