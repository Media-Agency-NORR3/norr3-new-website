import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import type { Locale } from "@/i18n/config";

/**
 * The SEO competitor report itself — server-rendered only.
 *
 * It lives in its own module so the page can decide, on the server, whether to
 * import it at all: the gate in ./page.tsx renders the lock screen and never
 * touches this file, so the report's copy, scores and prompt library are in
 * neither the HTML nor the RSC payload nor any client chunk while it is
 * locked. Never mark this file "use client".
 */

/* ------------------------------------------------------------------ data */

const sitemap = {
  sdm: {
    urls: "1 053",
    breakdown: [
      { label: "Blogi-artikkelit", value: 812, tone: "sdm" },
      { label: "Sivut (oppaat, palvelut, kampanjat)", value: 114, tone: "sdm" },
      { label: "Referenssit (caset)", value: 38, tone: "sdm" },
      { label: "Uutiset (news-sitemap)", value: 64, tone: "sdm" },
      { label: "Tekijäsivut", value: 24, tone: "sdm" },
      { label: "Materiaalit", value: 1, tone: "sdm" },
    ],
    notes: "Yoast SEO ‑hallittu sitemap-indeksi (post/page/material/news/reference/author). Uutissitemap → Google Discover ‑kelpoisuus.",
  },
  us: {
    urls: "68",
    breakdown: [
      { label: "Koodatut sivut (FI + EN)", value: 24, tone: "us" },
      { label: "Palvelusivut (FI + EN)", value: 10, tone: "us" },
      { label: "Caset (FI + EN)", value: 18, tone: "us" },
      { label: "Blogi-artikkelit (FI + EN)", value: 16, tone: "us" },
    ],
    notes: "Yksi yhtenäinen sitemap.xml + luettava /sitemap. Jokaisella sivulla hreflang-pari FI/EN.",
  },
};

