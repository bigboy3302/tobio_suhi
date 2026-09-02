import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MenuGrid from "@/components/MenuGrid";
import MobileOrderBar from "@/components/MobileOrderBar";
import { getLocations, getMenuItems, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ēdienkarte — Tobio Sushi | Sigulda & Cēsis",
  description:
    "Pilna Tobio Sushi ēdienkarte — suši seti, aukstie un siltie ruļļi, sushi burgeri, nigiri un uzkodas. Pieejams Siguldā un Cēsīs.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [menuItems, locations, settings] = await Promise.all([
    getMenuItems(),
    getLocations(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header locations={locations} />
      <main className="flex-1 pt-6">
        <MenuGrid items={menuItems} allergenText={settings?.allergen_text} />
      </main>
      <Footer locations={locations} />
      <MobileOrderBar locations={locations} />
    </>
  );
}
