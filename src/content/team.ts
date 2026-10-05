export type TeamMember = {
  id: string;
  name: string;
  photo: string;
  /**
   * The photo chosen at the 2.6.2026 shoot (NORR3-valokuvaukset-02062026.xlsx).
   * When the photographer's files arrive, save each as
   * `public/images/team/<id>.jpg` and switch `photo` to `/images/team/<id>.jpg`.
   * "TBD" = the person marked favourites in the gallery but no filename was
   * recorded in the schedule yet.
   */
  selectedShot: string;
  role?: { fi: string; en: string };
  bio: { fi: string; en: string };
  /** True for the management team (drives the Contact page's lead-contact row). */
  lead?: boolean;
  /** Optional per-person links. Left undefined until real URLs/addresses are
   *  supplied — the card falls back to the company LinkedIn + info@norr3.fi
   *  rather than fabricating personal contacts. */
  linkedin?: string;
  email?: string;
  phone?: string;
};

// Roster from the photo-shoot schedule. Portrait photos are placeholders until
// the real shots arrive (see selectedShot). Roles are only set where the brand
// materials state them — do not invent titles for real people.

/**
 * The shared house line every member currently carries, because per-person bios
 * have not been written yet. Cards compare against this object and skip it: 17
 * identical paragraphs read as filler, and the same claim is already made in
 * full by the "Attitude." pillar above the roster. As soon as a member gets a
 * real bio object, their card starts showing it — no code change needed.
 */
export const houseBio = {
  fi: "Rohkea, innovatiivinen ja strateginen mediatoimistokentän uudistaja.",
  en: "A bold, innovative and strategic renewer of the media agency field.",
};

const bio = houseBio;

/**
 * Role-based bios for members whose personal bio is not in the CMS yet.
 * True to their roles and how they work — the CMS team table is the
 * source of truth once a real bio is saved there.
 */
