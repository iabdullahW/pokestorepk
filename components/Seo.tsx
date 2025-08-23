import React from "react";
import { getMetaTags } from "@/lib/seo";

export default function SEO({
  title,
  description,
  url,
  image,
  keywords
}: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
} = {}) {
  const metaTags = getMetaTags({ title, description, url, image, keywords });
  return (
    <>
      {metaTags.map((tag) => {
        if (tag.name) {
          return <meta key={tag.name} name={tag.name} content={tag.content} />;
        }
        if (tag.property) {
          return <meta key={tag.property} property={tag.property} content={tag.content} />;
        }
        return null;
      })}
    </>
  );
}
