import { initials, mediaSrc } from "@/lib/socialFormat";

/** Story ring gradient — the brand purple running into magenta and orange. */
export const STORY_RING =
  "bg-[conic-gradient(from_210deg,var(--color-purple),var(--color-accent-magenta),var(--color-accent-orange),var(--color-purple))]";

/**
 * A member's round portrait. `ring` adds the story ring: the brand gradient for
 * unseen stories, a quiet grey once they have all been watched. The inner gap
 * is painted in the social panel colour (white / the dark panel tint) so the
 * ring reads as a separate stroke in both themes.
 */
export function Avatar({
  name,
  photo,
  size = 48,
  ring = "none",
  className = "",
  alt,
  priority = false,
}: {
  name: string;
  photo: string;
  size?: number;
  ring?: "none" | "unseen" | "seen";
  className?: string;
  /** Decorative by default: every avatar sits next to the member's name. */
  alt?: string;
  /** The member's own portrait on their profile page is the LCP: load it eagerly. */
  priority?: boolean;
}) {
  const src = mediaSrc(photo);
  const stroke = size >= 96 ? 3 : 2;
  const face = (
    <span
      className="block overflow-hidden rounded-full bg-grey dark:bg-white/10"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          width={size}
          height={size}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden={alt === undefined}
          className="flex h-full w-full items-center justify-center font-medium text-violet dark:text-light-purple"
          style={{ fontSize: Math.max(11, size * 0.36) }}
        >
          {initials(name)}
        </span>
      )}
    </span>
  );

  if (ring === "none") return <span className={`inline-block shrink-0 rounded-full ${className}`}>{face}</span>;

  return (
    <span
      className={`inline-block shrink-0 rounded-full ${ring === "unseen" ? STORY_RING : "bg-black/15 dark:bg-white/25"} ${className}`}
      style={{ padding: stroke }}
    >
      <span className="block rounded-full bg-white dark:bg-[#16131e]" style={{ padding: stroke }}>
        {face}
      </span>
    </span>
  );
}
