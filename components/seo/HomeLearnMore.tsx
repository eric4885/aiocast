import Link from "next/link";

/** Server-rendered learn-more block for homepage SEO and internal linking. */
export function HomeLearnMore() {
  return (
    <section className="border-t border-border bg-[#07070c] py-12 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Guides & free tools</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Optional reading and tools after you pick a scene above — not required to generate a draft.
        </p>
        <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2 text-left text-sm text-muted-foreground sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
          <li>
            <Link
              href="/guides/podcast-to-blog-post"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              How to turn a podcast into a blog post
            </Link>
          </li>
          <li>
            <Link
              href="/guides/show-notes-template"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Show notes template
            </Link>
          </li>
          <li>
            <Link
              href="/tools/free-show-notes-generator"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Paste notes → blog draft
            </Link>
          </li>
          <li>
            <Link
              href="/tools/show-notes-to-html"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Show notes → HTML
            </Link>
          </li>
          <li>
            <Link
              href="/resources/pre-flight-checklist"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Preflight recording checklist
            </Link>
          </li>
          <li>
            <Link
              href="/guides/podcast-faq-for-seo"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              FAQ blocks for SEO
            </Link>
          </li>
          <li>
            <Link href="/resources" className="font-medium text-primary underline-offset-4 hover:underline">
              All resources
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
