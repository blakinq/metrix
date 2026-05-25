import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight">Metrix</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Privacy-friendly analytics and conversion tracking for small businesses, landing pages, and campaign sites.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
