import { client } from "./client"

export async function fetchDataFromSlug(type:string, slug: string) {

    const query = `
    *[_type == $type && slug.current == $slug][0]{
        name,
        slug,
        image,
        bio,
        socialLinks
    }`;

    return await client.fetch(query, { type, slug });

}

export async function fetchAllSlugs(type: string): Promise<string[]> {

    const query = `*[_type == $type]{ "slug": slug.current }`;

    const slugs = await client.fetch<{ slug: string }[]> (query, { type });

    console.log(slugs.map(s => s.slug));

    return slugs.map(s => s.slug);

}