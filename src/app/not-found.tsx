import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Page not found</h1>
      <p>We could not find the requested resource.</p>
      <Link href="/">Go back to Home</Link>
    </main>
  );
}
