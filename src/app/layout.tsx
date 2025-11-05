import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://caothong.is-a.dev'),
  title: {
    default: "Hoàng Cao Thống - Portfolio",
    template: "%s | Hoàng Cao Thống"
  },
  description:
    "Lập trình viên trẻ với tham vọng xây dựng thương hiệu cá nhân và tự do tài chính.",
  applicationName: "Hoàng Cao Thống Portfolio",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hoàng Cao Thống | Website Developer",
    description:
      "Lập trình viên trẻ với tham vọng xây dựng thương hiệu cá nhân và tự do tài chính.",
    url: "https://caothong.is-a.dev/",
    type: "website",
    images: [
      {
        url: "https://caothong.is-a.dev/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hoàng Cao Thống | Website Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  authors: [
    { name: "Hoàng Cao Thống", url: "https://caothong.is-a.dev/" },
  ],
  keywords: [
    "Hoàng Cao Thống",
    "Software Developer",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "AWS",
    "GCP",
    "MongoDB",
    "Firebase",
    "Tailwind CSS",
    "Web Development",
  ],
  creator: "Hoàng Cao Thống",
  publisher: "Hoàng Cao Thống",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <body
        className={`${outfit.className} w-screen min-h-screen m-0 p-0 overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
