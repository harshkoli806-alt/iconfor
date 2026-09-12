"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { iconUrl } from "../lib/tools";
import { copyText, payload } from "../lib/copy";
import { Glyph } from "./Tile";

const FORMATS = [
  { id: "url", label: "Image link", note: "A web address you can paste anywhere" },
  { id: "img", label: "HTML", note: "An <img> tag for a web page" },
  { id: "react", label: "React component", note: "Ready to paste into your codebase" },
];

export function Sheet({ tool, onClose, onCopied }) {
  const [done, setDone] = useState(null);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!tool) return null;

  const grab = (id) => {
    copyText(payload(tool, id)).then(() => {
      setDone(id);
      onCopied(`${tool.name} copied`);
      setTimeout(() => onClose(), 550);
    });
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet2" role="dialog" aria-label={`Formats for ${tool.name}`} onClick={(e) => e.stopPropagation()}>
        <div className="sheethead">
          <Glyph tool={tool} size={36} />
          <div>
            <strong>{tool.name}</strong>
            <span>{tool.domain}</span>
          </div>
          <button className="shut" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="fmts">
          {FORMATS.map((f) => (
            <button key={f.id} className={`fmt${done === f.id ? " done" : ""}`} onClick={() => grab(f.id)}>
              <span className="fl">{done === f.id ? "Copied" : f.label}</span>
              <span className="fn">{f.note}</span>
            </button>
          ))}
          <a className="fmt" href={iconUrl(tool.domain, 256)} target="_blank" rel="noopener noreferrer">
            <span className="fl">Download PNG</span>
            <span className="fn">256px, transparent background</span>
          </a>
        </div>

        <Link className="sheetlink" href={`/icons/${tool.slug}`}>
          Open the {tool.name} icon page
        </Link>
      </div>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span aria-hidden="true">✓</span> {message}
    </div>
  );
}
