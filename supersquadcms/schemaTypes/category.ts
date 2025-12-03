// /schemas/category.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Category Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: {
        list: [
          { title: "Auto", value: "auto" },
          { title: "Manual", value: "manual" },
        ],
      },
      initialValue: "auto",
    }),

    defineField({
      name: "documentType",
      title: "Auto: Document Type",
      type: "string",
      hidden: ({ parent }) => parent?.mode !== "auto",
    }),

    defineField({
      name: "links",
      title: "Manual: Links",
      type: "array",
      hidden: ({ parent }) => parent?.mode !== "manual",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "string", title: "URL" },
          ],
        },
      ],
    }),
  ],
});