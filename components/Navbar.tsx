// render in client
'use client';

import { useEffect, useState } from 'react';

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

// types
type navItem = {
  label: string;
  href: string;
};

type navCategory = {
  label: string;
  items: navItem[];
};

export default function Navbar() {
  const [categories, setCategories] = useState<navCategory[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch catagory documents
        const cats = await client.fetch(`
          *[_type == "category"]{
            label,
            mode,
            documentType,
            links
          }
        `);

        // resolve each category
        const resolved = await Promise.all(
          cats.map(async (cat: any) => {
            if (cat.mode === "auto") {
              // Fetch all docs of this type
              const items = await client.fetch(`
                *[_type == "${cat.documentType}"]{
                  "title": name,
                  "slug": slug.current
                }
              `);

              return {
                label: cat.label,
                items: items.map((i: any) => ({
                  label: i.title,
                  href: `/${cat.documentType}/${i.slug}`
                }))
              };
            }

            // manual mode
            return {
              label: cat.label,
              items: cat.links || []
            };
          })
        );

        // store in state
        setCategories(resolved);

      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    }

    fetchData();
  }, []); // empty dependency array

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="mr-8 font-semibold text-xl">
          Super Squad Publishing
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {categories.map((category) => (
              <NavigationMenuItem key={category.label}>
                <NavigationMenuTrigger>{category.label}</NavigationMenuTrigger>

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