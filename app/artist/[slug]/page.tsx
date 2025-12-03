// app/artist/[slug]/page.tsx
import { fetchDataFromSlug, fetchAllSlugs } from "@/sanity/lib/utils";

export const dynamic = "force-static";

export async function generateStaticParams() {

  const slugs = await fetchAllSlugs("artist");
  return slugs.map(slug => ({ slug }));

}

export default async function ArtistPage(

  { params, }: {
    params: Promise<{ slug: string }>;
  }

) {

  const { slug } = await params;

    const artist = await fetchDataFromSlug("artist", slug); // use fetchSlug to return info from Sanity

    if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div>
      <h1>{artist.name}</h1>
      {/* etc */}
    </div>
  );

}