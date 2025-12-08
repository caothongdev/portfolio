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
    default: "Hoang Cao Thong - Portfolio",
    template: "%s | Hoang Cao Thong"
  },
  description:
    "Young developer with ambitions to build a personal brand and achieve financial freedom.",
  applicationName: "Hoang Cao Thong Portfolio",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hoang Cao Thong | Website Developer",
    description:
      "Young developer with ambitions to build a personal brand and achieve financial freedom.",
    url: "https://caothong.is-a.dev/",
    type: "website",
    images: [
      {
        url: "https://caothong.is-a.dev/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Hoang Cao Thong | Website Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  authors: [
    { name: "Hoang Cao Thong", url: "https://caothong.is-a.dev/" },
  ],
  keywords: [
    "Hoang Cao Thong",
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
  creator: "Hoang Cao Thong",
  publisher: "Hoang Cao Thong",
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
