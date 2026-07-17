/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, BlogArticle, Testimonial, FAQItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'haushaltshilfe',
    title: 'Haushaltshilfe',
    category: 'haushalt',
    description: 'Unterstützung beim Aufräumen, Spülen, Wäsche bügeln und der allgemeinen Organisation Ihres Zuhauses.',
    detailedDescription: 'Unser Haushaltspflegedienst sorgt für Struktur und Glanz in Ihren vier Wänden. Wir übernehmen das Bettenbeziehen, die Wäschepflege, Bügelarbeiten sowie allgemeine Reinigungs- und Aufräumarbeiten. Abrechenbar direkt über die Pflegekasse dank §45a SGB XI Anerkennung.',
    price: 'Abrechnung über Pflegekasse (§45a SGB XI / Entlastungsbetrag)',
    priceValue: 29.90,
    iconName: 'Home',
    isPopular: true
  },
  {
    id: 'reinigung',
    title: 'Unterhaltsreinigung',
    category: 'reinigung',
    description: 'Regelmäßige, professionelle Reinigung Ihrer Wohnräume für ein stets frisches und hygienisches Wohngefühl.',
    detailedDescription: 'Wir reinigen Böden, Oberflächen, Sanitäranlagen und Küchen gründlich und im gewünschten Intervall (wöchentlich, zweiwöchentlich). Für ein staubfreies und glänzendes Zuhause mit Premium-Anspruch.',
    price: 'Individuelles Angebot',
    priceValue: 34.90,
    iconName: 'Sparkles',
    isPopular: false
  },
  {
    id: 'einkaufshilfe',
    title: 'Einkaufshilfe',
    category: 'haushalt',
    description: 'Einkaufen von Lebensmitteln, Holen von Medikamenten und Erledigung wichtiger Besorgungen des Alltags.',
    detailedDescription: 'Wir planen mit Ihnen den Wocheneinkauf, kaufen frische Lebensmittel, holen Ihre Rezepte sowie Medikamente aus der Apotheke und bringen alles sicher zu Ihnen nach Hause. Gerne begleiten wir Sie auch beim Einkauf.',
    price: 'Abrechnung über Pflegekasse (§45a SGB XI / Entlastungsbetrag)',
    priceValue: 28.50,
    iconName: 'ShoppingCart',
    isPopular: false
  },
  {
    id: 'alltagsbegleitung',
    title: 'Alltagsbegleitung',
    category: 'begleitung',
    description: 'Herzliche Gesellschaft, Begleitung zu Arztterminen, Spaziergänge und gemeinsame Freizeitgestaltung.',
    detailedDescription: 'Alltagsbegleitung mit viel Empathie und Geduld. Wir lesen vor, führen anregende Gespräche, machen Spaziergänge an der frischen Luft oder begleiten Sie sicher zu Ihren Arzt- und Behördenterminen. Gut für Geist und Seele.',
    price: 'Abrechnung über Pflegekasse möglich (§45a SGB XI)',
    priceValue: 29.00,
    iconName: 'HeartHandshake',
    isPopular: true
  },
  {
    id: 'angehoerige',
    title: 'Entlastung für Angehörige',
    category: 'begleitung',
    description: 'Zuverlässige stundenweise Betreuung Ihres Liebsten, damit pflegende Angehörige sich beruhigt Auszeiten nehmen können.',
    detailedDescription: 'Pflege und Alltagsbetreuung erfordern viel Kraft. Wir übernehmen zuverlässig stundenweise die Alltagsbegleitung und Hauswirtschaft vor Ort, damit Sie als pflegender Angehöriger neue Energie tanken, eigenen Terminen nachgehen oder Freizeit genießen können.',
    price: 'Abrechnung über Entlastungsbetrag (§45a SGB XI)',
    priceValue: 31.50,
    iconName: 'UserCheck',
    isPopular: false
  },
  {
    id: 'fenster',
    title: 'Fensterreinigung',
    category: 'zusatz',
    description: 'Streifenfreier Glanz für Ihre Fenster, Rahmen und Glasflächen im privaten sowie gewerblichen Bereich.',
    detailedDescription: 'Unsere professionelle Glasreinigung reinigt Fenster, Fensterbänke, Rahmen und anspruchsvolle Glasfronten ohne Schlieren. Wir bringen alle benötigten Reinigungsmaterialien mit und arbeiten schnell wie gründlich.',
    price: 'Individuelles Angebot auf Anfrage',
    priceValue: 45.00,
    iconName: 'GlassWater',
    isPopular: false
  },
  {
    id: 'buero',
    title: 'Büroreinigung',
    category: 'zusatz',
    description: 'Professionelle Reinigung von Büros, Kanzleien und Gewerbeflächen für ein produktives Arbeitsklima.',
    detailedDescription: 'Sorgen Sie für einen glänzenden Eindruck bei Ihren Kunden und Mitarbeitern. Wir reinigen Schreibtische, Konferenzräume, sanitäre Anlagen und Küchenflächen diskret, pünktlich und nach zertifizierten Hygienestandards.',
    price: 'Individuelles Angebot',
    priceValue: 39.90,
    iconName: 'Briefcase',
    isPopular: false
  },
  {
    id: 'deepclean',
    title: 'Deep Cleaning (Frühjahrsputz)',
    category: 'reinigung',
    description: 'Intensive Grundreinigung bis in die kleinsten Winkel, ideal für Ein- oder Auszüge und Jahreszeitenwechsel.',
    detailedDescription: 'Unser Deep-Cleaning-Service befreit Ihr gesamtes Zuhause von hartnäckigem Schmutz, Kalk und Fettablagerungen. Wir säubern hinter Heizkörpern, im Ofen, entkalken die Dusche fachmännisch und bringen jeden Winkel zum Glänzen.',
    price: 'Individuelles Angebot',
    priceValue: 44.95,
    iconName: 'ShieldAlert',
    isPopular: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Margarete S. (82J.) & Tochter Marion',
    role: 'Privatkunde (Berlin-Pankow)',
    text: 'Die Alltagsbegleitung des Emmasco Teams ist ein Segen für uns. Frau Schmidt kommt wöchentlich, hilft im Haushalt und geht mit meiner Mutter spazieren. Alles wird direkt mit der Pflegekasse (§45a) abgerechnet. Äußerst zuverlässig und herzlich!',
    rating: 5,
    date: '12. Mai 2026'
  },
  {
    id: '2',
    name: 'Dr. Michael Wagner',
    role: 'Gewerbekunde (Zahnarztpraxis Berlin)',
    text: 'Wir beauftragen EMMASCO für unsere Praxisreinigung in der Schönhauser Allee. Die Pünktlichkeit und gründliche Reinigung nach den geforderten Hygienestandards sind tadellos. Kompetenter und freundlicher Ansprechpartner.',
    rating: 5,
    date: '30. April 2026'
  },
  {
    id: '3',
    name: 'Christian & Sabine Brand',
    role: 'Haushaltshilfe privat',
    text: 'Nach der Geburt unserer Zwillinge brauchten wir dringend Unterstützung im Haushalt. Die Haushaltshilfe von Emmasco hat uns gerettet. Von Wäsche waschen über Staubsaugen bis hin zur perfekten Ordnung – absolut empfehlenswert.',
    rating: 5,
    date: '15. März 2026'
  }
];