const content = [
  {
    area: "Sisällön määrä",
    sdm: "812 blogiartikkelia, ~3 000–3 800 sanaa palvelusivulla. Julkaisuvauhti juloin: uutissitemap päivittyy jatkuvasti.",
    us: "8 blogiartikkelia, 608 sanaa palveluhubilla, ~280 sanaa palvelusivulla. Uutta sisältöä harvoin.",
    verdict: "them",
    fix: "Suurin yksittäinen kuilu. Blogeissa 100× määräero — sijoitukset rakentuvat tästä.",
  },
  {
    area: "Sisällön laatu & relevanttius",
    sdm: "Määrä yltää laadun: sivut ovat Yoast-mallin mukaan optimoituja, mutta geneerisiä (\"Mahdollistamme... mitattavilla menetelmillä\"). Moni sivu ohjaa lataamaan PDF-oppaan (lead magnet).",
    us: "Teroittunut, brändätty copywriting (\"jokainen mediaeuro mitataan\", \"tulos näytetään, ei väitetä\"). Ydinviesti erottuu — mutta ohuus verkkoon.",
    verdict: "split",
    fix: "Voima: tekstimme on aidosti parempi. Puute: määrä. Emme tarvitse 812 artikkelia — 30–50 vahvaa artikkelia oikeilla avainsanoilla riittää erottautumaan.",
  },
  {
    area: "Avainsanasivujen kattavuus",
    sdm: "13 palvelusivua (hakukonemainonta, somemarkkinointi, SEO-CRO, AI-optimointi, sisältömarkkinointi, visuaalinen suunnittelu, automaatio, web-analytiikka, video, verkkosivut, strategia, kasvustrategia, display). + kymmenet alasivut.",
    us: "5 palvelusivua (hakukoneoptimointi, ohjelmallinen, mediasuunnittelu, ulkomainonta, performance). Ei omia sivuja somelle, analytiikalle, sisällölle.",
    verdict: "them",
    fix: "Kattavuus selvästi heille. Meidän 5 sivua on hyvä alku — lisää puuttuvat avainsanasivut (some, sisältö, analytiikka) prioriteettijärjestyksessä hakumäärän mukaan.",
  },
  {
    area: "Tekninen SEO",
    sdm: "Yoast SEO (metat, sitemap, breadcrumb-schema, hreflang). Ei mitattavia latausongelmia. Legacy WordPress.",
    us: "Next.js 16, yhtenäinen sitemap.xml + news-tyyppinen luettava /sitemap, hreflang FI/EN kaikilla sivuilla, JSON-LD Organization + WebSite, CMS:n robot/canonical/redirect-hallinta, keskeneräinen mutta moderni.",
    verdict: "us",
    fix: "Meidän tekninen kanta on nykyaikaisempi ja nopeampi (Next.js vs WordPress). Pieni puute: meiltä puuttuu BreadcrumbList + Service/FAQPage schema.",
  },
  {
    area: "Rakenne & sisäinen linkitys",
    sdm: "Suuri sisäinen linkkiverkosto (72+ sisäistä linkkiä palvelusivulla), breadcrumb-navigaatio kaikilla sivuilla.",
    us: "Hyvä sisäinen linkitys (navi-dropdown, palvelusivujen ristikytkennät, caset, hub). Ei breadcrumbia.",
    verdict: "them",
    fix: "Lisää breadcrumb-navigaatio palvelusivuille + BreadcrumbList schema.",
  },
  {
    area: "Kaksikielisyys",
    sdm: "EN-sivusto olemassa (hreflang), mutta erillinen eikä täysin peilattu (en/sitemap.xml 404).",
    us: "Täysi FI/EN-peili kaikilla sivuilla, hreflang-parit jokaisessa URL:ssa, <html lang> oikein.",
    verdict: "us",
    fix: "Meillä parempi kansainvälisyyskanta.",
  },
  {
    area: "E-E-A-T ja brändi",
    sdm: "Tekijäsivut (24 kirjoittajaa), referenssit (38), \"Vuoden toimisto\" -maine, Avainlukuja-numerot. Asiakaskokemukset + tulokset mainittu, mutta ei selkeitä lukuja case-sivuilla julkisivulla.",
    us: "Senioritiimi, lähes kaikki partnereita — aito erottuvuus. Numerot (NPS 78, 800+ verkosto, liikevaihto) esillä. Todelliset case-numerot case-sivuilla (\"+298\", \"800+\").",
    verdict: "split",
    fix: "Voima: meidän case-sivut ovat numerojohtoisia. Puute: ei tekijäsivuja blogeille (E-E-A-T-signaali).",
  },
  {
    area: "UI/UX ja visuaalinen laatu",
    sdm: "Editoriaalinen, serif-vetoinen design, teal-aksentti, tummat kuvat. 7/10 — yhtenäinen, mutta palveluruudukko litteä (pelkkä teksti, ei kuvia/ikoneja), matala kontrasti kuva-overlayissa. Vain yksi CTA per palvelu.",
    us: "Moderni tuotesivumainen kokemus: interaktiivinen simulaattori, pyörivät headline-sanat, animoidut KPI:t, liukuväribrändi (violetti/keltainen), dokumentoitu design system. Palveluhubilla 6 korttia ikoneilla + alakohdat, case-kortit kuvilla ja keltainen tilastopill.",
    verdict: "us",
    fix: "Meidän UI on ilmeikkäämpi ja nykyaikaisempi. Peli- ja konversioelementit (simulaattori, brief-lomake) ovat ainutlaatuisia erottuvia tekijöitä.",
  },
  {
    area: "Liidien hallinta",
    sdm: "Ilmaiset PDF-oppaat (\"Verkkokauppaopas\", \"Google Ads -ostajan opas\") sähköpostia vastaan. Uutiskirje tilattavissa. Kuvitettu lead-magnet mainosbannerissa.",
    us: "Brief-lomake (monivaiheinen, AI-avusteinen). Yhteydenottolomake. Ei ladattavia oppaita, ei uutiskirjettä.",
    verdict: "them",
    fix: "SDM:n suurin konversioetu: ilmaiset oppaat keräävät sähköposteja. Meidän brief-lomake on hyvä työkalu mutta raskas ensikontaktiin.",
  },
];

