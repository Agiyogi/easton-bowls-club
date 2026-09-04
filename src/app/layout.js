import { Libre_Baskerville, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

const SITE_URL = "https://www.eastonbowlsclub.com";
const DESCRIPTION =
  "Easton Bowls Club — set in the beautiful Deben Valley, Suffolk. Welcoming players of all ages and abilities. View fixtures, membership, and events.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Easton Bowls Club | Suffolk",
  description: DESCRIPTION,
  keywords: "bowls, bowling, Easton, Suffolk, Deben Valley, lawn bowls, bowls club, Framlingham",
  // Link previews (WhatsApp, iMessage, Facebook, X). Swap the image when the
  // Fynn League promotion comes down.
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Easton Bowls Club",
    title: "Easton A are Fynn League champions 2026",
    description: DESCRIPTION,
    locale: "en_GB",
    images: [
      {
        url: "/images/og-fynn-winners.jpg",
        width: 1200,
        height: 630,
        alt: "Fireworks over the Easton bowling green — Fynn League winners 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Easton A are Fynn League champions 2026",
    description: DESCRIPTION,
    images: ["/images/og-fynn-winners.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