export const FAQs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'Was bedeutet die Anerkennung nach § 45a SGB XI?',
    answer: 'Als staatlich anerkannter Betreuungs- und Entlastungsdienst können wir unsere Leistungen direkt mit allen gesetzlichen und privaten Pflegekassen abrechnen. Wenn bei Ihnen oder Ihrem Angehörigen ein Pflegegrad (ab Pflegegrad 1) vorliegt, steht Ihnen ein monatlicher Entlastungsbetrag von 125 € zu. Diesen Betrag können Sie vollständig für unsere Haushaltshilfe, Einkaufshilfe und Alltagsbegleitung einsetzen.',
    category: 'allgemein'
  },
  {
    id: 'faq2',
    question: 'Sind Ihre Mitarbeiter versichert und qualifiziert?',
    answer: 'Selbstverständlich. Alle unsere Mitarbeiter im Reinigungsteam und in der Alltagsbegleitung sind vollumfänglich haftpflicht- und unfallversichert. Unser Personal nimmt zudem regelmäßig an Schulungen nach den SGB-Richtlinien teil, ist absolut diskret, freundlich und spricht fliesend Deutsch.',
    category: 'sicherheit'
  },
  {
    id: 'faq3',
    question: 'Wie hoch sind die Kosten und gibt es versteckte Gebühren?',
    answer: 'Bei uns herrscht absolute Preistransparenz. Unsere Stundenverrechnungssätze beginnen ab 28,50 € pro Stunde für qualifizierte Alltagsbegleitung und haushaltnahe Dienste im Rahmen des Entlastungsbetrags. Angebote für Glasreinigung, Büroreinigung und Sonderreinigungen kalkulieren wir fair und unverbindlich per Festpreis. Es gibt keine Mindestlaufzeiten oder versteckten Einrichtungspauschalen.',
    category: 'preise'
  },
  {
    id: 'faq4',
    question: 'Was passiert, wenn meine zugewiesene Kraft im Urlaub oder krank ist?',
    answer: 'Keine Sorge, Kontinuität ist uns wichtig. Im Krankheits- oder Urlaubsfall stellen wir Ihnen – nach vorheriger Absprache – eine qualifizierte und eingearbeitete Urlaubsvertretung aus unserem Team zur Seite, damit Sie keine Lücken in der Versorgung beklagen müssen.',
    category: 'allgemein'
  },
  {
    id: 'faq5',
    question: 'In welchen Stadtteilen von Berlin bieten Sie Ihre Dienste an?',
    answer: 'Unser Firmensitz liegt in Prenzlauer Berg (Schönhauser Allee). Wir bedienen Berlin-Mitte, Pankow, Prenzlauer Berg, Weißensee, Wedding, Friedrichshain, Kreuzberg, Schöneberg, Charlottenburg und angrenzende Bezirke im Norden und Osten Berlins. Senden Sie uns einfach Ihre Postleitzahl!',
    category: 'allgemein'
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'art1',
    title: 'Frühjahrsputz leicht gemacht: Strategie für ein staubfreies Zuhause',
    category: 'Cleaning Tips',
    excerpt: 'Mit dem richtigen Plan gelingt der Frühjahrsputz in kürzester Zeit. Erfahren Sie die besten Tipps unserer Reinigungsprofis.',
    content: `Ein gründlich sauberes Zuhause hebt die Stimmung und sorgt für ein gesundes Raumklima. Doch wer ohne Plan losputzt, verliert schnell die Übersicht und Motivation. Hier ist die ultimative Checkliste für einen effizienten Hausputz nach Profi-Art.

### 1. Von oben nach unten arbeiten
Fangen Sie immer oben an: Zuerst Spinnweben an der Decke entfernen, dann Lampen abstauben, Schrankoberseiten abwischen, und erst am Ende Tische reinigen und Staub saugen. Dadurch wird herabfallender Staub später einfach weggesaugt.

### 2. Sektionsprinzip anwenden
Konzentrieren Sie sich immer auf einen Raum oder eine Zone. Beenden Sie erst das Badezimmer, bevor Sie mit der Küche beginnen. Das gibt ein schnelles Erfolgsgefühl!

### 3. Profi-Mittel richtig einwirken lassen
Sprühen Sie Kalklöser im Bad auf und lassen Sie ihn mindestens 10 Minuten arbeiten, anstatt sofort zu schrubben. Die chemische Reaktion nimmt Ihnen 90 % der Arbeit ab.

### 4. Das richtige Mikrofasertuch nutzen
Nutzen Sie für Glasflächen spezielle, gewebte Glastücher, um Streifenbildung zu vermeiden. Für Fett in der Küche eignen sich gröbere Fasern mit biologischem Fettlöser.

Sollten Sie keine Zeit oder Kraft dafür finden, buchen Sie einfach unser **Deep Cleaning** Team. Wir übernehmen den kompletten Frühjahrsputz für Sie!`,
    author: 'Emma Osei, Geschäftsführung',
    date: '10. Mai 2026',
    readTime: '4 Min. Lesezeit',
    image: 'https://picsum.photos/seed/cleaning1/600/400',
    tags: ['Frühjahrsputz', 'Haushaltstipps', 'Ordnung']
  },
  {
    id: 'art2',
    title: 'Gesundes Altern: Alltagsunterstützung und seelische Gesundheit',
    category: 'Health',
    excerpt: 'Soziale Isolation ist im Alter ein großes Risiko. Wie Alltagsbegleitung nicht nur das Leben leichter, sondern auch glücklicher macht.',
    content: `Einsamkeit und körperliche Einschränkungen belasten viele Senioren. Häufig ziehen sie sich zurück, was die geistige Fitness und seelische Balance beeinträchtigen kann. Die haushaltsnahe Dienstleistung und Alltagsbegleitung nach § 45a SGB XI setzt genau hier an und bietet weit mehr als nur praktische Hilfe.

### Brücke gegen Einsamkeit
Eine herzliche Alltagsbegleitung bringt Struktur und Freude. Durch gemeinsame Gespräche bei einer Tasse Kaffee, das gemeinsame Backen oder Spaziergänge im Park wird das Gehirn angeregt, die Stimmung steigt, und Depression im Alter kann aktiv vorgebeugt werden.

### Erhalt der Selbstständigkeit im eigenen Heim
Der größte Wunsch der meisten Menschen ist es, bis ins hohe Alter in den eigenen vertrauten vier Wänden wohnen zu bleiben. Wenn das Bücken schwerfällt und das Einkaufen zur Last wird, hilft unsere Haushaltshilfe. Durch gezielte Entlastung und Aktivierung unterstützen wir Senioren dabei, ihr gewohntes Umfeld nicht aufgeben zu müssen.

### Entlastung der pflegenden Familienmitglieder
Angehörige, die Beruf, Familie und Pflege koordinieren, geraten oft an ihre Belastungsgrenzen. Eine externe stundenweise Hilfe schenkt wertvolle Freiräume, die ohne schlechtes Gewissen zur eigenen Erholung genutzt werden können.

Dank des monatlichen Entlastungsbetrags von 125 € der Pflegekasse (ab Pflegegrad 1) fallen für diese Dienste oft gar keine zusätzlichen privaten Kosten an!`,
    author: 'Dr. rer. med. Hans-Peter Beck',
    date: '28. April 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://picsum.photos/seed/caregivers/600/400',
    tags: ['Gesundheit im Alter', 'Alltagsbegleitung', 'SGB XI']
  },
  {
    id: 'art3',
    title: 'Wäschepflege wie im 5-Sterne-Hotel: Geheimnisse für perfekte Fasern',
    category: 'Lifestyle',
    excerpt: 'Vergraute Weißwäsche? Kratzige Handtücher? Unsere Experten verraten, wie Textilien jahrelang weich und strahlend bleiben.',
    content: `Wir verbringen Stunden mit dem Waschen, Trocknen und Bügeln unserer Kleidung. Trotzdem sehen Hemden oft schnell abgetragen aus, und die Handtücher fühlen sich an wie Schmirgelpapier. Mit diesen einfachen Kniffen waschen Sie künftig wie Profis:

### 1. Weniger Dosierung ist mehr
Das größte Missverständnis bei weicher Wäsche: Viel Waschmittel hilft viel. Das Gegenteil ist der Fall! Zu viel Waschmittel lagert sich in den Fasern ab, macht sie steif und zieht Schmutz an. Verwenden Sie maximal 2/3 der empfohlenen Menge.

### 2. Essig statt Weichspüler
Weichspüler legt einen Fettfilm über die Fasern, was die Saugfähigkeit von Handtüchern ruiniert. Geben Sie stattdessen einen kleinen Schuss haushaltsüblichen weißen Essig in das Weichspülerfach. Der Essig neutralisiert Kalk, wäscht sich rückstandslos aus und macht die Wäsche wunderbar weich – ganz ohne Essiggeruch!

### 3. Sortierung ist King
Waschen Sie raue Kleidungsstücke wie Jeans niemals mit empfindlichen Synthetikstoffen. Die Reibung im Waschgang schädigt die feinen Fasern und führt zum sogenannten Pilling (Knötchenbildung).

Unsere Haushaltshilfen achten bei der täglichen Wäscheversorgung in unseren Kundenhaushalten haargenau auf diese Feinheiten. Vertrauen Sie Ihre Lieblingsstücke gern den Profis an!`,
    author: 'Gabriele Becker, Hauswirtschaftsleiterin',
    date: '04. April 2026',
    readTime: '4 Min. Lesezeit',
    image: 'https://picsum.photos/seed/laundry/600/400',
    tags: ['Lifestyle', 'Wäschewaschen', 'Haushaltsorganisation']
  }
];

