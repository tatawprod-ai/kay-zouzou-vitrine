import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kay Zouzou",
  description: "Le menu, les avis et les témoignages de Kay Zouzou.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
