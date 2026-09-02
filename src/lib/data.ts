import { getPublicNhost } from "./nhost";
import type {
  Location,
  MenuItem,
  RollBuilderOption,
  SiteSettings,
  Testimonial,
} from "./types";

const MENU_ITEM_FIELDS = `
  id name description price price_large size_small_label size_large_label
  category tags active sort_order
`;

async function query<T>(gql: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const nhost = getPublicNhost();
    const res = await nhost.graphql.request<T>({ query: gql, variables }, { cache: "no-store" });
    return res.body.data ?? null;
  } catch {
    return null;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const data = await query<{ menu_items: MenuItem[] }>(`
    query {
      menu_items(where: { active: { _eq: true } }, order_by: [{ category: asc }, { sort_order: asc }]) {
        ${MENU_ITEM_FIELDS}
      }
    }
  `);
  return data?.menu_items ?? [];
}

export async function getLocations(): Promise<Location[]> {
  const data = await query<{ locations: Location[] }>(`
    query {
      locations(order_by: { sort_order: asc }) {
        id name city address phone hours_weekdays hours_weekend rating reviews_count google_maps_url sort_order
      }
    }
  `);
  return (data?.locations ?? []).map((l) => ({
    ...l,
    hours_weekdays: l.hours_weekdays ?? "",
    hours_weekend: l.hours_weekend ?? "",
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await query<{ testimonials: Testimonial[] }>(`
    query {
      testimonials(where: { active: { _eq: true } }, order_by: { sort_order: asc }) {
        id author_name location_name quote rating source active sort_order
      }
    }
  `);
  return data?.testimonials ?? [];
}

export async function getRollBuilderOptions(): Promise<RollBuilderOption[]> {
  const data = await query<{ roll_builder_options: RollBuilderOption[] }>(`
    query {
      roll_builder_options(where: { active: { _eq: true } }, order_by: [{ category: asc }, { sort_order: asc }]) {
        id category name price active sort_order
      }
    }
  `);
  return data?.roll_builder_options ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await query<{ site_settings: SiteSettings[] }>(`
    query {
      site_settings(limit: 1) {
        id hero_headline hero_subtext daily_special_manual_id roll_builder_base_price
        google_reviews_url wolt_url_sigulda wolt_url_cesis
        daily_special_manual {
          ${MENU_ITEM_FIELDS}
        }
      }
    }
  `);
  return data?.site_settings?.[0] ?? null;
}

/**
 * "Šodienas ieteikums" resolution: prefer the manual pick set by the owner
 * in site_settings, otherwise fall back to a deterministic day-of-week
 * rotation through the curated (populars / chef_special) menu items.
 */
export function resolveDailySpecial(
  menuItems: MenuItem[],
  settings: SiteSettings | null
): { item: MenuItem | null; isManual: boolean } {
  const manual = settings?.daily_special_manual;
  if (manual) {
    return { item: manual, isManual: true };
  }

  const curated = menuItems.filter(
    (item) => item.tags?.includes("populars") || item.tags?.includes("chef_special")
  );
  // Sauces and drinks aren't "today's dish" material — exclude them from the
  // fallback pool so an untagged rotation never lands on a bottle of Sprite.
  const dishes = menuItems.filter(
    (item) => item.category !== "merces" && item.category !== "dzerieni"
  );
  const pool = curated.length > 0 ? curated : dishes.length > 0 ? dishes : menuItems;
  if (pool.length === 0) {
    return { item: null, isManual: false };
  }

  const dayOfWeek = new Date().getDay(); // 0 = Sunday ... 6 = Saturday
  const item = pool[dayOfWeek % pool.length];
  return { item, isManual: false };
}

export const DAY_NAMES_LV = [
  "Svētdienai",
  "Pirmdienai",
  "Otrdienai",
  "Trešdienai",
  "Ceturtdienai",
  "Piektdienai",
  "Sestdienai",
];
