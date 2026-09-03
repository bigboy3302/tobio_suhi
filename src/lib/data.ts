import { getPublicNhost } from "./nhost";
import type { CopyOverrides } from "./i18n";
import type { Location, MenuItem, RollBuilderOption, SiteSettings } from "./types";

const MENU_ITEM_FIELDS = `
  id name description price price_large size_small_label size_large_label
  category tags active sort_order image_id image_alt
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
        google_place_id image_id image_alt
      }
    }
  `);
  return (data?.locations ?? []).map((l) => ({
    ...l,
    hours_weekdays: l.hours_weekdays ?? "",
    hours_weekend: l.hours_weekend ?? "",
  }));
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
        id daily_special_manual_id roll_builder_base_price
        wolt_url_sigulda wolt_url_cesis
        hero_image_id hero_image_alt
        daily_special_manual {
          ${MENU_ITEM_FIELDS}
        }
      }
    }
  `);
  return data?.site_settings?.[0] ?? null;
}

/**
 * All admin-editable UI copy (headings, body text, disclaimers), keyed to
 * match the i18n dictionary keys in lib/i18n.tsx — see CopyOverrides there
 * for how a DB row here takes precedence over the static dictionary default.
 */
export async function getSiteCopy(): Promise<CopyOverrides> {
  const data = await query<{ site_copy: { key: string; lv: string; en: string }[] }>(`
    query {
      site_copy {
        key lv en
      }
    }
  `);
  const out: CopyOverrides = {};
  for (const row of data?.site_copy ?? []) {
    out[row.key] = { lv: row.lv, en: row.en };
  }
  return out;
}

/**
 * "Šodienas ieteikums" resolution: prefer the manual pick set by the owner
 * in site_settings, otherwise fall back to a deterministic day-of-week
 * rotation through the curated (populars / chef_special) menu items.
 */
export function resolveDailySpecial(
  menuItems: MenuItem[],
  settings: SiteSettings | null
): { item: MenuItem | null; isManual: boolean; dayOfWeek: number } {
  // Computed once, here, on the server — passed down as a prop rather than
  // ever calling `new Date()` again in the client component that displays
  // it, which would re-run at hydration time using the visitor's own clock
  // and mismatch the server's render (React hydration error #418) whenever
  // the server and visitor are in different timezones.
  const dayOfWeek = new Date().getDay();

  const manual = settings?.daily_special_manual;
  if (manual) {
    return { item: manual, isManual: true, dayOfWeek };
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
    return { item: null, isManual: false, dayOfWeek };
  }

  const item = pool[dayOfWeek % pool.length];
  return { item, isManual: false, dayOfWeek };
}

/**
 * Curated handful of dishes for the homepage menu preview (the full 63-item
 * list lives on /menu). Prefers items tagged "populars"/"chef_special"; if
 * there aren't enough of those yet, fills the remaining slots by rotating
 * through categories so the preview still spans a few different kinds of
 * dish instead of just the first N rows of one category.
 */
export function pickMenuPreviewItems(menuItems: MenuItem[], target = 8): MenuItem[] {
  const dishes = menuItems.filter(
    (item) => item.category !== "merces" && item.category !== "dzerieni"
  );

  const curated = dishes.filter(
    (item) => item.tags?.includes("populars") || item.tags?.includes("chef_special")
  );
  if (curated.length >= target) return curated.slice(0, target);

  const selected = [...curated];
  const selectedIds = new Set(selected.map((i) => i.id));

  const byCategory = new Map<string, MenuItem[]>();
  for (const item of dishes) {
    if (selectedIds.has(item.id)) continue;
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  const categories = Array.from(byCategory.keys());
  let i = 0;
  while (selected.length < target && categories.some((c) => (byCategory.get(c)?.length ?? 0) > 0)) {
    const cat = categories[i % categories.length];
    const list = byCategory.get(cat);
    if (list && list.length > 0) {
      selected.push(list.shift()!);
    }
    i++;
  }

  return selected.slice(0, target);
}
