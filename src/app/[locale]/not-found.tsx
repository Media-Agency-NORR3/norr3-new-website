import { getSiteContent } from "@/lib/cms";
import { NotFoundContent } from "@/components/NotFoundContent";

/**
 * The custom 404. `notFound()` is thrown by the CMS-page catch-all (and by
 * case/post detail pages), so this renders inside the locale layout — nav,
 * footer and all — which is exactly what a user lost on a bad URL needs.
 *
 * No Request-time API here, deliberately. This element is handed to the root
 * layout's NotFoundBoundary as a prop, which means React Server Components
 * evaluate it during every page render on the site — so a `headers()` read
 * here (the old way of learning the locale) made *every* route dynamic and
 * uncacheable. The copy for both languages comes from the cached CMS bundle
 * and the client half picks the language from the `[locale]` URL param.
 * The response stays a hard 404 status.
 */
export default async function NotFound() {
  const { dictionaries } = await getSiteContent();
  return <NotFoundContent copy={{ fi: dictionaries.fi.notFound, en: dictionaries.en.notFound }} />;
}
