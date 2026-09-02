import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MenuGrid from "@/components/MenuGrid";
import MobileOrderBar from "@/components/MobileOrderBar";
import { getLocations, getMenuItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ēdienkarte — Tobio Sushi | Sigulda & Cēsis",
  description:
    "Pilna Tobio Sushi ēdienkarte — suši seti, aukstie un siltie ruļļi, sushi burgeri, nigiri un uzkodas. Pieejams Siguldā un Cēsīs.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [menuItems, locations] = await Promise.all([getMenuItems(), getLocations()]);

  return (
    <>
      <Header locations={locations} />
      <main className="flex-1 pt-6">
        <MenuGrid items={menuItems} />
      </main>
      <Footer locations={locations} />
      <MobileOrderBar locations={locations} />
    </>
  );
}
