// run in browser
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

// define types
type navItem = {
  label: string;
  href: string;
};

type navCategory = {
  label: string;
  items: navItem[];
}


export default function Navbar() {

  // store categories fetched from Sanity
  const [categories, setCategories] = useState<navCategory[]>([]);

  // runs once per component mount
  useEffect(() => {

    async function fetchNavigation() {

      try{

        // fetch top level navigation document from Sanity
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

        // process each category
        const resolvedCategories = await Promise.all(
          navigation.categories.map(async (cat: any) => {

            // if category is "auto", fetch items dynamically based on documentType
            if (cat.mode === 'auto') {
              const items = await client.fetch(`
                *[_type == "${cat.documentType}"]{
                  title,
                  "slug": slug.current
                }
              `);

              return {
                label: cat.label,

                // map each item to navItem format
                items: items.map((i: any) => ({
                  label: i.title,
                  href: '/${cat.documentType}/${i.slug}'
                }))
              };
            } else {

              // if category is manual, use link array
              return {
                label: cat.label,
                items: cat.links || [] // fallback to empty array
              };

            }

          })
        );

        // save processed catagories
        setCategories(resolvedCategories);
      } catch (error) {
        // if fetch fails, log error
        console.error('Failed to fetch nativation:', error);
      }
    }

    fetchNavigation(); // call the fetch function

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
