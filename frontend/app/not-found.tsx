import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center py-16 px-4">
      <div className="max-w-md text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Error 404
        </span>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            The page you are trying to visit might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="md" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-1.5" />
              Return Home
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <Compass className="h-4 w-4 mr-1.5" />
              Explore Events
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
