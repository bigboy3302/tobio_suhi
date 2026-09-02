import DailyPick from "@/components/DailyPick";
import Footer from "@/components/Footer";
import GoogleReviewsCTA from "@/components/GoogleReviewsCTA";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import MenuGrid from "@/components/MenuGrid";
import MobileOrderBar from "@/components/MobileOrderBar";
import RollBuilder from "@/components/RollBuilder";
import Story from "@/components/Story";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import WoltCTA from "@/components/WoltCTA";
import {
  getLocations,
  getMenuItems,
  getRollBuilderOptions,
  getSiteSettings,
  getTestimonials,
  resolveDailySpecial,
} from "@/lib/data";
import { buildRestaurantJsonLd } from "@/lib/structuredData";

export const dynamic = "force-dynamic";

const SITE_URL = "https://tobio-suhi.vercel.app";

export default async function Home() {
  const [menuItems, locations, testimonials, rollOptions, settings] = await Promise.all([
    getMenuItems(),
    getLocations(),
    getTestimonials(),
    getRollBuilderOptions(),
    getSiteSettings(),
  ]);

  const { item: dailyItem, isManual } = resolveDailySpecial(menuItems, settings);
  const jsonLd = buildRestaurantJsonLd(locations, SITE_URL);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locations={locations} />
      <main className="flex-1">
        <Hero settings={settings} menuItems={menuItems} locations={locations} />
        <div className="mt-4">
          <DailyPick item={dailyItem} isManual={isManual} />
        </div>
        <WhyUs locations={locations} />
        <Story heading={settings?.story_heading} body={settings?.story_body} />
        <RollBuilder
          options={rollOptions}
          basePrice={settings?.roll_builder_base_price ?? 4.9}
          locations={locations}
        />
        <MenuGrid items={menuItems} linkToFullMenu allergenText={settings?.allergen_text} />
        <WoltCTA settings={settings} />
        <Locations locations={locations} settings={settings} />
        <Testimonials testimonials={testimonials} />
        <GoogleReviewsCTA locations={locations} reviewsUrl={settings?.google_reviews_url ?? ""} />
      </main>
      <Footer locations={locations} />
      <MobileOrderBar locations={locations} />
    </>
  );
}
