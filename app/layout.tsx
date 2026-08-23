import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bon Ton Fitness — Member & Club Management",
  description:
    "Multi-branch gym management platform for Bon Ton Fitness Club. Attendance, workouts, and member management across all Bengaluru clubs.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#10131c",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} style={{ background: "#f4f5f7" }}>
      <body>{children}</body>
    </html>
  )
}
