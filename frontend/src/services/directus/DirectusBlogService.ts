//frontend/src/services/directus/DirectusBlogService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusBlog } from "./types/DirectusBlog";
import { DirectusBlogMapper } from "../mappers/DirectusBlogMapper";
import { IBlogService, BlogQueryOptions } from "../interfaces/IBlogService";
import { BlogPost } from "@/domain/blog/BlogPost";

// Requesting nested fields explicitly — without this, Directus returns
// featured_image as just the raw file ID string, not the related file
// object, so modified_on (needed for cache-busting) is never available.
const BLOG_FIELDS = [
  "*",
  "featured_image.id",
  "featured_image.modified_on",
];

export class DirectusBlogService implements IBlogService {

async getLatest(
  options?: BlogQueryOptions
): Promise<BlogPost[]> {

  const items = await directus.request(

    readItems("blog_posts", {

      fields: BLOG_FIELDS,

      sort: ["-publish_date"],

      limit: options?.limit,

    })

  );

  return (items as DirectusBlog[])
    .map(DirectusBlogMapper.toBlogPost);
}

 async getBySlug(
  slug: string
): Promise<BlogPost | null> {

  const items = await directus.request(

    readItems("blog_posts", {

      fields: BLOG_FIELDS,

      filter: {
        slug: {
          _eq: slug,
        },
      },

      limit: 1,

    })

  );

  const posts = items as DirectusBlog[];

  if (posts.length === 0) {
    return null;
  }

  return DirectusBlogMapper.toBlogPost(posts[0]);
}
}