export const TIMELINE_EVENTS = [
  { year: '2021', title: 'Gründung in Berlin', text: 'Gründung des Emmasco Reinigungsteams durch Gründerin Emma Osei in Berlin-Pankow, zunächst spezialisiert auf anspruchsvolle Privatwohnungsreinigung.' },
  { year: '2022', title: 'Präqualifizierung & Kassen-Zertifikat', text: 'Erfolgreiche staatliche Anerkennung nach § 45a SGB XI. Damit können unsere Kunden die Leistungen über den Entlastungsbetrag direkt mit den Pflegekassen abrechnen.' },
  { year: '2023', title: 'Eröffnung Büro Prenzlauer Berg', text: 'Einzug in unser modernes Büro an der lebendigen Schönhauser Allee 163, Berlin-Prenzlauer Berg für eine bessere Erreichbarkeit und Koordination.' },
  { year: '2024', title: 'Erweiterung Alltagsbegleitung', text: 'Aufbau eines eigenen Bereichs für Senioren- und Alltagsbegleitung mit qualifizierten Alltagsbegleitern zur Förderung seelischer und sozialer Gesundheit.' },
  { year: '2025', title: 'Zertifizierung zur Klimaneutralität', text: 'Einführung von 100% ökologischen Reinigungsmitteln und Umstellung unseres Team-Fuhrparks auf moderne Elektrofahrzeuge.' },
  { year: '2026', title: 'Über 500 aktive Kunden', text: 'Etablierung als eine der führenden, familiengeführten Haushaltshilfen- und Reinigungsagenturen im Berliner Norden.' }
];

