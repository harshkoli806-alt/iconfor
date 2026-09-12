"use client";
import Link from "next/link";
import { useState } from "react";

export function Masthead({ children }) {
  const [dark, setDark] = useState(false);
  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };
  return (
    <header>
      <div className="bar">
        <Link href="/" className="mark"><i />iconfor.ai</Link>
        <div className="bartools">
          {children}
          <Link className="ghost" href="/create">Make an icon</Link>
          <button className="ghost" onClick={flip}>{dark ? "Light" : "Dark"}</button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <span>Icons are the property of their respective owners. Displayed for identification only.</span>
      <span><a href="mailto:hello@iconfor.ai">Takedown requests</a></span>
    </footer>
  );
}
