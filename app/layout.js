// app/layout.js
import "./globals.css";
import { getLang } from "@/lib/lang";
import { tr } from "@/lib/i18n";
import { LangProvider } from "@/components/LangProvider";

export async function generateMetadata() {
  const t = tr(await getLang());
  return {
    metadataBase: new URL("https://krupa.co.in"),
    title: t("site.title"),
    description: t("site.desc"),
  };
}

export default async function RootLayout({ children }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Noto+Sans+Devanagari:wght@300;400;500&family=Noto+Sans+Tamil:wght@300;400;500;600&family=Noto+Serif+Tamil:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
