import Link from "next/link";
import { Masthead, Footer } from "./Chrome";

export default function NotFound() {
  return (
    <>
      <Masthead />
      <div className="empty" style={{ marginTop: 60 }}>
        That icon isn&rsquo;t here yet. <Link href="/" style={{ color: "var(--signal)" }}>Search the library</Link>
      </div>
      <Footer />
    </>
  );
}
