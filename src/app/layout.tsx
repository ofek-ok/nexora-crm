import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Nexora – ייבוא מוגן מחו״ל | חיסכון עד 50% על עלויות הרכש",
  description: "Nexora מייבאת עבורך מוצרים ישירות מהמפעל בחו\"ל ועד דלת העסק – בחצי מחיר ובאפס דאגות. בדיקת רווחיות חינם ללא התחייבות.",
  keywords: ["ייבוא מחו\"ל", "ייבוא מסחרי", "עמילות מכס", "שילוח בינלאומי", "רכש גלובלי", "חיסכון בייבוא"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Nexora – ייבוא מוגן מחו״ל | חיסכון עד 50% על עלויות הרכש",
    description: "מייבאים עבורך ישירות מהמפעל בחו\"ל ועד דלת העסק. בדיקת רווחיות חינם.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}