export const TEAM_MEMBERS = [
  {
    name: 'Emma Osei',
    role: 'Gründerin & Geschäftsführerin',
    bio: 'Mit über 15 Jahren Erfahrung in Hospitality und Pflege gründete sie EMMASCO, um haushaltsnahe Hilfe mit echter familiärer Empathie zu verknüpfen.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Marcus Becker',
    role: 'Leiter Alltagsbegleitung',
    bio: 'Ausgebildeter Alltagsbegleiter nach § 45b. Er koordiniert unsere Angebote für Senioren und pflegt engen Kontakt zu den Pflegekassen.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Gabriele Nowak',
    role: 'Bereichsleiterin Hauswirtschaft',
    bio: 'Sie leitet die Qualitätssicherung der Reinigungsangebote an und sorgt dafür, dass unser Team modernste, schonende Reinigungsmethoden einsetzt.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'EM-8342',
    customerName: 'Regina Keller',
    email: 'r.keller@web.de',
    phone: '0304729103',
    address: 'Kollwitzstraße 14, 10435 Berlin',
    serviceId: 'alltagsbegleitung',
    serviceName: 'Alltagsbegleitung',
    date: '2026-06-18',
    time: '14:00',
    status: 'confirmed',
    notes: 'Begleitung zum Hausarzt und anschließender kleiner Einkauf.',
    totalPrice: 58.00,
    createdAt: '2026-06-12 10:14'
  },
  {
    id: 'EM-9124',
    customerName: 'Dr. Michael Wagner',
    email: 'info@praxis-wagner.de',
    phone: '01729384729',
    address: 'Schönhauser Allee 82, 10439 Berlin',
    serviceId: 'buero',
    serviceName: 'Büroreinigung',
    date: '2026-06-19',
    time: '18:30',
    status: 'confirmed',
    notes: 'Regelmäßige Praxisreinigung wöchentlich. Schlüsselbox vorhanden.',
    totalPrice: 119.70,
    createdAt: '2026-06-14 09:30'
  },
  {
    id: 'EM-1025',
    customerName: 'Thomas Müller',
    email: 't.mueller@gmx.de',
    phone: '016394857291',
    address: 'Bornholmer Str. 12, 10439 Berlin',
    serviceId: 'deepclean',
    serviceName: 'Deep Cleaning (Frühjahrsputz)',
    date: '2026-06-21',
    time: '09:00',
    status: 'pending',
    notes: 'Einzugsreinigung für eine leere 3-Zimmer-Wohnung (80 qm).',
    totalPrice: 224.75,
    createdAt: '2026-06-15 15:45'
  }
];

