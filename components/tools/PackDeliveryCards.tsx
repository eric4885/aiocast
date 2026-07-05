import Link from "next/link";

type DeliveryItem = {
  icon: string;
  title: string;
  description: string;
  href?: string;
};

const items: DeliveryItem[] = [
  {
    icon: "📄",
    title: "SEO article draft",
    description: "Intent-based H2s, meta description, and keywords — paste into your CMS.",
  },
  {
    icon: "❓",
    title: "FAQ blocks",
    description: "Structured Q&A for People Also Ask and AI answer snippets.",
  },
  {
    icon: "📱",
    title: "Social scripts",
    description: "LinkedIn, X, and newsletter copy — edit lightly and post.",
  },
  {
    icon: "📅",
    title: "7-day publish plan",
    description: "A weekly rhythm to ship article + social without guessing timing.",
  },
  {
    icon: "🔧",
    title: "WordPress-ready HTML",
    description: "Format show notes as paste-ready HTML — no CMS plugin.",
    href: "/tools/show-notes-to-html",
  },
];

export function PackDeliveryCards({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">What you get in one run</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-border/70 bg-background/50 p-3 text-sm"
          >
            <p className="font-semibold text-foreground">
              <span aria-hidden>{item.icon} </span>
              {item.href ? (
                <Link href={item.href} className="text-primary underline-offset-4 hover:underline">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
