import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

export default async function Navbar() {
  const navigation = await client.fetch(`
    *[_type == "navigation"][0]{
      categories[]{
        label,
        mode,
        documentType,
        links
      }
    }
  `);

  const categories = navigation?.categories ?? []; // fallback to empty array

  // Fetch auto category items
  const resolvedCategories = await Promise.all(
    navigation.categories.map(async (cat) => {
      if (cat.mode === "auto") {
        const items = await client.fetch(`
          *[_type == "${cat.documentType}"]{
            title,
            "slug": slug.current
          }
        `);

        return {
          ...cat,
          items: items.map((i) => ({
            label: i.title,
            href: `/${cat.documentType}/${i.slug}`
          }))
        };
      }

      // Manual category
      return {
        ...cat,
        items: cat.links || []
      };
    })
  );

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="mr-8 font-semibold text-xl">
          Super Squad Publishing
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {resolvedCategories.map((category) => (
              <NavigationMenuItem key={category.label}>

                <NavigationMenuTrigger>
                  {category.label}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[200px]">
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block px-2 py-1 text-sm hover:bg-accent rounded"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>

              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
