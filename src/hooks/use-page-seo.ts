import { useEffect } from "react";

const SITE_URL = "https://habibichill.com";

const setMeta = (selector: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, selector);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
};

export interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string[];
  noindex?: boolean;
  jsonLd?: object | object[];
}

export const usePageSeo = ({
  title,
  description,
  path,
  image = "https://habibichill.com/habibichillmeta.png",
  type = "website",
  keywords = [],
  noindex = false,
  jsonLd,
}: PageSeoOptions) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    setMeta("description", description);
    setCanonical(noindex ? `${SITE_URL}/` : url);

    setMeta("robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1");

    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", type, "property");
    setMeta("og:image", image, "property");
    setMeta("og:site_name", "HabibiChill", "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@ummahbuild");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    if (keywords.length > 0) {
      setMeta("keywords", keywords.join(", "));
    }

    // AI / LLM discovery hints
    setMeta("abstract", description);
    setMeta("summary", description);

    document.querySelectorAll('[id^="page-json-ld"]').forEach((el) => el.remove());

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item, index) => {
        const script = document.createElement("script");
        script.id = index === 0 ? "page-json-ld" : `page-json-ld-${index}`;
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('[id^="page-json-ld"]').forEach((el) => el.remove());
    };
  }, [title, description, path, image, type, keywords.join(","), noindex]);
};