const actions = [
  {
    priority: "1",
    title: "Julkaise 2–4 blogiartikkelia kuukaudessa oikeilla avainsanoilla",
    body: "SDM voittaa hakukoneissa määrällä: 812 artikkelia vs meidän 8. Emme tarvitse saman verran, mutta säännöllisyys on hakukoneille elintärkeä signaali. Aloita avainsanoista joilla on hakumäärää ja 0–10 kilpailu: ohjelmallinen ostaminen, some-markkinointi, markkinoinnin automaatio, DCO, GEO.",
    icon: "edit_note",
  },
  {
    priority: "2",
    title: "Lisää puuttuvat avainsanasivut",
    body: "SDM kattaa 13 palvelusivulla. Meillä on 5. Lisää seuraavaksi: some-markkinointi (30+10/kk), sisältömarkkinointi, web-analytiikka, markkinoinnin automaatio, verkkosivut. Jokainen sivu: 300–600+ sanaa, avainsana H1:ssä ja titlessä, uniikki sisältö, ristikytkentä muihin palvelusivuihin.",
    icon: "web",
  },
  {
    priority: "3",
    title: "Luo ladattavia oppaita (lead magnetit)",
    body: "SDM kerää sähköposteja ilmaisilla PDF-oppailla — jokainen on myöhemmin konvertoitavissa asiakkaaksi. Meillä ei ole yhtään. Ensimmäinen ehdokas oli jo suunniteltu: kampanjasuunnitelma-opas (80/kk, kilpailu 0). Lisää: mediamix-työkalu, some-auditti-tsekki.",
    icon: "download",
  },
  {
    priority: "4",
    title: "Lisää schema-markupia",
    body: "SDM:llä BreadcrumbList jokaisella sivuilla (Yoast). Meiltä puuttuu kokonaan. Lisää: BreadcrumbList palvelusivuille, Service-schema palvelusivuille, FAQPage jos lisätään FAQ-osiot, Article-schema blogiin. Tämä on nopea voitto, vaikuttaa Rich Snippet -näyttöön.",
    icon: "code",
  },
  {
    priority: "5",
    title: "Tekijäsivut blogeille (E-E-A-T)",
    body: "SDM:llä 24 tekijäsivua — Google näkee aidot asiantuntijat. Meillä blogit kirjoitetaan \"NØRR3\"-nimellä. Lisää jokaiselle blogiartikkelille kirjoittaja (tiimiläinen) + oma tekijäsivu, joka listaa heidän artikkelinsa. Vahvistaa E-E-A_T-signaalia merkittävästi.",
    icon: "badge",
  },
  {
    priority: "6",
    title: "News-sitemap aktiiviseen käyttöön",
    body: "SDM:llä on erillinen news-sitemap (Google Discover -kelpoisuus). Meillä on /sitemap luettavassa muodossa mutta ei news-sitemap.xml -eriötä. Lisää /news-sitemap.xml joka sisältää viimeisen 30 päivän artikkelit.",
    icon: "feed",
  },
  {
    priority: "7",
    title: "Uutiskirje",
    body: "SDM kerää tilaajia \"Digitaalisen markkinoinnin hiljainen tieto\" -uutiskirjeellä. Meillä ei uutiskirjettä. Yksinkertainen tilaustyökalu footeriin + kuukausittainen markkinointikatsaus olisi pysyvä liidilähde.",
    icon: "mark_email_read",
  },
  {
    priority: "8",
    title: "Syvennä palvelusivujen sisältöä 600+ sanaan",
    body: "SDM:n palvelusivut ovat 2 500–3 800 sanaa. Meidän ovat ~280 sanaa. Tämä on isoero — Google palkitsee kattavuuden. Jokaiselle palvelusivulle: prosessikuvaus, case-esimerkki, FAQ-osio, hinnoittelun lähestymistapa. CMS:n sivu-editorilla hallittavissa.",
    icon: "article",
  },
];

const scores = [
  { label: "Tekninen SEO", us: 85, them: 78 },
  { label: "Sisällön määrä", us: 15, them: 95 },
  { label: "Sisällön laatu", us: 75, them: 65 },
  { label: "Avainsanasivut", us: 40, them: 90 },
  { label: "Kaksikielisyys", us: 95, them: 70 },
  { label: "E-E-A-T", us: 60, them: 75 },
  { label: "UI/UX", us: 90, them: 70 },
  { label: "Liidien keruu", us: 45, them: 85 },
];

