import React, { useState } from 'react';
import { 
  Users, Wrench, ShieldCheck, CheckCircle2, X, Sparkles, 
  ChevronRight, Info, Compass, Heart, Award, Check
} from 'lucide-react';

interface TrustGalleryProps {
  onOpenBooking: () => void;
  language: 'de' | 'en';
}

interface GalleryItem {
  id: string;
  category: 'team' | 'equipment';
  nameDe: string;
  nameEn: string;
  roleDe: string;
  roleEn: string;
  shortDescDe: string;
  shortDescEn: string;
  longDescDe: string;
  longDescEn: string;
  certificationDe: string;
  certificationEn: string;
  badgeDe: string;
  badgeEn: string;
  imageUrl: string;
  tipDe: string;
  tipEn: string;
  specsDe?: string[];
  specsEn?: string[];
}

const TRUST_ITEMS: GalleryItem[] = [
  {
    id: 'team-emma',
    category: 'team',
    nameDe: 'Emmanuel Isodje',
    nameEn: 'Emmanuel Isodje',
    roleDe: 'Gründerin & Geschäftsführerin',
    roleEn: 'Founder & Managing Director',
    shortDescDe: 'Über 15 Jahre Branchenerfahrung. Koordiniert das Team mit Herz, Empathie und absolutem Qualitätsfokus.',
    shortDescEn: 'Over 15 years of industry experience. Coordinates the team with heart, empathy and absolute quality focus.',
    longDescDe: 'Emma gründete das Emmasco Reinigungsteam, um haushaltsnahe Unterstützung mit familiärer Nestwärme zu vereinen. Als ausgebildete Hauswirtschaftsleiterin und expertin für Pflege-Entlastungsleistungen (§45a SGB XI) berät sie Berliner Familien auch persönlich bei der Kassenabrechnung.',
    longDescEn: 'Emma founded the Emmasco Cleaning Team to combine household assistance with familial warmth. As a qualified home economics manager and expert in care relief services (§45a SGB XI), she also personally advises Berlin families on health insurance billing.',
    certificationDe: 'Zertifizierte Pflegeberaterin & Hauswirtschaftsleiterin',
    certificationEn: 'Certified Care Consultant & Housekeeping Manager',
    badgeDe: 'Gründerin',
    badgeEn: 'Founder',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Mein Lieblings-Umwelttipp: Ein kleiner Schuss biologischer Apfelessig im Wischwasser löst Kalk streifenfrei auf Fenstern und schont die Raumluft vollkommen!',
    tipEn: 'My favorite eco-tip: A small splash of organic apple cider vinegar in the washing water dissolves limescale streak-free on windows and preserves the room air completely!',
    specsDe: ['15+ Jahre Erfahrung', 'Spezialistin für SGB XI Abrechnungen', 'Persönliche Erstberatung vor Ort'],
    specsEn: ['15+ Years Experience', 'Specialist in SGB XI Direct Billing', 'Personal initial on-site consultation']
  },
  {
    id: 'team-marcus',
    category: 'team',
    nameDe: 'Marcus Becker',
    nameEn: 'Marcus Becker',
    roleDe: 'Leiter Alltagsbegleitung & Seniorenbetreuung',
    roleEn: 'Head of Senior Companionship & Care Assistance',
    shortDescDe: 'Ausgebildeter Alltagsbegleiter nach §45b SGB XI. Liebt es, Lebensqualität und Lächeln zurückzubringen.',
    shortDescEn: 'Trained companion according to §45b SGB XI. Loves bringing back quality of life and smiles to our seniors.',
    longDescDe: 'Marcus leitet den Bereich für Alltagsbegleitung und Seniorenhilfe. Mit viel Geduld, Humor und Feingefühl begleitet er Senioren zum Arzt, hilft bei Besorgungen oder führt tiefgründige Gespräche bei Spaziergängen in Pankow und Prenzlauer Berg.',
    longDescEn: 'Marcus leads the companionship and senior support department. With plenty of patience, humor and empathy, he accompanies seniors to medical visits, assists with errands, or holds deep conversations during walks in Berlin.',
    certificationDe: 'Qualifizierter Alltagsbegleiter gem. § 45b SGB XI',
    certificationEn: 'Qualified Senior Companion acc. to § 45b SGB XI',
    badgeDe: 'Pflege-Experte',
    badgeEn: 'Care Expert',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Gedulds-Tipp: Bei der Alltagsbegleitung geht es nicht um Schnelligkeit, sondern um Präsenz. Ein ruhiges, aufmerksames Zuhören bewirkt oft mehr als jede Medizin.',
    tipEn: 'Patience tip: Companionship is not about speed, but presence. Quiet, attentive listening often does more than any medicine.',
    specsDe: ['Zertifiziert nach §45b', 'Erste-Hilfe-Ausbildung für Senioren', 'Spezialist für Demenzbegleitung'],
    specsEn: ['Certified acc. to §45b', 'Advanced Senior First Aid Training', 'Specialist in dementia companionship']
  },
  {
    id: 'team-sarah',
    category: 'team',
    nameDe: 'Sarah Lindemann',
    nameEn: 'Sarah Lindemann',
    roleDe: 'Spezialistin für Premium-Unterhaltsreinigung',
    roleEn: 'Premium Housekeeping & Sanitization Specialist',
    shortDescDe: 'Expertin für sensible Oberflächen, Parkettpflege und anspruchsvolle Privatwohnungen in Berlin.',
    shortDescEn: 'Expert for sensitive surfaces, parquet wood care, and demanding private apartments in Berlin.',
    longDescDe: 'Sarah liebt Ordnung und absolute Detailgenauigkeit. Sie ist hervorragend geschult auf modernste Wischsysteme und besitzt tiefes Wissen zur Werterhaltung edler Werkstoffe wie Marmor, Echtholz und empfindlicher Armaturen.',
    longDescEn: 'Sarah loves structure and absolute attention to detail. She is superbly trained in modern wiping systems and possesses deep knowledge on maintaining the value of noble materials like marble, genuine wood, and sensitive kitchen fittings.',
    certificationDe: 'Staatlich geprüfte Fachkraft für Gebäudereinigung',
    certificationEn: 'State-certified Housekeeping & Hygiene Expert',
    badgeDe: 'Hygiene-Profi',
    badgeEn: 'Hygiene Pro',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Sarahs Holz-Tipp: Echtholz-Parkett darf niemals nass, sondern immer nur nebelfeucht gewischt werden. Trocknen Sie empfindliche Kanten sofort ab, um Quellschäden zu meiden.',
    tipEn: 'Sarah’s Wood Tip: Real wood parquet floors should never be wiped wet, but only damp (mist-wet). Dry off delicate edges immediately to avoid swelling.',
    specsDe: ['Spezialistin für Naturstein', 'Zertifiziert für Desinfektionsschutz', '99% Kundenzufriedenheit'],
    specsEn: ['Specialist in Natural Stone & Marble', 'Certified for Disinfection Standards', '99% Customer Satisfaction Rating']
  },
  {
    id: 'equip-hepa',
    category: 'equipment',
    nameDe: 'HEPA-14 Profi-Rückensauger',
    nameEn: 'HEPA-14 Pro Backpack Vacuum',
    roleDe: 'Ausrüstung: Hochleistungs-Filtertechnik',
    roleEn: 'Equipment: High-Efficiency Filtering Tech',
    shortDescDe: 'Mobiles Rückensaugsystem mit HEPA H14 Schadstofffilter. Fängt 99,995 % aller Feinstäube und Allergene.',
    shortDescEn: 'Mobile backpack vacuum system with HEPA H14 medical-grade filter. Traps 99.995% of fine dust & allergens.',
    longDescDe: 'Unsere kabellosen Rücken-Schwebstoffsauger garantieren maximale Bewegungsfreiheit und erstklassige Saugergebnisse. Dank der vierstufigen HEPA H14 Filterung wird die Ausblasluft medizinisch rein gesäubert. Optimal für Asthmatiker, Allergiker und Haushalte mit Babys.',
    longDescEn: 'Our cordless backpack particulate vacuums guarantee maximum mobility and first-class suction. Thanks to the four-stage HEPA H14 filtration, the exhaust air is purified to medical-grade cleanliness. Ideal for asthmatics, allergy sufferers, and households with infants.',
    certificationDe: 'HEPA-H14 DIN EN 1822 Allergiker-Zertifikat',
    certificationEn: 'HEPA-H14 DIN EN 1822 Allergy-Safe Certification',
    badgeDe: 'Allergiker-Sicher',
    badgeEn: 'Allergy-Safe',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Technik-Vorteil: Herkömmliche Sauger wirbeln Feinstaub oft nur auf. Unsere HEPA-Systeme sperren Milbenkot und Pollen dauerhaft im Filter ein für langanhaltende Luftreinheit.',
    tipEn: 'Tech Benefit: Traditional vacuums often stir up fine dust. Our HEPA systems lock mite allergens and pollen permanently in the filter for long-lasting air purity.',
    specsDe: ['4-stufiger HEPA H14 Filter', '62 dB superleiser Flüsterbetrieb', 'Bürstenlose Saugkraft für Tierhaare'],
    specsEn: ['4-Stage HEPA H14 Filter', '62 dB Super-quiet Whisper Mode', 'Brushless Suction optimized for pet hair']
  },
  {
    id: 'equip-steam',
    category: 'equipment',
    nameDe: 'Vapor-Trockendampfsystem 4.5 Bar',
    nameEn: 'Vapor Dry-Steam System 4.5 Bar',
    roleDe: 'Ausrüstung: Ökologische Tiefendesinfektion',
    roleEn: 'Equipment: Ecological Deep Disinfection',
    shortDescDe: 'Schnittstelle für 140°C heißen Trockendampf. Beseitigt 99,99% aller Keime rein ökologisch ohne Chemie.',
    shortDescEn: 'Interface for 140°C dry micro-steam. Destroys 99.99% of bacteria and viruses purely organically.',
    longDescDe: 'Mit unserem professionellen Trockendampfreiniger desinfizieren wir Bäder, Fugen und Küchen vollkommen ohne abrasive Reinigungschemie. Der extrem heiße Dampf besitzt einen sehr geringen Feuchtigkeitsanteil und reinigt porentief, umweltfreundlich und materialschonend.',
    longDescEn: 'With our professional dry steam cleaner, we sanitize bathrooms, tile grouts, and kitchens completely without abrasive cleaning chemicals. The extremely hot micro-steam has very low water content and cleans deep into pores, being eco-friendly and gentle on surfaces.',
    certificationDe: 'Zertifizierte chemiefreie Thermodesinfektion',
    certificationEn: 'Certified Chemical-Free Thermal Disinfection',
    badgeDe: '100% Ökologisch',
    badgeEn: '100% Eco-Friendly',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Sicherheits-Vorteil: Trockendampf hinterlässt keinerlei Seifenrückstände, an denen sich neuer Schmutz anhaften könnte. Böden bleiben dadurch messbar länger sauber und keimfrei.',
    tipEn: 'Safety Advantage: Dry steam leaves no sticky soap residues where new dirt could easily attach. Floors remain measurably cleaner and sanitized for longer.',
    specsDe: ['140°C Mikrodampf-Temperatur', '4,5 Bar Hochdruckreinigung', 'Perfekt für tiefgehende Fugenreinigung'],
    specsEn: ['140°C Micro-steam Core Temp', '4.5 Bar Saturated High Pressure', 'Excellent for deep tile grout whitening']
  },
  {
    id: 'equip-colors',
    category: 'equipment',
    nameDe: 'Farbechtes 4-Zonen Microfaser-System',
    nameEn: 'Color-Coded 4-Zone Microfiber System',
    roleDe: 'Ausrüstung: Kreuzkontaminationsschutz',
    roleEn: 'Equipment: Cross-Contamination Barrier',
    shortDescDe: 'Streng getrennte Farbcodes für jede Zone (Rot für WCs, Blau für Glas, Gelb für Sanitär, Grün für Küche).',
    shortDescEn: 'Strictly separated color routing for individual zones (Red for toilets, Blue for glass, Yellow for bath, Green for kitchen).',
    longDescDe: 'Um die Übertragung von Keimen auszuschließen, nutzen wir ein striktes Farbleitsystem. Tücher, die im Sanitärbereich verwendet werden, kommen niemals mit Ihren Küchenoberflächen oder Couchmöbeln in Kontakt. Jedes Tuch wird nach dem Einsatz bei 95°C desinfizierend gewaschen.',
    longDescEn: 'To completely rule out the transfer of bacteria, we utilize a strict color guidance routing system. Towels used in toilets never touch kitchen tables or living area sofas. Every microfiber cloth is sanitizingly washed at 95°C after a single use.',
    certificationDe: 'Hygiene-Standard HACCP Konformität',
    certificationEn: 'HACCP Food Safety Standard Compliant',
    badgeDe: 'Streng Hygienisch',
    badgeEn: 'Strict Hygiene',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=500',
    tipDe: 'Hygiene-Vorteil: Unser Team wechselt die Tücher für jeden einzelnen Kundenhaushalt und jede Zone strikt aus. Das verhindert die Verschleppung von Keimen zu 100%.',
    tipEn: 'Hygiene Plus: Our team strictly swaps all towels for every single household and room zone. This stops the spread of microscopic pathogens by 100%.',
    specsDe: ['Ultra-Dichte 320g/m² Mikrofaser', 'Getrennte Eimer- und Tuchsysteme', 'Desinfizierende Wäsche bei 95°C'],
    specsEn: ['Ultra-dense 320g/m² microfiber', 'Completely separate bucket systems', 'Sanitized high-temp laundering at 95°C']
  }
];

