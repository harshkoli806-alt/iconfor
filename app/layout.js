import "./globals.css";
import { SITE } from "../lib/tools";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "iconfor.ai — copy the logo of any AI tool",
    template: "%s | iconfor.ai",
  },
  description:
    "Search any AI tool and copy its icon as a URL, a React component or an image tag. Free, no signup.",
  openGraph: { type: "website", siteName: "iconfor.ai" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
