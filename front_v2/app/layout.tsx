import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import StyledComponentsRegistry from "@/lib/styled-components-registry"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Boitata - Programa Queimadas INPE",
  description: "Sistema de monitoramento de queimadas e incêndios florestais",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
