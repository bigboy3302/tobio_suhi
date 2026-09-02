export type MenuCategory =
  | "susi_seti"
  | "aukstie_susi"
  | "siltie_susi"
  | "burgeri"
  | "nigiri"
  | "uzkodas"
  | "merces"
  | "dzerieni";

export type MenuTag =
  | "jauns"
  | "piktants"
  | "vegans"
  | "bez_glutena"
  | "populars"
  | "chef_special";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  price_large?: number;
  size_small_label?: string;
  size_large_label?: string;
  category: MenuCategory;
  tags: MenuTag[];
  active: boolean;
  sort_order: number;
  image_id: string | null;
  image_alt: string | null;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours_weekdays: string;
  hours_weekend: string;
  rating: number;
  reviews_count: number;
  google_maps_url: string;
  sort_order: number;
  image_id: string | null;
  image_alt: string | null;
}

export interface Testimonial {
  id: string;
  author_name: string;
  location_name: string;
  quote: string;
  rating: number;
  source: "google" | "facebook" | "direct" | "";
  active: boolean;
  sort_order: number;
}

export type RollOptionCategory = "rice" | "protein" | "extra";

export interface RollBuilderOption {
  id: string;
  category: RollOptionCategory;
  name: string;
  price: number;
  active: boolean;
  sort_order: number;
}

export interface SiteSettings {
  id: string;
  daily_special_manual_id: string | null;
  daily_special_manual: MenuItem | null;
  roll_builder_base_price: number;
  google_reviews_url: string;
  wolt_url_sigulda: string;
  wolt_url_cesis: string;
  hero_image_id: string | null;
  hero_image_alt: string | null;
}

export interface SiteCopyRow {
  key: string;
  lv: string;
  en: string;
}

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  susi_seti: "Suši seti",
  aukstie_susi: "Aukstie suši",
  siltie_susi: "Siltie suši",
  burgeri: "Burgeri",
  nigiri: "Nigiri",
  uzkodas: "Uzkodas",
  merces: "Mērces",
  dzerieni: "Dzērieni",
};

export const TAG_LABELS: Record<MenuTag, string> = {
  jauns: "Jauns",
  piktants: "Pikants",
  vegans: "Vegāns",
  bez_glutena: "Bez glutēna",
  populars: "Populārs",
  chef_special: "Šefpavāra izvēle",
};
