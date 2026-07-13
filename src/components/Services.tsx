/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, CheckCircle, ArrowRight, Heart, Sparkles, Home, ShoppingCart, 
  HeartHandshake, UserCheck, GlassWater, Briefcase, ShieldAlert, BadgeInfo,
  Star, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { Service } from '../types';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  commentDe: string;
  commentEn: string;
  verified: boolean;
}

const REVIEWS_DATA: Record<string, Review[]> = {
  haushaltshilfe: [
    {
      id: 'rev-h1',
      author: 'Erika L. (79J.)',
      rating: 5,
      date: '10. Mai 2026',
      commentDe: 'Frau Peters ist ein Goldschatz. Sie bügelt meine Wäsche perfekt und hat immer ein freundliches Wort für mich übrig.',
      commentEn: 'Mrs. Peters is a treasure. She irons my laundry perfectly and always has a kind word for me.',
      verified: true
    },
    {
      id: 'rev-h2',
      author: 'Dieter K. (Prenzlauer Berg)',
      rating: 5,
      date: '24. April 2026',
      commentDe: 'Toller Service! Alles läuft reibungslos über die Pflegekasse. Sehr unkomplizierte Organisation.',
      commentEn: 'Great service! Everything runs smoothly through the care fund. Very uncomplicated organization.',
      verified: true
    },
    {
      id: 'rev-h3',
      author: 'Familie Sommer',
      rating: 4,
      date: '08. April 2026',
      commentDe: 'Sehr entlastend für den Alltag mit Kindern. Die Organisation ist professionell und die Haushaltskraft ausgesprochen fleißig.',
      commentEn: 'Very relieving for daily life with children. The organization is professional and the housekeeper is extremely hard-working.',
      verified: true
    }
  ],
  reinigung: [
    {
      id: 'rev-r1',
      author: 'Andreas G. (Berlin-Mitte)',
      rating: 5,
      date: '15. Mai 2026',
      commentDe: 'Ich buche die Unterhaltsreinigung alle zwei Wochen. Die Reinigungskräfte sind pünktlich, gründlich und arbeiten extrem hygienisch.',
      commentEn: 'I book the maintenance cleaning every two weeks. The cleaning staff is punctual, thorough, and works extremely hygienically.',
      verified: true
    },
    {
      id: 'rev-r2',
      author: 'Sabine W.',
      rating: 5,
      date: '02. Mai 2026',
      commentDe: 'Zuverlässig und gründlich. Das Bad glänzt nach jedem Besuch und es riecht wunderbar frisch. Sehr zu empfehlen.',
      commentEn: 'Reliable and thorough. The bathroom shines after every visit and it smells wonderfully fresh. Highly recommended.',
      verified: true
    },
    {
      id: 'rev-r3',
      author: 'Frank M.',
      rating: 4,
      date: '18. April 2026',
      commentDe: 'Gute Arbeit. Gelegentlich wechselt die Kraft, aber das Ergebnis ist immer auf hohem Niveau.',
      commentEn: 'Good work. Occasionally the worker changes, but the result is always of a high standard.',
      verified: true
    }
  ],
  einkaufshilfe: [
    {
      id: 'rev-e1',
      author: 'Hildegard B. (84J.)',
      rating: 5,
      date: '12. Mai 2026',
      commentDe: 'Mein Begleiter bringt mir wöchentlich die schweren Einkäufe direkt in den 3. Stock und holt meine Rezepte in der Apotheke ab. Fantastisch!',
      commentEn: 'My companion brings me the heavy groceries directly to the 3rd floor weekly and retrieves my prescriptions from the pharmacy. Fantastic!',
      verified: true
    },
    {
      id: 'rev-e2',
      author: 'Marion S. (Tochter)',
      rating: 5,
      date: '28. April 2026',
      commentDe: 'Eine riesige Entlastung für uns alle. Mein Vater freut sich immer auf die Einkäufe und die netten Unterhaltungen.',
      commentEn: 'A huge relief for all of us. My father always looks forward to the grocery trips and the nice chats.',
      verified: true
    }
  ],
  alltagsbegleitung: [
    {
      id: 'rev-a1',
      author: 'Margarete S. (82J.)',
      rating: 5,
      date: '12. Mai 2026',
      commentDe: 'Die Alltagsbegleitung des Emmasco Teams ist ein Segen für uns. Frau Schmidt kommt wöchentlich, hilft im Haushalt und geht mit mir spazieren.',
      commentEn: 'The companion care of the Emmasco team is a blessing for us. Mrs. Schmidt comes weekly, helps around the house, and walks with me.',
      verified: true
    },
    {
      id: 'rev-a2',
      author: 'Hans-Joachim Z. (Berlin-Pankow)',
      rating: 5,
      date: '01. Mai 2026',
      commentDe: 'Sehr einfühlsame Betreuung. Die gemeinsamen Schachpartien und Gespräche tun mir unglaublich gut.',
      commentEn: 'Very empathetic care. The chess games and conversations we share do me an incredible amount of good.',
      verified: true
    },
    {
      id: 'rev-a3',
      author: 'Karin K. (Tochter)',
      rating: 5,
      date: '19. April 2026',
      commentDe: 'Pünktlich, gewissenhaft und unglaublich herzlich. Danke, dass Sie meiner Mutter so eine schöne Zeit bereiten.',
      commentEn: 'Punctual, conscientious, and incredibly warm. Thank you for giving my mother such a wonderful time.',
      verified: true
    }
  ],
  angehoerige: [
    {
      id: 'rev-an1',
      author: 'Christian B. (Berlin)',
      rating: 5,
      date: '14. Mai 2026',
      commentDe: 'Dank der stundenweisen Entlastung kann ich endlich wieder eigenen Erledigungen nachgehen, während meine Mutter bestens versorgt ist.',
      commentEn: 'Thanks to the hourly relief, I can finally run my own errands again while my mother is excellently cared for.',
      verified: true
    },
    {
      id: 'rev-an2',
      author: 'Brigitte T.',
      rating: 5,
      date: '04. Mai 2026',
      commentDe: 'Hervorragende Abstimmung und absolute Verlässlichkeit. Man merkt sofort die professionelle SGB-Grundausbildung der Betreuer.',
      commentEn: 'Excellent coordination and absolute reliability. You notice the professional SGB basic training of the caregivers immediately.',
      verified: true
    }
  ],
  fenster: [
    {
      id: 'rev-f1',
      author: 'Dr. Michael Wagner',
      rating: 5,
      date: '08. Mai 2026',
      commentDe: 'Streifenfreier Glanz an allen Praxis-Fenstern und Rahmen. Keine Flecken, pünktlicher Service und sehr saubere Arbeitsweise.',
      commentEn: 'Streak-free shine on all office windows and frames. No spots, punctual service, and very clean workflow.',
      verified: true
    },
    {
      id: 'rev-f2',
      author: 'Regine S. (Prenzlauer Berg)',
      rating: 5,
      date: '27. April 2026',
      commentDe: 'Schnelle Terminvergabe für meine Altbauwohnung. Die Fenster glänzen wieder und die Preise sind fair kalkuliert.',
      commentEn: 'Quick scheduling for my historical building apartment. The windows sparkle again and the prices are fairly calculated.',
      verified: true
    }
  ],
  buero: [
    {
      id: 'rev-b1',
      author: 'Inhouse Agentur GmbH',
      rating: 5,
      date: '12. Mai 2026',
      commentDe: 'Professionelle und diskrete Reinigung nach unseren hohen Standards. Das Büro glänzt morgens pünktlich vor Arbeitsbeginn.',
      commentEn: 'Professional and discreet cleaning according our high standards. The office sparkles in the morning right before work starts.',
      verified: true
    },
    {
      id: 'rev-b2',
      author: 'Praxis Dr. Neuhaus',
      rating: 5,
      date: '30. April 2026',
      commentDe: 'Hygienische Sauberkeit ist in unserer Kanzlei ein Muss. Emmasco erfüllt alle behördlichen Richtlinien tadellos.',
      commentEn: 'Hygienic cleanliness is a must in our office. Emmasco fulfills all regulatory guidelines flawlessly.',
      verified: true
    }
  ],
  deepclean: [
    {
      id: 'rev-d1',
      author: 'Sebastian F. (Berlin)',
      rating: 5,
      date: '15. Mai 2026',
      commentDe: 'Wir haben den Frühjahrsputz für unsere neue Wohnung gebucht. Unglaublich gründlich, selbst der Backofen sieht aus wie neu.',
      commentEn: 'We booked the deep cleaning for our new flat. Incredibly thorough, even the oven looks like new.',
      verified: true
    },
    {
      id: 'rev-d2',
      author: 'Monika R. (Weißensee)',
      rating: 4,
      date: '05. Mai 2026',
      commentDe: 'Sehr fleißiges Team. Haben jeden Winkel gereinigt. Hat ein wenig länger gedauert als geplant, aber dafür extrem sauber.',
      commentEn: 'Very busy team. Cleaned every corner. Took slightly longer than planned, but extremely clean in return.',
      verified: true
    }
  ]
};

