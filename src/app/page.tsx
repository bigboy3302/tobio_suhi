import DailyPick from "@/components/DailyPick";
import Footer from "@/components/Footer";
import GoogleReviewsCTA from "@/components/GoogleReviewsCTA";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import MenuGrid from "@/components/MenuGrid";
import MobileOrderBar from "@/components/MobileOrderBar";
import RollBuilder from "@/components/RollBuilder";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import {
  DAY_NAMES_LV,
  getLocations,
  getMenuItems,
  getRollBuilderOptions,
  getSiteSettings,
  getTestimonials,
  resolveDailySpecial,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [menuItems, locations, testimonials, rollOptions, settings] = await Promise.all([
    getMenuItems(),
    getLocations(),
    getTestimonials(),
    getRollBuilderOptions(),
    getSiteSettings(),
  ]);

  const { item: dailyItem, isManual } = resolveDailySpecial(menuItems, settings);
  const dayName = DAY_NAMES_LV[new Date().getDay()];

  return (
    <>
      <Header locations={locations} />
      <main className="flex-1">
        <Hero settings={settings} menuItems={menuItems} locations={locations} />
        <div className="mt-4">
          <DailyPick item={dailyItem} isManual={isManual} dayName={dayName} />
        </div>
        <WhyUs locations={locations} />
        <RollBuilder options={rollOptions} basePrice={settings?.roll_builder_base_price ?? 4.9} />
        <MenuGrid items={menuItems} />
        <Locations locations={locations} />
        <Testimonials testimonials={testimonials} />
        <GoogleReviewsCTA locations={locations} reviewsUrl={settings?.google_reviews_url ?? ""} />
      </main>
      <Footer locations={locations} />
      <MobileOrderBar locations={locations} />
    </>
  );
}