const aiPlan = {
  intro:
    "Jokainen yllä oleva korjaus on toteutettavissa tekoälyllä — mutta vain oikeilla prompteilla. Tämä on NØRR3:n oma promptikirjasto: lataa playbook, täytä hakasulkeiset kohdat ja aja. Promptit on kirjoitettu niin, että tulos kuulostaa meiltä — ei geneeriseltä AI-tekstiltä. Sääntö: AI tuottaa luonnoksen, ihminen hyväksyy ja teroittaa. Aina.",
  workflow: [
    { step: "01", title: "Kerää raaka-aine", body: "Anna AI:lle konteksti: brand-ääni, kilpailija-analyysi, avainsanadata. Ilman tätä tulokset ovat geneerisiä." },
    { step: "02", title: "Generoi luonnos promptilla", body: "Käytä alla olevia prompteja sellaisenaan. Ne pakottavat AI:n kirjoittamaan NØRR3:n äänellä, FI + EN." },
    { step: "03", title: "Ihmiskatselmus", body: "Seniori tarkistaa faktat, luvut ja sävyn. AI ei saa julkaista mitään numeroita joita ei voi todentaa." },
    { step: "04", title: "Julkaise ja mittaa", body: "Julkaise CMS:llä, lisää sitemap, seuraa sijoituksia 4 viikkoa. Toista mikä toimii." },
  ],
  prompts: [
    {
      id: "blog",
      file: "01-blogiartikkeli.md",
      icon: "edit_note",
      title: "Blogiartikkelin tuotanto (prioriteetti 1)",
      goal: "Tuottaa 600–900 sanan hakukoneoptimoitu artikkeli, joka kuulostaa NØRR3:lle ja voittaa SDM:n geneerisen sisällön.",
      prompt:
`Olet NØRR3:n sisältöstrategi. NØRR3 on pohjoismainen insight- ja mediatoimisto Helsingissä, jonka ääni on suora, itsevarma ja tuloshakuinen — ei jargonia, ei corporate-tyhjää puhetta. Tunnuslause: "jokainen mediaeuro mitataan".

Kirjoita blogiartikkeli aiheesta: [AIHE, esim. "ohjelmallinen ulkomainonta pDOOH"].
Avainsana: [AVAINSANA]. Kohderyhmä: [esim. markkinointipäälliköt B2B-yrityksissä].

Vaativat:
- 600–900 sanaa, suomeksi. Otsikko sisältää avainsanan, alle 60 merkkiä.
- Meta-kuvaus: 150–155 merkkiä, avainsana mukana, aktiivinen päättely.
- H1 sisältää avainsanan. Vähintään 3 H2-aliosiota, jotka vastaavat oikeisiin hakokysymyksiin.
- Aloita konkreettisella ongelmalla, älä määritelmällä. SDM aloittaa määritelmillä — me emme.
- Käytä esimerkkejä tosielämästa (kuvitteellisia mutta uskottavia, [ESIMERKKI]-kohdat merkitään tarkistettavaksi).
- Päätä CTA:lla joka vie joko /palvelut-sivulle tai brief-lomakkeeseen.
- Älä käytä sanoja: "dynaaminen", "innovatiivinen", "kokonaisvaltainen", "seamless". Nämä ovat kiellettyjä.
- Kirjoita lopuksi englanninkielinen versio samasta artikkelista (ei käännös — lokalisoitu, sama rakenne).

Muoto: palauta Markdown, jossa H1, meta-kuvaus, H2-osiot ja CTA selvästi eroteltuna.`,
    },
    {
      id: "service-page",
      file: "02-palvelusivun-syventaminen.md",
      icon: "web",
      title: "Palvelusivun syventäminen (prioriteetti 2 + 8)",
      goal: "Muuttaa 280 sanan palvelusivu 600–900 sanan kattavaksi sivuksi, joka voittaa SDM:n 3000-sanaiset mutta geneeriset sivut tiiviudella.",
      prompt:
`Olet NØRR3:n palvelusisällön suunnittelija. Meillä on palvelusivu [PALVELU, esim. "ohjelmallinen ostaminen"] joka on tällä hetkellä 280 sanaa. SDM:n vastaava sivu on 3000 sanaa mutta geneerinen ja pitkästyttävä.

Meidän strategia: emme kilpaile pituudella vaan tiiviydellä ja asiantuntijuudella. Tavoite: 600–900 sanaa, joista jokainen ansaitsee paikkansa.

Kirjoita täysi sivun runko seuraavalla rakenteella:
1. Hero: otsikko jossa avainsana, 2-lauseinen intro joka lupaa konkreettisen lopputuloksen (ei "mahdollistamme").
2. "Miten se toimii" — 3-osainen prosessi: mitä teemme, mitä asiakas saa, missä järjestyksessä. Käytä numeroituja vaiheita.
3. "Miten eroamme" — 3 kohtaa joissa erottuminen kilpailijoista (data → media → todentaminen -ketju, oma teknologia, senioritiimi).
4. Yksi mini-case: kuvitteellinen mutta uskettava esimerkki, [CASE]-merkinnällä jos luvut pitää tarkistaa.
5. FAQ: 4 kysymystä joita asiakkaat oikeasti kysyvät (ei "mikä on X" — vaan "mihin budjettiin X sopii", "milloin näen tulokset").
6. CTA: "Ota yhteyttä" + "Varaa 30 min palaveri".

Kiellettyjä sanoja: "kokonaisvaltainen", "seamless", "dynaaminen", "innovatiivinen", "yhdessä kumppanin kanssa". NØRR3:n ääni: suora, itsevarma, tuloshakuinen.

Palauta: Markdown, H1 + intro + numeroidut osiot + FAQ + CTA. Suomeksi. Lisää loppuun englanninkielinen lokalisoitu versio.`,
    },
    {
      id: "lead-magnet",
      file: "03-lead-magnet-opas.md",
      icon: "download",
      title: "Lead magnet -opas (prioriteetti 3)",
      goal: "Luoda PDF-opas joka kerää sähköposteja kuten SDM:n oppaat — mutta meidän oppaamme on käytännöllinen työkalu, ei 40 sivun myyntipuhe.",
      prompt:
`Olet NØRR3:n kasvumarkkinoija. Suunnittele ladattava opas (lead magnet) aiheesta: [AIHE, esim. "kampanjasuunnitelman opas"].

NØRR3:n filosofia: emme tee 40-sivuisia PDF:llä täynnä myyntipuhetta. Teemme tiiviit, käytännölliset työkalut joita asiakas voi käyttää heti.

Suunnittele:
1. Otsikko: lupaa konkreettisen lopputuloksen, alle 60 merkkiä. Esim. "Kampanjasuunnitelma 30 minuutissa — pikaopas".
2. Sisällysluettelo: 5–7 lukua. Jokainen luku on toimintaohje, ei teoriaa. Esim: "Luku 3: Miten jakaa budjetti viidelle kanavalle — kaava ja esimerkki".
3. Yhden luvun koko sisältö kirjoitettuna: 400–600 sanaa, jossa vähintään yksi käytännön taulukko tai checklist.
4. Sivun loppumainos: "Haluatko että NØRR3 tekee tämän puolestasi? Varaa 30 min palaveri" + linkki.
5. Optimoinut landing-sivun teksti: hero-otsikko, 3 hyötyä, lomakkeen teksti ("Saat oppaan heti sähköpostiisi").

Muoto: palauta Markdown, jossa on selkeästi eroteltuna (a) opaan sisältö (b) landing-sivun teksti. Suomeksi.`,
    },
    {
      id: "schema",
      file: "04-schema-markup.md",
      icon: "code",
      title: "Schema-markupin toteutus (prioriteetti 4)",
      goal: "Lisätä BreadcrumbList, Service ja FAQPage schema jokaiselle palvelusivulle — Rich Snippet -näkyvyyteen.",
      prompt:
`Olet tekninen SEO-asiantuntija. Generoi JSON-LD schema-markup NØRR3:n palvelusivulle: [PALVELUSIVU, esim. /hakukoneoptimointi].

Sivun tiedot:
- URL: https://norr3.fi/[SLUG]
- Nimi: [NIMI]
- Kuvaus: [META-KUVAUS sivulta]
- Palvelutyyppi: [esim. "SearchEngineOptimization"]
- FAQ-kysymykset: [4 kysymystä FAQ-osion pohjalta]

Generoi kolme erillistä JSON-LD-lohkoa, jotka voi liittää sivun <head>-osaan:

1. BreadcrumbList: Etusivu > Palvelut > [Nimi]
2. Service: nimi, kuvaus, provider (NØRR3, url https://norr3.fi), areaServed (Helsinki, Finland)
3. FAQPage: jokainen kysymys + vastaus (vastaukset 2–3 lausetta, suoraan sivun FAQ-osion sisällöstä)

Vaativet:
- Muodollisesti validi JSON-LD, schema.org-vanhempi.
- Käytä suomenkielisiä näkyviä tekstejä mutta englanninkielisiä schema-tyyppejä.
- Palauta valmiina script-tageissa: <script type="application/ld+json">...</script>

Tarkista: jokainen lohko on erillinen script-tagi, ei yhdistetty.`,
    },
    {
      id: "author",
      file: "05-tekijasivut.md",
      icon: "badge",
      title: "Tekijäsivujen sisältö (prioriteetti 5)",
      goal: "Luoda jokaiselle tiimiläiselle tekijäsivu joka vahvistaa E-E-A_T-signaalia ja listaa heidän artikkelinsa.",
      prompt:
`Olet NØRR3:n sisältötuottaja. Kirjoita tekijäsivun sisältö tiimiläiselle: [NIMI, ROOLI].

NØRR3:n erottuvuus: lähes kaikki ovat partnereita, senioritiimi. Tekijäsivun ei pidä olla LinkedIn-tyylinen ansioluettelo — sen pitää näyttää asiantuntemus ja persoona.

Kirjoita:
1. Intro (2–3 lausetta): kuka hän on ja mitä hän tekee asiakkaille — ei tittelilista vaan arvo asiakkaalle.
2. Asiantuntemus (3 kohtaa): millaisiin kysymyksiin hän vastaa paremmin kuin kukaan muu toimistossa.
3. Kirjoitustyyli: "Nimi kirjoittaa [tyyli, esim. suoraan ja numerovetoinesti] aiheista [aiheet]."
4. Quota: yksi lause joka kuvaa hänen suhtautumistaan markkinointiin (keksi uskottava, NØRR3:n sävyinen).
5. Sivun loppuun: "Lue [Nimen] artikkelit:" — tyhjä lista joka täytetään CMS:llä kun hän julkaisee.

Muoto: 150–250 sanaa, suomeksi ja englanniksi. Ei kolmatta persoonaa yliptyvää — suora ja lämmin.`,
    },
    {
      id: "newsletter",
      file: "06-uutiskirje.md",
      icon: "mark_email_read",
      title: "Uutiskirjeen konsepti (prioriteetti 7)",
      goal: "Suunnitella kuukausittainen uutiskirje joka tuo liidejä ilman että se on pelkkä blogi-mainos.",
      prompt:
`Olet NØRR3:n uutiskirjeen päätoimittaja. Suunnittele kuukausittaisen uutiskirjeen konsepti.

Erottuvuus: SDM lähettää "hiljaisen tiedon" uutiskirjeen joka on käytännössä linkkilista blogeista. Me teemme paremmin: uutiskirje joka on itsenäisesti arvokas — lukija oppii jotain vaikka ei klikkaisi mitään.

Suunnittele:
1. Nimi: lyhyt, NØRR3:n sävyinen, ei "uutiskirje". Esim. "Media€ / kk" tai "Signaali".
2. Rakenne (4 kiinteää osiota joka numerossa):
   - "Kuukauden luku": yksi tilasto mediamaailmasta + 2 lauseen tulkinta siitä mitä se tarkoittaa.
   - "Tämä testasimme": yksi asia jonka NØRR3 testasi viime kuussa ja mitä opimme (myös epäonnistumiset).
   - "Kysymys johon vastasimme": asiakkaan oikea kysymys + meidän 3-lauseinen vastaus.
   - "Yksi klikkaus": yksi linkki — ei viittä.
3. Esimerkkinumeron koko sisältö (esim. luku 1) kirjoitettuna, 300–400 sanaa.
4. Tilauspaikan teksti footeriin: 1 lause joka saa tilaamaan.

Muoto: Markdown. Suomeksi.`,
    },
    {
      id: "competitor-monitor",
      file: "07-kilpailijaseuranta.md",
      icon: "query_stats",
      title: "Kilpailijaseurannan automaatio (bonus)",
      goal: "Kuukausittainen automaattinen raportti joka näyttää missä SDM liikkuu — jotta reagoimme ennen kuin he saavat etumatkaa.",
      prompt:
`Olet SEO-analyytikko. Luo kuukausittaisen kilpailijaseurannan raporttipohja.

Seurattavat: sdm.fi (pääkilpailija), [MUUT KILPAILIJAT].

Suunnittele raportin rakenne joka voidaan täyttää joka kuukausi:
1. Sivumäärä: sitemap-URL-luku jokaiselta kilpailijalta (edellinen vs nykyinen, muutos).
2. Uusi sisältö: 5 uusinta artikkelia kilpailijoilta (otsikko + avainsanapainauma arvioituna).
3. Palvelusivujen kattavuus: lista puuttuvista avainsanoista joilla kilpailija on meitä vahvempi.
4. Toimenpide-ehdotus: 1 kappale jossa "tämän kuuksen liikkeet" — mitä meidän pitää tehdä vastaukseksi.

Muoto: Markdown-taulukot. Suunnittele niin, että sen voi täyttää 15 minuutissa käyttäen vain julkista dataa (sitemaps, sivujen otsikot).`,
    },
    {
      id: "geo",
      file: "08-geo-ai-lloydettavyys.md",
      icon: "auto_awesome",
      title: "GEO / AI-löydettävyyden optimointi (bonus — tulevaisuus)",
      goal: "Optimoida sisältö niin, että ChatGPT, Gemini ja muut AI-assistentit suosittelevat NØRR3:aa kun niiltä kysyy mediatoimistosta.",
      prompt:
`Olet GEO-asiantuntija (Generative Engine Optimization). Tämä on uusi hakukoneoptimoinnin haara: AI-assistentit suosittelevat brändejä vastauksissaan. NØRR3 haluaa olla se suositus kun joku kysyy "paras mediatoimisto Helsinki" tai "ohjelmallinen mainonta Suomi".

Analysoi NØRR3:n sivu [URL, esim. https://norr3.fi/ohjelmallinen-ostaminen] GEO-näkökulmasta:

1. Mikä sivulla tukee AI-suosituksia:
   - Selkeästi rakennettu sisältö (H2/H3-hierarkia)?
   - Konkreettiset väitteet ja luvut joita AI voi lainata?
   - Uniikki näkökulma jota AI ei löydä muualta?

2. Mikä puuttuu:
   - Suoria vastauksia yleisiin kysymyksiin (AI etsii fact-lauseita joita siteerata)?
   - Rakennettuja "vastauslohkoja" (2–3 lauseen tiivistelmät jotka AI nostaa)?
   - Vertailutaulukoita (AIAssistentit suosivat strukturoitua dataa)?

3. Kirjoita 3 "vastauslohkoa" tästä aiheesta: kukin 2–3 lausetta, jotka vastaavat suoraan kysymykseen kuten "Miten ohjelmallinen ostaminen eroaa perinteisestä?", "Paljonko ohjelmallinen mainonta maksaa?" ja "Miten aloitan?". Suora, lainattavissa oleva tyyli.

Muoto: analyysi (a) (b) + 3 valmista vastauslohkoa suomeksi.`,
    },
  ],
};

