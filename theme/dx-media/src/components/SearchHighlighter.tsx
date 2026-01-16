"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitTerms(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  const parts = Array.from(new Set(q.split(/\s+/).filter(Boolean)));
  if (!parts.includes(q)) parts.push(q);
  return parts.slice(0, 8);
}

function shouldSkip(node: Node | null): boolean {
  let el: Node | null = node;
  while (el && el instanceof HTMLElement) {
    const tag = el.tagName.toLowerCase();
    // code/pre もハイライト対象に含めるため、スキップしない
    if (tag === 'kbd' || tag === 'script' || tag === 'style' || tag === 'svg') return true;
    if (tag === 'mark' && (el as HTMLElement).classList.contains('fd-search-highlight')) return true;
    el = el.parentElement;
  }
  return false;
}

function clearHighlights(root: Element) {
  const marks = root.querySelectorAll('mark.fd-search-highlight');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
}

function highlightIn(root: Element, terms: string[]): number {
  if (terms.length === 0) return 0;
  const patternGlobal = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const patternTest = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'i');
  let count = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement as HTMLElement | null;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (shouldSkip(parent)) return NodeFilter.FILTER_REJECT;
      if (!patternTest.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  } as any);

  const nodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    nodes.push(current as Text);
  }

  for (const textNode of nodes) {
    const value = textNode.nodeValue || '';
    const parts = value.split(patternGlobal);
    if (parts.length <= 1) continue;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      if (i % 2 === 1) {
        const mark = document.createElement('mark');
        mark.className = 'fd-search-highlight';
        mark.textContent = part;
        frag.appendChild(mark);
        count++;
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    }
    const parent = textNode.parentNode;
    if (parent) parent.replaceChild(frag, textNode);
  }
  return count;
}

export function SearchHighlighter() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    const terms = splitTerms(q);

    const run = () => {
      const roots = Array.from(document.querySelectorAll(
        // Fumadocs infra側のDOMに合わせた候補
        '#nd-page article, article, .prose'
      )) as Element[];
      if (roots.length === 0) return;
      roots.forEach(clearHighlights);
      if (terms.length === 0) return;
      let total = 0;
      roots.forEach((el) => {
        total += highlightIn(el, terms);
      });
      if (total > 0 && window.location.hash) {
        const el = document.getElementById(window.location.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' } as any);
      }
    };

    run();
    const t = setTimeout(run, 50);
    return () => clearTimeout(t);
  }, [searchParams]);

  return null;
}


