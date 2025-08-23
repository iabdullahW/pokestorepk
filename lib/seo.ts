// Central SEO config and helpers for LNCC Organics

export const defaultSEO = {
  title: "Pokemon Store",
  description: "Discover the best Pokemon cards, collectibles, and accessories at PokemonStore. Shop now for exclusive deals and rare finds!",
  keywords: [
    "Pokemon Store", "Pokemon Cards", "Pokemon Collectibles", "Pokemon Accessories", "Pokemon Store", "Pokemon Store", "Pokemon Store", "Pokemon Store", "Pokemon Store", "Pokemon Store"
  ],
  url: "https://pokemonstorepk.vercel.app/",
  image: "@/public/aboutus.jpg", // Adjusted to use a relative path
  siteName: "Pokemon Store",
  twitter: "@pokemonstorepk"
}

export function getMetaTags({
  title = defaultSEO.title,
  description = defaultSEO.description,
  url = defaultSEO.url,
  image = defaultSEO.image,
  keywords = defaultSEO.keywords.join(", ")
} = {}) {
  return [
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: defaultSEO.siteName },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: defaultSEO.twitter }
  ]
}