const draftBios: Record<string, { fi: string; en: string }> = {
  "maria-malila": {
    fi: "Marialla on yli 20 vuoden kokemus markkinoinnista sekä asiakkaan että toimiston puolelta — se tuo kaupallista näkökulmaa projekteihin.\n\nHän on johtanut tiimejä, kampanjoita ja asiakkuuksia muun muassa Hartwallilla ja Eezyllä. NØRR3:lla Maria vastaa ihmisistä, kampanjoista ja asiakasprojekteista.",
    en: "Maria has 20+ years in marketing on both the client and agency side — commercial perspective that benefits every project.\n\nShe has led teams, campaigns and client accounts at Hartwall, Eezy, TBWA\\PHS and TEQUILA, among others. At NØRR3 Maria looks after people, campaigns and client projects.",
  },
  "elina-rossi": {
    fi: "Elinalla on pitkä kokemus projektien johtamisesta ja mediasuunnittelusta. Hän rakentaa kampanjakokonaisuuksia, joissa luova ja media pelaavat yhteen — ja huolehtii, että työ valmistuu ajallaan ja sovitusti.",
    en: "Elina has long experience in project management and media planning. She builds campaign entities where creative and media work together — and makes sure the work is delivered on time and as agreed.",
  },
  "anna-liina-harrivaara": {
    fi: "Allulla on 16 vuoden kokemus tuloksellisesta digimainonnasta B2B- ja B2C-puolelta, erityisesti autoilun, travelin, retailin ja financen aloilta.\n\nHän on vahvimmillaan Googlen kanavissa ja parhaimmillaan pienen paineen alla. NØRR3:lla Allu suunnittelee, operoi ja optimoi mainontaa.",
    en: "Allu has 16 years of results-driven digital advertising across B2B and B2C, with special expertise in automotive, travel, retail and finance.\n\nShe is at her strongest in Google's channels and thrives under clear goals and a little pressure. At NØRR3 Allu plans, runs and optimizes campaigns.",
  },
  "maija-etokari": {
    fi: "Maijalla on 13 vuoden monipuolinen digimarkkinoinnin osaaminen: hakusanamainonta, ohjelmallinen ostaminen, some, sähköpostimarkkinointi ja automaatio, sisältömarkkinointi sekä SEO ja analytiikka.\n\nNØRR3:lla Maija keskittyy digimainonnan suunnitteluun, operointiin ja optimointiin.",
    en: "Maija brings 13 years of versatile digital marketing know-how: search, programmatic buying, social, email and automation, content marketing, SEO and analytics.\n\nAt NØRR3 Maija focuses on digital media planning, operations and optimization.",
  },
  "dina-barbis": {
    fi: "Dina vastaa monikanavaisesta mediasuunnittelusta ja yhteistyöstä suorien medioiden kanssa: ulkomainonta, printti, Total-tv, radio ja suorat digikampanjat.\n\n10+ vuotta mainonnan suunnittelusta ja operoinnista lähes kaikissa kanavissa. Kohderyhmäanalyysi on hänen ydinosaamistaan.",
    en: "Dina leads multichannel media planning and direct-media partnerships: out-of-home, print, Total TV, radio and direct digital campaigns.\n\n10+ years of advertising planning and operations across nearly every digital and offline channel. Audience behaviour analysis is her core skill.",
  },
  "marika-salovaara": {
    fi: "Marikalla on yli 10 vuoden kokemus markkinoinnin suunnittelusta ja johtamisesta sekä vahvat vuorovaikutustaidot.\n\nHän hallinnoi sujuvasti useita kokonaisuuksia ja on työskennellyt laajasti B2C- ja B2B-asiakkaiden sekä FMCG-brändien parissa. NØRR3:lla Marika johtaa tiimiä ja asiakasprojekteja.",
    en: "Marika has 10+ years in marketing planning and leadership, with strong interpersonal skills.\n\nShe juggles several entities at once and has worked widely with B2C and B2B clients and several FMCG brands. At NØRR3 Marika leads a team and client projects.",
  },
  "aino-lehtinen": {
    fi: "Ainolla on kokemusta markkinoinnin monipuolisista tehtävistä ja mediatoimistomaailmasta erityisesti somen puolelta: sisällönsuunnittelusta ja kampanjahallinnasta.\n\nHänen vahvimmat kanavansa ovat Meta, TikTok ja Snapchat. NØRR3:lla Aino keskittyy kanavien optimointiin, operointiin ja raportointiin.",
    en: "Aino already has versatile marketing and agency experience, especially in social media: from content planning to campaign management.\n\nHer strongest channels are Meta, TikTok and Snapchat. At NØRR3 Aino focuses on media channel optimization, operations and reporting.",
  },
  "janne-savela": {
    fi: "Jannella on 9 vuoden kokemus mediatoimistoista: digitaalisia kampanjoita, ohjelmallista ostamista ja displayta — myös esihenkilöroolista.\n\nHänen portfolioonsa mahtuu pörssiyrityksiä ja kansainvälisiä autovalmistajia. NØRR3:lla Janne suunnittelee ja toteuttaa ohjelmallisia kampanjoita.",
    en: "Janne has nine years in media agencies: digital campaigns, programmatic buying and direct display — including a team-lead role.\n\nHis portfolio spans listed companies, charities and international car makers. At NØRR3 Janne plans and runs programmatic and display campaigns.",
  },
  "teppo-lipsanen": {
    fi: "Teppo on analyyttinen ongelmanratkaisija, jonka keskiössä ovat aina olleet luvut ja niistä johdetut tiedot.\n\nHän on tehnyt kampanja-, brändi- ja hakuosuustutkimuksia sekä rakentanut teknisiä seurantoja ja dashboardeja. NØRR3:lla Teppo vastaa datasta, mittauksista ja projektien johtamisesta.",
    en: "Teppo is an analytical problem-solver whose focus has always been numbers and the insight drawn from them.\n\nHe has run campaign, brand and search-share studies and built technical tracking and dashboards. At NØRR3 Teppo is responsible for data, measurement and project management.",
  },
  "michael-oshea": {
    fi: "Michael on analyyttinen ongelmanratkaisija, jolla on 5+ vuoden kokemus mediatoimistoista ja suomalaisista brändeistä.\n\nHänen erikoisosaamistaan ovat ohjelmallinen ostaminen, konversio-optimointi, digital audio ja ohjelmallinen ulkomainonta. NØRR3:lla Michael vastaa dynaamisista ratkaisuista.",
    en: "Michael is an analytical problem-solver with 5+ years in media agencies and well-known Finnish brands across industries.\n\nHis specialities are programmatic buying, conversion optimization, digital audio and programmatic OOH. At NØRR3 Michael works on dynamic solutions and performance marketing.",
  },
  "karoliina-makela": {
    fi: "Karoliina vastaa talouden suunnittelusta ja seurannasta. Hän pitää huolen, että luvut ovat ajan tasalla ja että sekä tiimillä että asiakkailla on luotettava kuva taloudesta.",
    en: "Karoliina is responsible for financial planning and monitoring. She makes sure the numbers are up to date and that both the team and clients have a reliable view of the finances.",
  },
};

const bioFor = (id: string) => draftBios[id] ?? bio;

