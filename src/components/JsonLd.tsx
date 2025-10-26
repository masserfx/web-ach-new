/**
 * JsonLd komponenta pro vkládání structured data do stránek
 * Podporuje Schema.org markup pro lepší SEO
 */

export function JsonLd<T>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
