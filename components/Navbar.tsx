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

interface NavigationLink {
  label: string;
  href: string;
}

interface NavigationCategory {
  label: string;
  mode: "auto" | "manual";
  documentType?: string;
  links?: NavigationLink[];
  items?: NavigationLink[];
}

interface NavigationData {
  categories: NavigationCategory[];
}

interface SanityItem {
  title: string;
  slug: string;
}


export default async function Navbar() {
  const navigation: NavigationData = await client.fetch(`
    *[_type == "navigation"][0]{
      categories[]{
        label,
        mode,
        documentType,
        links
      }
    }
  `);

  const categories: NavigationCategory[] = navigation?.categories ?? [];

  const resolvedCategories: NavigationCategory[] = await Promise.all(
    categories.map(async (cat) => {
      if (cat.mode === "auto" && cat.documentType) {
        const items: SanityItem[] = await client.fetch(`
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
                <NavigationMenuTrigger>{category.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[200px]">
                    {category.items?.map((item) => (
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

