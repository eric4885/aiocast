"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { href: "/tools/seo-growth-pack", label: "SEO growth pack" },
  { href: "/ai-podcast-editing-stack", label: "Podcast to blog" },
  {
    href: "/podcast-to-short-video",
    label: "Social scripts",
    badge: "Soon",
  },
  { href: "/remote-recording-setup", label: "Publish schedule" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[56px] max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:min-h-[74px] sm:px-6 sm:py-0">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 font-bold tracking-tight">
          <span className="text-xl leading-none sm:text-2xl sm:leading-none md:text-[28px]">
            <span className="text-foreground">Aio</span>
            <span className="text-primary">Cast</span>
          </span>
        </Link>

        {!isHome && (
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === item.href && "bg-secondary text-foreground",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {"badge" in item && item.badge ? (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {isHome ? (
            <Button size="sm" asChild>
              <Link href="/tools/seo-growth-pack">Generate SEO pack</Link>
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/pro-toolkit">Pro toolkit</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/tools/seo-growth-pack">Generate SEO pack</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-11 min-h-[44px] min-w-[44px] touch-manipulation"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border bg-secondary">
              {nav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between gap-2">
                    <span>{item.label}</span>
                    {"badge" in item && item.badge ? (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-200">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild>
                <Link href="/pro-toolkit" onClick={() => setOpen(false)}>
                  Pro toolkit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/seo-growth-pack" onClick={() => setOpen(false)}>
                  Generate pack
                </Link>
              </DropdownMenuItem>
              {isHome ? (
                <DropdownMenuItem asChild>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
