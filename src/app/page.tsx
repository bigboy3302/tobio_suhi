import DailyPick from "@/components/DailyPick";
import Footer from "@/components/Footer";
import GoogleReviews from "@/components/GoogleReviews";
import GoogleReviewsCTA from "@/components/GoogleReviewsCTA";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import MenuPreview from "@/components/MenuPreview";
import MobileOrderBar from "@/components/MobileOrderBar";
import RollBuilder from "@/components/RollBuilder";
import Story from "@/components/Story";
import WhyUs from "@/components/WhyUs";
import WoltCTA from "@/components/WoltCTA";
import {
  getLocations,
  getMenuItems,
  getRollBuilderOptions,
  getSiteSettings,
  pickMenuPreviewItems,
  resolveDailySpecial,
} from "@/lib/data";
import { getGoogleReviews } from "@/lib/googleReviews";
import { buildRestaurantJsonLd } from "@/lib/structuredData";

export const dynamic = "force-dynamic";

const SITE_URL = "https://tobio-suhi.vercel.app";

export default async function Home() {
  const [menuItems, locations, rollOptions, settings] = await Promise.all([
    getMenuItems(),
    getLocations(),
    getRollBuilderOptions(),
    getSiteSettings(),
  ]);

  const { item: dailyItem, isManual } = resolveDailySpecial(menuItems, settings);
  const previewItems = pickMenuPreviewItems(menuItems);
  const googleReviews = await getGoogleReviews(locations);
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
        <Story />
        <RollBuilder
          options={rollOptions}
          basePrice={settings?.roll_builder_base_price ?? 4.9}
          locations={locations}
        />
        <MenuPreview items={previewItems} />
        <WoltCTA settings={settings} />
        <Locations locations={locations} settings={settings} />
        <GoogleReviews reviews={googleReviews} />
        <GoogleReviewsCTA locations={locations} reviewsUrl={settings?.google_reviews_url ?? ""} />
      </main>
      <Footer locations={locations} />
      <MobileOrderBar locations={locations} />
    </>
  );
}
