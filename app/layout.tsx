import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display,Montserrat } from "next/font/google"
import "./globals.css"
import ClientProviders from "@/components/ClientProviders"
import { getMetaTags } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

const metaTags = getMetaTags();

export const metadata = {
    metadataBase: new URL("https://pokemonstorepk.com/"),
  title: "PokeStore - Your Ultimate Destination for Pokémon Cards",
  description:
    "Discover the best Pokémon cards, collectibles, and accessories at PokemonStore. Shop now for exclusive deals and rare finds!",
  icons: {
    icon: '/favicon.png', // or .ico or .png
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "PokeStore - Your Ultimate Destination for Pokémon Cards",
    description: "Discover the best Pokémon cards, collectibles, and accessories at PokemonStore. Shop now for exclusive deals and rare finds!",
    url: "https://pokemonstorepk.com/",
    images: [{ url: "/aboutus.jpg" }],
    siteName: "PokemonStore",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poketore - Your Ultimate Destination for Pokémon Cards",
    description: "Discover the best Pokémon cards, collectibles, and accessories at PokemonStore. Shop now for exclusive deals and rare finds!",
    site: "@pokemonstorepk",
    images: ["/aboutus.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="no-overflow-x">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans no-overflow-x`}
        style={{ backgroundColor: "#212121", color: "#ffffff" }}
        suppressHydrationWarning={true}
      >
        <ClientProviders>{children}</ClientProviders>
        {/* {metaTags.map((tag, idx) => (
          <meta name={tag.name} content={tag.content} key={tag.name + '-' + idx} />
        ))} */}
      </body>
    </html>
  )
}
