"use client";
import { useState } from "react";
import Link from "next/link";
import { iconUrl } from "../lib/tools";

// Icons load at different speeds and some domains have no favicon at all.
// Reserve the space, then fade in — or fall back to a monogram so the
// grid never shows a broken image.
export function Glyph({ tool, size = 44 }) {
  const [state, setState] = useState("loading");
  const box = { width: size, height: size };

  return (
    <span className="glyph" style={box}>
      {state !== "ready" && (
        <span className={`glyphfill ${state}`} style={box} aria-hidden="true">
          {state === "failed" ? tool.name[0].toUpperCase() : null}
        </span>
      )}
      <img
        src={iconUrl(tool.domain)}
        alt=""
        loading="lazy"
        width={size}
        height={size}
        style={{ ...box, opacity: state === "ready" ? 1 : 0 }}
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
      />
    </span>
  );
}

export function Tile({ tool, onCopy, onMore, selecting, selected, onSelect }) {
  if (selecting) {
    return (
      <div
        className={`tile${selected ? " picked" : ""}`}
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onClick={() => onSelect(tool)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(tool);
          }
        }}
      >
        <span className="tick" aria-hidden="true">{selected ? "✓" : ""}</span>
        <Glyph tool={tool} />
        <div>
          <div className="nm">{tool.name}</div>
          <div className="dm">{tool.domain}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tile">
      <button className="tap" onClick={() => onCopy(tool)} aria-label={`Copy the ${tool.name} icon`}>
        <Glyph tool={tool} />
        <div>
          <div className="nm">{tool.name}</div>
          <div className="dm">{tool.domain}</div>
        </div>
        <span className="tapnote" aria-hidden="true">Tap to copy</span>
      </button>

      <button
        className="more"
        onClick={(e) => {
          e.stopPropagation();
          onMore(tool);
        }}
        aria-label={`More formats for ${tool.name}`}
      >
        <span aria-hidden="true">···</span>
      </button>

      <Link className="peek" href={`/icons/${tool.slug}`} aria-label={`${tool.name} icon details`}>
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
