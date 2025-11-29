import { client } from '@/sanity/lib/client'

export default async function TestPage() {
  const data = await client.fetch(`*[_type == "sample"]`)

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

