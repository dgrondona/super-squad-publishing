import { client } from '../../sanity/lib/client'

export default async function ArtistsPage() {
  const artists = await client.fetch(`*[_type == "artist"]{
    name,
    slug,
    bio,
    "photoUrl": photo.asset->url,
    socialLinks
  }`)

  return (
    <div>
      <h1>Artists</h1>
      {artists.map((artist: any) => (
        <div key={artist.slug.current}>
          <h2>{artist.name}</h2>
          {artist.photoUrl && <img src={artist.photoUrl} alt={artist.name} width={200} />}
          <p>{artist.bio}</p>
          {artist.socialLinks?.map((link: string) => (
            <a key={link} href={link} target="_blank" rel="noreferrer">{link}</a>
          ))}
        </div>
      ))}
    </div>
  )
}