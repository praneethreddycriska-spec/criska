"use client";

/**
 * Catches errors thrown in the root layout itself. It REPLACES <html>/<body>,
 * so it can't rely on globals.css or Tailwind — styles are inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          background: "#ffffff",
          color: "#171717",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 30, margin: "0 0 8px", fontWeight: 400 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6f6f6f", margin: "0 0 24px" }}>
            A critical error occurred. Please try again or refresh the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "none",
              borderRadius: 999,
              background: "#171717",
              color: "#ffffff",
              padding: "12px 24px",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
