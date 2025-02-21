import "./globals.css";
import SessionWrapper from "./components/SessionWrapper"; 

export const metadata = {
  title: "ระบบกองบุญออนไลน์",
  description: "ระบบกองบุญออนไลน์ วิหารพระโพธิสัตว์กวนอิมทุ่งพิชัย",
  icons: {
    icon: "/img/AdminLogo.png", // ✅ กำหนด favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}