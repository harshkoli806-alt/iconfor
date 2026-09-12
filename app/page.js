"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOOLS, CATEGORIES, asDomain } from "../lib/tools";
import { copyText, payload } from "../lib/copy";
import { Masthead, Footer } from "./Chrome";
import { Tile } from "./Tile";
import { Sheet, Toast } from "./Sheet";

export default function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState(() => new Set());
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const input = useRef(null);
  const timer = useRef(null);

  const say = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1600);
  };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const found = TOOLS.filter(
      (t) =>
        (cat === "all" || t.category === cat) &&
        (!s ||
          t.name.toLowerCase().includes(s) ||
          t.domain.toLowerCase().includes(s) ||
          t.category.includes(s))
    );
    if (found.length === 0 && s) {
      const guess = asDomain(q);
      if (guess) return [guess];
    }
    return found;
  }, [q, cat]);

  const isLive = list.length === 1 && list[0].live;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== input.current) {
        e.preventDefault();
        input.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === input.current) setQ("");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const quickCopy = (tool) => {
    copyText(payload(tool, "url")).then(() => say(`${tool.name} link copied`));
  };

  const toggle = (tool) => {
    const next = new Set(picked);
    if (next.has(tool.slug)) next.delete(tool.slug);
    else next.add(tool.slug);
    setPicked(next);
  };

  const bulk = (kind, label) => {
    const sel = TOOLS.filter((t) => picked.has(t.slug));
    copyText(sel.map((t) => payload(t, kind)).join("\n\n")).then(() =>
      say(`${sel.length} ${label} copied`)
    );
  };

  return (
    <>
      <Masthead>
        <button
          className="ghost"
          aria-pressed={selecting}
          onClick={() => {
            setSelecting(!selecting);
            if (selecting) setPicked(new Set());
          }}
        >
          {selecting ? "Done" : "Pick several"}
        </button>
      </Masthead>

      <section className="hero">
        <div className="searchrow">
          <input
            id="q"
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && list[0]) quickCopy(list[0]);
            }}
            placeholder="Search a tool"
            autoComplete="off"
            spellCheck="false"
            aria-label="Search AI tools"
          />
          {q && (
            <button
              className="clearq"
              onClick={() => {
                setQ("");
                input.current?.focus();
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="count">
          <span>
            {list.length} icon{list.length === 1 ? "" : "s"}
          </span>
          <span className="onlybig">
            Tap any icon to copy its link · <kbd>/</kbd> to search
          </span>
        </div>
      </section>

      <nav className="cats" aria-label="Filter by category">
        <button className={`cat${cat === "all" ? " on" : ""}`} onClick={() => setCat("all")}>
          all
        </button>
        {Object.keys(CATEGORIES).map((c) => (
          <button key={c} className={`cat${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </nav>

      {selecting && (
        <div className="tray show">
          <span>{picked.size ? `${picked.size} selected` : "Tap icons to select them"}</span>
          {picked.size > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => bulk("url", "links")}>Copy links</button>
              <button onClick={() => bulk("img", "HTML tags")}>Copy HTML</button>
              <button onClick={() => bulk("react", "components")}>Copy React</button>
              <button onClick={() => setPicked(new Set())}>Clear</button>
            </div>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty">
          Nothing matched <b>{q.trim()}</b>.
          <span className="emptyhint">
            Try a website address instead, like <code>stripe.com</code> — any site on the
            internet works.
          </span>
        </div>
      ) : (
        <>
        {isLive && (
          <p className="livenote">Not in the library yet — pulled live from the web.</p>
        )}
        <main className="sheet">
          {list.map((t) => (
            <Tile
              key={t.slug}
              tool={t}
              onCopy={quickCopy}
              onMore={setSheet}
              selecting={selecting}
              selected={picked.has(t.slug)}
              onSelect={toggle}
            />
          ))}
        </main>
        </>
      )}

      <Sheet tool={sheet} onClose={() => setSheet(null)} onCopied={say} />
      <Toast message={toast} />
      <Footer />
    </>
  );
}
