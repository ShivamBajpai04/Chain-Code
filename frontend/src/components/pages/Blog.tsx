import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useSeo } from "../../utils/useSeo";

// Raw-import every post; frontmatter parsed at module load.
const modules = import.meta.glob("../content/blog/*.mdx", { as: "raw" });

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
  schema?: string;
};

function parsePost(raw: string): Post | null {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = Object.fromEntries(
    m[1].split("\n").map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  ) as Record<string, string>;
  return {
    slug: fm.slug || "",
    title: fm.title || "",
    description: fm.description || "",
    date: fm.date || "",
    body: raw.slice(m[0].length),
    schema: fm.schema,
  };
}

export function getAllPosts(): Promise<Post[]> {
  return Promise.all(
    Object.entries(modules).map(async ([path, load]) => {
      const post = parsePost(await (load as () => Promise<string>)());
      return post ? { ...post, slug: path.split("/").pop()!.replace(/\.mdx?$/, "") } : null;
    }),
  ).then((list) => list.filter(Boolean).sort((a, b) => (a!.date < b!.date ? 1 : -1)) as Post[]);
}

export function BlogList() {
  return <BlogListView />;
}

function BlogListView() {
  const [posts_, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    let alive = true;
    getAllPosts().then((p) => alive && setPosts(p));
    return () => {
      alive = false;
    };
  }, []);

  useSeo({
    title: "Chain-Code blog: code challenges, NFTs, and sandboxes",
    description:
      "Writing from the Chain-Code workshop: code ownership certificates, sandboxed execution, judge engines, and building for on-chain developers.",
    path: "/blog",
  });

  return (
    <div className="app-ledger-grid min-h-screen text-[#f5f1e8]">
      <div className="container mx-auto max-w-[1100px] px-6 py-16">
        <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#d4a017]">Ledger notes</p>
        <h1 className="f-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Writing from the Chain-Code workshop
        </h1>
        <div className="mt-10 space-y-4">
          {posts_ === null && (
            <p className="text-sm" style={{ color: "rgba(245,241,232,0.55)" }}>Loading…</p>
          )}
          {posts_?.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="block rounded-lg border border-white/[0.08] bg-[#131020] p-6 transition-colors duration-200 hover:border-[#c89d4a]/40 hover:bg-white/[0.03]"
            >
              <h2 className="f-display text-xl font-bold tracking-tight">{p.title}</h2>
              <p className="f-mono mt-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(245,241,232,0.35)" }}>
                {p.date}
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(245,241,232,0.55)" }}>
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let alive = true;
    getAllPosts().then((all) => {
      const found = all.find((p) => p.slug === slug) ?? null;
      if (!alive) return;
      setPost(found);
      setMissing(!found);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (missing)
    return (
      <div className="app-ledger-grid flex min-h-screen flex-col items-center justify-center text-[#f5f1e8]">
        <h1 className="f-display text-2xl font-semibold tracking-tight">No such entry</h1>
        <Link to="/blog" className="mt-8 rounded-md border border-white/[0.12] px-4 py-2 text-sm hover:bg-white/[0.06]">
          Back to the blog
        </Link>
      </div>
    );
  if (!post) return <div className="app-ledger-grid min-h-screen" />;

  return <PostView post={post} />;
}

function PostView({ post }: { post: Post }) {
  const path = `/blog/${post.slug}`;
  useSeo({
    title: post.title,
    description: post.description,
    path,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Organization", name: "Chain-Code" },
      url: `https://chaincode-xi.vercel.app${path}`,
      ...(post.schema === "HowTo"
        ? {
            "@type": "HowTo",
            step: Array.from(post.body.matchAll(/^\d+\. \*\*(.+?)\*\*/gm)).map((m) => ({
              "@type": "HowToStep",
              name: m[1],
            })),
          }
        : {}),
    },
  });

  return (
    <article className="app-ledger-grid min-h-screen text-[#f5f1e8]">
      <div className="container mx-auto max-w-[720px] px-6 py-16">
        <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#d4a017]">{post.date}</p>
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="f-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="f-display mt-10 text-xl font-bold tracking-tight">{children}</h2>
            ),
            p: ({ children }) => (
              <p className="mt-5 leading-relaxed" style={{ color: "rgba(245,241,232,0.62)" }}>{children}</p>
            ),
            li: ({ children }) => (
              <li className="mt-2 leading-relaxed" style={{ color: "rgba(245,241,232,0.62)" }}>{children}</li>
            ),
            ol: ({ children }) => <ol className="mt-5 list-decimal space-y-1 pl-5">{children}</ol>,
            ul: ({ children }) => <ul className="mt-5 list-disc space-y-1 pl-5">{children}</ul>,
            a: ({ href, children }) =>
              href?.startsWith("/") ? (
                <Link to={href} className="text-[#ecc76a] underline underline-offset-2">{children}</Link>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#ecc76a] underline underline-offset-2">{children}</a>
              ),
            code: ({ children }) => (
              <code className="f-mono rounded bg-black/40 px-1.5 py-0.5 text-[13px]">{children}</code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="mt-6 border-l-2 border-[#c89d4a]/50 pl-4 italic">{children}</blockquote>
            ),
          }}
        >
          {post.body}
        </ReactMarkdown>
        <Link
          to="/blog"
          className="mt-14 inline-block rounded-md border border-white/[0.12] px-4 py-2 text-sm transition-colors duration-200 hover:bg-white/[0.06]"
        >
          All posts
        </Link>
      </div>
    </article>
  );
}
