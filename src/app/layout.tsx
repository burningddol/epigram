import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nanum_Myeongjo } from "next/font/google";
import { QueryProvider } from "@/shared/api/QueryProvider";
import { Header } from "@/widgets/header";
import "./globals.css";
import { ModalProvider } from "@/shared/ui/ModalProvider";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

// 피그마 시안의 Iropke Batang OTF 대체 — 동일 계열 한국 명조체
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-myeongjo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Epigram",
  description: "짧은 글귀를 공유하는 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${nanumMyeongjo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 flex-col">
          <QueryProvider>{children}</QueryProvider>
        </main>
        <ModalProvider />
      </body>
    </html>
  );
}
