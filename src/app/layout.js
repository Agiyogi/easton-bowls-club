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

export const metadata = {
  title: "Easton Bowls Club | Suffolk",
  description: "Easton Bowls Club — set in the beautiful Deben Valley, Suffolk. Welcoming players of all ages and abilities. View fixtures, membership, and events.",
  keywords: "bowls, bowling, Easton, Suffolk, Deben Valley, lawn bowls, bowls club, Framlingham",
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