export const COMPANY_VALUES = [
  { title: 'Herzlichkeit & Respekt', text: 'Wir behandeln jeden Kunden wie ein Familienmitglied – mit Würde, Geduld und echtem Lächeln.' },
  { title: 'Absolute Zuverlässigkeit', text: 'Pünktlichkeit und die exakte Einhaltung von Absprachen sind das Fundament unseres Erfolgs.' },
  { title: 'Transparente Ehrlichkeit', text: 'Keine versteckten Verträge, keine versteckten Kosten. Volle Abrechnungsklarheit für Pflegekassen und Privatkunden.' },
  { title: 'Höchste Hygiene', text: 'Professionell geschultes Personal, das modernste rückstandsfreie und hautverträgliche Verfahren anwendet.' }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal1',
    title: 'Badezimmer Grundreinigung',
    desc: 'Beseitigung von extremen Kalkablagerungen und Fugen-Verschmutzungen.',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=40&w=400',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=40&w=400'
  },
  {
    id: 'gal2',
    title: 'Unterhaltsreinigung Wohnzimmer',
    desc: 'Staubfreie Vitrinen und streifenfreie Holzböden nach Profi-Wischtechnik.',
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=40&w=400',
    after: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=40&w=400'
  },
  {
    id: 'gal3',
    title: 'Fenster- & Glasreinigung',
    desc: 'Spiegelblanke Scheiben und tadellos gesäuberte Rahmen außen.',
    before: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=40&w=400',
    after: 'https://images.unsplash.com/photo-1549558549-415fa4fc37eb?auto=format&fit=crop&q=40&w=400'
  }
];
