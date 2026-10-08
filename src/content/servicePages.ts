import type { Locale } from "@/i18n/config";

export type ServicePage = {
  slug: string;
  icon: string;
  /** Photo under the hero (WebP in /images/services/). Empty = no image. */
  image?: string;
  fi: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroLeft: string;
    heroAccent: string;
    intro: string;
    sections: { heading: string; body: string }[];
    bullets: string[];
    /** Source references, one per line. Empty = nothing renders. */
    sources?: string;
  };
  en: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroLeft: string;
    heroAccent: string;
    intro: string;
    sections: { heading: string; body: string }[];
    bullets: string[];
    /** Source references, one per line. Empty = nothing renders. */
    sources?: string;
  };
};

export const servicePages: ServicePage[] = [
  {
    slug: "insight-strategia",
    image: "/images/services-gen/insight-strategia.webp",
    icon: "zoom_in_map",
    fi: {
      title: "Insight & strategia",
      metaTitle: "Insight ja strategiapalvelut | NØRR3 Helsinki",
      metaDescription: "Brändi- ja tunnettuusseuranta, kohderyhmätutkimus, mediankäyttötutkimus ja mediastrategia — dataan perustuva suunnittelu Helsingissä.",
      heroLeft: "Strategia alkaa",
      heroAccent: "ymmärryksestä",
      intro: "Ennen kuin mediaan sijoitetaan euroa, me ymmärrämme kenet tavoitellaan, missä hän liikkuu ja mitä kilpailijat tekevät. Insight&strategia on se perusta, jolle jokainen kasvava kampanja rakennetaan.",
      sections: [{ heading: "Kokonaisvaltainen mediastrategia", body: "Jotta voimme rakentaa parhaan mahdollisen mediastrategian, tulee datan ja liiketoiminnan tavoitteiden pohjalta muodostaa kokonaisvaltainen ja yhtenäinen näkemys brändin positiosta, sen kilpailutilanteesta, kohderyhmistä sekä markkinointiviestinnän ja median tavoitteista. Kun ymmärrämme nämä asiat, mediastrategia määrittelee miten ja mitkä mediat kuljettavat oikeat viestit perille oikeaan aikaan ja oikealla yleisölle vaikuttavasti, jotta kohderyhmän ajattelussa tai käytöksessä saadaan aikaan haluttu muutos. Vankan kokemuksemme perusteella pystymme auttamaan sinua kaikessa tässä. Tavoitteiden asettaminen ja oikeiden mittareiden valinta ei ole aina helppoa. Pystymme auttamaan sinua määrittelemään millaisia liiketoiminnasta johdettuja tavoitteita markkinoinnille ja medialle tulisi asettaa ja millaiset tasot olisivat realistisia saavuttaa sekä kuinka näitä tavoitteita kannattaisi mitata. Brändin positioon ja kilpailutilanteeseen vaikuttaa moni asia, ja sitä voi selvittää mm. brändi- ja kuluttajatutkimuksilla, analysoimalla kilpailijoiden toimenpiteitä sekä omia ja kilpailijoiden mediapanostuksia sekä seuraamalla trendejä ja yhteiskunnassa tapahtuvia muutoksia. Voimme muodostaa kohderyhmänäkemyksen hyödyntämällä NØRR3:n omaa työkalua 360 mediakäytöstä sekä rikastaa sitä ostokäyttäytymis-, kiinnostus-, arvo- ja asennetiedolla. Näin syntyy kokonaisvaltainen kuva kohderyhmän profiilista. Mediastrategiassa otamme huomioon kaiken yllämainitun ja muodostamme siitä kokonaisnäkemyksen sekä rakennamme sen pohjalta kattavan median vuosisuunnitelman, joka pitää sisällään mm. Medianeuvottelut, mediamixin budjettiallokaatioineen, kohderyhmät, jaon brändin ja taktisen välillä sekä suosituksia luovista toteutuksista kohderyhmälähtöisesti." }, { heading: "Rakenna ihanteellinen mediastrategia: avainasemassa data", body: "Tehokkaimman mediastrategian synnyttämiseksi haluamme ymmärtää liiketoiminnan tavoitteet, kilpailutilanteen, brändin tunnettuuden ja kehitysalueet, kohderyhmät ja niiden eroavaisuudet sekä yhteneväisyydet, kohderyhmien mediankäytön, toimialan mediapanostukset sekä luonnollisesti avainhenkilöiden ja asiakkaiden näkemykset. Muodostamme yrityksellesi näkemyksellisen mediastrategian tavoitteidesi saavuttamiseksi. Strategiatyömme avulla ymmärrät myös kilpailijoiden toimenpiteet. Ymmärtämällä koko dynamiikan et panosta liikaa tai liian vähän – vaan juuri sopivasti ja oikealla mediamixillä." }, { heading: "Mediapanostusdata", body: "Mediapanostusdata kertoo  omat sekä kilpailijoiden mediaan käytetyt eurot vuosi-, kuukausi- tai tarvittaessa viikkotasolla ja mediaryhmittäin. Mediapanostusdataa voimme yhdistää esimerkiksi myyntidataan tai verkkosivujen analytiikkadataan." }, { heading: "NØRR3 Media Insights", body: "NØRR3 Media Insights on NØRR3:n itse kehittämä jatkuva tutkimus suomalaisten mediakäyttäytymisestä. Tutkimustulokset on nähtävissä media- ja kohderyhmittäin suoraan dashboardista ja populoitavissa asiakkaidemme omilla kysymyksillä. Paneeli on Norstatin sertifioitu paneeli, ja vuodessa vastauksia saadaan yhteensä noin 15.000 mahdollistaen pientenkin kohderyhmien tai alueiden tutkimisen." }, { heading: "NØRR3 Performance -sarjan tutkimukset", body: "NØRR3 Brand Performance tutkii brändisi tunnettuuden, harkinnan, preferenssin, NPS:n sekä draiverit. NØRR3 Campaign Performance mittaa kampanjoidesi tehokkuuden. NØRR3 Pre-Campaign Performance taas on hyödyllinen halutessasi tutkia esim. lanseerauksessa käytettävää luovaa sekä sen kehitysmahdollisuuksia." }, { heading: "Datafeedit ja avoin data", body: "Dynaamisessa markkinoinnissa luomme sinulle automaattisesti päivittyvät luovat kohderyhmittäin tai alueittain. Tähän tarvitsemme datafeedejä ja avointa dataa, kuten aluekohtaista säätietoa, sähkön hintaa, euribor-koron tasoa jne." }],
      bullets: ["Kohderyhmämääritys ja insight-raportti", "Mediasuunnitelman strateginen raami", "Tunnettuus- ja brändimittarit", "Kilpailija-analyysi", "Mittarit ja tavoitteet kampanjalle"],
    },
    en: {
      title: "Insight & Strategy",
      metaTitle: "Insight and Strategy Services | NØRR3 Helsinki",
      metaDescription: "Brand and awareness tracking, audience research, media consumption research and media strategy — data-driven planning in Helsinki.",
      heroLeft: "Strategy starts",
      heroAccent: "with insight",
      intro: "Before a single euro goes into media, we understand who to reach, where they move and what competitors are doing. Insight and strategy is the foundation every growth campaign is built on.",
      sections: [{ heading: "Brand and awareness tracking", body: "Are you measuring the right things? We build awareness and brand metrics that media decisions can hang on — before and after." }, { heading: "Audience research", body: "Who actually buys from you and what media do they use? Audience composition from panel data, not guesswork." }, { heading: "Media consumption research", body: "Channel reach and pricing against your specific audience — our own Media Insights tool shows it." }, { heading: "Media strategy", body: "The strategic frame that turns business goals into media: channels, timing, budget and metrics." }],
      bullets: ["Audience definition and insight report", "The strategic frame for the media plan", "Awareness and brand metrics", "Competitor analysis", "Metrics and goals for the campaign"],
    },
  },
  {
    slug: "data-ja-mittaus",
    image: "/images/services-gen/data-ja-mittaus.webp",
    icon: "monitoring",
    fi: {
      title: "Data ja mittaus",
      metaTitle: "Data ja mittaus — konversiomittaus, mallit ja integraatiot | NØRR3",
      metaDescription: "Konversiomittaus myyntiin asti, mittausmallit ja todentaminen, data layer ja integraatiot. Jokainen mediaeuro mitataan — Helsingissä.",
      heroLeft: "Jokainen euro",
      heroAccent: "mitataan",
      intro: "Mediastrategia alkaa datasta ja päättyy todennettuun tulokseen. Mittaamme aina myynti- tai CRM-dataan asti — ei pelkkiä klikkejä — joten tiedät mitä jokainen mediaeuro oikeasti tuotti.",
      sections: [{ heading: "Rakenna ihanteellinen mediastrategia: avainasemassa data", body: "Tehokkaimman mediastrategian synnyttämiseksi haluamme ymmärtää liiketoiminnan tavoitteet, kilpailutilanteen, brändin tunnettuuden ja kehitysalueet, kohderyhmät ja niiden eroavaisuudet sekä yhteneväisyydet, kohderyhmien mediankäytön, toimialan mediapanostukset sekä luonnollisesti avainhenkilöiden ja asiakkaiden näkemykset. Muodostamme yrityksellesi näkemyksellisen mediastrategian tavoitteidesi saavuttamiseksi. Strategiatyömme avulla ymmärrät myös kilpailijoiden toimenpiteet. Ymmärtämällä koko dynamiikan et panosta liikaa tai liian vähän – vaan juuri sopivasti ja oikealla mediamixillä." }, { heading: "Mediapanostusdata", body: "Mediapanostusdata kertoo  omat sekä kilpailijoiden mediaan käytetyt eurot vuosi-, kuukausi- tai tarvittaessa viikkotasolla ja mediaryhmittäin. Mediapanostusdataa voimme yhdistää esimerkiksi myyntidataan tai verkkosivujen analytiikkadataan." }, { heading: "NØRR3 Media Insights", body: "NØRR3 Media Insights on NØRR3:n itse kehittämä jatkuva tutkimus suomalaisten mediakäyttäytymisestä. Tutkimustulokset on nähtävissä media- ja kohderyhmittäin suoraan dashboardista ja populoitavissa asiakkaidemme omilla kysymyksillä. Paneeli on Norstatin sertifioitu paneeli, ja vuodessa vastauksia saadaan yhteensä noin 15.000 mahdollistaen pientenkin kohderyhmien tai alueiden tutkimisen." }, { heading: "NØRR3 Performance -sarjan tutkimukset", body: "NØRR3 Brand Performance tutkii brändisi tunnettuuden, harkinnan, preferenssin, NPS:n sekä draiverit. NØRR3 Campaign Performance mittaa kampanjoidesi tehokkuuden. NØRR3 Pre-Campaign Performance taas on hyödyllinen halutessasi tutkia esim. lanseerauksessa käytettävää luovaa sekä sen kehitysmahdollisuuksia." }, { heading: "Datafeedit ja avoin data", body: "Dynaamisessa markkinoinnissa luomme sinulle automaattisesti päivittyvät luovat kohderyhmittäin tai alueittain. Tähän tarvitsemme datafeedejä ja avointa dataa, kuten aluekohtaista säätietoa, sähkön hintaa, euribor-koron tasoa jne." }, { heading: "Vain mittaamalla voi tietää, mikä tehoaa – ja mitä kannattaa kehittää", body: "Mittaamme jatkuvasti sekä aineistojen tehoa kohderyhmissä että tietenkin kampanjoiden tuloksia. Mittaamisen ansiosta markkinointisi vahvistuu vääjäämättä yhä tehokkaammaksi. Meillä on taito ja työvälineet auttaa sinua mittaamisen liittyvissä asioissa. Asetettujen tavoitteiden mittaaminen ja seuranta on hyvin tärkeää, erityisen kiinnostavia ovat varmasti liiketoiminnan luvut ja myynnilliset tavoitteet, joita peilataan median toimivuuteen analytiikan ja muiden mediamittareiden avulla . Dashboardien avulla visualisoit markkinointipanostustesi panos-hyöty-suhteen itsellesi sekä muille. Tilanteen seuraaminen on helppoa ja tapahtuu reaaliajassa, joten pääset myös reagoimaan muutoksiin nopeasti. Konseptien / mainosten esitestaus kannattaa varsinkin ennen isoa lanseerausta. Se on hyvä keino varmistaa, että luova sisältö toimii ja viesti menee kohderyhmässä varmasti läpi. Jos luova sisältö ei toimi, ei sen puutteita kannata yrittää korvata kasvattamalla mediabudjettia. Toisaalta toimiva luova sisältö saattaa parhaimmillaan alkaa elää mediassa omaa elämäänsä, jolloin mediabudjettia kuluu sen kannattelemiseen vähemmän. Pelkän sisällön ymmärtämisen lisäksi pitää hahmottaa, kuinka luova sisältö istuu eri kanavien luonteeseen ja mainosvariaatioiden kohdentamiseen – ja ennen kaikkea on saatava käsitys siitä, kuinka se toimii ja konvertoi. Myös aineistojen tehokkuuden mittaus on tärkeä osa mediatehokkuuden varmistamista: jos aineisto ei vetoa kohderyhmään, sen näyttämiseen käytettävää budjettia kulutetaan turhaan. Aineistojen tehokkuutta testatessamme kokeilemme tyypillisesti esimerkiksi eri taustojen, viestikärkien ja kohdennusten vaikutusta tuloksiin. Meillä on kattava kokemus siitä, mitä kussakin aineistoissa on järkevää testata. Kampanjamittaus kannattaa jo pienemmänkin mediabudjetin kampanjassa, erityisesti, mikäli testataan uusia medioita tai luovaa konseptia. Kampanjamittauksen avulla saat tiedon siitä, miten hyvin kampanja tavoitti kohderyhmät ja mitkä mediat korostuivat eri kohderyhmissä. Tutkimus kertoo myös suhtautumisesta mainoksiin sekä brändiin kampanjan jälkeen. Parhaimmillaan kampanjamittauksesta saadaan kiinni johtolankoja, joita seuraamalla päästään tekemään syvempiä liiketoiminnallisia oivalluksia. ROMI-mittaus kertoo paljonko markkinointi-investoinnit tuott" }],
      bullets: ["Todentamisen malli ja mittaripuu", "Konversiomittaus myyntidataan asti", "Reaaliaikaiset dashboardit", "Data layer ja integraatiot", "Optimointisuositukset datan pohjalta"],
    },
    en: {
      title: "Data & Measurement",
      metaTitle: "Data and Measurement — Conversion, Models, Integrations | NØRR3",
      metaDescription: "Conversion measurement down to sales, measurement models and verification, data layer and integrations. Every media euro is measured — in Helsinki.",
      heroLeft: "Every euro",
      heroAccent: "is measured",
      intro: "A media strategy starts with data and ends with a verified result. We always measure down to sales or CRM data — not just clicks — so you know what every media euro actually produced.",
      sections: [{ heading: "Conversion measurement", body: "We verify what media actually produces: measurement all the way to sales/CRM data, not just site traffic." }, { heading: "Measurement model and verification", body: "A metric tree that connects business goals to channel-level metrics — and verifies results with numbers." }, { heading: "Data layer and integrations", body: "Product, inventory, CRM and campaign data into one chain: your media and your systems talk to each other without manual copying." }],
      bullets: ["Verification model and metric tree", "Conversion measurement down to sales data", "Real-time dashboards", "Data layer and integrations", "Data-driven optimisation recommendations"],
    },
  },
  {
    slug: "data-ja-mittaus/dashboardit",
    image: "/images/services-gen/data-ja-mittaus-dashboardit.webp",
    icon: "space_dashboard",
    fi: {
      title: "Dashboardit",
      metaTitle: "Dashboardit — reaaliaikainen raportointi | NØRR3",
      metaDescription: "Reaaliaikaiset asiakasdashboardit, joissa kampanjoiden tulokset näkyvät ilman odottelua — NØRR3 Dashboard -asiakasportaali.",
      heroLeft: "Tulokset näkyvät",
      heroAccent: "reaaliajassa",
      intro: "Kampanjan tulokset eivät odota raportointikierrosta. NØRR3 Dashboard näyttää tavoittavuuden, hinnan ja konversiot reaaliajassa — aina auki, aina ajantasainen.",
      sections: [{ heading: "Dashboardit", body: "Dashbordien avulla visualisoit markkinointipanostustesi panos-hyöty-suhteen itsellesi ja esität sen selkeästi muille. Tilanteen seuraaminen on helppoa ja tapahtuu reaaliajassa, joten pääset myös reagoimaan muutoksiin nopeasti. Olemme erikoistuneita eri datalähteiden yhdistämiseen ja suunnittelemme kanssasi, minkä datan seuraamisesta juuri teille on eniten hyötyä. Seulomme käyttöösi vain käyttäjäkokemukseltaan optimaalisimmat dashboardit, jotta seuranta ei vahingossakaan jää tekemättä esim. hankalan näkymän vuoksi. Kiinnostavimpia ovat liiketoiminnan luvut ja myynnilliset tavoitteet, joita peilataan median toimivuuteen." }, { heading: "Dasboard set-up sisältö:", body: "Määritetään mittarit (KPI), joita halutaan seurata sekä dashboard alusta. Rakennetaan dashboard määriteltyjen mittareiden perusteella ja yhdistetään datalähteet. Kun dashboard on valmis annetaan oikeudet kaikille halutuille käyttäjille. Dashboardia hyödynnetään reaaliaikaisesti sekä sovituissa raportointipalavereissa" }],
      bullets: ["Reaaliaikainen näkyvyys tuloksiin", "Kanava- ja kampanjakohtaiset näkymät", "Myyntidataan asti -mittaus", "Automaattiset raportit", "Käyttöoikeudet rooleittain"],
    },
    en: {
      title: "Dashboards",
      metaTitle: "Dashboards — Real-time Reporting | NØRR3",
      metaDescription: "Real-time client dashboards where campaign results are visible without waiting — the NØRR3 Dashboard client portal.",
      heroLeft: "Results visible",
      heroAccent: "in real time",
      intro: "Campaign results don't wait for a reporting round. The NØRR3 Dashboard shows reach, cost and conversions in real time — always open, always current.",
      sections: [{ heading: "NØRR3 Dashboard", body: "A client portal where campaign results show in real time. No waiting for a monthly report — the data is always up to date." }, { heading: "Tailored views", body: "Each stakeholder gets their own view: the big picture for management, channel detail for marketing, sales data for commerce." }],
      bullets: ["Real-time visibility into results", "Channel and campaign level views", "Measurement down to sales data", "Automated reports", "Role-based access"],
    },
  },
  {
    slug: "data-ja-mittaus/datan-mallintaminen",
    image: "/images/services-gen/data-ja-mittaus-datan-mallintaminen.webp",
    icon: "query_stats",
    fi: {
      title: "Datan mallintaminen",
      metaTitle: "Datan mallintaminen — ROMI, ROAS ja arviointi | NØRR3",
      metaDescription: "ROMI- ja ROAS-laskenta, mediamix-mallintaminen ja tulosten arviointi datalla. Tiedät mitä media investointina tuotti.",
      heroLeft: "Data mallinnetaan",
      heroAccent: "tulokseksi",
      intro: "Mitä media investointina tuotti? Mallinnamme mediamixin vaikutuksen ja laskemme ROMIn ja ROASin — numeroina, jotka kestävät hallituksen katseen.",
      sections: [{ heading: "ROMI- ja ROAS-laskenta", body: "NØRR3 ROMI (Return On Marketing Investement)-mittaus kertoo paljonko markkinointi-investointisi tuottavat. Eli määritellään ja mitataan kaikki markkinointi-investoinnit, joita sitten verrataan myynnin kehittymiseen. Mittauksesta saadaan eniten irti, kun ymmärretään ja mitataan ROMI:n lisäksi koko funnelin eri vaiheiden tunnusluvut. Siten päästään kehittämään oleellisimpiin tunnuslukuihin vaikuttavia tekijöitä. ROMI-mittauksen avulla pystymme arvioimaan ja osoittamaan markkinointipanostustesi kannattavuuden – tai kannattamattomuuden. NØRR3n markkinointi mixin mallintaminen voidaan tehdä yhteistyössä asiakkaan olemassa olevien tai NØRR3:n kumppanien kanssa. Mallintaminen on analyyttinen ratkaisu, joka auttaa markkinoijia ymmärtämään ja ennustamaan millaisia vaikutuksia erilaisilla mediaratkaisuilla ja budjettiallokaatiolla on myyntiin ja brändin kehitykseen sekä tekemään tämän perusteella muutoksia omaan mediastrategiaan. ROMI-mittauksessa huomioitavat kustannuserät kannattaa miettiä tarkasti etukäteen. Huomioidaanko esimerkiksi maksettujen mediakulujen lisäksi ulkopuoliset työvoimakulut, lisenssikulut, sisäiset työkulut jne. Suoraviivaisempi mittaus voidaan tehdä myös ROAS (Return On Ad Spend)-tasolla. Tällöin maksetun median kuluja verrataan myynnin tai esimerkiksi liidimäärän kasvuun." }, { heading: "ROMI mittauksen sisältö:", body: "Määritetään mitä markkinointi-investointeja lasketaan mukaan ROMI mittaukseen (mediainvestoinnit, toimistojen työinvestoinnit, teknologiainvestoinnit ym.). Kerätään yhteen kaikki markkinointiin laitetut investoinnit sekä myynnin luvut. Lasketaan panos-tuotto suhde, voidaan tehdä sovitusta aikajänteestä tai jatkuvana. Annetaan suositukset tulosten perusteella." }],
      bullets: ["ROMI ja ROAS myyntidataan perustuen", "Mediamix-mallinnus", "Kanavien välinen vaikutusanalyysi", "Budjetin allokaatiosuositukset"],
    },
    en: {
      title: "Data Modelling",
      metaTitle: "Data Modelling — ROMI, ROAS and Evaluation | NØRR3",
      metaDescription: "ROMI and ROAS calculation, media mix modelling and results evaluation with data. Know what media produced as an investment.",
      heroLeft: "Data modelled",
      heroAccent: "into results",
      intro: "What did media produce as an investment? We model the media mix effect and calculate ROMI and ROAS — numbers that survive boardroom scrutiny.",
      sections: [{ heading: "ROMI and ROAS calculation", body: "Return on media investment, calculated on data that reaches down to sales." }, { heading: "Media mix modelling", body: "We model how channels work together — and where the next euro should go." }],
      bullets: ["ROMI and ROAS based on sales data", "Media mix modelling", "Cross-channel impact analysis", "Budget allocation recommendations"],
    },
  },
  {
    slug: "markkinointistrategia",
    image: "/images/services-gen/markkinointistrategia.webp",
    icon: "strategy",
    fi: {
      title: "Markkinointistrategia",
      metaTitle: "Markkinointistrategia — suunnittelu datalla | NØRR3 Helsinki",
      metaDescription: "Markkinointistrategia, joka perustuu mediapanostusdataan ja tutkimukseen — ei mutuun. Suunnitelma kasvulle Helsingissä.",
      heroLeft: "Suunnitelma",
      heroAccent: "kasvulle",
      intro: "Markkinointistrategia, joka perustuu tutkimukseen ja mediapanostusdataan. Määrittelemme tavoitteet, kohderyhmät, kanavat ja budjetit — ja mittarit joilla onnistuminen todennetaan.",
      sections: [{ heading: "Mediapanostusdatan analyysi ja hyödyntäminen", body: "Mediapanostusdataa käytetään apuna määrittelemään sopiva mediabudjetti, kampanjoinnin optimaaliset hetket sekä riittävä always on-taso. Mediapanostusdatan lähteenä käytetään Kantar Ad Intellligence -dataa ja se pitää sisällään brändin omat sekä kilpailijoiden mediapanostustiedot sovitulta ajanjaksolta mediaryhmittäin ja kuukausittain / viikottain (*. Saat meiltä analyysin valintasi mukaan omien, kilpailijoiden ja koko kategorian mediapanostuksista ml. kanava- ja aikajana-analyysi. Perusanalyysiä voi kehittää yhdistämällä siihen esimerkiksi verkkosivuanalytiikkaa tai syvempää kanavakohtaista analyysiä (esim. TRP-tasot). Viikko- tai kuukausikohtainen data on vietävissä NØRR3 Brand Performance -dashboardiin, jolloin voimme nähdä esimerkiksi tunnettuuden kehittymisen suhteessa omiin ja kilpailijoiden mediapanostuksiin. Pystymme toteuttamaan myös mm. regressio-analyysit mainonnan vaikutuksesta tunnettuuteen. *) Kantar Ad Intelligence -data pitää sisällään kaikki muut mediaryhmät, paitsi sosiaalisen median ja hakukonemarkkinoinnin. Display-media on mukana rajoitetusti. Tämä johtuu siitä, että ulkomaalaiset toimijat eivät ole datassa mukana." }, { heading: "Päätökset", body: "Analyysin laajuus sekä mahdollinen yhdistäminen muuhun dataan. Tehdäänkö kertaluonteinen analyysi vai jatkuvana ja kuinka usein. Jatkuvassa vaihtoehdossa päätös myös dashboardin rakentamisesta. Mitkä kilpailijat tai toimialat otetaan mukaan dataan. Kuinka pitkältä ajanjaksolta data halutaan (suositus: >2 vuotta) ja viikko- vai kuukausitasolla (viikkotaso ei tarkka, suositus: kk-tasolla)" }],
      bullets: ["Tavoitteet ja mittarit", "Kohderyhmä- ja kilpailija-analyysi", "Mediamix ja budjettiraami", "Kanaval valinta ja ajoitus", "Vuosikello kampanjoille"],
    },
    en: {
      title: "Marketing Strategy",
      metaTitle: "Marketing Strategy — Data-driven Planning | NØRR3 Helsinki",
      metaDescription: "Marketing strategy based on media investment data and research — not guesswork. A plan for growth in Helsinki.",
      heroLeft: "A plan",
      heroAccent: "for growth",
      intro: "A marketing strategy built on research and media investment data. We define goals, audiences, channels and budgets — and the metrics that prove success.",
      sections: [{ heading: "Data-driven planning", body: "Audience, competitor and media investment data set the direction — we don't guess." }, { heading: "From business to media", body: "The strategy becomes a concrete media mix: channels, timing, budget and ownership." }],
      bullets: ["Goals and metrics", "Audience and competitor analysis", "Media mix and budget frame", "Channel selection and timing", "Annual campaign calendar"],
    },
  },

  {
    slug: "hakukoneoptimointi",
    image: "/images/services-gen/hakukoneoptimointi.webp",
    icon: "search",
    fi: {
      title: "Hakukoneoptimointi ja hakukonemainonta",
      metaTitle: "Hakukoneoptimointi (SEO) ja hakukonemainonta (SEM) | NØRR3 Helsinki",
      metaDescription:
        "Hakukoneoptimointi, hakukonemarkkinointi ja GEO: löydy Googlesta ja tekoälyavustajien vastauksista. SEO-auditista jatkuvaan optimointiin — Helsingissä.",
      heroLeft: "Löydy sieltä, mistä",
      heroAccent: "sinua etsitään",
      intro:
        "Kun asiakas hakee ratkaisua, hän aloittaa Googlesta — ja yhä useammin ChatGPT:stä tai Geministä. Varmistamme, että sinä olet siellä, missä ostopäätös alkaa.",
      sections: [
        {
          heading: "Hakukoneoptimointi (SEO)",
          body: "Rakennamme teknisen ja sisällöllisen perustan, joka nostaa sivustosi orgaanista näkyvyyttä pitkäjänteisesti. Auditista löydämme esteet, korjaamme ne ja luomme sisältöstrategian, joka vastaa siihen, mitä asiakkaasi oikeasti hakevat.",
        },
        {
          heading: "Hakukonemarkkinointi (SEM)",
          body: "Hakutulosten kärkeen heti — mainoksilla siellä, missä ostoaikeus on korkein. Optimoimme sanat, mainokset ja laskeutumissivut niin, että jokainen klikki tuo mitattavaa tulosta.",
        },
        {
          heading: "GEO — näkyvyys tekoälyn vastauksissa",
          body: "Tekoälyavustajat suosittelevat brändejä vastauksissaan. Varmistamme, että yrityksesi data ja sisältö ovat siinä kunnossa, että ChatGPT ja Gemini suosittelevat juuri sinua.",
        },
      ],
      bullets: ["SEO-audit ja korjauslista", "Avainsanatutkimus ja sisältöstrategia", "Hakutulosten kärkeen mainoksilla", "GEO / AI-löydettävyys", "Jatkuva optimointi ja raportointi"],
    },
    en: {
      title: "SEO and Search Advertising",
      metaTitle: "SEO and Search Advertising (SEM) | NØRR3 Helsinki",
      metaDescription:
        "Search engine optimisation, search advertising and GEO: get found on Google and in AI assistant answers. From an SEO audit to continuous optimisation — in Helsinki.",
      heroLeft: "Get found where",
      heroAccent: "you're searched for",
      intro:
        "When a customer looks for a solution, they start on Google — and increasingly in ChatGPT or Gemini. We make sure you show up where the buying decision begins.",
      sections: [
        {
          heading: "Search engine optimisation (SEO)",
          body: "We build the technical and content foundation that lifts your organic visibility for the long term. The audit finds the blockers, we fix them, and we build a content strategy that matches what your customers actually search for.",
        },
        {
          heading: "Search advertising (SEM)",
          body: "To the top of the results immediately — with ads where purchase intent is highest. We optimise keywords, ads and landing pages so every click produces measurable results.",
        },
        {
          heading: "GEO — visibility in AI answers",
          body: "AI assistants recommend brands in their answers. We make sure your data and content are in the shape that makes ChatGPT and Gemini recommend you.",
        },
      ],
      bullets: ["SEO audit and fix list", "Keyword research and content strategy", "To the top of search with ads", "GEO / AI discoverability", "Continuous optimisation and reporting"],
    },
  },
  {
    slug: "ohjelmallinen-ostaminen",
    image: "/images/services-gen/ohjelmallinen-ostaminen.webp",
    icon: "hub",
    fi: {
      title: "Ohjelmallinen ostaminen",
      metaTitle: "Ohjelmallinen ostaminen ja DOOH | NØRR3 Helsinki",
      metaDescription:
        "Ohjelmallinen ostaminen: display, video, audio ja ulkomainonta (pDOOH) yhdestä alustasta. Reaaliaikainen optimointi ja läpinäkyvä raportointi — Helsingissä.",
      heroLeft: "Media ostetaan",
      heroAccent: "ohjelmallisesti",
      intro:
        "Ohjelmallinen ostaminen tarkoittaa mediaa, joka ostetaan ja optimoidaan datalla reaaliajassa — ilman manuaalisia kierroksia. Display, video, audio ja ulkomainonta samasta alustasta.",
      sections: [
        {
          heading: "Display ja video",
          body: "Ohjelmallinen display ja video tavoittavat oikean yleisön oikeassa kontekstissa — ja optimoituvat automaattisesti sen mukaan, mikä toimii.",
        },
        {
          heading: "Ulkomainonta ja pDOOH",
          body: "Ohjelmallinen ulkomainonta (programmatic DOOH) yhdistää digitaalisten näyttöjen tavoittavuuden datapohjaiseen ostoon — joustavasti ja mitattavasti.",
        },
        {
          heading: "Digitaalinen audio",
          body: "Podcastit, suoratoisto ja radiodigitointi ohjelmallisesti — kohdennettuna kuunteluhetkeen ja yleisöön.",
        },
      ],
      bullets: ["Kanavariippumaton suunnittelu", "Reaaliaikainen optimointi", "Läpinäkyvä hinnoittelu ja raportointi", "DCO ja syötepohjaiset luovat", "Yksi alusta, kaikki kanavat"],
    },
    en: {
      title: "Programmatic Buying",
      metaTitle: "Programmatic Buying and DOOH | NØRR3 Helsinki",
      metaDescription:
        "Programmatic buying: display, video, audio and out-of-home (pDOOH) from one platform. Real-time optimisation and transparent reporting — in Helsinki.",
      heroLeft: "Media, bought",
      heroAccent: "programmatically",
      intro:
        "Programmatic buying means media that is bought and optimised with data in real time — without manual rounds. Display, video, audio and out-of-home from one platform.",
      sections: [
        {
          heading: "Display and video",
          body: "Programmatic display and video reach the right audience in the right context — and optimise automatically toward what works.",
        },
        {
          heading: "Out-of-home and pDOOH",
          body: "Programmatic DOOH combines the reach of digital screens with data-driven buying — flexibly and measurably.",
        },
        {
          heading: "Digital audio",
          body: "Podcasts, streaming and digital radio programmatically — targeted to the listening moment and the audience.",
        },
      ],
      bullets: ["Channel-agnostic planning", "Real-time optimisation", "Transparent pricing and reporting", "DCO and feed-based creatives", "One platform, every channel"],
    },
  },
  {
    slug: "mediasuunnittelu",
    image: "/images/services-gen/mediasuunnittelu.webp",
    icon: "edit_note",
    fi: {
      title: "Mediasuunnittelu ja -ostaminen",
      metaTitle: "Mediasuunnittelu ja median osto | NØRR3 Helsinki",
      metaDescription:
        "Mediasuunnittelu ja median osto, joka muuttaa budjetin kasvuksi. Dataan perustuva mediamix, neuvotellut sopimukset ja optimointi — Helsingissä.",
      heroLeft: "Budjetti muuttuu",
      heroAccent: "kasvuksi",
      intro:
        "Mediasuunnittelu alkaa liiketoiminnan tavoitteesta, ei kanavasta. Rakennamme datalla perustellun mediamixin, neuvottelemme ostot ja optimoimme kampanjan elinkaaren jokaisen vaiheen.",
      sections: [
        {
          heading: "Dataan perustuva suunnitelma",
          body: "Kohderyhmä-, kilpailija- ja mediankäyttödata määrittävät, mihin euro kannattaa laittaa — ei mutu, vaan tutkittu tieto.",
        },
        {
          heading: "Osto ja neuvottelu",
          body: "Neuvottelemme mediatalojen kanssa ja ostamme kaikki kanavat yhdestä paikasta — TV:stä sosiaaliseen mediaan ja ulkomainontaan.",
        },
        {
          heading: "Optimointi lennossa",
          body: "Kampanjan aikana siirrämme panoksia sinne, mikä toimii — jokainen euro tuottaa enemmän.",
        },
      ],
      bullets: ["Mediamix ja budjettiraami", "Neuvotellut mediatalosopimukset", "Kanavariippumaton osto", "Jatkuva optimointi", "Todennettu raportointi"],
    },
    en: {
      title: "Media Planning and Buying",
      metaTitle: "Media Planning and Buying | NØRR3 Helsinki",
      metaDescription:
        "Media planning and buying that turns budget into growth. Data-driven media mix, negotiated deals and optimisation — in Helsinki.",
      heroLeft: "Budget, turned into",
      heroAccent: "growth",
      intro:
        "Media planning starts with the business goal, not the channel. We build a data-backed media mix, negotiate the buys and optimise every stage of the campaign lifecycle.",
      sections: [
        {
          heading: "A data-based plan",
          body: "Audience, competitor and media-usage data decide where each euro should go — not gut feel, but researched fact.",
        },
        {
          heading: "Buying and negotiation",
          body: "We negotiate with media houses and buy every channel from one place — from TV to social and out-of-home.",
        },
        {
          heading: "Optimisation in flight",
          body: "During the campaign we shift spend toward what works — every euro produces more.",
        },
      ],
      bullets: ["Media mix and budget frame", "Negotiated media house deals", "Channel-agnostic buying", "Continuous optimisation", "Verified reporting"],
    },
  },
  {
    slug: "ulkomainonta",
    image: "/images/services-gen/ulkomainonta.webp",
    icon: "location_on",
    fi: {
      title: "Ulkomainonta ja pDOOH",
      metaTitle: "Ulkomainonta ja pDOOH | NØRR3 Helsinki",
      metaDescription:
        "Ulkomainonta ja ohjelmallinen DOOH: digitaaliset näytöt, joustava ostaminen ja mitattava tavoittavuus — suunnittelusta toteutukseen Helsingissä.",
      heroLeft: "Näkyvyyttä, jota ei voi",
      heroAccent: "ohittaa",
      intro:
        "Ulkomainonta tavoittaa siellä, missä ihminen liikkuu — kadulla, terminaalissa ja kaupan edustalla. Ohjelmallinen DOOH tekee siitä joustavaa ja mitattavaa.",
      sections: [
        {
          heading: "Digitaalinen ulkomainonta",
          body: "Digitaaliset näytöt tuovat liikkuvan kuvan ja ajantasaisen viestin — vaihdettavissa hetkessä, ei painoaikatauluissa.",
        },
        {
          heading: "Ohjelmallinen DOOH",
          body: "Ostamme näyttöjä datalla: oikea viesti, oikeassa paikassa, oikeaan aikaan — ja tulokset mitataan.",
        },
      ],
      bullets: ["Digitaaliset näytöt ja pinnat", "pDOOH-osto ja optimointi", "Ajantasaiset, vaihdettavat luovat", "Mitatattu tavoittavuus"],
    },
    en: {
      title: "Out-of-Home and pDOOH",
      metaTitle: "Out-of-Home and pDOOH | NØRR3 Helsinki",
      metaDescription:
        "Out-of-home and programmatic DOOH: digital screens, flexible buying and measurable reach — from planning to execution in Helsinki.",
      heroLeft: "Visibility you",
      heroAccent: "can't skip",
      intro:
        "Out-of-home reaches people where they move — on the street, in terminals and outside stores. Programmatic DOOH makes it flexible and measurable.",
      sections: [
        {
          heading: "Digital out-of-home",
          body: "Digital screens bring moving imagery and up-to-date messaging — changeable in a moment, not bound to print schedules.",
        },
        {
          heading: "Programmatic DOOH",
          body: "We buy screens with data: the right message, in the right place, at the right time — and the results are measured.",
        },
      ],
      bullets: ["Digital screens and inventory", "pDOOH buying and optimisation", "Up-to-date, swappable creatives", "Measured reach"],
    },
  },
  {
    slug: "performance-markkinointi",
    image: "/images/services-gen/performance-markkinointi.webp",
    icon: "trending_up",
    fi: {
      title: "Performance-markkinointi",
      metaTitle: "Performance-markkinointi | NØRR3 Helsinki",
      metaDescription:
        "Performance-markkinointi: tulospohjainen ostaminen, dynaaminen ja personoitu mainonta sekä aineistojen automaatio — konkreettisia tuloksia Helsingistä.",
      heroLeft: "Mainonta, joka",
      heroAccent: "tuottaa",
      intro:
        "Performance-markkinointi tarkoittaa mainontaa, jonka tulos mitataan — ei näyttöjä, vaan konversioita. Ostamme tulospohjaisesti ja automatisoimme aineistot.",
      sections: [{ heading: "Mainonnalla aidosti tuloksia", body: "Tulospohjaista mainontaa optimoidaan tyypillisesti kohti tavoite ROAS- tai CPA-tasoa. Google Ads Shopping -kampanjoissa tyypillinen ROAS-tavoite voi olla 700–900 %. Sovellusmainonnassa yksittäisen sovelluksen tavoite-lataushinnaksi voidaan asettaa muutama euro, jolloin kampanjat optimoidaan kohti tavoite CPI-hintaa (Cost per Install). Tulospohjaisen mainonnan tiimimme koostuu huippuammattilaisista, joilla on kokemusta satojen tuhansien eurojen kuukausibudjettien optimoinnista. Vahvan paikallisen tiimin lisäksi saat kauttamme käyttöösi yli 700 kansainvälistä huippuammattilaista Making Science -yhteistyömme kautta." }],
      bullets: ["Tulosvastuinen ostaminen", "Hintatehokkuus per konversio", "Personoidut aineistot ja automaatio", "Skaalautuva malli kasvuun"],
    },
    en: {
      title: "Performance Marketing",
      metaTitle: "Performance Marketing | NØRR3 Helsinki",
      metaDescription:
        "Performance marketing: performance-based buying, dynamic and personalised advertising, and asset automation — concrete results from Helsinki.",
      heroLeft: "Advertising that",
      heroAccent: "delivers",
      intro:
        "Performance marketing means advertising whose result is measured — not impressions, but conversions. We buy on results and automate the assets.",
      sections: [
        {
          heading: "Performance-based buying",
          body: "You pay for results, not impressions. Price per conversion, with every euro steered toward what converts.",
        },
        {
          heading: "Dynamic and personalised advertising",
          body: "Thousands of versions from one master — product and customer data make the message right for every viewer.",
        },
        {
          heading: "Asset automation",
          body: "Assets update themselves from the feed. No manual rounds — always-current creative.",
        },
      ],
      bullets: ["Accountable buying", "Cost efficiency per conversion", "Personalised creatives and automation", "A scalable model for growth"],
    },
  },

  {
    slug: "mediasuunnittelu/norr3-media-insights",
    image: "/images/services-gen/mediasuunnittelu-norr3-media-insights.webp",
    icon: "insights",
    fi: {
      title: "NØRR3 Media Insights",
      metaTitle: "NØRR3 Media Insights — mediankäyttötutkimus | NØRR3",
      metaDescription: "Oma työkalumme, joka näyttää kanavien tavoittavuuden ja hinnat suhteessa juuri sinun yleisöösi — data, ei mutu.",
      heroLeft: "Kanavat",
      heroAccent: "datalla valittuna",
      intro: "NØRR3 Media Insights näyttää miten B2C- tai B2B-yleisösi mediaa käyttää: tavoittavuus ja hinta kanavittain, suhteessa juuri sinun kohderyhmääsi. Lopeta arvailu, aloita datalla suunnittelu.",
      sections: [{ heading: "NØRR3 Media Insights", body: "Loimme NØRR3 Media Insights -työkalun , jotta saisimme luotettavaa, laaja-alaista ja jatkuvasti päivittyvää dataa suomalaisten mediakäytöstä . Aikaisemmin markkinoilla saatavilla oleva data muodostettiin pistetutkimuksena kaksi kertaa vuodessa sekä ei kattanut tarpeeksi laajasti digitaalisia kanavia. Korjasimme tämän." }, { heading: "NØRR3 esittelee ennennäkemättömän työkalun suomalaisten mediakäytöksen kattavaan ja ajantasaiseen seurantaan", body: "NØRR3 Media Insights -työkalun avulla saat ymmärryksen kohderyhmäsi 360 mediakäytöstä inter- ja intramediatasolla ja kuinka se eroaa keskimääräisestä käytöstä. Näet helposti erot esim. eri-ikäisten henkilöiden mediakäyttäytymisessä – tai eri alueilla asuvien kesken. Näet myös kohderyhmät yhdistävät mediaryhmät ja näin pystyt hyödyntämään dataa laaja-alaisesti. Data tulee NØRR3 omasta paneelitutkimuksesta ja jatkuvaan kyselyyn on mahdollista saada mukaan oma kysymyksesi, mikäli haluat selvittää oman tai potentiaalisen asiakaskuntasi tarkan mediakäyttymisen ja brändisi preferroinnin. Paneelin toteuttaja on sertifioitu Norstat. Paneelin vuosittainen n = n. 10.000. Tarjous: Annamme jokaiselle uudelle asiakkaalle veloituksettoman kohderyhmä-analyysin yhdestä valitusta kohderyhmästä." }, { heading: "Osta kohderyhmä-analyysi yhdestä tai useammasta haluamastasi kohderyhmästä", body: "Raportti pitää sisällään kohderyhmän käyttäytymisen inter- ja intramediatasolla sekä näyttää kohderyhmän korostumat eri medioissa." }, { heading: "Osta lisenssi työkaluun", body: "Lisenssillä sinä tai muu yrityksesi edustaja pääsee rakentamaan ja kokeilemaan eri kohderyhmiä sekä muun muassa ristiintaulkoimaan työkalussa suoraan eri mediaryhmiä tai -kanavia. Voit myös ostaa kyselyyn mukaan oman kysymyksesi. Kysymyksessä kysytään brändisi tunnettuuta, harkintaa ja preferointia. Voit tämän jälkeen dashboardilla nähdä eri näillä kohdistettujen kohderyhmien käyttäytymisen eri medioissa ja verrata muuhun vastaavaan kohderyhmään. Esim. näet kaikkiien brändisi preferoijien mediakäyttäytymisen tai niiden, jotka ei vielä ole asiakkaitasi mutta olisivat halukkaita kokeilemaan." }, { heading: "NØRR3 Media Insights tutkimuksessa kysyttävät mediat tai muu kiinnostava käyttäytyminen", body: "Uutis-, aikakaus- ja iltapäivälehtien verkkopalvelut" }],
      bullets: ["Kanavakohtainen tavoittavuus", "Hintatiedot mediavaihtoehdoista", "B2C- ja B2B-yleisöt", "Säästä 25 % mainoskuluissa", "Aina ajantasainen panelidata"],
    },
    en: {
      title: "NØRR3 Media Insights",
      metaTitle: "NØRR3 Media Insights — Media Consumption Research | NØRR3",
      metaDescription: "Our own tool showing channel reach and pricing against your specific audience — data over guesswork.",
      heroLeft: "Channels",
      heroAccent: "chosen by data",
      intro: "NØRR3 Media Insights shows how your B2C or B2B audience uses media: reach and pricing per channel, relative to your specific audience. Stop guessing, start planning with data.",
      sections: [{ heading: "Reach and price for your audience", body: "The tool shows channel reach and pricing against your specific audience — not averages." }, { heading: "Up-to-date data", body: "Norstat-collected data 3–4 times a year, over 1,500 consumers and 300+ B2B decision-makers per round." }],
      bullets: ["Channel-level reach", "Pricing data for media options", "B2C and B2B audiences", "Save 25% on ad spend", "Always-current panel data"],
    },
  },
  {
    slug: "mediasuunnittelu/radio",
    image: "/images/services-gen/mediasuunnittelu-radio.webp",
    icon: "graphic_eq",
    fi: {
      title: "Radiomainonta",
      metaTitle: "Radiomainonta — suunnittelu ja osto | NØRR3",
      metaDescription: "Radiomainonta tavoittaa ja liikuttaa: suunnittelu, ostot ja optimointi kaikilla kanavilla — NØRR3 Helsingissä.",
      heroLeft: "Radio",
      heroAccent: "liikuttaa",
      intro: "Radiomainonta tavoittaa kuulijan kotona, autossa ja työmatkalla. Suunnittelemme ja ostamme radiokampanjat osana kokonaismediamixiä — mitattuna.",
      sections: [{ heading: "Mihin radiomainonta soveltuu?", body: "Radiomainonta soveltuu sekä bränditietoisuuden kasvattamiseen että taktiseen mainontaan, kampanjan ykkösmediana esimerkiksi printin ja digin kaverina – tai vaikka TV-mainosten jatkajana. Radio ja audio toimivat kokonaisuutena hyvin myös mainonnan pääkanavana. Pitkäkestoiseen muistiin pääsee vaikuttamaan yhdistämällä ääni brändin jo ennestään tuttuun ilmeeseen." }, { heading: "Hyvä tietää radiomainonnasta", body: "Audion kokonaiskulutus on kasvussa ja sen huomioarvo on pysynyt tasaisesti korkeana. Uudenlaiset tuotteet, kuten surround sound -tekniikan hyödyntäminen ja audio bränding, ovat merkittäviä trendejä audion mediakentällä. Yli 70 % digitaalisten audiosisältöjen kuuntelusta tapahtuu kuulokkeilla, jolloin audiosisällöt saavat kuulijalta suuren huomion. Mainoshälyn määrä on vähäistä ja mainokset kuunnellaan alusta loppuun saakka keskittyneesti. Musiikin suoratoistopalvelut ovat suosikki mediakanava jopa 65 % suomalaisista. (Lähde: NØRR3 Insight Tool, Jan/2023 n=5.145) Suosituksemme on asettaa OTH (opportunity to hear) -taso siten, että kohderyhmäsi kuulee mainoksen vähintään viisi kertaa. Tyypillinen kampanjan kesto on 2–6 viikkoa. Huomioi myös digitaalinen audio: minkä podcastin tai audiopalvelun yleisön pitäisi kuulla brändistäsi lisää?" }, { heading: "Radiomainonnan hinnat", body: "Audiomainonnan huomioarvoprosentin keskihinta on yksi edullisimmista verrattuna muihin mediaryhmiin. Tuotantokustannukset ovat yleensä maltilliset. Hinta on > 1,3 €/CPT (CPT = tuhat soittokertaa). Audiomainonnan investoinnit ovat kasvaneet, koska keskimääräinen mainonnan total ROMI on merkittävästi suurempi, kun radio on mukana mediamixissä. (Lähde: 2012-2021 Dagmar ROMI benchmark meta-analyysi)" }],
      bullets: ["Kanava- ja ohjelmavalinta datalla", "Neuvotellut radiotalosopimukset", "Optimointi lennossa", "Mittaus tavoittavuuteen"],
    },
    en: {
      title: "Radio Advertising",
      metaTitle: "Radio Advertising — Planning and Buying | NØRR3",
      metaDescription: "Radio advertising reaches and moves: planning, buying and optimisation across channels — NØRR3 in Helsinki.",
      heroLeft: "Radio",
      heroAccent: "moves people",
      intro: "Radio reaches the listener at home, in the car and on the commute. We plan and buy radio campaigns as part of the total media mix — measured.",
      sections: [{ heading: "Planning and buying", body: "Channel and programme selections on audience data, negotiated rates and in-flight optimisation." }, { heading: "Radio as part of the mix", body: "Radio works best together: it builds the awareness that digital channels convert." }],
      bullets: ["Data-driven channel and programme selection", "Negotiated radio house deals", "In-flight optimisation", "Reach measurement"],
    },
  },
  {
    slug: "mediasuunnittelu/televisio",
    image: "/images/services-gen/mediasuunnittelu-televisio.webp",
    icon: "tv",
    fi: {
      title: "TV-mainonta",
      metaTitle: "TV-mainonta — suunnittelu ja osto | NØRR3",
      metaDescription: "TV-mainonta rakentaa tunnettuutta mittakaavalla: suunnittelu, ostot ja optimointi — NØRR3 mediatoimisto Helsingissä.",
      heroLeft: "TV rakentaa",
      heroAccent: "mittakaavaa",
      intro: "TV-mainonta rakentaa tunnettuutta kuten mikään muu kanava. Suunnittelemme TV-ostot yleisödatalla ja yhdistämme ne digikanaviin mitattavaksi kokonaisuudeksi.",
      sections: [{ heading: "Mihin televisiomainonta soveltuu?", body: "Televisiomainonta soveltuu erityisesti tunnettuuden nostoon, eli brändäävään mainontaan ykkösmediaksi. Tunnettuuden nostossa TV-mainos on edelleen ykkönen, ja mainokset jättävät pitkän muistijäljen. TV koetaan luotettavimmaksi mediaksi ja sillä saadaan brändi laajojen massojen eteen. Hyvin rakennetulla sisältöyhteistyöllä voidaan parantaa brändin mielikuvaa ja muistettavuutta esittelemällä omia palveluita tai tuotteita osana isoja ilmiöohjelmia." }, { heading: "Hyvä tietää TV-mainonnasta", body: "Suosituksemme TRP-panostukseksi: ~300+ (TRP = kampanjan saavuttamat kokonaiskontaktit) Lisää rinnalle aktivoivaa digikampanjointia, jotta investoinnista saadaan paras teho irti. Tyypillinen TV-kampanjan kesto on 2–6+ viikkoa. Nettopeitto kohderyhmässä on hyvä saada ylittämään 50 % etenkin yli 2 viikkoa kestävässä kampanjassa. Mikäli mainonnan viesti on taktinen, on hyvä saada sopiva määrä toistoa oikeaan aikaan lyhyemmillä lähdöillä. Brändillinen viesti voi taas olla pidempi ja sillä saadaan luotua pidempiaikaista muistijälkeä. Mainonnan vaikutus ulottuu ostetun kohderyhmän lisäksi myös laajemmalle massalle, joten peitto rakentuu nopeasti. Suomalaisista 74 % kuluttaa lineaarisen TV:n sisältöä viikottain ja satunnaisia käyttäjiä saadaan erittäin laajasti kiinni myös osana isoja ilmiöitä, kuten jääkiekon MM-kisat. (Lähde: NØRR3 Insight Tool, Jan/2023 n=5.145) Yhteismitallisuus Total TV:ssä tulee mahdollistamaan ensi vuoden aikana tehokkaan TV:n ja Online videon ostamisen ja mittaamisen. Tämä lisää kustannustehokkuutta ja integroidun peiton kautta päästään optimoimaan isojen ruutujen ostamista entisestään." }, { heading: "Hinnat TV-mainonnassa", body: "TV:n tuotantohinnat ovat korkeammat kuin muissa medioissa, mutta se on huomiarvoltaan vaikuttavin media ja on siihen nähden vielä hyvin edullista. TV-mainonnan ostamisessa korostuu kustannustehokkaasti ostettu mainonta oikeassa kohderyhmässä." }],
      bullets: ["Ohjelma- ja aikavalinta datalla", "Neuvotellut TV-sopimukset", "Yhdistetty TV+digi-mittaus", "Optimointi kampanjan aikana"],
    },
    en: {
      title: "TV Advertising",
      metaTitle: "TV Advertising — Planning and Buying | NØRR3",
      metaDescription: "TV advertising builds awareness at scale: planning, buying and optimisation — NØRR3 media agency in Helsinki.",
      heroLeft: "TV builds",
      heroAccent: "at scale",
      intro: "TV advertising builds awareness like no other channel. We plan TV buys on audience data and combine them with digital into a measurable whole.",
      sections: [{ heading: "Planning and buying", body: "Programmes, slots and rates on audience data — negotiated, not list price." }, { heading: "TV + digital together", body: "We combine TV awareness with digital conversion: the same message, a measurable result." }],
      bullets: ["Data-driven programme and slot selection", "Negotiated TV deals", "Combined TV+digital measurement", "In-flight optimisation"],
    },
  },
  {
    slug: "mediasuunnittelu/elokuvamainonta-eli-cinema",
    image: "/images/services-gen/mediasuunnittelu-elokuvamainonta-eli-cinema.webp",
    icon: "movie",
    fi: {
      title: "Elokuvamainonta (Cinema)",
      metaTitle: "Elokuvamainonta — Cinema | NØRR3",
      metaDescription: "Elokuvamainonta tavoittaa katsojan suurella elämyksellä: suunnittelu ja osto elokuvateattereihin — NØRR3 Helsingissä.",
      heroLeft: "Suurella",
      heroAccent: "elämyksellä",
      intro: "Elokuvamainonta tavoittaa katsojan silloin, kun hän on keskittynyt ja vastaanottavainen. Isolla ruudulla viesti jää mieleen — ja mittaa on.",
      sections: [{ heading: "Mihin elokuvamainonta soveltuu?", body: "Leffamainonta on huomioarvoltaan kaikkein vahvin media, sillä kuluttaja on hyvin rentoutuneessa mielentilassa ilman ulkopuolisia ärsykkeitä. Laadukkaasti tuotettu tarinallinen sisältö tulee parhaalla mahdollisella tavalla esille. Vaikuttava audiovisuaalinen kokemus antaa mainostajalle hyvän mahdollisuuden jättää voimakkaan muistijäljen. Brändien tunnettuuden kasvattaminen sekä lanseeraukset ovat sopivia hetkiä valita elokuvat mukaan mediamixiin. Mikäli tarkoituksena on kertoa hyvä tarina videon avulla, niin siihen elokuvamainonta sopii erittäin hyvin. Leffapelit puolestaan ovat erinomaisia aktivoimaan ja lisäämään brändin parissa vietettyä aikaa. Lisäksi ne ovat helppo tapa nostaa uusia tuotteita esille taktiseltakin kulmalta. 42 % suomalaisista kertoo elokuvien olevan heidän suosikkimediakanavansa. Tähän peilaten elokuvamainonnan alle 1 % osuus vuosittaisesta mediapanostuksesta on selvästi aliarvostetulla tasolla. (Lähde: NØRR3 Insight Tool, Jan/2023 n=5.145)" }, { heading: "Hyvä tietää elokuvamainonnasta", body: "Talouskurin aikakausi laskee suoratoistopalveluiden tilaajien määrää ja muuttaa sisällön kulutuksen tapoja. Suoratoistopalvelun käyttäjät suosivat tv-ohjelmia ja sarjoja, kun taas elokuvia katsotaan mieluummin elokuvateattereissa. Elokuvissa käydään juuri silloin eniten, kun kuluttajat ovat vastaanottavaisimpia mainonnalle, eli klo 15–21 välillä. Tällöin noin 67 % ihmisistä ottaa mainonnan hyvällä mielialalla ja rentoutuneesti vastaan. (Lähde: Kantar ‘AdReaction’ study & DCM Admissions -data)" }, { heading: "Elokuvamainonnan hinnat", body: "Vaikka elokuvamainonta ei ole halvimmasta päästä, niin sekuntimääräisen huomion kannalta se on hyvinkin kustannustehokasta. Elokuvaelämys on yksi niistä asioista, joista moni ei ole valmis tinkimään. Hinnat ovat hyvin riippuvaisia budjetista, ajankohdasta ja ajoituksen aikana py" }],
      bullets: ["Teatteri- ja elokuvavalinta", "Neuvotellut sopimukset", "Kohdennus elokuvan mukaan", "Tunnettuusvaikutus suurella ruudulla"],
    },
    en: {
      title: "Cinema Advertising",
      metaTitle: "Cinema Advertising | NØRR3",
      metaDescription: "Cinema advertising reaches the viewer with a big experience: planning and buying for movie theatres — NØRR3 in Helsinki.",
      heroLeft: "On the big",
      heroAccent: "screen",
      intro: "Cinema advertising reaches the viewer when they are focused and receptive. On the big screen the message stays — at scale.",
      sections: [{ heading: "Planning and buying", body: "Theatre chains, films and slots selected by target audience, negotiated." }, { heading: "Scale and experience", body: "Cinema offers TV-scale attention without the remote — the viewer is seated in front of your message." }],
      bullets: ["Theatre and film selection", "Negotiated deals", "Targeting by film", "Awareness impact on the big screen"],
    },
  },
  {
    slug: "mediasuunnittelu/printti-eli-lehtimainonta",
    image: "/images/services-gen/mediasuunnittelu-printti-eli-lehtimainonta.webp",
    icon: "newspaper",
    fi: {
      title: "Printti eli lehtimainonta",
      metaTitle: "Lehtimainonta — printtimainonta | NØRR3",
      metaDescription: "Lehti- ja printtimainonta: suunnittelu, ostot ja tuotanto sanoma- ja aikakauslehtiin — NØRR3 Helsingissä.",
      heroLeft: "Printti",
      heroAccent: "elää",
      intro: "Printtimainonta elää yhä: lehti luetaan keskittyneesti ja mainos jää sivulle. Suunnittelemme ja ostamme lehtimainonnan osana kokonaisuutta.",
      sections: [{ heading: "Mihin printtimainonta soveltuu?", body: "Printti soveltuu isolla formaatilla kertomaan teistä yrityksenä ja brändinä, ja toisaalta yhdistämällä pienempää formaattia toistoon saadaan taktisiin kampanjoihin tehoa. Kestävyys: Painettu materiaali voi pysyä pidempään esillä verrattuna digitaaliseen mainontaan, joka voi kadota nopeasti verkkoympäristössä. Kohdennettavuus: Sanomalehti- ja aikakauslehtimainoksia voidaan kohdentaa tietylle kohdeyleisölle, esimerkiksi erityisen aihepiirin lehdissä. Brändin tunnistaminen: Printtimainonta voi auttaa brändin tunnettuuden kasvattamisessa ja luottamuksen rakentamisessa." }, { heading: "Hyvä tietää printtimainonnasta", body: "Printtimainontaa käytetään edelleen laajasti markkinoinnissa, ja se voi olla osa kokonaisvaltaista markkinointistrategiaa, joka sisältää myös digitaalista mainontaa ja muita markkinointikeinoja. Yritykset valitsevat mainonnan muodon sen mukaan, mikä parhaiten sopii heidän kohdeyleisölleen ja tavoitteilleen. Printtimainonnassa suosittelemme välttämään irtolähtöjä, vaikka ne vauhdissa saattavatkin houkuttaa. Paras teho saadaan, kun printti-ilmoitukset yhdistetään kampanjakokonaisuuteen. Haasteena printtimainonnalle ovat lukijamäärien lasku, korkeammat tuotantokustannukset, rajoitettu interaktiivisuus verrattuna digitaaliseen mainontaan sekä vaikeus se" }],
      bullets: ["Lehti- ja numerovalinta", "Neuvotellut sopimukset", "Sijoitus- ja kampanjasuunnittelu", "Mainosmateriaalien koordinointi"],
    },
    en: {
      title: "Print Advertising",
      metaTitle: "Print Advertising — Newspapers and Magazines | NØRR3",
      metaDescription: "Print and magazine advertising: planning, buying and production for newspapers and magazines — NØRR3 in Helsinki.",
      heroLeft: "Print",
      heroAccent: "lives on",
      intro: "Print advertising still lives: magazines are read with focus and the ad stays on the page. We plan and buy print as part of the whole.",
      sections: [{ heading: "Planning and buying", body: "Publications, issues and placements by target audience — negotiated." }, { heading: "Print as part of the mix", body: "Print adds depth and permanence: it works as a reputation builder alongside digital." }],
      bullets: ["Publication and issue selection", "Negotiated deals", "Placement and campaign planning", "Ad material coordination"],
    },
  },
  {
    slug: "mediasuunnittelu/luovat",
    image: "/images/services-gen/mediasuunnittelu-luovat.webp",
    icon: "draw",
    fi: {
      title: "Luovat",
      metaTitle: "Luovat — mainosaineistot ja tuotanto | NØRR3",
      metaDescription: "Mainosaineistot, luova suunnittelu ja tuotanto kaikille kanaville —dynaamiset materiaalit automaatiolla.",
      heroLeft: "Luovat",
      heroAccent: "kaikille kanaville",
      intro: "Yksi master-ajattelu, tuhansia versioita. Suunnittelemme ja tuotamme mainosaineistot kaikille kanaville — dynaamiset ja personoidut aineistot automaatiolla.",
      sections: [{ heading: "Luovien testaus", body: "Luovien testaus on prosessi, jossa markkinoijat kokeilevat erilaisia luovia elementtejä, kuten mainoskuvia, otsikoita ja mainostekstejä selvittääkseen mikä niistä resonoi parhaiten kohdeyleisön kanssa ja tuottaa parhaat tulokset mainoskampanjassa." }, { heading: "Dynaamiset aineistot", body: "Dynaamiset aineistot ovat tietoja, jotka muuttuvat ja päivittyvät automaattisesti sen perusteella, kuka niitä tarkastelee tai mitä toimintoja suoritetaan. Näitä tietoja voidaan käyttää esimerkiksi personoitujen mainosten tai copy-tekstien luomiseen." }, { heading: "HTML- ja videoaineistot", body: "HTML- ja videoaineistot ovat keskeisiä elementtejä digimainonnan tehokkuudessa. HTML mahdollistaa dynaamisten bannerien rakentamisen ja muokkaamisen ketterästi. Videoaineistoja voidaan luoda satoja eri variaatioita mm. templateja hyödyntämällä." }],
      bullets: ["Konseptit ja master-aineistot", "Dynaamiset ja personoidut versiot", "Kaikki formaatit ja mitat", "A/B-testaus", "Syötepohjainen automaatio"],
    },
    en: {
      title: "Creatives",
      metaTitle: "Creatives — Ad Materials and Production | NØRR3",
      metaDescription: "Ad creatives, creative design and production for all channels — dynamic materials with automation.",
      heroLeft: "Creatives",
      heroAccent: "for every channel",
      intro: "One master, thousands of versions. We design and produce ad materials for every channel — dynamic and personalised creatives with automation.",
      sections: [{ heading: "Creative design", body: "Concepts and ad materials that work in the channel where they run." }, { heading: "Dynamic production", body: "Thousands of versions generated automatically from a feed: price, offer and target change without manual work." }],
      bullets: ["Concepts and master assets", "Dynamic and personalised versions", "All formats and sizes", "A/B testing", "Feed-based automation"],
    },
  },
  {
    slug: "mediasuunnittelu/kampanjat-ja-jatkuva-mainonta",
    image: "/images/services-gen/mediasuunnittelu-kampanjat-ja-jatkuva-mainonta.webp",
    icon: "campaign",
    fi: {
      title: "Kampanjat ja jatkuva mainonta",
      metaTitle: "Kampanja- ja jatkuva mainonta | NØRR3",
      metaDescription: "Sekin isot lanseeraukset että ympärivuotinen näkyvyys: kampanjasuunnittelu ja jatkuva mainonta — NØRR3.",
      heroLeft: "Näkyvyyttä",
      heroAccent: "ympäri vuoden",
      intro: "Isot lanseerausponnistukset ja ympärivuotinen näkyvyys, joka ei katkea. Suunnittelemme kampanjat ja jatkuvan mainonnan yhdeksi tasaiseksi putkeksi.",
      sections: [{ heading: "Jatkuvan näkyvyyden sisältö:", body: "Operoroidaan valittuja kanavia ja optimoidaan niitä valituilla mittareilla parhaiden mahdollisten tulosten saavuttamiseksi Tulokset raportoidaan sovitussa formaatissa ja sovitulla aikataululla" }],
      bullets: ["Lanseaus- ja sesonkikampanjat", "Always-on-näkyvyys", "Kanavat ja ajoitus kokonaisuutena", "Optimointi jatkuvasti"],
    },
    en: {
      title: "Campaigns and Always-on",
      metaTitle: "Campaign and Always-on Advertising | NØRR3",
      metaDescription: "Both big launches and year-round visibility: campaign planning and always-on advertising — NØRR3.",
      heroLeft: "Visibility",
      heroAccent: "all year round",
      intro: "Big launch pushes and year-round visibility that never breaks. We plan campaigns and always-on advertising as one continuous flow.",
      sections: [{ heading: "Campaigns", body: "Launches, seasons and bursts — planned, bought and measured." }, { heading: "Always-on", body: "Continuous presence that keeps the brand on the purchase path all year." }],
      bullets: ["Launch and seasonal campaigns", "Always-on visibility", "Channels and timing as a whole", "Continuous optimisation"],
    },
  },
  {
    slug: "mediastrategia",
    image: "/images/services-gen/mediastrategia.webp",
    icon: "hub",
    fi: {
      title: "Mediastrategia",
      metaTitle: "Mediastrategia — kanavalinjaus ja budjetit | NØRR3",
      metaDescription: "Mediastrategia: kanavavalinnat, budjettien jako ja mittarit datalla. Strateginen raami medialle — NØRR3 Helsinki.",
      heroLeft: "Media",
      heroAccent: "strategisesti",
      intro: "Mediastrategia kääntää liiketoiminnan tavoitteet kanavalinjaukseksi: mitkä kanavat, missä suhteessa, millä budjetilla ja miten mitattuna. Data ensin, mielipiteet sitten.",
      sections: [{ heading: "Kattava mediasuunnittelu ja operointi tuloksellisesti ja kustannustehokkaasti kaikissa online- ja offline-kanavissa", body: "360-mediastrategia viedään käytäntöön tuloksellisen ja huolellisen mediasuunnittelun ja -operoinnin keinoin. Yhdistämme kohderyhmään vetoavan mediasuunnittelun, eri mediakanavien operoinnin sekä mainonnan optimoinnin yhdeksi kanavariippumattomaksi kokonaisuudeksi. NØRR3:lla mediasuunnittelussa korostuvat medioiden läpikotainen tuntemus sekä kokonaisvaltainen suunnittelu kaikkien offline- ja online-kanavien osalta. Emme jää yksittäisten kanavien vangiksi, vaan katsomme kokonaiskuvaa liiketoimintalähtöisesti: mainoksesi näkyy siellä, missä se tavoittaa juuri oikean kohderyhmän vaikuttavasti ja kustannustehokkaasti, oli kyseessä sitten TikTok tai Maaseudun Tulevaisuus. Hyvin toteutettuna mediaostaminen, -operointi ja -optimointi tuovat sekä kustannussäästöjä että parempia tuloksia. Ostamalla mediaa meidän kauttamme saat 15 % mediatoimistoalennuksen sekä parhaat mahdolliset asiakaskohtaisesti neuvotellut lisäalennukset. Optimointi on olennainen osa erityisesti digitaalisten kanavien operointia. Sillä voi saavuttaa merkittäviä tulosparannuksia, kun optimoidaan kokonaisuutena eri kohderyhmiä, kanavia, mainosformaatteja, aineistoja sekä viestejä. Optimointiin voidaan yhdistää myös dynaaminen mainonta. Luova suunnittelu ja tuotanto täydentävät mediasuunnittelupalveluitamme. Onnistuneet markkinointiratkaisut vaativat luovan ja median saumatonta yhteispeliä. Koska meillä on hyvä ymmärrys mediasta, pystymme itse rakentamaan asiakkaillemme toimivia pienempiä konsepteja sekä tuottamaan kohderyhmään ja mediaan sopivia mainoksia kustannustehokkaasti. Näin koko prosessi luovasta suunnittelusta tuotannon kautta operointiin nopeutuu ja tehostuu." }, { heading: "Mediat ja mediamixit", body: "Mediasuunnitelma vie mediastrategian käytäntöön kampanja- ja intramediatasolla. Mediastrategiaan pohjautuen rakennamme konkreettisen kampanjakohtaisen tai/tai jatkuvan mainonnan mediasuunnitelman, joka huomioi optimaalisen tavoittavuuden ja vaikuttavuuden." }, { heading: "Kampanjat ja jatkuva mainonta", body: "Kampanjointi ja jatkuva mainonta, eli niin sanottu Always On -näkyvyys, toteutetaan mediastrategiaan ja kilpailijoiden mediapanostuksiin pohjautuen. Jatkuva näkyvyys ylläpitää brändin tunnettuutta ja toimii tärkeänä tulospohjaisena markkinointiviestinnän keinona kampanjoiden väli" }],
      bullets: ["Kanavalinjaus datalla", "Budjettiallokaatio", "Ajoitus- ja vuosikello", "Mittarit ja todentaminen", "Kilpailijoiden mediaseuranta"],
    },
    en: {
      title: "Media Strategy",
      metaTitle: "Media Strategy — Channel Selection and Budgets | NØRR3",
      metaDescription: "Media strategy: channel selection, budget split and metrics with data. The strategic frame for media — NØRR3 Helsinki.",
      heroLeft: "Media",
      heroAccent: "strategically",
      intro: "Media strategy turns business goals into a channel plan: which channels, in what proportion, at what budget, and how measured. Data first, opinions second.",
      sections: [{ heading: "Channel selection", body: "Audience and intent data decide the channels — we don't favour our own favourites." }, { heading: "Budget split", body: "A modelled budget allocation that tells where the next euro produces the most." }, { heading: "Metrics", body: "Clear goals and metrics for every channel — verified after the campaign." }],
      bullets: ["Data-driven channel plan", "Budget allocation", "Timing and annual calendar", "Metrics and verification", "Competitor media monitoring"],
    },
  },
  {
    slug: "dynaaminen-mainonta",
    image: "/images/services-gen/dynaaminen-mainonta.webp",
    icon: "auto_awesome",
    fi: {
      title: "Dynaaminen mainonta",
      metaTitle: "Dynaaminen mainonta ja DCO | NØRR3 Helsinki",
      metaDescription: "Dynaaminen ja personoitu mainonta: tuhansia aineistoversioita tuote- ja asiakasdatasta — DCO automaatiolla.",
      heroLeft: "Yksi viesti",
      heroAccent: "tuhansin versioin",
      intro: "Dynaaminen mainonta rakentuu tuote- ja asiakasdatasta: hinta, tarjous ja kuva vaihtuvat katsojan mukaan automaattisesti. Tuhansia versioita yhdestä masterista.",
      sections: [{ heading: "Dynaaminen mainonta", body: "Dynaamisessa mainonnassa nimensä mukaisesti tehdään markkinoinnista dynaamisempaa. Siinä set-up -työ vie hieman enemmän aikaa, mutta vastaavasti jatkuva operointi helpottuu ja nopeutuu huomattavasti. Dynaamisuus tekee markkinoinnista paljon tuloksellisempaa sekä säästää aikaa ja rahaa pidemmässä juoksussa. Dynaamisessa mainonnassa hyödynnetään templateja, feedejä, dataa ja algoritmejä reealiaikaisesti." }, { heading: "Dynaaminen mainonta: tehokkuutta ja tuloksia markkinointiin", body: "Parhaimmillaan hyödyt tästä mainonnan muodosta pääsee tuntemaan, kun markkinointia tehdään jatkuvassa muodossa (always-on tai useita kampanjoita läpi vuoden), vähintään 4000 euron kk-budjetilla / kanava ja monituote- & monikanavaympäristössä. Hinta dynaamisen mainonnan set-upille ja toteutukselle lasketaan tapauskohtaisesti. Tähän vaikuttaa suuresti sekä kanavien määrä että eri tyyppisten kampanjoiden määrä per kanava. Hintaan vaikuttaa lisäksi se, minkä tasoista dynaamista kampanjaa ollaan tekemässä: helpoimmillaan dynaamisessa kampanjassa vain päivitetään excelin kautta mainosversioita ja monimutkaisimmillaan dynaaminen mainos tehdään feedien ja muiden datalähteiden avulla." }],
      bullets: ["Personointi katsojatason datasta", "Hinta ja tarjous reaaliajassa", "A/B-testaus automaattisesti", "Tuhansia versioita yhdestä masterista", "Konversiopohjainen optimointi"],
    },
    en: {
      title: "Dynamic Advertising",
      metaTitle: "Dynamic Advertising and DCO | NØRR3 Helsinki",
      metaDescription: "Dynamic and personalised advertising: thousands of creative versions from product and customer data — DCO with automation.",
      heroLeft: "One message",
      heroAccent: "a thousand versions",
      intro: "Dynamic advertising is built from product and customer data: price, offer and image change automatically per viewer. Thousands of versions from one master.",
      sections: [{ heading: "DCO — dynamic creative optimisation", body: "Creatives change during the run: what converts gets shown more." }, { heading: "Feed-based production", body: "Product, inventory and pricing data becomes creative automatically — no manual rounds." }],
      bullets: ["Personalisation from viewer-level data", "Price and offer in real time", "Automatic A/B testing", "Thousands of versions from one master", "Conversion-based optimisation"],
    },
  },
  {
    slug: "hakukonemainonta",
    image: "/images/services-gen/hakukonemainonta.webp",
    icon: "search",
    fi: {
      title: "Hakukonemainonta",
      metaTitle: "Hakukonemainonta SEM — Google Ads | NØRR3 Helsinki",
      metaDescription: "Hakukonemainonta: Google Ads ja hakutulosten kärkeen siellä missä ostoaikeus on korkein — NØRR3 Helsingissä.",
      heroLeft: "Löydy",
      heroAccent: "ostoaiheessa",
      intro: "Hakukonemainonta tavoittaa asiakkaan silloin, kun hän etsii juuri sinun ratkaisuasi. Sanat, mainokset ja laskeutumissivut optimoidaan konversioon — jokainen klikki mitataan.",
      sections: [{ heading: "Shopping", body: "Shopping-kampanjat generoivat usein valtaosan verkkokaupan myynnistä, ja ROAS-tavoitteet ovat tyypillisesti 700–900 %. Shopping-kampanjoissa painotetaan ROAS-tasoja sovittujen tavoitteiden mukaisesti. ROAS-tasot voidaan sopia kampanjakohtaisesti, kun kampanjoiden rakenne on tehty esimerkiksi katetasojen mukaiseksi. Optimoimme shopping-kampanjoita jatkuvasti maksimaalisten tulosten saavuttamiseksi (mm. tulosten aktiivinen seuranta, CPA- ja ROAS -kehityksen seuranta, negatiiviset avainsanat)." }, { heading: "Mihin hakukonemainonta soveltuu?", body: "Hakukonemainonta sopii sekä ottamaan kysynnästä kiinni suurempien kampanjalähtöjen aikana että käytättäväksi jatkuvana mainontana (vähintään brändihakujen osalta)." }, { heading: "Hyvä tietää", body: "SEM:issä relevanttien hakujen määrän, laadun sekä hintojen selvittäminen ja tunteminen korostuu, ja virheet tuntuvat budjetissa. Asiantuntijan apu maksaa itsensä yleensä nopeasti takaisin." }],
      bullets: ["Avainsanatutkimus ja -strategia", "Mainostekstit ja laajennukset", "Laskeutumissivuoptimointi", "Budjetin jako ja tarjoukset", "Konversioseuranta myyntiin asti"],
    },
    en: {
      title: "Search Advertising",
      metaTitle: "Search Advertising SEM — Google Ads | NØRR3 Helsinki",
      metaDescription: "Search advertising: Google Ads to the top of the results where purchase intent is highest — NØRR3 in Helsinki.",
      heroLeft: "Get found",
      heroAccent: "at the intent",
      intro: "Search advertising reaches the customer exactly when they are looking for your solution. Keywords, ads and landing pages are optimised for conversion — every click measured.",
      sections: [{ heading: "Keywords and ads", body: "Keyword research, ad copy and extensions that match the real search intent." }, { heading: "Landing pages and conversion", body: "The ad promises, the page delivers: we optimise the whole path from click to conversion." }],
      bullets: ["Keyword research and strategy", "Ad copy and extensions", "Landing page optimisation", "Budget split and bidding", "Conversion tracking down to sales"],
    },
  },
  {
    slug: "display-ja-videomainonta",
    image: "/images/services-gen/display-ja-videomainonta.webp",
    icon: "grid_view",
    fi: {
      title: "Display- ja videomainonta",
      metaTitle: "Display- ja videomainonta | NØRR3 Helsinki",
      metaDescription: "Display- ja videomainonta: bannerit, video ja ohjelmallinen ostaminen yhdestä paikasta — mitattuna, NØRR3.",
      heroLeft: "Näytä",
      heroAccent: "ja kerro",
      intro: "Display-mainonta rakentaa tunnettuutta, video kertoo tarinan. Suunnittelemme ja ostamme molemmat — usein ohjelmallisesti — ja mittaat tuloksen reaaliajassa.",
      sections: [{ heading: "Suoraostot", body: "Mainontaa ostetaan joko kampanjakohtaisesti tai osana jatkuvaa näkyvyyttä. Mainostajat (tai mediatoimistot heidän puolestaan) neuvottelevat suoraan kustantajien tai verkkosivuston omistajien kanssa mainostilan ostamisesta. Suoraostetuissa kampanjoissa hyödynnetään kyseisen median sivustoja ja/tai heidän käyttäjistä kerättyä markkinointidataa mainonnan kohdentamiseen. Suoraostettuja kampanjoita on paljon erilaisia, ja ne voi räätälöidä halutun tavoitteen, kohdennuksen, formaatin ja budjetin mukaisesti. Toisin kuin ohjelmallisessa mainonnassa, mainosnäytöt eivät perustu huutokauppaan ja hinnoittelu mainoksen näytöstä (tai klikistä) sovitaan suoraan kiinteään hintaan." }, { heading: "Ohjelmallinen ostaminen", body: "Mainosnäytöt ostetaan automatisoidulla tekniikalla järjestelmässä, jossa voidaan ostaa useamman median mainosinventaaria yhtäaikaisesti. Ohjelmallisen mainonnan osto-alustat käyttävät datavetoisia algoritmeja mainosten ostamiseen ja sijoittamiseen reaaliajassa, ja ne perustuvat huutokauppoihin (Real-Time Bidding). Kun käyttäjä vierailee sivustolla tai sovelluksessa, vapaana oleva mainospaikka ilmestyy huutokauppaan ja mainostajat käyvät huutokauppaa mainoksen näytöstä riippuen kohdennuksista, asetuksista ja hinnasta reaaliajassa. Ohjelmallinen mainonta nojaa vahvasti datan käyttöön kampanjan suorituksessa, tavoitteissa ja kohdennuksissa. Mainosteknologia kehittyy valtavasti ja tarjoaa ohjelmallisen ostajille jatkuvasti uusia ominaisuuksia ja formaatteja ostamisen automatisointiin sekä kampanjan tavoitteiden saavuttamiseen. Tehostuneet tekoäly-algoritmit tarjoavat parempia optimointikeinoja, tarkempaa kohdentamista ja mainosten personointia. Ohjelmallinen mainonta on kehittymässä kovaa vauhtia monikanavaisiin integraatioihi" }, { heading: "Mihin online video soveltuu?", body: "Online video sopii lähes jokaiseen kampanjaan, koska eri tyyppisiä formaatteja on hyvin paljon ja liikkuva kuva jättää hyvän muistijäljen. Online video toimii hyvin yksinään, mutta vielä paremmin tv:n tukimediana. Total-TV -mainonnalla on korkea tuotto ja tehokkuus, mutta se on samalla turvallinen alusta brändeille. Formaattina se on hyvä, koska se toimii tehokkaasti herättämällä tunteita ja aktivoimalla katselijaa, ja sisältää hyvin monipuolisia kohdennusmahdollisuuksia. Videolla ei pelkästään tueta hyvää brändillistä tarinankerrontaa, mutta myös esitellään näyttävällä tavalla tuotteita tai palveluita. Online video on hyvä tapa informoida vaikeistakin aiheista kiinnostavalla ja osallistavalla tavalla." }, { heading: "Hyvä tietää", body: "Katselijakunnassa korostuvat aavistuksen miehet/miesoletetut, ja sisältöjä katsotaan usein isoilta näytöiltä. Useilta alustoilta voi ostaa monipuolisesti myös pelkästään loppuun asti katseluja tai tuotteita, joissa korostuu tietty KPI-mittari. Koska uusia toimijoita ja tuotteita tulee jatkuvasti, on meidän tehtävämme suodattaa aidosti hyödylliset ostotavat mittaamalla tuloksia aktiivisesti. Olennaisinta on pitää omat tavoitteet ajan tasalla, oppia tuloksista sekä kehittää tekemistä jatkuvasti. Ymmärtämällä omia kohderyhmiä saadaan tehokkaammin viestiä perille oikeille yleisöille. 63 % suomalaisista seuraa vähintään viikottain joko Katsomoa, Ruutua tai molempia. Ruudulla on keskimäärin hieman vanhempi ikäprofiili kuin Katsomolla, mutta molemmista tavoitetaan nuoria tehokkaasti. (Lähde: NØRR3 Insight Tool, Jan/2023 n=5.145)" }],
      bullets: ["Banneri- ja videoformaattien suunnittelu", "Ohjelmallinen osto", "Tavoittavuus ja frekvenssin hallinta", "Näkyvyys (viewability) mittauksena", "Yhdistetty display+digi-mittaus"],
    },
    en: {
      title: "Display and Video Advertising",
      metaTitle: "Display and Video Advertising | NØRR3 Helsinki",
      metaDescription: "Display and video advertising: banners, video and programmatic buying from one place — measured, NØRR3.",
      heroLeft: "Show",
      heroAccent: "and tell",
      intro: "Display advertising builds awareness, video tells the story. We plan and buy both — often programmatically — with results measured in real time.",
      sections: [{ heading: "Display advertising", body: "Banners and native formats in the right environments, reach and frequency managed." }, { heading: "Video advertising", body: "TrueView, in-stream and out-stream: a story that stops the viewer — from 6 seconds to a minute." }],
      bullets: ["Banner and video format planning", "Programmatic buying", "Reach and frequency management", "Viewability measurement", "Combined display+digital measurement"],
    },
  },
  {
    slug: "somemarkkinointi",
    image: "/images/services-gen/somemarkkinointi.webp",
    icon: "share",
    fi: {
      title: "Somemarkkinointi",
      metaTitle: "Somemarkkinointi — Facebook, Instagram, TikTok | NØRR3",
      metaDescription: "Somemarkkinointi kaikilla kanavilla: Facebook, Instagram, LinkedIn ja TikTok — suunnittelu, ostot ja mittaus NØRR3:ltä.",
      heroLeft: "Ole",
      heroAccent: "siellä missä yleisösi",
      intro: "Somemarkkinointi on nykyaikaa: yleisösi on Facebookissa, Instagramissa, LinkedInissä ja TikTokissa. Suunnittelemme ja ostamme somemainonnan — kohdennettuna, mitattuna, tuloksekkaasti.",
      sections: [{ heading: "Mihin somemainonta soveltuu?", body: "Somemainonta soveltuu osaksi kampanjoita sekä toimii myös erinomaisesti always on -mediamixissä. Somekanavissa voidaan tehdä sekä brändäävää että taktista mainontaa, eli optimoida kohti kovia konversioita tai herättää enemmän tietoisuutta ja huomioarvoa." }],
      bullets: ["Kanavalinjaus ja roolit", "Kohdennus yleisödatalla", "Kaikki formaatit (feed, story, reels)", "Yhteisöjen rakentaminen", "Tulokset mitattuna"],
    },
    en: {
      title: "Social Media Marketing",
      metaTitle: "Social Media Marketing — Facebook, Instagram, TikTok | NØRR3",
      metaDescription: "Social media marketing across channels: Facebook, Instagram, LinkedIn and TikTok — planning, buying and measurement from NØRR3.",
      heroLeft: "Be",
      heroAccent: "where your audience is",
      intro: "Social media marketing is the present: your audience is on Facebook, Instagram, LinkedIn and TikTok. We plan and buy social advertising — targeted, measured, effective.",
      sections: [{ heading: "Channel plan", body: "Facebook, Instagram, LinkedIn and TikTok — each with its own role: LinkedIn for B2B, TikTok for the younger crowd." }, { heading: "Targeting and creatives", body: "Creatives targeted with audience data that work in their channel — vertical video for TikTok, article links for LinkedIn." }],
      bullets: ["Channel plan and roles", "Audience-data targeting", "All formats (feed, story, reels)", "Community building", "Measured results"],
    },
  },
  {
    slug: "tutkimukset",
    image: "/images/services-gen/tutkimukset.webp",
    icon: "science",
    fi: {
      title: "Tutkimukset",
      metaTitle: "Tutkimukset — brand-, kampanja- ja ennakkomittaus | NØRR3",
      metaDescription: "Brand Performance-, Campaign Performance- ja Pre-campaign -tutkimukset. Tiedä ennen, tänä ja jälkeen — NØRR3.",
      heroLeft: "Tiedä",
      heroAccent: "ennen ja jälkeen",
      intro: "Tutkimme ennen kampanjaa, sen aikana ja jälkeen: brändin kunnon, kampanjan vaikutuksen ja ennakko-odotukset. Yksi tutkimusperhe — kolme näkökulmaa.",
      sections: [{ heading: "NØRR3 Brand Performance", body: "NØRR3n Brand Performance tutkimuksen avulla voit mitata brandisi nykytilanteen tietyssä hetkessä kerran tai jatkuvana. Tutkimuksessa selvitetään Norstatin valtakunnallisen paneelin ja kyselytutkimuksen avulla asiakkaan brändin performointi, brändin tunnettuus sekä brändisuppilon toiminta eri vaiheissa kilpailijat huomioiden. Autamme sinua aina tutkimuslomakkeen suunnittelusta tulosten analysointiin asti. Saat käyttöösi alan konkareiden dataan nojaavat näkemykset, joiden pohjalta on selkeämpää ottaa seuraavat askeleet oikeaan suuntaan. Tulokset voidaan raportoida joko dashboardissa tai perinteisesti powerpointissa." }, { heading: "Räätälöidyn tutkimuksen sisältö:", body: "Määritellään tutkimuksen kohderyhmä sekä millaisissa taustamuuttujissa tuloksia halutaan tarkastella. Suositeltu minimi n-koko on 500 kpl. Määritetään tutkimuksessa tarkemmin selvitettävät asiat, mm. brändi-attribuutit (suositeltu: max 10) sekä  3-5 kilpailijaa joiden tunnettuuteen asiakkaan brändiä verrataan. Toteutetaan online-pohjainen paneeli-tutkimus ja kerätään vastaajien tiedot (kesto riippuu n-koosta, noin 1-3 viikkoa). Koostetaan yhteenveto ja johtopäätökset, selvitetään missä asioissa asiakas on onnistunut ja missä on kehitettävää. Tutkimus voidaan toistaa halutun väliajoin, jatkuvissa tutkimuksissa hinta matalampi." }, { heading: "NØRR3 Campaign Performance", body: "NØRR3 Campaign Performance -tutkimuksen avulla voit mitata miten hyvin kampanjasi tavoitti halutun kohderyhmän ja miten se toimi. Suositeltu n-koko on minimi 300-500 kpl. Tutkimuksessa selvitetään valtakunnallisen paneelin (Norstat) ja kyselytutkimuksen avulla asiakkaan kampanjan performointi, mm. mainonnan muistaminen ja huomioarvo, ajatukset mainonnasta, mainonnan vaikutus mielikuvaan, mainonnan herättämät ajatukset sekä mainonnan aktivoivuus." }, { heading: "Tutkimuksen sisältö", body: "Määritetään tutkimuksen kohderyhmä, ajankohta sekä selvitettävät asiat Toteutetaan online-pohjainen paneeli-tutkimus ja kerätään vastaajien tiedot (kesto riippuu n:n koosta, noin 1-2 viikkoa). Koostetaan yhteenveto ja johtopäätökset, selvitetään missä asioissa kampanja on onnistunut ja missä on kehitettävää. Tutkimus voidaan toistaa uusien kampanjoiden yhteydessä" }, { heading: "NØRR3 Pre-Campaign Performance", body: "NØRR3 Pre-Campaign Performance -tutkimuksen avulla voit testata konseptia ennen isoa lanseerausta ja varmistaa, että luova sisältö toimii ja viesti menee kohderyhmässä varmasti läpi. Saman voi tehdä kampanjan aineistoille, jos mietit luovan tai viestien toimivuutta. Kampanjan näytteen koko (n) voi olla 100-500. Paneeli toteutetaan sertifioidun kumppanimme Norstatin kanssa." }, { heading: "Tutkimuksen sisältö", body: "Määritetään tutkimuksen kohderyhmä, ajankohta sekä selvitettävät asiat Toteutetaan online-pohjainen paneeli-tutkimus ja kerätään vastaajien tiedot (kesto riippuu n:n koosta, noin 1 viikko). Koostetaan yhteenveto ja johtopäätökset, selvitetään missä asioissa kampanja on onnistunut ja missä on kehitettävää. Tutkimus voidaan toistaa uusien kampanjoiden yhteydessä" }],
      bullets: ["Brand Performance -tutkimus", "Campaign Performance -tutkimus", "Pre-campaign -lähtötaso", "Express-versiot nopeisiin tarpeisiin", "Räätälöidyt kysymyssetit"],
    },
    en: {
      title: "Research",
      metaTitle: "Research — Brand, Campaign and Pre-campaign Studies | NØRR3",
      metaDescription: "Brand Performance, Campaign Performance and Pre-campaign studies. Know before, during and after — NØRR3.",
      heroLeft: "Know",
      heroAccent: "before and after",
      intro: "We research before the campaign, during it and after: brand health, campaign impact and baseline expectations. One research family — three perspectives.",
      sections: [{ heading: "Brand Performance", body: "Brand awareness, attitude and consideration before and after — you see the change in numbers." }, { heading: "Campaign Performance", body: "What the campaign achieved: awareness, image and purchase intent measured." }, { heading: "Pre-campaign", body: "A baseline measurement before the campaign: the starting level to compare impact against." }],
      bullets: ["Brand Performance study", "Campaign Performance study", "Pre-campaign baseline", "Express versions for fast needs", "Tailored question sets"],
    },
  },
  {
    slug: "ai-optimointi",
    image: "/images/services-gen/ai-optimointi.webp",
    icon: "neurology",
    fi: {
      title: "AI-optimointi",
      metaTitle: "AI-optimointi — tekoäly markkinoinnissa | NØRR3 Helsinki",
      metaDescription: "AI-optimointi: tekoäly kampanjasuunnittelun, luovien automaation ja datan analyysin moottorina — NØRR3.",
      heroLeft: "Tekoäly",
      heroAccent: "moottorina",
      intro: "Tekoäly ei ole slidellä — se on työkalu, joka ajaa suunnittelua, luovien automaatiota ja data-analyysiä. NØRR3:n AI-optimointi tekee markkinoinnista nopeampaa, tarkempaa ja tehokkaampaa.",
      sections: [{ heading: "Tekoälyavusteinen suunnittelu", body: "Mallit jakavat panostukset uudelleen kesken lennon yleisödatan pohjalta — sama logiikka kuin Marketing Enginessä." }, { heading: "Luovien automaatio", body: "Yksi master-suunnittelu tuhansiksi versioiksi: AI generoi personoituja aineistoja tuote- ja asiakasdatasta." }, { heading: "GEO — näkyvyys AI-vastauksissa", body: "Tekoälyavustajat suosittelevat brändejä vastauksissaan. Varmistamme, että ne suosittelevat sinua." }],
      bullets: ["AI-lähtöinen mediamix-suunnittelu", "Automaattinen aineistotuotanto", "GEO / AI-löydettävyys", "Datan analyysi ja ennakointi", "AI-workshopit tiimeillesi"],
    },
    en: {
      title: "AI Optimisation",
      metaTitle: "AI Optimisation — AI in Marketing | NØRR3 Helsinki",
      metaDescription: "AI optimisation: artificial intelligence as the engine of campaign planning, creative automation and data analysis — NØRR3.",
      heroLeft: "AI",
      heroAccent: "as the engine",
      intro: "AI isn't a slide in our deck — it's a tool driving planning, creative automation and data analysis. NØRR3's AI optimisation makes marketing faster, sharper and more effective.",
      sections: [{ heading: "AI-assisted planning", body: "Models reallocate spend mid-flight on audience data — the same logic that runs the Marketing Engine." }, { heading: "Creative automation", body: "One master design into thousands of versions: AI generates personalised creatives from product and customer data." }, { heading: "GEO — visibility in AI answers", body: "AI assistants recommend brands in their answers. We make sure they recommend you." }],
      bullets: ["AI-driven media mix planning", "Automated creative production", "GEO / AI discoverability", "Data analysis and forecasting", "AI workshops for your team"],
    },
  },
  {
    slug: "tekoalymainonta",
    image: "/images/services-gen/tekoalymainonta.webp",
    icon: "auto_awesome",
    fi: {
      title: "Tekoälymainonta",
      metaTitle: "Tekoälymainonta — mainonta, joka oppii | NØRR3 Helsinki",
      metaDescription: "Tekoälymainonta: mainokset, kohdennus ja budjetti, jotka paranevat kampanjan aikana. NØRR3 yhdistää tekoälyn, median ja liiketoiminnan tavoitteet.",
      heroLeft: "Mainonta",
      heroAccent: "oppii",
      intro: "Tekoälymainonnassa mainokset, kohdennus ja budjetti paranevat kampanjan aikana, eivät vasta sen jälkeen. Rakennamme kokonaisuuden: mitä tekoäly tekee, mitä ihminen päättää ja miten tulos näkyy liiketoiminnassa.",
      sections: [
        { heading: "Mitä tekoälymainonta on?", body: "Tekoäly tekee mainoksista kymmeniä versioita, testaa ne oikeilla ihmisillä ja siirtää rahan sinne, missä tulos syntyy. Ihminen asettaa tavoitteet, rajat ja brändin äänen. Kone hoitaa toiston." },
        { heading: "Langat pysyvät yksissä käsissä", body: "Kampanjassa on nykyään mukana monta tekijää: mediat, alustat, tuotanto, oma tiimisi ja usein muita kumppaneita. Me sovitamme ne yhteen, jotta tekoälyllä on oikea tieto ja selkeä tavoite, ja vastuu tuloksesta on yhdellä taholla." },
        { heading: "Kasvua, ei kokeiluja", body: "Mittaamme sitä, mikä ratkaisee liiketoiminnassa: myyntiä, liidejä ja asiakashankinnan hintaa. Tekoäly on keino, ei tavoite." },
        { heading: "Palvelu kehittyy kanssasi", body: "Tekoälymainonnan työkalut muuttuvat kuukausittain. Emme myy valmista pakettia, vaan rakennamme mallin, joka sopii juuri sinun tavoitteisiisi ja kehittyy niiden mukana." },
      ],
      bullets: ["Tekoälyllä tehdyt mainosversiot", "Jatkuva testaus ja optimointi", "Kohdennus asiakastiedon pohjalta", "Budjetin ohjaus tuloksen mukaan", "Raportointi myyntiin ja liideihin asti"],
    },
    en: {
      title: "AI Advertising",
      metaTitle: "AI Advertising — advertising that learns | NØRR3 Helsinki",
      metaDescription: "AI advertising: ads, targeting and budget that improve while the campaign runs. NØRR3 brings AI, media and your business goals together.",
      heroLeft: "Advertising",
      heroAccent: "that learns",
      intro: "With AI advertising, your ads, targeting and budget improve while the campaign runs, not after it ends. We build the whole setup: what AI does, what people decide, and how the result shows up in your business.",
      sections: [
        { heading: "What is AI advertising?", body: "AI produces dozens of ad versions, tests them with real people and moves the money to where results happen. People set the goals, the limits and the brand voice. The machine handles the repetition." },
        { heading: "One party holding it together", body: "A campaign today involves many players: media owners, platforms, production, your own team and often other partners. We bring them together so the AI has the right information and a clear goal, and one party is accountable for the result." },
        { heading: "Growth, not experiments", body: "We measure what matters to the business: sales, leads and the cost of winning a customer. AI is the means, not the goal." },
        { heading: "A service that grows with you", body: "AI advertising tools change every month. We don't sell a ready-made package. We build a model that fits your goals and evolves with them." },
      ],
      bullets: ["AI-made ad versions", "Continuous testing and optimisation", "Targeting based on customer information", "Budget steered by results", "Reporting all the way to sales and leads"],
    },
  },
  {
    slug: "markkinointi-terveydenhuolto",
    image: "/images/services-gen/markkinointi-terveydenhuolto.webp",
    icon: "health_and_safety",
    fi: {
      title: "Terveydenhuollon markkinointi",
      metaTitle: "Terveydenhuollon markkinointi monitoimipisteille | NØRR3 Helsinki",
      metaDescription: "Terveys- ja hammashoitoketjujen markkinointi yhdestä alustasta: jokainen toimipiste saa oman kampanjansa ilman toistotyötä — NØRR3 Marketing Engine.",
      heroLeft: "Yksi kampanja,",
      heroAccent: "neljäkymmentä toimipistettä",
      intro: "Kun klinikoita on neljäkymmentä, sama kampanja pitää rakentaa neljäkymmentä kertaa — ellei moottori tee sitä puolestasi. Marketing Engine jalkauttaa yhden suunnitelman jokaiseen toimipisteeseen paikallisesti kohdennettuna.",
      sections: [
        { heading: "Jokainen toimipiste, oma kampanja", body: "Potilaat hakevat hoitoa omalta alueeltaan. Engine luo jokaiselle toimipisteelle oman, paikallisen version — omalla budjetilla ja omalla maantieteellisellä kohdennuksella." },
        { heading: "Kanavat samasta putkesta", body: "Meta, display ja ulkomainonta (pDOOH) yhdestä ohjauspaneelista. Ei erillisiä sopimuksia, ei erillisiä raportteja." },
        { heading: "Tulokset mitataan toimipisteittäin", body: "Jokainen mediaeuro mitataan. Näet, mikä toimipiste tuottaa ja mikä kampanja kannattaa toistaa." },
      ],
      bullets: ["Toimipistekohtaiset kampanjat", "Paikallinen kohdennus ja budjetti", "Meta + display + pDOOH", "Tulokset toimipisteittäin", "Vähemmän manuaalityötä"],
    },
    en: {
      title: "Healthcare Marketing",
      metaTitle: "Healthcare Marketing for Multi-location Providers | NØRR3 Helsinki",
      metaDescription: "Marketing for healthcare and dental chains from one platform: every location gets its own campaign without repeated work — NØRR3 Marketing Engine.",
      heroLeft: "One campaign,",
      heroAccent: "forty locations",
      intro: "When you have forty clinics, the same campaign has to be built forty times — unless an engine does it for you. The Marketing Engine rolls one plan out to every location, locally targeted.",
      sections: [
        { heading: "Every location, its own campaign", body: "Patients look for care near them. The Engine creates a local version for every location — with its own budget and its own geographic targeting." },
        { heading: "Channels from one pipeline", body: "Meta, display and out-of-home (pDOOH) from a single control panel. No separate contracts, no separate reports." },
        { heading: "Results measured per location", body: "Every media euro is measured. You see which location delivers and which campaign is worth repeating." },
      ],
      bullets: ["Per-location campaigns", "Local targeting and budget", "Meta + display + pDOOH", "Results per location", "Less manual work"],
    },
  },
  {
    slug: "markkinointi-kiinteistonvalitys",
    image: "/images/services-gen/markkinointi-kiinteistonvalitys.webp",
    icon: "home_work",
    fi: {
      title: "Kiinteistönvälityksen markkinointi",
      metaTitle: "Kiinteistönvälityksen markkinointi | NØRR3 Helsinki",
      metaDescription: "Kiinteistönvälitysyritysten markkinointi: jokainen kohde ja alue saa oman kampanjansa automaattisesti — NØRR3 Marketing Engine.",
      heroLeft: "Jokainen kohde,",
      heroAccent: "oma kampanjansa",
      intro: "Asuntoja on kymmeniä ja alueita yhtä monta. Marketing Engine rakentaa jokaiselle kohteelle ja alueelle oman kampanjansa datasta — ilman että kukaan toistaa työtä käsin.",
      sections: [
        { heading: "Kohde- ja aluekampanjat automaattisesti", body: "Myytävät kohteet vaihtuvat viikoittain. Engine synkronoi kohteet datasta ja luo kampanjat niiden ympärille automaattisesti." },
        { heading: "Näkyvyys siellä missä ostajat ovat", body: "Kohdennus alueen, kiinnostuksen ja elämäntilanteen mukaan — Meta, display ja ulkomainonta samasta paneelista." },
        { heading: "Näkyvyydestä kauppaan", body: "Mittaat, mikä näkyvyys tuottaa yhteydenottoja ja kauppoja — ja skaalaat sen, mikä toimii." },
      ],
      bullets: ["Kohdekohtaiset kampanjat", "Alueellinen kohdennus", "Automaattinen aineistotuotanto", "Meta + display + pDOOH", "Myyntiin asti mitattuna"],
    },
    en: {
      title: "Real Estate Marketing",
      metaTitle: "Real Estate Marketing | NØRR3 Helsinki",
      metaDescription: "Marketing for real estate brokerages: every listing and every area gets its own campaign automatically — NØRR3 Marketing Engine.",
      heroLeft: "Every listing,",
      heroAccent: "its own campaign",
      intro: "Dozens of listings, just as many areas. The Marketing Engine builds a campaign for every listing and area from data — without anyone repeating the work by hand.",
      sections: [
        { heading: "Listing and area campaigns, automatically", body: "Listings change weekly. The Engine syncs them from data and builds campaigns around them automatically." },
        { heading: "Visibility where the buyers are", body: "Targeting by area, interest and life stage — Meta, display and out-of-home from one panel." },
        { heading: "From visibility to a sale", body: "You measure which visibility produces enquiries and sales — and scale what works." },
      ],
      bullets: ["Per-listing campaigns", "Area targeting", "Automated creative production", "Meta + display + pDOOH", "Measured down to a sale"],
    },
  },
  {
    slug: "markkinointi-vahittaiskauppa",
    image: "/images/services-gen/markkinointi-vahittaiskauppa.webp",
    icon: "storefront",
    fi: {
      title: "Vähittäiskaupan markkinointi",
      metaTitle: "Vähittäiskaupan markkinointi ketjuille | NØRR3 Helsinki",
      metaDescription: "Vähittäiskauppaketjujen markkinointi: sama tarjous jokaisessa myymälässä, paikallisesti kohdennettuna — NØRR3 Marketing Engine.",
      heroLeft: "Sama tarjous,",
      heroAccent: "jokaisessa myymälässä",
      intro: "Tarjous on sama, mutta asiakas on eri jokaisessa kaupungissa. Marketing Engine jalkauttaa kampanjan jokaiseen myymälään paikallisella kohdennuksella ja omalla budjetilla.",
      sections: [
        { heading: "Kampanja kerran, myymälöihin automaattisesti", body: "Rakenna kampanja kerran. Engine monistaa sen jokaiselle myymälälle — oikealla viestillä, oikealla alueella." },
        { heading: "Tarjous ja tuotteet datasta", body: "Syötteet päivittävät mainokset automaattisesti: hinta, saatavuus ja tarjous pysyvät aina ajan tasalla." },
        { heading: "Käynti myymälään", body: "Mittaamme mainonnasta myymäläkäyntiin — ja siirrämme budjettia sinne, mikä tuo asiakkaita." },
      ],
      bullets: ["Myymäläkohtaiset kampanjat", "Syötepohjaiset, ajantasaiset aineistot", "Paikallinen kohdennus", "Meta + display + pDOOH", "Myymäläkäyntiin asti mitattuna"],
    },
    en: {
      title: "Retail Marketing",
      metaTitle: "Retail Marketing for Chains | NØRR3 Helsinki",
      metaDescription: "Marketing for retail chains: the same offer in every store, locally targeted — NØRR3 Marketing Engine.",
      heroLeft: "The same offer,",
      heroAccent: "in every store",
      intro: "The offer is the same, but the customer differs in every city. The Marketing Engine rolls the campaign out to every store with local targeting and its own budget.",
      sections: [
        { heading: "Built once, into every store automatically", body: "Build the campaign once. The Engine multiplies it to every store — the right message, in the right area." },
        { heading: "Offers and products from data", body: "Feeds update the ads automatically: price, availability and offer stay current." },
        { heading: "Footfall in the store", body: "We measure from ad to store visit — and shift budget toward what brings customers in." },
      ],
      bullets: ["Per-store campaigns", "Feed-based, always-current creatives", "Local targeting", "Meta + display + pDOOH", "Measured to store visit"],
    },
  },
  {
    slug: "markkinointi-autoliikkeet",
    image: "/images/services-gen/markkinointi-autoliikkeet.webp",
    icon: "directions_car",
    fi: {
      title: "Autoliikkeiden markkinointi",
      metaTitle: "Autoliikkeiden ja -ketjujen markkinointi | NØRR3 Helsinki",
      metaDescription: "Autoliikkeiden markkinointi: malli- ja toimipistekohtaiset kampanjat yhdestä alustasta — NØRR3 Marketing Engine.",
      heroLeft: "Mallisto,",
      heroAccent: "toimipisteittäin",
      intro: "Jokaisella toimipisteellä on oma varasto ja oma alue. Marketing Engine luo mallisto- ja toimipistekohtaiset kampanjat datasta — ja kohdentaa ne ostajille lähellä.",
      sections: [
        { heading: "Varasto näkyy mainoksissa", body: "Vaihtuva varasto päivittyy kampanjoihin automaattisesti — oikea auto, oikealle ostajalle." },
        { heading: "Paikallinen kysyntä", body: "Kohdennus toimipisteen vaikutusalueelle ja kiinnostuksen mukaan — uudet autot, vaihtoautot ja huolto." },
        { heading: "Yhteydenotosta koeajoon", body: "Mittaamme mainonnasta yhteydenottoon ja koeajoon — ja optimoimme sen mukaan." },
      ],
      bullets: ["Mallistokohtaiset kampanjat", "Varastosyötteet", "Toimipistekohtainen kohdennus", "Meta + display + pDOOH", "Yhteydenottoon asti mitattuna"],
    },
    en: {
      title: "Automotive Marketing",
      metaTitle: "Automotive Dealer and Group Marketing | NØRR3 Helsinki",
      metaDescription: "Marketing for car dealers: model- and location-specific campaigns from one platform — NØRR3 Marketing Engine.",
      heroLeft: "The lineup,",
      heroAccent: "per location",
      intro: "Every location has its own stock and its own area. The Marketing Engine builds model- and location-specific campaigns from data — targeted at buyers nearby.",
      sections: [
        { heading: "Stock shows in the ads", body: "Changing stock updates into the campaigns automatically — the right car, to the right buyer." },
        { heading: "Local demand", body: "Targeting to the location's catchment area and interest — new cars, used cars and service." },
        { heading: "From enquiry to test drive", body: "We measure from ad to enquiry and test drive — and optimise accordingly." },
      ],
      bullets: ["Model-specific campaigns", "Stock feeds", "Per-location targeting", "Meta + display + pDOOH", "Measured to enquiry"],
    },
  },
  {
    slug: "markkinointi-franchising",
    image: "/images/services-gen/markkinointi-franchising.webp",
    icon: "store",
    fi: {
      title: "Franchising-ketjujen markkinointi",
      metaTitle: "Franchising-ketjujen markkinointi | NØRR3 Helsinki",
      metaDescription: "Franchising-ketjujen markkinointi: yksi brändi, paikallinen toteutus jokaiselle yrittäjälle — NØRR3 Marketing Engine.",
      heroLeft: "Yksi brändi,",
      heroAccent: "monta yrittäjää",
      intro: "Franchisingissa brändi on yhteinen, mutta jokainen yrittäjä tarvitsee oman paikallisen näkyvyytensä. Marketing Engine pitää brändin yhtenäisenä ja tekee toteutuksesta paikallisen.",
      sections: [
        { heading: "Yhtenäinen brändi, paikallinen toteutus", body: "Keskus rakentaa brändin ja mallin; Engine monistaa sen jokaiselle yrittäjälle paikallisella kohdennuksella." },
        { heading: "Budjetti ja näkyvyys oikeudenmukaisesti", body: "Jokainen toimipiste saa sovitun budjetin ja oman alueensa näkyvyyden — läpinäkyvästi." },
        { heading: "Tulokset keskukselle ja yrittäjälle", body: "Keskus näkee kokonaisuuden, yrittäjä oman toimipisteensä. Yksi järjestelmä, kaksi näkymää." },
      ],
      bullets: ["Yhtenäinen brändi", "Paikallinen toteutus", "Toimipistekohtaiset budjetit", "Keskus- ja yrittäjänäkymät", "Läpinäkyvä raportointi"],
    },
    en: {
      title: "Franchise Marketing",
      metaTitle: "Franchise Chain Marketing | NØRR3 Helsinki",
      metaDescription: "Marketing for franchise chains: one brand, local execution for every owner — NØRR3 Marketing Engine.",
      heroLeft: "One brand,",
      heroAccent: "many owners",
      intro: "In franchising the brand is shared, but every owner needs their own local visibility. The Marketing Engine keeps the brand consistent and makes the execution local.",
      sections: [
        { heading: "One brand, local execution", body: "The centre builds the brand and template; the Engine multiplies it to every owner with local targeting." },
        { heading: "Budget and visibility, fairly", body: "Every location gets its agreed budget and its own area's visibility — transparently." },
        { heading: "Results for the centre and the owner", body: "The centre sees the whole, the owner sees their location. One system, two views." },
      ],
      bullets: ["One consistent brand", "Local execution", "Per-location budgets", "Centre and owner views", "Transparent reporting"],
    },
  },
  {
    slug: "marketing-engine-alusta",
    image: "/images/services-gen/marketing-engine-alusta.webp",
    icon: "rocket_launch",
    fi: {
      title: "Marketing Engine -alusta",
      metaTitle: "Marketing Engine -alusta — monikanavainen markkinoinnin automaatio | NØRR3",
      metaDescription: "Marketing Engine -alusta: white-label-markkinoinnin automaatio monitoimipaikkaisille yrityksille ja partneritoimistoille — lisensoi moottori.",
      heroLeft: "Lisensoi moottori,",
      heroAccent: "jokaiselle toimialalle",
      intro: "Marketing Engine on alusta, jonka lisensoit — ei kertaluonteinen projekti. Monitoimipaikkainen markkinointi Metaan, displayhin ja ulkomainontaan yhdestä ohjauspaneelista, white-labelina.",
      sections: [
        { heading: "Yksi alusta, monta toimialaa", body: "Hammashoito, kiinteistönvälitys, vähittäiskauppa, autokauppa, franchising — uuden toimialan käyttöönotto on datasyöttö, ei koodia." },
        { heading: "White-label omalla brändilläsi", body: "Brändivärit, fontit ja tekstit omaksesi. Engine näyttää sinun tuotteeltasi." },
        { heading: "Partneritoimistoille", body: "Lisensoi moottori omille asiakkaillesi ja laskuta oma marginaalisi. Skaalaa ilman omaa kehitystiimiä." },
      ],
      bullets: ["Monikanavainen (Meta, display, pDOOH)", "White-label omalla brändillä", "Toimialakohtaiset seed-paketit", "Roolipohjaiset käyttöoikeudet", "Lisenssimalli"],
    },
    en: {
      title: "Marketing Engine Platform",
      metaTitle: "Marketing Engine Platform — Multi-channel Marketing Automation | NØRR3",
      metaDescription: "The Marketing Engine platform: white-label marketing automation for multi-location businesses and partner agencies — license the engine.",
      heroLeft: "License the engine,",
      heroAccent: "for every vertical",
      intro: "The Marketing Engine is a platform you license — not a one-off project. Multi-location marketing across Meta, display and out-of-home from one control panel, white-label.",
      sections: [
        { heading: "One platform, many verticals", body: "Dental, real estate, retail, automotive, franchising — onboarding a new vertical is a data seed, not code." },
        { heading: "White-label, your brand", body: "Brand colours, fonts and copy made yours. The Engine looks like your product." },
        { heading: "For partner agencies", body: "License the engine to your own clients and bill your own margin. Scale without your own dev team." },
      ],
      bullets: ["Multi-channel (Meta, display, pDOOH)", "White-label, your brand", "Vertical seed packs", "Role-based access", "Licensing model"],
    },
  },];

export function servicePageFor(slug: string): ServicePage | undefined {
  return servicePages.find((p) => p.slug === slug);
}

export function servicePageLocalised(page: ServicePage, locale: Locale) {
  return page[locale];
}
