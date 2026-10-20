/**
 * Media, platform and technology partners.
 *
 * This is the logo line the old site carried under the mid-page CTA — the
 * "partners banner" our clients (and Antti) expect to see next to the client
 * references. The assets are the same files the old site served (SVGs kept as
 * SVG, bitmaps converted to WebP); TikTok is included so the social platforms
 * are represented alongside Meta, LinkedIn, YouTube and the rest.
 *
 * Labels double as alt text — they are proper nouns, so they read the same in
 * both locales.
 */
export type Partner = {
  id: string;
  label: string;
  src: string;
};

export const partners: Partner[] = [
  { id: "vuoden-toimisto", label: "Vuoden Toimisto 2022 & 2023", src: "/images/partners/vuoden-toimisto.svg" },
  { id: "vuoden-toimisto-finalisti", label: "Vuoden Toimisto Finalisti 2024 & 2025", src: "/images/partners/vuoden-toimisto-1.svg" },
  { id: "menestyjat", label: "Menestyjät", src: "/images/partners/menestyjat.svg" },
  { id: "meta", label: "Meta", src: "/images/partners/meta-business-partner.webp" },
  { id: "google-partner", label: "Google Partner", src: "/images/partners/google-partner.svg" },
  { id: "iab", label: "IAB Finland", src: "/images/partners/iab.svg" },
  { id: "marketing-finland", label: "Marketing Finland", src: "/images/partners/marketing-finland.webp" },
  { id: "norstat", label: "Norstat", src: "/images/partners/norstat.svg" },
  { id: "kantar", label: "Kantar", src: "/images/partners/kantar.svg" },
  { id: "finnpanel", label: "Finnpanel", src: "/images/partners/finnpanel.svg" },
  { id: "techedge", label: "Techedge", src: "/images/partners/techedge.webp" },
  { id: "adform", label: "Adform", src: "/images/partners/adform.svg" },
  { id: "smartly-io", label: "Smartly.io", src: "/images/partners/smartly-io.svg" },
  { id: "luotettava", label: "Luotettava Kumppani", src: "/images/partners/luotettava.webp" },
  { id: "bauer-media", label: "Bauer Media", src: "/images/partners/bauer-media.svg" },
  { id: "sanoma", label: "Sanoma", src: "/images/partners/sanoma.svg" },
  { id: "mtv", label: "MTV", src: "/images/partners/mtv.svg" },
  { id: "wbd", label: "Warner Bros. Discovery", src: "/images/partners/wbd.svg" },
  { id: "mtv-katsomo", label: "MTV Katsomo", src: "/images/partners/mtv-katsomo.svg" },
  { id: "ruutu", label: "Ruutu", src: "/images/partners/ruutu.svg" },
  { id: "netflix", label: "Netflix", src: "/images/partners/netflix.svg" },
  { id: "disney-plus", label: "Disney+", src: "/images/partners/disney-plus.svg" },
  { id: "max", label: "Max", src: "/images/partners/max.svg" },
  { id: "spotify", label: "Spotify", src: "/images/partners/spotify.svg" },
  { id: "helsingin-sanomat", label: "Helsingin Sanomat", src: "/images/partners/helsingin-sanomat.svg" },
  { id: "kauppalehti", label: "Kauppalehti", src: "/images/partners/kauppalehti.svg" },
  { id: "iltalehti", label: "Iltalehti", src: "/images/partners/iltalehti.svg" },
  { id: "ilta-sanomat", label: "Ilta-Sanomat", src: "/images/partners/ilta-sanomat.svg" },
  { id: "facebook", label: "Facebook", src: "/images/partners/facebook.svg" },
  { id: "instagram", label: "Instagram", src: "/images/partners/instagram.svg" },
  { id: "tiktok", label: "TikTok", src: "/images/partners/tiktok-marketing-partners.webp" },
  { id: "jodel", label: "Jodel", src: "/images/partners/jodel.svg" },
  { id: "linkedin", label: "LinkedIn", src: "/images/partners/linkedin.svg" },
  { id: "youtube", label: "YouTube", src: "/images/partners/youtube.svg" },
  { id: "discord", label: "Discord", src: "/images/partners/discord.svg" },
  { id: "finnkino", label: "Finnkino", src: "/images/partners/finnkino.svg" },
  { id: "clear-channel", label: "Clear Channel", src: "/images/partners/clear-channel.svg" },
  { id: "jcdecaux", label: "JCDecaux", src: "/images/partners/jcdecaux.svg" },
  { id: "mediateko", label: "Mediateko", src: "/images/partners/mediateko.svg" },
  { id: "outshine", label: "Outshine", src: "/images/partners/outshine.svg" },
  { id: "alma", label: "Alma Media", src: "/images/partners/alma.svg" },
];
