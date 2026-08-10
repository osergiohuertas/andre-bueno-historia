export type VideoEmbedInfo = {
  provider: "youtube" | "vimeo";
  id: string;
  thumbnailUrl: string | null;
  embedUrl: string;
};

export function parseVideoUrl(url: string): VideoEmbedInfo | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : (u.searchParams.get("v") ?? u.pathname.split("/embed/")[1]);

      if (!id) return null;

      return {
        provider: "youtube",
        id,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
      };
    }

    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;

      return {
        provider: "vimeo",
        id,
        thumbnailUrl: null,
        embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Nome amigável da origem pra links que não têm embed público suportado
 * (ex.: Globoplay) — usado como rótulo do botão "Assistir no X" em vez de
 * deixar o card sem player nenhum, silenciosamente quebrado.
 */
export function nomeProvedorVideo(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (hostname.includes("globoplay") || hostname.includes("globo.com")) {
      return "Globoplay";
    }
    if (hostname.includes("facebook.com") || hostname.includes("fb.watch")) {
      return "Facebook";
    }
    if (hostname.includes("instagram.com")) return "Instagram";
    if (hostname.includes("tiktok.com")) return "TikTok";
    return hostname;
  } catch {
    return "site original";
  }
}
