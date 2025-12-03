import { client } from "./client"

export async function fetchDataFromSlug(type:string, slug: string) {

    try {
        const query = `
        *[_type == $type && slug.current == $slug][0]{
            name,
            slug,
            image,
            bio,
            socialLinks
        }`;

        return await client.fetch(query, { type, slug });

    } catch (error) {

        console.error(`Failed to fetch data for "${type} : ${slug}":`, error);
        return null;

    }

}

export async function fetchAllSlugs(type: string): Promise<string[]> {

    try {
        const query = `*[_type == $type]{ "slug": slug.current }`;
        const slugs = await client.fetch<{ slug: string }[]> (query, { type });

        return slugs.map(s => s.slug).filter(Boolean) as string[];
        
    } catch (error) {

        console.error(`Failed to fetch slugs for type "${type}":`, error);
        return[];

    }

}