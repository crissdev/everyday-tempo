import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404</span>
      <h1>That thing isn&apos;t here.</h1>
      <p>The activity or club may have moved, or it may not be published yet.</p>
      <Link href="/" className="primary-link">
        Back home
      </Link>
    </main>
  );
}