interface ServicesProps {
  onSelectServiceAndBook: (serviceId: string) => void;
  preselectedServiceId: string | null;
  clearPreselection: () => void;
}

export default function Services({ onSelectServiceAndBook, preselectedServiceId, clearPreselection }: ServicesProps) {
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { language, t, services } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);

  // Review System States
  const [localReviews, setLocalReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('emmasco_services_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading offline reviews:', e);
      }
    }
    return REVIEWS_DATA;
  });

  // Write Review Form State
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Persist reviews locally
  useEffect(() => {
    localStorage.setItem('emmasco_services_reviews', JSON.stringify(localReviews));
  }, [localReviews]);

  // Aggregate helpers
  const getServiceReviews = (serviceId: string): Review[] => {
    return localReviews[serviceId] || [];
  };

  const getServiceAggregate = (serviceId: string) => {
    const reviews = getServiceReviews(serviceId);
    if (reviews.length === 0) {
      return { avg: 5.0, total: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: Math.round((sum / reviews.length) * 10) / 10,
      total: reviews.length
    };
  };

  // Handle Review Submission
  const handleAddReviewSubmit = (e: React.FormEvent, serviceId: string) => {
    e.preventDefault();
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      setFormErrorMessage(
        language === 'de' 
          ? 'Bitte füllen Sie alle erforderlichen Felder aus (Name und Bewertungstext).' 
          : 'Please fill in all required fields (Name and Review Text).'
      );
      return;
    }

    const newObj: Review = {
      id: `rev-custom-${Date.now()}`,
      author: `${newReviewAuthor.trim()}${newReviewLocation ? ` (${newReviewLocation.trim()})` : ''}`,
      rating: newReviewRating,
      date: new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      commentDe: newReviewComment.trim(),
      commentEn: newReviewComment.trim(),
      verified: true
    };

    // Prepend new review
    setLocalReviews(prev => ({
      ...prev,
      [serviceId]: [newObj, ...(prev[serviceId] || [])]
    }));

    // Reset Form
    setNewReviewAuthor('');
    setNewReviewLocation('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setFormSuccessMessage(
      language === 'de'
        ? 'Vielen Dank! Ihre Bewertung wurde verifiziert und erfolgreich veröffentlicht.'
        : 'Thank you! Your review has been verified and successfully published.'
    );
    setShowAddReviewForm(false);
  };

  // If there's a preselected service, open its detail automatically or scroll to it
  useEffect(() => {
    if (preselectedServiceId) {
      const match = services.find(s => s.id === preselectedServiceId);
      if (match) {
        setSelectedServiceDetail(match);
      }
    }
  }, [preselectedServiceId, services]);

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Leistungen' : 'All Services' },
    { id: 'haushalt', label: language === 'de' ? 'Haushalt & Einkaufen' : 'Household & Shopping' },
    { id: 'reinigung', label: language === 'de' ? 'Unterhaltsreinigung' : 'Maintenance Cleaning' },
    { id: 'begleitung', label: language === 'de' ? 'Alltagsbegleitung' : 'Companion Care' },
    { id: 'zusatz', label: language === 'de' ? 'Zusatzleistungen' : 'Additional Services' }
  ];

  const handleCategoryChange = (catId: string) => {
    const oldIndex = categories.findIndex((c) => c.id === selectedCategory);
    const newIndex = categories.findIndex((c) => c.id === catId);
    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setSlideDirection(newIndex > oldIndex ? 1 : -1);
    }
    setSelectedCategory(catId);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Home': return <Home className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'ShoppingCart': return <ShoppingCart className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'UserCheck': return <UserCheck className={className} />;
      case 'GlassWater': return <GlassWater className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full bg-[#F6FAFF] min-h-screen pb-20">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0056D6] to-[#0A1329] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <span className="bg-white/10 border border-white/20 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider text-blue-100">
            {language === 'de' ? 'Ausführliches Leistungsportfolio' : 'Detailed Service Portfolio'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black">
            {language === 'de' ? 'Unsere Leistungen & Preise' : 'Our Services & Prices'}
          </h1>
          <p className="text-sm md:text-base font-semibold text-blue-100/90 max-w-xl">
            {language === 'de' 
              ? 'Flexible Unterstützung für Ihr Zuhause. Transparent kalkuliert und erstklassig ausgeführt. Viele Angebote sind zu 100% kassenfinanziert.'
              : 'Flexible support for your home. Transparently calculated and executed to premium standards. Many offers are 100% covered by care insurance.'}
          </p>
        </div>
      </section>

      {/* Main Filter and Search Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Search & Dynamic Filters panel */}
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto font-semibold">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'text-white shadow-xs bg-[#0056D6]'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[#0056D6] z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'de' ? 'Suchen nach Haushaltskraft, Fenster...' : 'Search for household help, window...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-55/70 border border-blue-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F6FAFF]"
            />
          </div>

        </div>

        {/* Dynamic Service Grid with Slide Animation */}
        <div className="overflow-hidden mt-10 w-full">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={selectedCategory}
              custom={slideDirection}
              variants={{
                enter: (dir: number) => ({
                  x: dir * 120,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir * -120,
                  opacity: 0,
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.25 }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    key={service.id}
                    id={`service-detail-card-${service.id}`}
                    className="bg-white border border-blue-50 hover:border-blue-101 rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,86,214,0.03)] hover:shadow-[0_15px_30px_rgba(0,86,214,0.08)] flex flex-col justify-between relative overflow-hidden group"
                  >
                    {service.isPopular && (
                      <div className="absolute top-0 right-0 bg-[#0056D6] text-white text-[10px] uppercase font-extrabold tracking-widest px-4 py-1.5 rounded-bl-2xl">
                        {language === 'de' ? 'Beste Wahl' : 'Best Choice'}
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#0056D6] rounded-2xl flex items-center justify-center font-bold">
                        {renderIcon(service.iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-850 group-hover:text-[#0056D6] transition-colors">{service.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="inline-block text-[10px] font-black uppercase text-[#0056D6] bg-blue-50/70 px-2.5 py-1 rounded-md">
                            {service.category === 'haushalt' && (language === 'de' ? 'Haushalt & Alltag' : 'Household & Daily')}
                            {service.category === 'reinigung' && (language === 'de' ? 'Reinigung' : 'Cleaning')}
                            {service.category === 'begleitung' && (language === 'de' ? 'Kassenbegleitung' : 'Care Companion')}
                            {service.category === 'zusatz' && (language === 'de' ? 'Zusatzleistung' : 'Additional Service')}
                          </span>
                          
                          {/* Render elegant star rating indicator */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedServiceDetail(service);
                              // Ensures we scroll or show reviews
                              setTimeout(() => {
                                if (reviewsRef.current) {
                                  reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }}
                            className="flex items-center gap-1 bg-amber-50/60 hover:bg-amber-100 border border-amber-200/50 rounded-md py-0.5 px-2 select-none text-left cursor-pointer transition-all duration-200"
                          >
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-amber-800 text-[10px] font-black">{getServiceAggregate(service.id).avg.toFixed(1)}</span>
                            <span className="text-amber-600/60 text-[9px]">•</span>
                            <span className="text-amber-700 text-[9px] font-bold underline decoration-dotted">
                              {getServiceAggregate(service.id).total} {language === 'de' ? 'Kritiken' : 'Reviews'}
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {service.description}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold bg-[#F6FAFF] p-3 rounded-xl border border-blue-50/50 leading-relaxed">
                        {service.detailedDescription}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-4">
                      <div className="flex justify-between items-center bg-[#F6FAFF] p-4 rounded-2xl border border-blue-101/40">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                            {language === 'de' ? 'Verrechnung' : 'Hourly Rate'}
                          </span>
                          <span className="text-sm font-extrabold text-[#0056D6]">{service.price}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                            {language === 'de' ? 'Pflegegrad' : 'Care Level'}
                          </span>
                          <span className="text-xs font-extrabold text-green-700">
                            {language === 'de' ? '100% Kasse' : '100% Covered'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`service-info-modal-btn-${service.id}`}
                          onClick={() => {
                            setSelectedServiceDetail(service);
                            if (preselectedServiceId) clearPreselection();
                          }}
                          className="py-3 px-4 rounded-xl border border-blue-200 text-[#0056D6] font-extrabold text-xs hover:bg-blue-55 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <BadgeInfo className="w-4 h-4" />
                          {language === 'de' ? 'Info-Broschüre' : 'Info Brochure'}
                        </button>
                        <button
                          id={`service-book-btn-${service.id}`}
                          onClick={() => onSelectServiceAndBook(service.id)}
                          className="py-3 px-4 rounded-xl bg-[#0056D6] text-white font-extrabold text-xs hover:bg-[#0047b3] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                        >
                          {language === 'de' ? 'Jetzt Buchen' : 'Book Now'}
                          <ArrowRight className="w-4 h-4 lg:inline hidden" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredServices.length === 0 && (
                <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-blue-100 flex flex-col items-center gap-4">
                  <span className="text-4xl">🔍</span>
                  <div>
                    <h4 className="font-extrabold text-blue-950 text-base">
                      {language === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'de' 
                        ? 'Versuchen Sie es mit einem anderen Begriff oder filtern Sie nach einer anderen Kategorie.'
                        : 'Try another search term or filter by a different category.'}
                    </p>
                  </div>
                  <button
                    id="reset-filter-btn"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="bg-blue-50 text-blue-700 font-black text-xs px-4 py-2 rounded-xl border border-blue-150 cursor-pointer"
                  >
                    {language === 'de' ? 'Filter zurücksetzen' : 'Reset Filters'}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </section>

      {/* Detailed Info Sheet / Modal Popup inside preview */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-blue-100 animate-scale-up text-left flex flex-col gap-5 relative font-semibold select-none">
            <button
              id="close-modal-btn"
              onClick={() => {
                setSelectedServiceDetail(null);
                clearPreselection();
                setShowAddReviewForm(false);
                setFormSuccessMessage('');
                setFormErrorMessage('');
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer z-10"
              aria-label="Schließen"
            >
              ✕
            </button>

            <span className="inline-flex self-start px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg">
              {language === 'de' ? 'Details — ' : 'Details — '}{selectedServiceDetail.title}
            </span>
            
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold font-mono shrink-0">
                {renderIcon(selectedServiceDetail.iconName, 'w-6 h-6')}
              </div>
              <div>
                <h2 className="text-2xl font-black text-blue-900">{selectedServiceDetail.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.round(getServiceAggregate(selectedServiceDetail.id).avg) ? 'fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-700">
                    {getServiceAggregate(selectedServiceDetail.id).avg.toFixed(1)} / 5.0 ({getServiceAggregate(selectedServiceDetail.id).total} {language === 'de' ? 'Bewertungen' : 'reviews'})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-extrabold text-blue-950 text-sm uppercase tracking-wider">
                {language === 'de' ? 'Beschreibung der Tätigkeit:' : 'Description of Activity:'}
              </h4>
              <p className="text-gray-650 text-sm leading-relaxed font-semibold">
                {selectedServiceDetail.detailedDescription || selectedServiceDetail.description}
              </p>

              <div className="bg-emerald-50/80 border border-emerald-150 p-4 rounded-xl flex items-start gap-3">
                <span className="text-xl">🛡️</span>
                <div className="text-xs">
                  <span className="font-extrabold text-emerald-900 block mb-0.5">
                    {language === 'de' ? 'Finanzierung & Kassenleistung:' : 'Financing & Support Budget:'}
                  </span>
                  <span className="text-emerald-800 leading-relaxed font-semibold">
                    {language === 'de' ? (
                      <>
                        Da wir nach <strong>§ 45a SGB XI anerkannt</strong> sind, zahlt die gesetzliche Pflegekasse diese Leistung ab Pflegegrad 1 fast vollständig (monatlicher Entlastungsbetrag von 125 €).
                      </>
                    ) : (
                      <>
                        Since we are <strong>approved under § 45a SGB XI</strong>, the statutory health/care insurance covers this service almost fully starting from care level 1 (monthly budget of €125).
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#F6FAFF] border border-blue-50 p-3 rounded-xl text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-black block">
                    {language === 'de' ? 'Stundensatz Privat' : 'Private Hourly Rate'}
                  </span>
                  <span className="text-sm font-extrabold text-blue-900">{selectedServiceDetail.price}</span>
                </div>
                <div className="bg-[#F6FAFF] border border-blue-50 p-3 rounded-xl text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-black block">
                    {language === 'de' ? 'Anfahrtspauschale' : 'Travel Expenses'}
                  </span>
                  <span className="text-sm font-extrabold text-blue-900">
                    {language === 'de' ? 'Inklusive in Berlin' : 'Free within Berlin'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Reviews Section inside Modal */}
            <div id="reviews-anchor" ref={reviewsRef} className="border-t border-gray-100 pt-5 mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-blue-950 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4.5 h-4.5 text-[#0056D6]" />
                    {language === 'de' ? 'Kundenbewertungen' : 'Verified Reviews'}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-bold">
                    {language === 'de'
                      ? 'Echte Rezensionen von verifizierten Berliner Haushalten'
                      : 'Authentic reviews from verified Berlin households'}
                  </p>
                </div>

                {/* Write Review Trigger Button */}
                <button
                  id={`toggle-write-review-${selectedServiceDetail.id}`}
                  onClick={() => {
                    setShowAddReviewForm(!showAddReviewForm);
                    setFormSuccessMessage('');
                    setFormErrorMessage('');
                  }}
                  className="text-[11px] bg-blue-50 hover:bg-blue-100 text-[#0056D6] py-1.5 px-3 rounded-xl font-black border border-blue-100 cursor-pointer transition-all duration-250 select-none"
                >
                  {showAddReviewForm 
                    ? (language === 'de' ? 'Abbrechen' : 'Cancel')
                    : (language === 'de' ? '+ Bewerten' : '+ Rate')}
                </button>
              </div>

              {/* Form Success/Error notifications */}
              {formSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-emerald-800 text-xs font-semibold leading-relaxed">
                  {formSuccessMessage}
                </div>
              )}

              {formErrorMessage && (
                <div className="bg-red-50 border border-red-150 p-3.5 rounded-xl text-red-800 text-xs font-semibold leading-relaxed">
                  {formErrorMessage}
                </div>
              )}

              {/* COLLAPSIBLE ADD REVIEW FORM PANEL */}
              {showAddReviewForm && (
                <form 
                  onSubmit={(e) => handleAddReviewSubmit(e, selectedServiceDetail.id)}
                  className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl flex flex-col gap-3.5"
                >
                  <div className="text-xs font-black text-slate-800">
                    {language === 'de' ? 'Ihre Service-Erfahrung teilen' : 'Share your service rating'}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                        {language === 'de' ? 'Name (öffentlich) *' : 'Name (displayed) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'de' ? 'z.B. Marianne K.' : 'e.g. Marianne K.'}
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                        {language === 'de' ? 'Berliner Ortsteil' : 'Berlin District'}
                      </label>
                      <input
                        type="text"
                        placeholder={language === 'de' ? 'z.B. Pankow' : 'e.g. Pankow'}
                        value={newReviewLocation}
                        onChange={(e) => setNewReviewLocation(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Star Selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                      {language === 'de' ? 'Ihre Sternebewertung *' : 'Your Star Rating *'}
                    </label>
                    <div className="flex gap-1.5 focus:outline-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReviewRating ? 'text-amber-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                      {language === 'de' ? 'Ihr Erfahrungsbericht *' : 'Your Review Comment *'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={
                        language === 'de'
                          ? 'Beschreiben Sie Ihre Erfahrung mit unserem Service...'
                          : 'Describe your experience with our service...'
                      }
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="self-start text-[10px] font-black uppercase text-white bg-[#0056D6] hover:bg-[#0047b3] py-2.5 px-4 rounded-xl cursor-pointer transition-all"
                  >
                    {language === 'de' ? 'Rezension Absenden' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* REVIEWS LIST DISPLAY */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {getServiceReviews(selectedServiceDetail.id).length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4">
                    {language === 'de'
                      ? 'Noch keine Bewertungen für diese Leistung vorhanden. Seien Sie der Erste!'
                      : 'No reviews yet for this service. Be the first to leave one!'}
                  </p>
                ) : (
                  getServiceReviews(selectedServiceDetail.id).map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-slate-50/70 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2 relative leading-relaxed"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 bg-blue-100/60 text-[#0056D6] rounded-full flex items-center justify-center text-[10px] font-black uppercase select-none">
                            {rev.author.substring(0, 2)}
                          </span>
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block">
                              {rev.author}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold block">
                              {rev.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-250'}`} 
                              />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            ✓ {language === 'de' ? 'Kassenzugelassen' : 'Verified Care'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-650 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100/65">
                        "{language === 'de' ? rev.commentDe : rev.commentEn}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-105">
              <button
                id="modal-unselected-btn"
                onClick={() => {
                  setSelectedServiceDetail(null);
                  clearPreselection();
                  setShowAddReviewForm(false);
                  setFormSuccessMessage('');
                  setFormErrorMessage('');
                }}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs cursor-pointer text-center"
              >
                {language === 'de' ? 'Zurück zur Liste' : 'Back to list'}
              </button>
              <button
                id="modal-confirm-book-btn"
                onClick={() => {
                  const sId = selectedServiceDetail.id;
                  setSelectedServiceDetail(null);
                  clearPreselection();
                  setShowAddReviewForm(false);
                  setFormSuccessMessage('');
                  setFormErrorMessage('');
                  onSelectServiceAndBook(sId);
                }}
                className="py-3 px-4 rounded-xl bg-[#0056D6] hover:bg-[#0047b3] text-white font-black text-xs shadow-md cursor-pointer text-center"
              >
                {language === 'de' ? 'DIREKT JETZT BUCHEN' : 'BOOK DIRECTLY NOW'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
