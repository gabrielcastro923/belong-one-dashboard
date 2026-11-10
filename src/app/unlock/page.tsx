import { Suspense } from "react";
import { UnlockError } from "@/components/unlock-error";

export const metadata = { title: "Unlock · Path to 20" };

export default function UnlockPage() {
  return (
    <div className="mx-auto max-w-sm pt-10">
      <div className="rounded-xl border border-line bg-card p-6">
        <h1 className="text-[22px] font-semibold leading-7 tracking-[-0.02em]">Dashboard key</h1>
        <p className="mt-1 text-sm text-muted">This dashboard holds homeowner phone numbers. The key is set as DASH_KEY in Vercel.</p>
        <form method="post" action="/api/unlock" className="mt-6 space-y-3">
          <label htmlFor="key" className="block text-xs font-medium text-ink-2">
            Key
          </label>
          <input
            id="key"
            name="key"
            type="password"
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-lg border border-line-strong bg-card px-3 text-base text-ink focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
          />
          <Suspense>
            <UnlockError />
          </Suspense>
          <button type="submit" className="h-10 w-full rounded-lg bg-ink text-sm font-medium text-card transition-opacity hover:opacity-90">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
