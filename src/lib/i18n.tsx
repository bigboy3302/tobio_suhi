"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "lv" | "en";

const STORAGE_KEY = "tobio_lang";

const STRINGS: Record<string, Record<Lang, string>> = {
  "nav.daily": { lv: "Šodienas ieteikums", en: "Today's pick" },
  "nav.menu": { lv: "Ēdienkarte", en: "Menu" },
  "nav.builder": { lv: "Uztaisi savu roll'u", en: "Build your roll" },
  "nav.locations": { lv: "Atrašanās vietas", en: "Locations" },
  "nav.reviews": { lv: "Atsauksmes", en: "Reviews" },
  "nav.expand": { lv: "Izvērst izvēlni", en: "Open menu" },
  "nav.callCity": { lv: "Zvanīt uz {city}", en: "Call {city}" },

  "hero.headline": { lv: "Svaigi suši. Gatavots ar sirdi.", en: "Fresh sushi. Made with heart." },
  "hero.subtext": {
    lv: "Roku darbs, svaigi produkti un japāņu gatavošanas tradīcijas — katru dienu no jauna Siguldā un Cēsīs.",
    en: "Handmade, fresh ingredients, and Japanese culinary tradition — made fresh every day in Sigulda and Cēsis.",
  },
  "hero.ctaMenu": { lv: "Skatīt ēdienkarti", en: "View the menu" },
  "hero.ctaCall": { lv: "Piezvanīt un pasūtīt", en: "Call to order" },
  "hero.statItems": { lv: "ēdienkartes pozīcijas", en: "menu items" },
  "hero.statCities": { lv: "pilsētas Latvijā", en: "cities in Latvia" },

  "daily.eyebrow": { lv: "Šodienas ieteikums", en: "Today's pick" },
  "daily.chefSpecial": { lv: "Šefpavāra izvēle", en: "Chef's special" },
  "daily.cta": { lv: "Skatīt ēdienkartē", en: "View in the menu" },

  "why.eyebrow": { lv: "Kāpēc Tobio", en: "Why Tobio" },
  "why.heading": { lv: "Svaigums un rūpes katrā rullītī", en: "Freshness and care in every roll" },
  "why.freshTitle": { lv: "100% svaigi produkti", en: "100% fresh ingredients" },
  "why.freshBody": {
    lv: "Svaigs lasis, kvalitatīvas sastāvdaļas un rūpīgi gatavots katrs rullītis — bez saldēšanas, bez kompromisiem.",
    en: "Fresh salmon, quality ingredients, and every roll made with care — never frozen, no shortcuts.",
  },
  "why.ratingFrom": { lv: "no {n}+ atsauksmēm", en: "from {n}+ reviews" },
  "why.ratingAvg": { lv: "vidējais vērtējums", en: "average rating" },
  "why.locationsLabel": { lv: "atrašanās vietas Latvijā", en: "locations in Latvia" },
  "why.setsTitle": { lv: "Suši seti svētkiem", en: "Sushi sets for celebrations" },
  "why.setsBody": {
    lv: "No 24 līdz 48 gabaliņiem lielākai kompānijai",
    en: "24 to 48 pieces for a larger group",
  },
  "why.chefTitle": { lv: "Roku darbs ar rūpēm", en: "Hand-rolled care" },
  "why.chefBody": {
    lv: "Katrs rullītis tiek tīts ar rokām un pasniegts svaigs — katru dienu no jauna.",
    en: "Every roll is hand-rolled and served fresh — made new each day.",
  },
  "why.builderTitle": { lv: "Uztaisi savu roll'u", en: "Build your own roll" },
  "why.builderBody": {
    lv: "Izvēlies rīsus, olbaltumvielu un piedevas — cena aprēķinās uzreiz",
    en: "Choose your rice, protein, and extras — the price updates instantly",
  },
  "why.builderCta": { lv: "Izmēģināt", en: "Try it" },

  "story.eyebrow": { lv: "Mūsu stāsts", en: "Our story" },
  "story.headline": {
    lv: "Aiz katra rullīša stāv roku darbs un svaigas sastāvdaļas.",
    en: "Behind every roll is hand-rolled care and fresh ingredients.",
  },
  "story.body": {
    lv: "Tobio komanda katru dienu gatavo no jauna — svaigs lasis, rūpīgi vārīti rīsi un roku darbā tīti ruļļi, bez saldēšanas un bez steigas. Šodien mūs atradīsi divās vietās — Siguldā un Cēsīs — ar vienādu rūpēm par katru šķīvi abās.",
    en: "The Tobio team cooks fresh every day — fresh salmon, carefully cooked rice, and hand-rolled sushi, never frozen, never rushed. You'll find us in two locations — Sigulda and Cēsis — with the same care for every plate in both.",
  },

  "builder.eyebrow": { lv: "Interaktīvi", en: "Interactive" },
  "builder.heading": { lv: "Uztaisi savu roll'u", en: "Build your own roll" },
  "builder.subtext": {
    lv: "Izvēlies katru sastāvdaļu un vēro, kā cena mainās reāllaikā.",
    en: "Pick each ingredient and watch the price update in real time.",
  },
  "builder.step1": { lv: "1. Izvēlies rīsus", en: "1. Choose your rice" },
  "builder.step2": { lv: "2. Izvēlies olbaltumvielu", en: "2. Choose your protein" },
  "builder.step3": { lv: "3. Pievieno piedevas", en: "3. Add extras" },
  "builder.yourRoll": { lv: "Tavs roll'is", en: "Your roll" },
  "builder.basePrice": {
    lv: "Bāzes cena €{base} + izvēlētās sastāvdaļas",
    en: "Base price €{base} + your chosen ingredients",
  },
  "builder.callToOrder": { lv: "Piezvanīt un pasūtīt", en: "Call to order" },
  "builder.orderThis": { lv: "Pasūtīt šo roll'u", en: "Order this roll" },
  "builder.orWolt": { lv: "vai pasūti Wolt lietotnē", en: "or order via the Wolt app" },
  "builder.included": { lv: "iekļauts", en: "included" },

  "menu.eyebrow": { lv: "Ēdienkarte", en: "Menu" },
  "menu.heading": { lv: "Izvēlies savu favorītu", en: "Find your favorite" },
  "menu.fullMenuLink": {
    lv: "Pilna ēdienkarte atsevišķā lapā →",
    en: "Full menu on its own page →",
  },
  "menu.allergenNote": {
    lv: "Ēdienkartē var būt zivis, vēžveidīgie, sezama sēklas, soja un citi alergēni. Ja tev ir alerģija vai nepanesamība, lūdzu, jautā personālam par sastāvu pirms pasūtīšanas.",
    en: "Our menu may contain fish, shellfish, sesame, soy, and other allergens. If you have an allergy or intolerance, please ask our staff about ingredients before ordering.",
  },
  "menu.all": { lv: "Visi", en: "All" },

  "wolt.heading": { lv: "Pasūti Wolt lietotnē", en: "Order on Wolt" },
  "wolt.body": {
    lv: "Piegādi Siguldā un Cēsīs nodrošina Wolt — atver mūsu profilu un pasūti tiešā ceļā.",
    en: "Delivery in Sigulda and Cēsis is handled by Wolt — open our profile and order directly.",
  },
  "wolt.orderSigulda": { lv: "Pasūtīt Siguldā", en: "Order in Sigulda" },
  "wolt.orderCesis": { lv: "Pasūtīt Cēsīs", en: "Order in Cēsis" },

  "locations.eyebrow": { lv: "Atrašanās vietas", en: "Locations" },
  "locations.heading": { lv: "Divas vietas, viena kvalitāte", en: "Two locations, one standard" },
  "locations.openNow": { lv: "Tagad atvērts", en: "Open now" },
  "locations.closedNow": { lv: "Tagad slēgts", en: "Closed now" },
  "locations.reviewsCount": { lv: "{n}+ Google atsauksmes", en: "{n}+ Google reviews" },
  "locations.directions": { lv: "Maršruts", en: "Directions" },
  "locations.orderWolt": { lv: "Pasūtīt Wolt", en: "Order on Wolt" },

  "testimonials.eyebrow": { lv: "Atsauksmes", en: "Reviews" },
  "testimonials.heading": { lv: "Ko saka mūsu viesi", en: "What our guests say" },

  "googleReviews.body": {
    lv: "Pievienojies simtiem apmierinātu viesu Siguldā un Cēsīs. Dalies ar savu pieredzi!",
    en: "Join hundreds of happy guests in Sigulda and Cēsis. Share your own experience!",
  },
  "googleReviews.outOf5": { lv: "no 5", en: "out of 5" },
  "googleReviews.count": { lv: "{n}+ Google atsauksmes", en: "{n}+ Google reviews" },
  "googleReviews.cta": { lv: "Skatīt Google atsauksmes", en: "See Google reviews" },

  "footer.tagline": {
    lv: "Svaigs suši, gatavots ar sirdi — Siguldā un Cēsīs.",
    en: "Fresh sushi, made with heart — in Sigulda and Cēsis.",
  },
  "footer.rights": { lv: "Visas tiesības aizsargātas.", en: "All rights reserved." },

  "mobileBar.call": { lv: "Zvanīt {city}", en: "Call {city}" },

  "category.susi_seti": { lv: "Suši seti", en: "Sushi sets" },
  "category.aukstie_susi": { lv: "Aukstie suši", en: "Cold sushi" },
  "category.siltie_susi": { lv: "Siltie suši", en: "Hot sushi" },
  "category.burgeri": { lv: "Burgeri", en: "Burgers" },
  "category.nigiri": { lv: "Nigiri", en: "Nigiri" },
  "category.uzkodas": { lv: "Uzkodas", en: "Snacks" },
  "category.merces": { lv: "Mērces", en: "Sauces" },
  "category.dzerieni": { lv: "Dzērieni", en: "Drinks" },

  "tag.jauns": { lv: "Jauns", en: "New" },
  "tag.piktants": { lv: "Pikants", en: "Spicy" },
  "tag.vegans": { lv: "Vegāns", en: "Vegan" },
  "tag.bez_glutena": { lv: "Bez glutēna", en: "Gluten-free" },
  "tag.populars": { lv: "Populārs", en: "Popular" },
  "tag.chef_special": { lv: "Šefpavāra izvēle", en: "Chef's pick" },
};

export const DAY_NAMES: Record<Lang, string[]> = {
  lv: ["Svētdienai", "Pirmdienai", "Otrdienai", "Trešdienai", "Ceturtdienai", "Piektdienai", "Sestdienai"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

type TranslateFn = (key: keyof typeof STRINGS | string, vars?: Record<string, string | number>) => string;

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: TranslateFn }>({
  lang: "lv",
  setLang: () => {},
  t: (key) => key,
});

export type CopyOverrides = Record<string, { lv: string; en: string }>;

export function LanguageProvider({
  children,
  initialCopy,
}: {
  children: React.ReactNode;
  initialCopy?: CopyOverrides;
}) {
  const [lang, setLangState] = useState<Lang>("lv");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "lv" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }

  const t: TranslateFn = useMemo(
    () => (key, vars) => {
      // admin-edited copy (site_copy table) wins when set; the dictionary
      // below is the fallback default so a missing/blank DB row never
      // renders empty text.
      const override = initialCopy?.[key]?.[lang];
      const entry = STRINGS[key];
      let str = override || (entry ? entry[lang] : key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang, initialCopy]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