export default function TrustGallery({ onOpenBooking, language }: TrustGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'team' | 'equipment'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const isDe = language === 'de';

  const filteredItems = TRUST_ITEMS.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <section className="py-20 bg-[#F6FAFF] border-t border-blue-50 relative overflow-hidden" id="trust-gallery-section">
      {/* Decorative Background Accents */}
      <div className="absolute top-1/4 -left-36 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-1/4 -right-36 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3 mb-12">
          <span className="trust-badge-minimal">
            {isDe ? 'Qualität & Vertrauen zum Anfassen' : 'Tangible Quality & Trust'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isDe ? 'Unser Team & professionelle Ausrüstung' : 'Our Team & Professional Equipment'}
          </h2>
          <p className="text-gray-500 text-sm font-semibold leading-relaxed">
            {isDe 
              ? 'Lernen Sie die Menschen kennen, die Ihr Zuhause zum Strahlen bringen, und erfahren Sie mehr über unsere hochmoderne Technik, die für maximale Hygiene und Werterhalt sorgt.'
              : 'Meet the dedicated hands that make your home shine, and explore our state-of-the-art equipment designed for maximum hygiene and sensitive surface care.'}
          </p>
        </div>

        {/* Filter Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 p-1.5 rounded-2xl border border-blue-100/50 shadow-sm flex gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-[#0056D6] text-white shadow-sm'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {isDe ? 'Alle zeigen' : 'Show All'}
            </button>
            <button
              onClick={() => setActiveFilter('team')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'team'
                  ? 'bg-[#0056D6] text-white shadow-sm'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {isDe ? 'Unser Team' : 'Our Team'}
            </button>
            <button
              onClick={() => setActiveFilter('equipment')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'equipment'
                  ? 'bg-[#0056D6] text-white shadow-sm'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              {isDe ? 'Ausrüstung & Technik' : 'Equipment & Tech'}
            </button>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        <div id="gallery-anchor" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl border border-blue-50/60 hover:border-blue-150 shadow-[0_4px_15px_rgba(0,86,214,0.02)] hover:shadow-[0_15px_35px_rgba(0,86,214,0.08)] transition-all duration-300 overflow-hidden text-left flex flex-col justify-between cursor-pointer transform hover:scale-105"
            >
              {/* Image with Category Tag */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={isDe ? item.nameDe : item.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                
                {/* Custom Badge */}
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[#0056D6] font-extrabold text-[10px] uppercase py-1 px-3 rounded-full shadow-sm tracking-wider flex items-center gap-1">
                  {item.category === 'team' ? <Users className="w-3 h-3 text-blue-500" /> : <Wrench className="w-3 h-3 text-[#2FB5FF]" />}
                  {isDe ? item.badgeDe : item.badgeEn}
                </span>

                {/* Overlaid Info Icon */}
                <span className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full transition-all text-white">
                  <Info className="w-4 h-4" />
                </span>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black tracking-widest text-[#2FB5FF] uppercase">
                    {isDe ? item.roleDe : item.roleEn}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-850 group-hover:text-[#0056D6] transition-colors">
                    {isDe ? item.nameDe : item.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {isDe ? item.shortDescDe : item.shortDescEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {isDe ? 'Zertifizierter Standard' : 'Certified Standard'}
                  </span>
                  <span className="text-xs font-black text-[#0056D6] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    {isDe ? 'Details' : 'Details'}
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* trust guarantee micro footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white border border-blue-50 px-6 py-4 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] text-xs text-slate-650 font-semibold max-w-3xl mx-auto">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isDe ? 'Hygienische Desinfektionsgarantie' : 'Hygienic Disinfection Guarantee'}
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isDe ? '100% Polizeilich geprüftes Personal' : '100% Background-Checked Staff'}
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isDe ? 'Allergikerfreundliche Reinigungsmethoden' : 'Allergen-Safe Wiping Systems'}
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Expandable Overlay Modal Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-blue-50 shadow-2xl overflow-hidden max-w-2xl w-full text-left relative flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
            
            {/* Left side Image with badges */}
            <div className="w-full md:w-5/12 relative bg-slate-100 h-48 md:h-auto min-h-[220px]">
              <img
                src={selectedItem.imageUrl}
                alt={isDe ? selectedItem.nameDe : selectedItem.nameEn}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2FB5FF] block mb-0.5">
                  {isDe ? selectedItem.roleDe : selectedItem.roleEn}
                </span>
                <h4 className="text-lg font-black leading-tight">
                  {isDe ? selectedItem.nameDe : selectedItem.nameEn}
                </h4>
              </div>

              {/* Close Button on Mobile */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-slate-800 md:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Right side details content */}
            <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[calc(90vh-220px)] md:max-h-[550px]">
              
              {/* Close Button on Desktop */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-150 p-2 rounded-full text-gray-500 hidden md:block cursor-pointer transition-colors"
                aria-label="Schließen"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex flex-col gap-4">
                
                {/* Certification Flag */}
                <div className="flex items-start gap-2 bg-[#F6FAFF] border border-blue-50 p-3 rounded-2xl">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                      {isDe ? 'Qualitätszertifikat' : 'Quality Certificate'}
                    </span>
                    <span className="text-xs font-extrabold text-blue-900 leading-snug">
                      {isDe ? selectedItem.certificationDe : selectedItem.certificationEn}
                    </span>
                  </div>
                </div>

                {/* Long description text */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">
                    {isDe ? 'Überblick & Details' : 'Overview & Details'}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {isDe ? selectedItem.longDescDe : selectedItem.longDescEn}
                  </p>
                </div>

                {/* Key specs bullet list */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                    {isDe ? 'Sicherheitsmerkmale' : 'Safety Features'}
                  </h5>
                  <div className="flex flex-col gap-1.5">
                    {(isDe ? selectedItem.specsDe : selectedItem.specsEn)?.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-750">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expert tip/advice box */}
                <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 flex items-center gap-1">
                    {selectedItem.category === 'team' ? <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                    {isDe ? 'Empfehlung für Sie' : 'Pro Recommendation'}
                  </span>
                  <p className="text-xs text-amber-900 italic mt-1 font-semibold leading-relaxed">
                    {isDe ? selectedItem.tipDe : selectedItem.tipEn}
                  </p>
                </div>

              </div>

              {/* Call to action inside modal */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-extrabold text-center cursor-pointer transition text-slate-750"
                >
                  {isDe ? 'Schließen' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    onOpenBooking();
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold text-center cursor-pointer transition shadow-sm"
                >
                  {isDe ? 'Einsatz anfragen' : 'Request Service'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
