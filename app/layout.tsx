import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kay Zouzou — Bar à cocktails artisanal",
  description: "Cocktails maison pour soirées, mariages et événements privés. Découvrez notre carte, nos événements et l'avis de nos invités.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
