/**
 * Renders one or more Schema.org objects as <script type="application/ld+json">.
 * ld+json is data, not executable JS, so it is not affected by script-src CSP.
 * We still escape `<` to `<` to prevent any HTML-context breakout.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
