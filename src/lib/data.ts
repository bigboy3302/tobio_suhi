import { createPocketBase } from "./pocketbase";
import type {
  Location,
  MenuItem,
  RollBuilderOption,
  SiteSettings,
  Testimonial,
} from "./types";

// PocketBase requests are made with `cache: "no-store"` so that edits made
// in the PocketBase admin UI are reflected on the site on the next request,
// without needing a rebuild or redeploy.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

function pb() {
  return createPocketBase();
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const client = pb();
    const records = await client.collection("menu_items").getFullList({
      filter: "active = true",
      sort: "category,sort_order",
      fetch: noStoreFetch,
    });
    return records as unknown as MenuItem[];
  } catch {
    return [];
  }
}

export async function getLocations(): Promise<Location[]> {
  try {
    const client = pb();
    const records = await client.collection("locations").getFullList({
      sort: "sort_order",
      fetch: noStoreFetch,
    });
    return records as unknown as Location[];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const client = pb();
    const records = await client.collection("testimonials").getFullList({
      filter: "active = true",
      sort: "sort_order",
      fetch: noStoreFetch,
    });
    return records as unknown as Testimonial[];
  } catch {
    return [];
  }
}

export async function getRollBuilderOptions(): Promise<RollBuilderOption[]> {
  try {
    const client = pb();
    const records = await client.collection("roll_builder_options").getFullList({
      filter: "active = true",
      sort: "category,sort_order",
      fetch: noStoreFetch,
    });
    return records as unknown as RollBuilderOption[];
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const client = pb();
    const record = await client.collection("site_settings").getFirstListItem("", {
      expand: "daily_special_manual",
      fetch: noStoreFetch,
    });
    return record as unknown as SiteSettings;
  } catch {
    return null;
  }
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
  const manual = settings?.expand?.daily_special_manual;
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
