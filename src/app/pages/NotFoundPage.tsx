import { Link } from "react-router-dom";
import { icons } from "@/lib/icons";

/**
 * 404 Not Found page.
 * Rendered by the catch-all route path="*" in App.tsx.
 */
export function NotFoundPage() {
  const AlertIcon = icons.alert;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertIcon
        className="mb-4 h-10 w-10 text-muted"
        strokeWidth={1.5}
        aria-hidden
      />
      <h1 className="text-[22px] font-semibold text-text">Page Not Found</h1>
      <p className="mt-2 text-sm text-muted">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-inner bg-accent px-4 py-2 text-[13px] font-medium text-white transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
