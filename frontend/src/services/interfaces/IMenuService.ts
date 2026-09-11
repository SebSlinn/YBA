import type { MenuItem } from "@/domain/menu/MenuItem";

/**
 * The seam: components/pages only ever depend on this. "primary" is the
 * only menu slug in use today (the header nav); the slug argument exists
 * so a footer or mobile-specific menu can be added later without a new
 * interface or schema change — just a new row with a different `menu`
 * value in Directus.
 */
export interface IMenuService {
  getMenu(slug: string): Promise<MenuItem[]>;
}
