import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WunderKompass · Die große Abenteuerwelt des Wissens",
  description: "Drehe die Weltkugel, entdecke Länder und Ozeane, reise zum Erdkern und teste dein Wissen. Tiere, Geschichte, Erfindungen und Wissenschaft für Kinder ab 8 Jahren.",
  metadataBase: new URL("https://erde-entdecker.rahmati-nima92.chatgpt.site"),
  openGraph: {title:"WunderKompass",description:"Die große Abenteuerwelt des Wissens",type:"website",locale:"de_DE",images:[{url:"/og.png",width:1200,height:630,alt:"WunderKompass – Die große Abenteuerwelt des Wissens"}]},
  twitter:{card:"summary_large_image",title:"WunderKompass",images:["/og.png"]},
  manifest: "/learning.webmanifest",
  other: { "learning-build": typeof __EARTH_BUILD__ === "undefined" ? "dev" : __EARTH_BUILD__ },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