/* ------------------------------------------------------------------ view */

function Tone({ tone, children }: { tone: "them" | "us" | "split"; children: React.ReactNode }) {
  if (tone === "them")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1 text-[11px] font-medium text-accent-red">
        <Icon name="arrow_downward" style={{ fontSize: "13px" }} /> {children}
      </span>
    );
  if (tone === "us")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/15 px-3 py-1 text-[11px] font-medium text-accent-green">
        <Icon name="arrow_upward" style={{ fontSize: "13px" }} /> {children}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow/25 px-3 py-1 text-[11px] font-medium text-ink">
      <Icon name="drag_handle" style={{ fontSize: "13px" }} /> {children}
    </span>
  );
}

export default function SeoReportContent({ locale }: { locale: Locale }) {
  return (
    <Container className="pb-24 pt-12 lg:pb-32 lg:pt-20">
      <Reveal>
        <HeroPill>SDM vs NØRR3</HeroPill>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 max-w-4xl text-[min(9vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-ink dark:text-white">
          Kilpailija-analyysi
        </h1>
      </Reveal>
      <Reveal delay={0.1} className="mt-6 flex flex-col items-start gap-4">
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
          SDM Digital (sdm.fi) on yksi Suomen näkyvimmistä digitoimistoista hakukoneissa. Tämä raportti vertaa heidän
          sivustoaan meidän: sitemap, sisältö, tekninen SEO, UI/UX ja liidien hallinta — sekä tarkat toimenpiteet, joilla
          ohitamme heidät.
        </p>
        <p className="text-xs text-ink/45 dark:text-white/45">
          Sisäinen raportti · laadittu 27.8.2026 · ei indeksoida
        </p>
      </Reveal>

      {/* Scoreboard */}
      <Reveal delay={0.15} className="mt-16">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Pisteet</h2>
        <div className="mt-8 space-y-4">
          {scores.map((s) => (
            <div key={s.label} className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[220px_1fr_1fr]">
              <p className="text-sm font-medium text-ink dark:text-white">{s.label}</p>
              <div className="col-span-2 flex items-center gap-4 sm:col-span-2">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-ink/50 dark:text-white/50">
                    <span>NØRR3</span>
                    <span>{s.us}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-purple transition-all" style={{ width: `${s.us}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-ink/50 dark:text-white/50">
                    <span>SDM</span>
                    <span>{s.them}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-black/30 dark:bg-white/30" style={{ width: `${s.them}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Sitemap comparison */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Sitemap: 1 053 vs 68</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-card bg-ink p-card-pad text-white ring-1 ring-white/10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">SDM · sdm.fi</p>
            <p className="mt-3 text-5xl font-medium tabular-nums">{sitemap.sdm.urls}</p>
            <ul className="mt-6 space-y-2.5">
              {sitemap.sdm.breakdown.map((b) => (
                <li key={b.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-white/70">{b.label}</span>
                  <span className="font-medium tabular-nums text-white">{b.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-white/50">{sitemap.sdm.notes}</p>
          </div>
          <div className="rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">NØRR3 · norr3.fi</p>
            <p className="mt-3 text-5xl font-medium tabular-nums text-ink dark:text-white">{sitemap.us.urls}</p>
            <ul className="mt-6 space-y-2.5">
              {sitemap.us.breakdown.map((b) => (
                <li key={b.label} className="flex items-center justify-between gap-3 text-sm text-ink dark:text-white">
                  <span className="text-ink/70 dark:text-white/70">{b.label}</span>
                  <span className="font-medium tabular-nums">{b.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-black/10 pt-4 text-[12px] leading-relaxed text-ink/55 dark:border-white/10 dark:text-white/55">
              {sitemap.us.notes}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Content head-to-head */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Eri osa-alueet</h2>
        <div className="mt-8 space-y-4">
          {content.map((c) => (
            <div
              key={c.area}
              className="rounded-card bg-white p-card-pad ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-ink dark:text-white">{c.area}</h3>
                {c.verdict === "them" && <Tone tone="them">Heille</Tone>}
                {c.verdict === "us" && <Tone tone="us">Meille</Tone>}
                {c.verdict === "split" && <Tone tone="split">Tasan</Tone>}
              </div>
              <div className="mt-4 grid gap-4 text-sm leading-relaxed sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-black/40 dark:text-white/40">SDM</p>
                  <p className="text-ink/70 dark:text-white/70">{c.sdm}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-purple dark:text-light-purple">NØRR3</p>
                  <p className="text-ink/70 dark:text-white/70">{c.us}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-black/5 pt-3 text-[13px] leading-relaxed text-ink/60 dark:border-white/10 dark:text-white/60">
                <Icon name="lightbulb" className="mr-1.5 text-[15px] text-yellow" style={{ color: "var(--color-yellow)" }} />
                {c.fix}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Action plan */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">
          Toimenpiteet — näin ohitamme heidät
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60 dark:text-white/60">
          Järjestetty vaikuttavuuden ja vaivan suhteeseen. Kohdat 1–3 ovat ratkaisevia; loput vahvistavat.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <div
              key={a.priority}
              className="flex h-full flex-col gap-3 rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name={a.icon} style={{ fontSize: "22px" }} />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                  Prioriteetti {a.priority}
                </span>
              </div>
              <h3 className="text-base font-medium leading-snug text-ink dark:text-white">{a.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink/65 dark:text-white/65">{a.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* AI execution plan */}
      <Reveal delay={0.1} className="mt-20">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-violet text-white">
            <Icon name="auto_awesome" style={{ fontSize: "26px" }} />
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">
            AI-suunnitelma — promptikirjasto
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-white/70">{aiPlan.intro}</p>

        {/* Workflow */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiPlan.workflow.map((w) => (
            <div
              key={w.step}
              className="flex h-full flex-col gap-2 rounded-card bg-pastel-purple/60 p-5 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
            >
              <span className="text-lg font-medium tabular-nums text-purple dark:text-light-purple">{w.step}</span>
              <h3 className="text-[15px] font-medium text-ink dark:text-white">{w.title}</h3>
              <p className="text-[12px] leading-relaxed text-ink/60 dark:text-white/60">{w.body}</p>
            </div>
          ))}
        </div>

        {/* Prompt cards */}
        <div className="mt-10 space-y-5">
          {aiPlan.prompts.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-card bg-white ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 p-card-pad pb-0">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                    <Icon name={p.icon} style={{ fontSize: "22px" }} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-medium text-ink dark:text-white">{p.title}</h3>
                      <a
                        href={`/seo-playbooks/${p.file}`}
                        download
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
                      >
                        <Icon name="download" style={{ fontSize: "14px" }} />
                        Lataa playbook
                      </a>
                    </div>
                    <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-ink/60 dark:text-white/60">{p.goal}</p>
                  </div>
                </div>
              </div>
              <div className="p-card-pad pt-4">
                <details className="group">
                  <summary className="flex cursor-pointer select-none items-center gap-2 text-[13px] font-medium text-purple transition-colors hover:text-violet dark:text-light-purple">
                    <Icon name="terminal" style={{ fontSize: "18px" }} />
                    Näytä prompt
                    <Icon
                      name="expand_more"
                      className="transition-transform group-open:rotate-180"
                      style={{ fontSize: "18px" }}
                    />
                  </summary>
                  <div className="relative mt-4">
                    <pre className="max-h-[480px] overflow-auto rounded-card bg-ink p-5 text-[12px] leading-relaxed text-white/90 ring-1 ring-white/10">
{p.prompt}
                    </pre>
                    <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                      Kopioi &amp; käytä
                    </span>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Summary */}
      <Reveal delay={0.1} className="mt-20">
        <div className="rounded-card bg-violet p-card-pad text-white">
          <h2 className="text-2xl font-medium tracking-tight lg:text-3xl">Yhteenveto</h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">Vahvuutemme</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Tekninen kanta: Next.js, nopeus, moderni arkkitehtuuri, CMS-hallittu SEO</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Täysi FI/EN-peili hreflang-pareilla</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Selvästi parempi UI/UX: animaatiot, simulaattori, design-järjestelmä</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Numerojohtoiset caset ja erottuva brändiääni</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Ainutlaatuinen tuote (Marketing Engine) jollaista SDM:llä ei ole</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">Heikkoutemme (SDM:n edut)</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Sisällön määrä: 8 vs 812 blogiartikkelia</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Avainsanasivujen kattavuus: 5 vs 13 palvelusivua</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Ei ladattavia oppaita (lead magnetit)</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Palvelusivujen sisältö liian ohut (280 vs 3 000+ sanaa)</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Ei breadcrumbia, schemaa, tekijäsivuja tai uutiskirjettä</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/80">
            <strong>Johtopäätös:</strong> SDM voittaa määrällä — me voimme voittaa laadulla ja erottuvuudella. Tekninen
            pohjamme on parempi ja tuotteemme ainutlaatuinen. Kun lisäämme sisältöä systemaattisesti (prioriteetit 1–3),
            rakennamme aukottoman kilpailuedun, jota on vaikea kopioida.
          </p>
        </div>
      </Reveal>
    </Container>
  );
}
