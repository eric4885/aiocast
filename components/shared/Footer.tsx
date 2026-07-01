"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { SubscribeForm } from "@/components/shared/SubscribeForm";

import { siteConfig } from "@/lib/data";
import { newsletterBlurb, newsletterHeading } from "@/lib/pricing-copy";



function XGlyph({ className }: { className?: string }) {

  return (

    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">

      <path d="M18.244 3H21l-7.125 8.662L22 21h-6.663l-5.214-6.793L5.53 21H3l7.605-9.229L2 3h6.663l4.713 6.231L18.244 3Zm-1.073 16.078h1.873L7.486 4.82H5.393l11.778 14.258Z" />

    </svg>

  );

}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.4-2.4C19.5 3 12 3 12 3s-7.5 0-9.1.8C1.7 4.1.8 5 .5 6.2 0 8 0 12s0 4 .5 5.8c.3 1.2 1.2 2.1 2.4 2.4 1.6.8 9.1.8 9.1.8s7.5 0 9.1-.8c1.2-.3 2.1-1.2 2.4-2.4.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.75 15.02v-6.04L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}

const socialLinks = [
  { href: siteConfig.social.x, icon: XGlyph, label: "X / Twitter" },
  { href: siteConfig.social.linkedin, icon: LinkedInGlyph, label: "LinkedIn" },
  { href: siteConfig.social.youtube, icon: YoutubeGlyph, label: "YouTube" },
].filter((s) => typeof s.href === "string" && /^https?:\/\//i.test(s.href.trim()));



export function Footer() {

  const pathname = usePathname();

  if (pathname === "/") return null;



  return (

    <footer className="border-t border-border bg-card/40">

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">

        <div className="space-y-4">

          <Link href="/" className="text-lg font-bold text-foreground">

            {siteConfig.name}

          </Link>

          <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>

          <div className="flex flex-wrap gap-2">
            {socialLinks.length > 0 ? (
              socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    aria-label={s.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground">
                Social profile links coming soon — follow the newsletter below for updates.
              </p>
            )}
          </div>

        </div>



        <div>

          <p className="text-sm font-semibold text-foreground">Explore</p>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">

            <li>

              <Link className="hover:text-foreground" href="/tools/seo-growth-pack">

                Podcast SEO growth pack generator

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/tools/show-notes-to-html">

                Show notes to HTML converter

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/examples/sample-growth-pack">

                Sample growth pack output

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/guides/podcast-to-blog-post">

                Podcast to blog guide

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/ai-podcast-editing-stack">

                Podcast to SEO article workflow

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/remote-recording-setup">

                7-day publish plan guide

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/podcast-to-short-video">

                Podcast social scripts (in pack)

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/my-packs">

                Find my SEO growth packs

              </Link>

            </li>

            <li>

              <Link className="hover:text-foreground" href="/pro-toolkit">

                Pro pricing

              </Link>

            </li>

          </ul>

        </div>



        <div>

          <p className="text-sm font-semibold text-foreground">{newsletterHeading}</p>

          <p className="mt-2 text-sm text-muted-foreground">

            {newsletterBlurb}

          </p>

          <SubscribeForm
            className="mt-4"
            source="footer"
            submitLabel="Subscribe"
            layout="row"
            emailPlaceholder="Email"
          />

        </div>

      </div>

      <div className="border-t border-border/80 py-6 text-center text-xs text-muted-foreground">

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-3">

          <Link

            href="/privacy"

            className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"

          >

            Privacy

          </Link>

          <span aria-hidden className="hidden text-border sm:inline">

            ·

          </span>

          <Link href="/terms" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">

            Terms

          </Link>

          <span aria-hidden className="hidden text-border sm:inline">

            ·

          </span>

          <Link href="/help" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">

            Help

          </Link>

          <span aria-hidden className="hidden text-border sm:inline">

            ·

          </span>

          <Link href="/unsubscribe" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">

            Unsubscribe

          </Link>

          <span aria-hidden className="hidden text-border sm:inline">

            ·

          </span>

          <Link

            href="/contact"

            className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"

          >

            Contact

          </Link>

        </div>

        <p className="mt-3">

          © {new Date().getFullYear()} {siteConfig.name}. Built for indie podcasters.

        </p>

      </div>

    </footer>

  );

}

