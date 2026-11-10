import { Suspense } from "react";
import { UnlockError } from "@/components/unlock-error";

export const metadata = { title: "Unlock · Path to 20" };

export default function UnlockPage() {
  return (
    <div className="mx-auto max-w-sm space-y-4 pt-8">
      <h1 className="text-lg font-semibold">Enter the dashboard key</h1>
      <p className="text-sm text-muted-foreground">This dashboard holds homeowner phone numbers. The key is set as DASH_KEY in Vercel.</p>
      <form method="post" action="/api/unlock" className="space-y-3">
        <label htmlFor="key" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Key
        </label>
        <input
          id="key"
          name="key"
          type="password"
          autoComplete="current-password"
          required
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-base"
        />
        <Suspense>
          <UnlockError />
        </Suspense>
        <button type="submit" className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Unlock
        </button>
      </form>
    </div>
  );
}
