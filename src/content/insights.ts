export type Insight = {
  slug: string;
  /**
   * English address for this post (CMS `posts.slug_en`). Empty/absent falls
   * back to the `slugEn.ts` table, then to the Finnish slug.
   */
  slugEn?: string;
  date: string;
  ghost?: string;
  image?: string;
  fi: { title: string; excerpt: string; body: string[] };
  en: { title: string; excerpt: string; body: string[] };
};

// Blog cards from the Figma design: some lead with a photo, others with a
// lavender tile carrying a giant "ghost" figure (e.g. 2026, 360).
export const insights: Insight[] = [
  {
    slug: "tre-kronor-media",
    date: "25.8.2026",
    image: "/images/brand/space-arch.webp",
    fi: {
      title: "Tre Kronor Media laajentuu Suomeen NØRR3:n kanssa",
      excerpt: "Pohjoismainen palkittu mediatoimisto Tre Kronor Media laajentuu Suomeen yhdessä NØRR3:n kanssa.",
      body: [
        "Pohjoismainen palkittu mediatoimisto Tre Kronor Media laajentuu Suomeen yhdessä NØRR3:n kanssa. Yhteistyö tuo suomalaisasiakkaille pääsyn pohjoismaiseen osaamiseen ja ostovoimaan ilman, että paikallinen palvelu ohenee.",
        "Käytännössä laajentuminen tarkoittaa yhteisiä työkaluja, jaettua dataa ja yhteispohjoismaisia neuvotteluasemia mediataloihin — asiakkaalle se näkyy parempina hintoina ja laajempana näkymänä.",
        "Ensimmäiset yhteiset asiakkuudet käynnistyvät syksyllä 2026.",
      ],
    },
    en: {
      title: "Tre Kronor Media expands to Finland with NØRR3",
      excerpt: "The awarded Nordic media agency Tre Kronor Media expands to Finland together with NØRR3.",
      body: [
        "The awarded Nordic media agency Tre Kronor Media is expanding to Finland together with NØRR3. The partnership gives Finnish clients access to Nordic expertise and buying power without thinning out local service.",
        "In practice the expansion means shared tools, shared data and a pan-Nordic negotiating position with media houses — for the client it shows up as better prices and a wider view.",
        "The first joint accounts start in autumn 2026.",
      ],
    },
  },
  {
    slug: "isojen-ruutujen-trendit",
    date: "25.8.2026",
    ghost: "2026",
    fi: {
      title: "Isojen ruutujen trendit",
      excerpt: "Kirjoituksessa pohditaan mitä trendejä liittyy isoihin ruutuihin.",
      body: [
        "Iso ruutu ei kadonnut minnekään — se muutti muotoaan. TV:n, suoratoiston ja digitaalisen ulkomainonnan rajat hämärtyvät, ja suunnittelijan on ajateltava ruutuja yhtenä jatkumona.",
        "Kun sama sisältö elää olohuoneen televisiossa, kauppakeskuksen näytöllä ja puhelimen ruudulla, mittaamisen on seurattava katsojaa eikä laitetta.",
        "Isojen ruutujen vahvuus on edelleen huomioarvo — mutta vain, jos luova on suunniteltu ruudun kokoon eikä skaalattu siihen jälkikäteen.",
      ],
    },
    en: {
      title: "Big screen trends",
      excerpt: "What trends are shaping the big screens.",
      body: [
        "The big screen didn't disappear — it changed shape. The lines between TV, streaming and digital out-of-home are blurring, and a planner has to treat screens as one continuum.",
        "When the same content lives on the living-room TV, the mall screen and the phone, measurement has to follow the viewer, not the device.",
        "The big screen's strength is still attention — but only if the creative is designed for the screen size rather than scaled to it afterwards.",
      ],
    },
  },
  {
    slug: "voittava-mediamix-2026",
    date: "25.7.2026",
    image: "/images/brand/data-desk.webp",
    fi: {
      title: "Voittava mediamix vuodelle 2026",
      excerpt: "Kirjoituksessa pohditaan voittavan mediamixin rakentamista vuodelle 2026 ja mitä siinä voisi huomioida.",
      body: [
        "Voittava mediamix ei synny kanavalistasta vaan tavoitteesta: mitä kohderyhmän ajattelussa tai käytöksessä pitää muuttua?",
        "Vuonna 2026 kolme asiaa korostuu: vähittäismedian nousu, isojen ruutujen paluu huomion lähteeksi ja AI-avusteinen budjetin uudelleenjako kesken kampanjan.",
        "Paras suoja hukkaan menneiltä euroilta on edelleen tylsä perusasia: tutkittu data siitä, missä yleisösi oikeasti on.",
      ],
    },
    en: {
      title: "The winning media mix for 2026",
      excerpt: "How to build a winning media mix for 2026 and what to consider.",
      body: [
        "A winning media mix doesn't start from a channel list but from a goal: what has to change in how the audience thinks or acts?",
        "Three things stand out in 2026: the rise of retail media, big screens returning as the source of attention, and AI-assisted budget reallocation mid-campaign.",
        "The best protection against wasted euros is still the boring basic: researched data on where your audience actually is.",
      ],
    },
  },
  {
    slug: "media-insights-360",
    date: "25.6.2026",
    ghost: "360",
    fi: {
      title: "360° näkymä yleisöön — mitä Media Insights kertoo",
      excerpt: "Miten tutkittu paneelidata muuttaa mediasuunnittelun arjen.",
      body: [
        "Kun yleisödata kerätään 3–4 kertaa vuodessa yli 1500 kuluttajalta, mediasuunnittelu lakkaa olemasta arvailua.",
        "Media Insights näyttää, miten B2C- tai B2B-yleisösi mediankäyttö oikeasti jakautuu — kanavittain, ikäryhmittäin ja sukupuolittain.",
        "Tuloksena asiakkaamme säästävät keskimäärin 25 % mainoskuluissaan karsimalla hukkakontaktit pois suunnitelmasta.",
      ],
    },
    en: {
      title: "A 360° view of the audience — what Media Insights shows",
      excerpt: "How researched panel data changes everyday media planning.",
      body: [
        "When audience data is collected 3–4 times a year from over 1,500 consumers, media planning stops being guesswork.",
        "Media Insights shows how your B2C or B2B audience's media use actually splits — by channel, age group and gender.",
        "As a result our clients save an average of 25% of their ad spend by cutting wasted contacts out of the plan.",
      ],
    },
  },
  {
    slug: "norr3-ja-kiinteistomaailma-yhteistyossa-marketing-engine-mullistaa-paikallismarkkinoinnin",
    date: "28.3.2025",
    image: "/images/cases/kiinteistomaailma.webp",
    fi: {
      title: "NØRR3 ja Kiinteistömaailma yhteistyössä — Marketing Engine mullistaa paikallismarkkinoinnin",
      excerpt: "NØRR3 Marketing Engine automatisoi paikallismarkkinoinnin ja vähentää manuaalista työtä murto-osaan.",
      body: [
        "Insight- ja mediatoimisto NØRR3 on kehittänyt yhdessä Kiinteistömaailman kanssa NØRR3 Marketing Enginen, joka automatisoi paikallismarkkinointia ja vähentää manuaalista työtä murto-osaan.",
        "NØRR3 Marketing Engine tuottaa ja jakaa personoidut, dynaamiset aineistot eri kanaviin automaattisesti yrittäjien valintojen mukaisesti — yrittäjä voi valita kampanjaan haluamansa asunnot, määrittää kampanja-alueen ja budjetin, ja työkalu luo mainosmateriaalit ajantasaisin asuntotiedoin.",
        "Ratkaisu ei ole rajoitettu kiinteistöalaan — se soveltuu myös muille franchising- ja kivijalkaketjuille hyödyntäen tuote-, varasto- ja palveludataa.",
      ],
    },
    en: {
      title: "NØRR3 and Kiinteistömaailma — Marketing Engine revolutionises local marketing",
      excerpt: "NØRR3 Marketing Engine automates local marketing and cuts manual work to a fraction.",
      body: [
        "Insight and media agency NØRR3 has developed, together with Kiinteistömaailma, the NØRR3 Marketing Engine — automating local marketing and cutting manual work to a fraction.",
        "The Marketing Engine produces and distributes personalised, dynamic creatives to channels automatically based on each entrepreneur's choices — they pick the listings, define the campaign area and budget, and the tool builds the ads with up-to-date property details.",
        "The solution isn't limited to real estate — it fits other franchise and brick-and-mortar chains by leveraging product, inventory and service data.",
      ],
    },
  },
  {
    slug: "norr3-vuoden-toimisto-2023",
    date: "6.3.2023",
    ghost: "2023",
    fi: {
      title: "NØRR3 on vuoden toimisto 2023!",
      excerpt: "NØRR3 nappasi alalla arvostetun Vuoden Toimisto -palkinnon — toista kertaa peräkkäin.",
      body: [
        "Viime vuoden tavoin NØRR3 nappasi itselleen alalla arvostetun laadun ja osaamisen mittarin — Vuoden Toimisto -palkinnon kategoriassa mediatoimistot 500t–2M€.",
        "Yli toimialan keskiarvon nousimme asiakkaan liiketoiminnan tuntemuksessa, digitaalisessa osaamisessa, sitoutuneisuudessa, hallinnollisissa rutiineissa, toimitusvarmuudessa ja hinta-laatu-suhteessa.",
        "64 % vastanneista asiakkaista antoi arvosanan 10 tai 9 liiketoiminnan tuntemuksesta, ja digitaalinen osaaminen ylsi lukemiin 8,91.",
      ],
    },
    en: {
      title: "NØRR3 is Agency of the Year 2023!",
      excerpt: "NØRR3 won the industry's respected Agency of the Year award — for the second year running.",
      body: [
        "Just like last year, NØRR3 took home the industry's respected quality-and-expertise benchmark — the Agency of the Year award in the media agencies 500k–2M€ category.",
        "We scored above the industry average in knowledge of the client's business, digital expertise, commitment, administrative routines, delivery reliability and value for money.",
        "64 % of responding clients gave a 9 or 10 for business understanding, and our digital expertise reached 8.91.",
      ],
    },
  },
  {
    slug: "nelja-pohjoismaata-yhdistavat-voimansa-uudessa-mediatoimistoverkostossa",
    date: "8.2.2023",
    ghost: "INN",
    fi: {
      title: "Neljä pohjoismaata yhdistävät voimansa uudessa mediatoimistoverkostossa",
      excerpt: "HowCom, TRY Opt, Calibrate ja NØRR3 perustivat itsenäisen pohjoismaisen mediatoimistoverkoston.",
      body: [
        "Ruotsalainen HowCom, norjalainen TRY Opt, tanskalainen Calibrate ja NØRR3 perustivat mediatoimistoverkoston, jonka tavoitteena on tarjota pohjoismaisille mainostajille itsenäinen ja läpinäkyvä vaihtoehto mediatoimistokumppania valitessaan.",
        "Liittouman, Independent Nordic Networkin (”INN”), muodostavat vahvat, paikalliset ja itsenäiset toimistot, jotka jakavat saman lähestymistavan ja intohimon tuottaa asiakkailleen lisäarvoa.",
        "Verkosto tarjoaa ”one point of contact” -periaatteella paikalliset tiimit kaikista Pohjoismaista — yhteenlaskettu liikevaihto on yli 120 M€ ja verkosto työllistää yli 160 markkinoinnin ja media-alan ammattilaista.",
      ],
    },
    en: {
      title: "Four Nordic countries join forces in a new media agency network",
      excerpt: "HowCom, TRY Opt, Calibrate and NØRR3 founded an independent Nordic media agency network.",
      body: [
        "Sweden's HowCom, Norway's TRY Opt, Denmark's Calibrate and NØRR3 founded a media agency network with the goal of offering Nordic advertisers an independent and transparent alternative when choosing a media agency partner.",
        "The alliance, the Independent Nordic Network (”INN”), is made up of strong, local and independent agencies that share the same approach and passion for creating added value for their clients.",
        "The network offers local teams across all the Nordics on a one-point-of-contact basis — with a combined revenue above €120M and more than 160 marketing and media professionals.",
      ],
    },
  },
  {
    slug: "ai-and-the-creative-future",
    date: "24.10.2024",
    ghost: "AI",
    fi: {
      title: "AI & The Creative Future: Enhancing Performance and Customer Experience",
      excerpt: "Aamutilaisuus, jossa alan johtavat asiantuntijat jakoivat strategioita tekoälyn hyödyntämiseen.",
      body: [
        "Tervetuloa inspiroivaan aamuun, jossa alan johtavat asiantuntijat jakavat strategioita suorituskyvyn parantamiseen saumattomalla tiimien välisellä integraatiolla.",
        "Keynote-puhujina Antti Ujainen (NØRR3), Julia Rautakoski (Tre Kronor Media) ja Helena Dokken (Farmasiet), sekä paneelissa IAB Finlandin, Google Cloudin, Sherpan, MTV & TV4:n ja Alma Median edustajat.",
        "Tapahtuma järjestettiin 24. lokakuuta klo 8–11 NØRR3:n studiolla Helsingissä, Pursimiehenkatu 26 C:ssä.",
      ],
    },
    en: {
      title: "AI & The Creative Future: Enhancing Performance and Customer Experience",
      excerpt: "A morning event where leading industry experts shared strategies for leveraging AI.",
      body: [
        "An insightful morning where leading industry experts shared strategies to enhance performance through seamless integration across teams.",
        "Keynotes by Antti Ujainen (NØRR3), Julia Rautakoski (Tre Kronor Media) and Helena Dokken (Farmasiet), plus a panel with IAB Finland, Google Cloud, Sherpa, MTV & TV4 and Alma Media.",
        "The event ran on 24 October, 8–11 AM, at NØRR3's studio in Helsinki, Pursimiehenkatu 26 C.",
      ],
    },
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

/**
 * Estimated reading time at ≈200 words per minute, rounded to at least one
 * minute. One helper for the blog cards, the index feature and the article
 * header, so the same post never advertises two different figures.
 */
export function readingMinutes(body: string[]) {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