export const team: TeamMember[] = [
  { id: "maria-malila", name: "Maria Malila", photo: "/images/team/maria-malila.webp", selectedShot: "Norr33113.jpg", role: { fi: "Client & Team Lead", en: "Client & Team Lead" }, lead: true, email: "maria.malila@norr3.fi", bio: bioFor("maria-malila") },
  { id: "antti-ujainen", name: "Antti Ujainen", photo: "/images/team/antti-ujainen.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Managing Director", en: "Managing Director" }, lead: true, email: "antti.ujainen@norr3.fi", linkedin: "https://www.linkedin.com/in/ujainen/", bio },
  { id: "anne-mari-lahtinen", name: "Anne-Mari Lahtinen", photo: "/images/team/anne-mari-lahtinen.webp", selectedShot: "Norr33286.jpg", role: { fi: "Senior Concept Designer, Team Lead, Partner", en: "Senior Concept Designer, Team Lead, Partner" }, lead: true, email: "anne-mari.lahtinen@norr3.fi", bio },
  { id: "elina-rossi", name: "Elina Rossi", photo: "/images/team/elina-rossi.webp", selectedShot: "Norr33374.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "elina.rossi@norr3.fi", bio: bioFor("elina-rossi") },
  { id: "anton-kallio", name: "Anton Kallio", photo: "/images/team/anton-kallio.webp", selectedShot: "Norr33595.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "anton.kallio@norr3.fi", bio },
  { id: "anna-liina-harrivaara", name: "Anna-Liina Harrivaara", photo: "/images/team/anna-liina-harrivaara.webp", selectedShot: "TBD (valittu kuvauksissa)", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "anna-liina.harrivaara@norr3.fi", bio: bioFor("anna-liina-harrivaara") },
  { id: "maija-etokari", name: "Maija Etokari", photo: "/images/team/maija-etokari.webp", selectedShot: "Norr33739.jpg / Norr33804.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "maija.etokari@norr3.fi", bio: bioFor("maija-etokari") },
  { id: "dina-barbis", name: "Dina Barbis", photo: "/images/team/dina-barbis.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Senior Media Planner, Partner", en: "Senior Media Planner, Partner" }, email: "dina.barbis@norr3.fi", bio: bioFor("dina-barbis") },
  { id: "marika-salovaara", name: "Marika Salovaara", photo: "/images/team/marika-salovaara.webp", selectedShot: "Norr34062.jpg", role: { fi: "Client & Team Lead", en: "Client & Team Lead" }, lead: true, email: "marika.salovaara@norr3.fi", bio: bioFor("marika-salovaara") },
  { id: "lotta-brech", name: "Lotta Brech", photo: "/images/team/lotta-brech.webp", selectedShot: "Norr34138.jpg", role: { fi: "Client & Team Lead, Partner", en: "Client & Team Lead, Partner" }, lead: true, email: "lotta.brech@norr3.fi", bio },
  { id: "salla-sofia-lahti", name: "Salla-Sofia Lahti", photo: "/images/team/salla-sofia-lahti.webp", selectedShot: "Norr34300.jpg", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "salla-sofia.lahti@norr3.fi", bio },
  { id: "aino-lehtinen", name: "Aino Lehtinen", photo: "/images/team/aino-lehtinen.webp", selectedShot: "Norr34653.jpg", role: { fi: "Media Specialist", en: "Media Specialist" }, email: "aino.lehtinen@norr3.fi", bio: bioFor("aino-lehtinen") },
  { id: "janne-savela", name: "Janne Savela", photo: "/images/team/janne-savela.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "janne.savela@norr3.fi", bio: bioFor("janne-savela") },
  { id: "geir-siirde", name: "Geir Siirde", photo: "/images/team/geir-siirde.webp", selectedShot: "Norr34687.jpg / Norr34711.jpg", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "geir.siirde@norr3.fi", bio },
  { id: "teppo-lipsanen", name: "Teppo Lipsanen", photo: "/images/team/teppo-lipsanen.webp", selectedShot: "Norr34853.jpg", role: { fi: "Data Analyst & Project Manager, Partner", en: "Data Analyst & Project Manager, Partner" }, email: "teppo.lipsanen@norr3.fi", bio: bioFor("teppo-lipsanen") },
  { id: "michael-oshea", name: "Michael O'Shea", photo: "/images/team/michael-oshea.webp", selectedShot: "Norr35115.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "michael.oshea@norr3.fi", bio: bioFor("michael-oshea") },
  { id: "karoliina-makela", name: "Karoliina Mäkelä", photo: "/images/team/karoliina-makela.webp", selectedShot: "Norr35036.jpg", role: { fi: "Business Controller", en: "Business Controller" }, lead: true, email: "karoliina.makela@norr3.fi", bio: bioFor("karoliina-makela") },
];

/**
 * Group + mood shots picked at the same shoot — for the hero collage, values
 * interstitials and About section once the files arrive:
 * group: Norr33485.jpg, Norr33502.jpg
 * mood ("fiiliskuvat"): Norr35218, Norr35344, Norr35374, Norr35406, Norr35410,
 * Norr35464, Norr35493, Norr35502
 */

export type OpenRole = {
  id: string;
  title: { fi: string; en: string };
  location: { fi: string; en: string };
  /**
   * Where this role is actually advertised for applications (the recruitment
   * system page, e.g. Eilakaisla/Talentadore). The role card links straight
   * here — without it every posting dumped the candidate on the contact page.
   * Owned by the CMS (`careers.apply_url`); absent for the committed fallback
   * roles, which then fall back to the open-roles list.
   */
  applyUrl?: string;
};

export const openRoles: OpenRole[] = [
  { id: "programmatic", title: { fi: "Ohjelmallisen ostamisen asiantuntija", en: "Programmatic Trading Specialist" }, location: { fi: "Helsinki", en: "Helsinki" } },
  { id: "engine-dev", title: { fi: "Marketing Engine -kehittäjä", en: "Marketing Engine Developer" }, location: { fi: "Helsinki / etä", en: "Helsinki / remote" } },
  { id: "client-director", title: { fi: "Asiakkuuspäällikkö, B2B", en: "Client Director, B2B" }, location: { fi: "Helsinki", en: "Helsinki" } },
];
