"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
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

const generateLinks = [
  { href: "/tools/seo-growth-pack", label: "SEO growth pack" },
  { href: "/tools/free-podcast-title-generator", label: "Title generator" },
  { href: "/tools/show-notes-to-html", label: "Show notes → HTML" },
] as const;

const nav = [
  { href: "/guides/podcast-to-blog-post", label: "How it works" },
  { href: "/resources", label: "Resources" },
] as const;

function isGeneratePath(pathname: string) {
  return generateLinks.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const generateActive = isGeneratePath(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[56px] max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:min-h-[74px] sm:px-6 sm:py-0">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 font-bold tracking-tight">
          <span className="text-xl leading-none sm:text-2xl sm:leading-none md:text-[28px]">
            <span className="text-foreground">Aio</span>
            <span className="text-primary">Cast</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
                  generateActive ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                Generate
                <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 border-border bg-secondary">
              {generateLinks.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === item.href && "bg-secondary text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/pro-toolkit">Pricing</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/tools/seo-growth-pack">Generate pack</Link>
          </Button>
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
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Generate
              </p>
              {generateLinks.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border" />
              {nav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild>
                <Link href="/pro-toolkit" onClick={() => setOpen(false)}>
                  Pricing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
