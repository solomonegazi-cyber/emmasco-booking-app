/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Calendar, Star, CheckCircle, ChevronRight, ChevronLeft, 
  Sparkles, Home as HomeIcon, ShoppingCart, HeartHandshake, 
  UserCheck, GlassWater, Briefcase, ShieldAlert, Check, HelpCircle
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data';
import { useLanguage } from '../LanguageContext';
import TrustGallery from './TrustGallery';
import { motion } from 'motion/react';

// Dynamic asset path resolver that bypasses typescript module declaration limits
const heroImage = new URL('../assets/images/caregiver_helping_elderly_1781598992140.jpg', import.meta.url).href;
const founderImage = new URL('../assets/images/founder_portrait_1784068713580.jpg', import.meta.url).href;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

interface HomeProps {
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
  onSelectService: (serviceId: string) => void;
}

export default function Home({ setCurrentPage, onOpenBooking, onSelectService }: HomeProps) {
  const { language, t, services, testimonials, faqs } = useLanguage();
  
  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq1');
  
  // Testimonials Carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Testimonials Scroll Reveal state
  const [revealTestimonials, setRevealTestimonials] = useState(false);
  const testimonialsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealTestimonials(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (testimonialsSectionRef.current) {
      observer.observe(testimonialsSectionRef.current);
    }

    return () => {
      if (testimonialsSectionRef.current) {
        observer.unobserve(testimonialsSectionRef.current);
      }
    };
  }, []);
  
  // Before/After interactive comparison card states
  const [gallerySelected, setGallerySelected] = useState<Record<string, 'before' | 'after'>>({
    gal1: 'after',
    gal2: 'after',
    gal3: 'after'
  });

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleGallery = (id: string, state: 'before' | 'after') => {
    setGallerySelected(prev => ({ ...prev, [id]: state }));
  };

  // Helper to get React component for service icon
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Home': return <HomeIcon className={className} />;
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
    <div className="w-full bg-[#F6FAFF] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-blue-100/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <span className="trust-badge-minimal self-start">
              <span className="w-2 h-2 rounded-full bg-[#0056D6] animate-pulse"></span>
              {t('hero.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.125] tracking-tight">
              {t('hero.title_part1')}<br />
              <span className="text-[#0056D6] relative inline-block">
                {t('hero.title_part2')}
                <span className="absolute left-0 bottom-1 w-full h-1 bg-[#2FB5FF]/40 rounded"></span>
              </span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="tel:017621856044"
                className="inline-flex items-center gap-2 bg-[#0056D6] hover:bg-[#0047b3] text-white font-extrabold px-6 py-4 rounded-xl transition-all duration-200 shadow-[0_8px_20px_rgba(0,86,214,0.15)] hover:shadow-[0_12px_25px_rgba(0,86,214,0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer text-sm font-semibold text-white"
                id="hero-call-btn"
              >
                <Phone className="w-5 h-5 text-blue-100 animate-bounce" />
                {t('hero.button_call')}
              </a>
              <button 
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F6FAFF] text-[#0056D6] font-extrabold px-6 py-4 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_18px_rgba(0,86,214,0.08)] border border-blue-100 cursor-pointer text-sm font-semibold"
                id="hero-consult-btn"
              >
                <Calendar className="w-5 h-5 text-[#2FB5FF]" />
                {t('hero.button_consult')}
              </button>
            </div>

            {/* Sub-hero trust checklist */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-gray-150 pt-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-green-100 text-green-700 shrink-0">✔</span>
                <span className="text-xs font-bold text-gray-700">
                  {language === 'de' ? 'Abrechnung aller Kassen' : 'All Insurance Billing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-green-100 text-green-700 shrink-0">✔</span>
                <span className="text-xs font-bold text-gray-700">
                  {language === 'de' ? '100% Haftpflichtversichert' : '100% Liability Insured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-green-100 text-green-700 shrink-0">✔</span>
                <span className="text-xs font-bold text-gray-700">
                  {language === 'de' ? 'Erfahrenes Berliner Team' : 'Experienced Berlin Team'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image Container */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-blue-100/50 aspect-video lg:aspect-[4/3] max-w-lg mx-auto">
              <img 
                src={heroImage} 
                alt="Emmasco Alltagsbegleitung Pflegedienst" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
            
            {/* Visual Floating Cards */}
            <div className="absolute -bottom-6 -left-4 md:-bottom-4 md:left-2 bg-white/95 backdrop-blur shadow-lg border border-blue-100 rounded-2xl p-4 flex items-center gap-3 animate-bounce-slow max-w-xs">
              <span className="text-3xl">💝</span>
              <div>
                <span className="block text-xs font-black text-blue-900">
                  {language === 'de' ? 'Familiäre Begleitung' : 'Familiar Assistance'}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  {language === 'de' ? 'Mit Herz & großem Engagement' : 'With heart & great commitment'}
                </span>
              </div>
            </div>

            <div className="absolute -top-4 -right-2 bg-blue-900 text-white shadow-xl rounded-2xl p-4 flex items-center gap-3 max-w-[180px]">
              <div className="p-2 bg-blue-800 rounded-xl text-blue-300 font-extrabold text-xs">
                SGB XI
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-extrabold text-blue-400">
                  {language === 'de' ? 'Direktabrechnung' : 'Direct Billing'}
                </span>
                <span className="text-xs font-bold">131 € Freibetrag</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SPECIFIC TRUST BADGES SECTION */}
      <section className="-mt-8 relative z-10 max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-3xl shadow-[0_12px_35px_rgba(0,86,214,0.06)] border border-blue-100/50 py-10 px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-50">
          
          <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0">
            <div className="text-4xl text-[#0056D6] mb-1">🛡️</div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">
              ✓ {language === 'de' ? '100% Versichert' : '100% Insured'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
              {language === 'de' ? 'Voller Schutz und Sicherheit bei jedem Einsatz – 100% Haftpflichtversichert.' : 'Complete protection and liability coverage for all cleaning situations in Berlin.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0">
            <div className="text-4xl text-[#0056D6] mb-1">✨</div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">
              ✓ {language === 'de' ? 'Professionelle Reinigung' : 'Professional Cleaning'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
              {language === 'de' ? 'Ausgebildete Servicekräfte sorgen für strahlenden und hygienischen Glanz.' : 'Zertifiziertes personal with extensive sanitization and housekeeping competence.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0">
            <div className="text-4xl text-[#0056D6] mb-1">📅</div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">
              ✓ {language === 'de' ? 'Flexible Einsatzplanung' : 'Flexible Scheduling'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
              {language === 'de' ? 'Termine ganz nach Wunsch buchen und unkompliziert anpassen.' : 'Schedule tailored service hours and match your regular preferred cleaner.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0">
            <div className="text-4xl text-[#0056D6] mb-1">📍</div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">
              ✓ {language === 'de' ? 'Berliner Abdeckung' : 'Berlin Coverage'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
              {language === 'de' ? 'Ganz Berlin wird von unseren freundlichen Teams zuverlässig betreut.' : 'We provide local trusted household care in every Berlin district.'}
            </p>
          </div>

        </div>
      </section>

      {/* OUR FOUNDER'S STORY SECTION */}
      <section className="bg-white py-20 border-t border-blue-50 overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column: Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[450px] rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-slate-50 border border-slate-100">
                <img
                  src={founderImage}
                  alt="Emmanuel Isodje"
                  className="w-full h-auto object-contain rounded-2xl select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Story Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full self-start">
                  {t('about.founder_badge')}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight leading-tight">
                  {t('about.founder_heading')}
                </h2>
              </div>

              {language === 'de' ? (
                <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed font-semibold">
                  <p>
                    Mein Name ist <strong className="text-base md:text-lg font-extrabold text-blue-950">Emmanuel Isodje</strong>, und ich habe das Emmasco ReinigungsTeam UG im Mai 2025 gegründet – nur wenige Tage nach dem Tod meiner geliebten Mutter im Alter von 93 Jahren.
                  </p>
                  <p>
                    In den letzten Tagen ihres Lebens wurde meine Mutter schwer krank. Diese schwierige und emotionale Zeit hat mir gezeigt, wie wertvoll es ist, fürsorgliche Menschen in der Nähe zu haben – Menschen, die praktische Unterstützung, Trost und Gesellschaft bieten, wenn alltägliche Aufgaben zu einer Überlastung werden. Meine Familie stand an ihrer Seite und pflegte sie, bis sie friedlich einschlief.
                  </p>
                  <p>
                    Diese Erfahrung inspirierte mich dazu, die Emmasco ReinigungsTeam UG zu gründen. Ich wollte ein Unternehmen schaffen, das Menschen in ihrem eigenen Zuhause mit derselben Empathie, demselben Respekt und derselben Hingabe unterstützt, die meine Familie meiner Mutter entgegengebracht hat.
                  </p>
                  <p>
                    Für uns sind Sie niemals einfach nur ein Kunde. Sie sind ein Mensch, der es verdient, sich in seinem eigenen Zuhause wohl, respektiert und gut unterstützt zu fühlen. Unser freundliches Team freut sich darauf, Sie bei alltäglichen Haushaltsaufgaben zu entlasten, damit Sie mehr Lebensqualität, Unabhängigkeit und Seelenfrieden genießen können.
                  </p>
                  <div>
                    <p className="font-extrabold text-blue-950 mb-3 text-base">Wir unterstützen mit Stolz:</p>
                    <ul className="space-y-3 pl-1 font-semibold text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Menschen mit Pflegegrad 1–5 über den monatlichen Entlastungsbetrag.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Schwangere und Familien im Rahmen der Haushaltshilfe nach § 38 SGB V.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Anspruchsberechtigte auf Haushaltshilfe nach § 39 SGB VII.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Privatkunden, die eine verlässliche Unterstützung im Haushalt suchen.</span>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Wir kooperieren mit Krankenkassen, Pflegekassen, Unfallversicherungsträgern und Berufsgenossenschaften. Bei vorliegender Bewilligung können wir direkt mit dem zuständigen Kostenträger abrechnen.
                  </p>
                  <p>
                    Jeder Kunde erhält unabhängig vom Umfang der gewünschten Leistung denselben Respekt, dieselbe Freundlichkeit und Professionalität.
                  </p>
                  <p>
                    Vielen Dank für Ihr Vertrauen in die Emmasco ReinigungsTeam UG.
                  </p>
                  <div className="pt-6 border-t border-blue-50/70 mt-8">
                    <p className="text-sm text-slate-500 font-bold">Herzliche Grüße,</p>
                    <p className="text-base md:text-lg font-black text-blue-950 mt-1">Emmanuel Isodje</p>
                    <p className="text-xs md:text-sm text-slate-500 font-bold">Gründer & Geschäftsführer</p>
                    <p className="text-xs md:text-sm text-slate-400 font-semibold">Emmasco ReinigungsTeam UG (haftungsbeschränkt)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed font-semibold">
                  <p>
                    My name is <strong className="text-base md:text-lg font-extrabold text-blue-950">Emmanuel Isodje</strong>, and I founded Emmasco ReinigungsTeam UG in May 2025—just a few days after my beloved mother passed away at the age of 93.
                  </p>
                  <p>
                    During the final days of her life, my mother became seriously ill. This difficult and emotional time showed me how valuable it is to have caring people nearby—people who offer practical support, comfort and companionship when everyday tasks become overwhelming. My family stood by her side and cared for her until she peacefully passed away.
                  </p>
                  <p>
                    That experience inspired me to establish Emmasco ReinigungsTeam UG. I wanted to create a company that would support people in their own homes with the same compassion, respect and dedication that my family showed my mother.
                  </p>
                  <p>
                    For us, you are never simply a customer. You are a person who deserves to feel comfortable, respected and well supported in your own home. Our friendly team is pleased to assist you with household tasks so that you can enjoy greater comfort, independence and peace of mind.
                  </p>
                  <div>
                    <p className="font-extrabold text-blue-950 mb-3 text-base">We proudly support:</p>
                    <ul className="space-y-3 pl-1 font-semibold text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>People with Pflegegrad 1–5 through the monthly Entlastungsbetrag.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Expectant mothers and families through household assistance under § 38 SGB V.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>People entitled to household assistance under § 39 SGB VII.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1 select-none font-bold">✓</span>
                        <span>Private customers seeking reliable household support.</span>
                      </li>
                    </ul>
                  </div>
                  <p>
                    We cooperate with health insurance funds, long-term care insurance funds, accident insurance providers and employers' liability insurance associations. Where approval has been granted, we can invoice the responsible institution directly.
                  </p>
                  <p>
                    Every client receives the same respect, kindness and professionalism regardless of the size of the service requested.
                  </p>
                  <p>
                    Thank you for placing your trust in Emmasco ReinigungsTeam UG.
                  </p>
                  <div className="pt-6 border-t border-blue-50/70 mt-8">
                    <p className="text-sm text-slate-500 font-bold">Warm regards,</p>
                    <p className="text-base md:text-lg font-black text-blue-950 mt-1">Emmanuel Isodje</p>
                    <p className="text-xs md:text-sm text-slate-500 font-bold">Founder & Managing Director</p>
                    <p className="text-xs md:text-sm text-slate-400 font-semibold">Emmasco ReinigungsTeam UG (haftungsbeschränkt)</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. DYNAMIC SERVICE CARDS SECTION */}
      <section className="py-16 bg-white border-y border-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3 mb-12">
            <span className="trust-badge-minimal">
              {t('services.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('services.title')}
            </h2>
            <p className="text-gray-500 text-sm font-semibold">
              {language === 'de' 
                ? 'Kombinieren Sie flexibel hauswirtschaftliche Hilfe, treue Alltagsbegleitung oder tiefgehende Fachreinigung genau nach Ihrem Bedarf.'
                : 'Flexibly combine household help, loyal companion care, or thorough specialist cleaning according to your precise needs.'}
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div 
                key={service.id} 
                id={`service-card-${service.id}`}
                variants={cardVariants}
                className="group relative bg-white border border-blue-50/70 hover:border-blue-100 rounded-3xl p-6 transition-all duration-350 shadow-[0_8px_20px_rgba(0,86,214,0.03)] hover:shadow-[0_15px_35px_rgba(0,86,214,0.08)] hover:-translate-y-1 flex flex-col justify-between"
              >
                {service.isPopular && (
                  <span className="absolute -top-2.5 right-6 bg-[#0056D6] text-white font-extrabold text-[10px] uppercase py-1 px-3 rounded-full tracking-wider shadow-sm">
                    {t('services.popular_badge')}
                  </span>
                )}
                
                <div className="flex flex-col gap-4 text-left">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50/80 group-hover:bg-[#0056D6] text-[#0056D6] group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-200">
                    {renderIcon(service.iconName, 'w-6 h-6')}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-slate-850 group-hover:text-[#0056D6] transition-colors">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal min-h-[85px]">
                    {service.description}
                  </p>
                </div>

                {/* Price and Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black tracking-widest text-[#2FB5FF] uppercase">{t('services.rate_label')}</span>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-full">{service.price}</span>
                  </div>
                  
                  <button
                    id={`service-card-cta-${service.id}`}
                    onClick={() => {
                      onSelectService(service.id);
                      setCurrentPage('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#0056D6] border border-blue-105 hover:border-[#0056D6] text-[#0056D6] hover:text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all duration-250 cursor-pointer"
                  >
                    {t('services.details_btn')}
                    <ChevronRight className="w-4 h-4 shrink-0 font-bold" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Info Bar */}
          <div className="mt-12 bg-blue-50/80 p-5 rounded-2xl border border-blue-100 max-w-3xl mx-auto text-left flex flex-col md:flex-row items-center gap-4">
            <span className="text-3xl text-blue-600 shrink-0">💡</span>
            <div className="text-sm">
              <span className="font-extrabold text-blue-900 block mb-0.5">
                {language === 'de' ? 'Wussten Sie schon?' : 'Did you know?'}
              </span>
              <span className="text-gray-650 font-medium font-semibold">
                {language === 'de' 
                  ? 'Sämtliche pflegebedürftige Personen mit Wohnsitz in Berlin können unsere haushaltsnahen Dienstleistungen ab Pflegegrad 1 zu 100 % über das Pflegeversicherungsbudget decken lassen (Entlastungsbetrag §45a SGB XI). Gerne regeln wir die Direktabrechnung für Sie!'
                  : 'All care-dependent individuals residing in Berlin can have our household services covered 100% via the care insurance budget starting from care level 1 (relief contribution §45a SGB XI). We are happy to arrange direct billing for you!'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE US & STATISTICS */}
      <section className="py-20 bg-gradient-to-br from-[#F6FAFF] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <span className="trust-badge-minimal self-start">
              {t('why.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('why.title')}
            </h2>
            <p className="text-gray-500 text-sm font-semibold max-w-xl">
              {t('why.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-white p-4.5 rounded-2xl border border-blue-50 shadow-[0_4px_15px_rgba(0,86,214,0.02)] flex items-start gap-3">
                <span className="p-1.5 rounded-xl bg-blue-50 text-[#0056D6] mt-0.5 font-bold">✔</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t('why.item1.title')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">{t('why.item1.desc')}</p>
                </div>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-blue-50 shadow-[0_4px_15px_rgba(0,86,214,0.02)] flex items-start gap-3">
                <span className="p-1.5 rounded-xl bg-blue-50 text-[#0056D6] mt-0.5 font-bold">✔</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t('why.item2.title')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">{t('why.item2.desc')}</p>
                </div>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-blue-50 shadow-[0_4px_15px_rgba(0,86,214,0.02)] flex items-start gap-3">
                <span className="p-1.5 rounded-xl bg-blue-50 text-[#0056D6] mt-0.5 font-bold">✔</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t('why.item3.title')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">{t('why.item3.desc')}</p>
                </div>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-blue-50 shadow-[0_4px_15px_rgba(0,86,214,0.02)] flex items-start gap-3">
                <span className="p-1.5 rounded-xl bg-blue-50 text-[#0056D6] mt-0.5 font-bold">✔</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t('why.item4.title')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">{t('why.item4.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Large statistics visual */}
          <div className="lg:col-span-6 relative flex flex-col justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-lg">
              
              <div className="bg-white border border-blue-50/50 rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,86,214,0.03)] text-center hover:scale-102 transition-all duration-200">
                <span className="block text-4xl font-black text-[#0056D6] mb-1">{t('stats.clients')}</span>
                <span className="block text-sm font-extrabold text-slate-800">{t('stats.clients_label')}</span>
                <span className="text-[10px] text-slate-450 font-medium font-semibold">{t('stats.clients_sub')}</span>
              </div>

              <div className="bg-white border border-blue-50/50 rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,86,214,0.03)] text-center hover:scale-102 transition-all duration-200">
                <span className="block text-4xl font-black text-[#0056D6] mb-1">{t('stats.satisfaction')}</span>
                <span className="block text-sm font-extrabold text-slate-800">{t('stats.satisfaction_label')}</span>
                <span className="text-[10px] text-slate-450 font-medium font-semibold">{t('stats.satisfaction_sub')}</span>
              </div>

              <div className="bg-white border border-blue-50/50 rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,86,214,0.03)] text-center hover:scale-102 transition-all duration-200 sm:col-span-1">
                <span className="block text-4xl font-black text-[#0056D6] mb-1">{t('stats.support')}</span>
                <span className="block text-sm font-extrabold text-slate-800">{t('stats.support_label')}</span>
                <span className="text-[10px] text-slate-450 font-medium font-semibold">{t('stats.support_sub')}</span>
              </div>

            </div>

            <div className="mt-8 bg-[#0056D6] text-blue-50 p-6 rounded-3xl border border-blue-700/50 shadow-[0_15px_30px_rgba(0,86,214,0.15)] max-w-lg text-left">
              <span className="block text-xs uppercase tracking-wider text-blue-200 font-extrabold">{t('quote.badge')}</span>
              <p className="mt-2.5 text-sm leading-relaxed font-semibold">
                {t('quote.text')}
              </p>
              <span className="block mt-4 text-xs font-black text-white">{t('quote.author')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BEFORE/AFTER CLEANING GALLERY */}
      <section className="py-16 bg-white border-t border-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-10">
            <span className="trust-badge-minimal">
              {t('gallery.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {t('gallery.title')}
            </h2>
            <p className="text-gray-500 text-sm font-semibold">
              {language === 'de' 
                ? 'Klicken Sie, um direkt zwischen "Vorher" und "Nachher" unserer professionellen Reinigungen zu wechseln.'
                : 'Click to toggle instantly between the "Before" and "After" states of our professional cleanings.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_ITEMS.map((item) => {
              const selectedState = gallerySelected[item.id] || 'after';
              const itemTitle = language === 'de' ? item.title : (item.id === 'gal1' ? 'Kitchen Deep Cleaning' : item.id === 'gal2' ? 'Floor Odor & Stain Polish' : 'Bathroom Calcification Clean');
              const itemDesc = language === 'de' ? item.desc : (item.id === 'gal1' ? 'Complete descaling and stove surface degreasing.' : item.id === 'gal2' ? 'Deep sanitization and fine gloss polish on parquet floors.' : 'Removal of persistent lime deposits and tile grout whitening.');

              return (
                <div 
                  key={item.id} 
                  id={`gallery-item-${item.id}`}
                  className="bg-white rounded-3xl overflow-hidden border border-blue-50/50 shadow-[0_8px_20px_rgba(0,86,214,0.03)] hover:shadow-[0_12px_28px_rgba(0,86,214,0.06)] transition-all duration-300"
                >
                  {/* Image container with aspect-square or aspect-video */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img 
                      src={selectedState === 'before' ? item.before : item.after} 
                      alt={`${itemTitle} - ${selectedState}`} 
                      className="w-full h-full object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Badge */}
                    <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow ${
                      selectedState === 'before' ? 'bg-amber-600 text-white' : 'bg-emerald-650 text-white'
                    }`}>
                      {selectedState === 'before' ? t('gallery.before') : t('gallery.after')}
                    </span>
                  </div>

                  {/* Toggle Controls */}
                  <div className="p-5 flex flex-col gap-3 text-left">
                    <div>
                      <h4 className="font-extrabold text-[#0056D6] text-base">{itemTitle}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{itemDesc}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-50 p-1 rounded-xl">
                      <button
                        id={`gallery-before-btn-${item.id}`}
                        onClick={() => toggleGallery(item.id, 'before')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedState === 'before' 
                            ? 'bg-amber-605 text-white shadow-xs font-black' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {t('gallery.before')}
                      </button>
                      <button
                        id={`gallery-after-btn-${item.id}`}
                        onClick={() => toggleGallery(item.id, 'after')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedState === 'after' 
                            ? 'bg-[#0056D6] text-white shadow-xs font-black' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {language === 'de' ? 'Nachher' : 'After'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* TRUST TEAM & PREMIUM EQUIPMENT GALLERY */}
      <TrustGallery onOpenBooking={onOpenBooking} language={language} />

      {/* 6. TESTIMONIALS CAROUSEL */}
      <section ref={testimonialsSectionRef} className="py-16 bg-[#F6FAFF] border-y border-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
            <span className="trust-badge-minimal">
              {t('testimonials.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {t('testimonials.title')}
            </h2>
          </div>

          <div className={`relative max-w-3xl mx-auto transition-all duration-1000 transform ease-out ${
            revealTestimonials 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-[0.98]'
          }`}>
            {/* Carousel card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,86,214,0.04)] border border-blue-50/50 text-left transition-all duration-300 relative">
              <span className="absolute top-6 right-8 text-7xl text-blue-100 font-serif leading-none select-none animate-pulse">“</span>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-700 italic font-medium text-base md:text-lg leading-relaxed mb-6">
                "{testimonials[currentTestimonialIndex].text}"
              </p>

              {/* Author */}
              <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                    {testimonials[currentTestimonialIndex].name}
                  </h4>
                  <span className="text-xs text-[#0056D6] font-bold block mt-0.5">
                    {testimonials[currentTestimonialIndex].role}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold mb-0.5">
                  {testimonials[currentTestimonialIndex].date}
                </span>
              </div>
            </div>

            {/* Slider navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                id="testimonial-prev-btn"
                onClick={prevTestimonial}
                className="w-11 h-11 bg-white hover:bg-blue-600 border border-blue-150 hover:border-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200"
                aria-label={language === 'de' ? "Vorheriges Testimonial" : "Previous Testimonial"}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Visual dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonialIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentTestimonialIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  ></button>
                ))}
              </div>

              <button
                id="testimonial-next-btn"
                onClick={nextTestimonial}
                className="w-11 h-11 bg-white hover:bg-blue-600 border border-blue-150 hover:border-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200"
                aria-label={language === 'de' ? "Nächstes Testimonial" : "Next Testimonial"}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section className="py-20 bg-white border-b border-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-left">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
            <span className="trust-badge-minimal">
              {t('faq.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {t('faq.title')}
            </h2>
            <p className="text-gray-500 text-sm font-semibold">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  id={`faq-${faq.id}`}
                  className="bg-white border border-blue-50/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(0,86,214,0.02)]"
                >
                  <button
                    id={`faq-toggle-btn-${faq.id}`}
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="font-extrabold text-slate-800 group-hover:text-[#0056D6] text-sm md:text-base flex items-center gap-2 transition-colors">
                      <HelpCircle className="w-5 h-5 text-[#2FB5FF] shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronRight className={`w-5 h-5 text-[#0056D6] shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed font-semibold border-t border-slate-50 bg-[#F6FAFF]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8 font-semibold">
            {language === 'de' 
              ? 'Haben Sie noch weitere Fragen? Unser Service-Team berät Sie gerne kostenfrei unter'
              : 'Do you have any other questions? Our support team will gladly advise you free of charge at'}{' '}
            <a href="tel:017621856044" className="text-blue-600 underline font-extrabold font-bold">0176 21856044</a>.
          </p>
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="py-20 bg-[#0056D6] text-white text-left relative overflow-hidden font-semibold">
        {/* Abstract design blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-35 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 rounded-full blur-2xl opacity-40 -ml-20 -mb-20"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="bg-[#2FB5FF]/30 text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full border border-white/20 self-start uppercase">
              {t('cta.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.2]">
              {t('cta.title')}
            </h2>
            <p className="text-blue-100 font-semibold text-sm leading-relaxed">
              {t('cta.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <button
              id="cta-booking-btn"
              onClick={onOpenBooking}
              className="bg-white hover:bg-blue-50 text-[#0056D6] font-black px-6 py-4 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer text-center text-sm"
            >
              {t('cta.book_btn')}
            </button>
            <a
              href="mailto:info@emmascoreinigungsteam.de"
              className="bg-[#0056D6]/35 hover:bg-black/10 text-white font-black px-6 py-4 rounded-xl border border-white/20 shadow-sm transition-all duration-200 text-center text-sm font-bold text-white"
              id="cta-email-link"
            >
              {t('cta.email_btn')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
