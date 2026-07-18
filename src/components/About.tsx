/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Heart, Award, Eye, Rocket, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

const founderPortrait = new URL('../assets/images/founder_portrait_1784068713580.jpg', import.meta.url).href;

export default function About() {
  const { language, t, teamMembers, timelineEvents, companyValues } = useLanguage();

  return (
    <div className="w-full bg-[#F6FAFF] min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white py-16 px-4 text-center relative overflow-hidden">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(47,181,255,0.15),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-4">
          <span className="text-blue-400 font-extrabold uppercase text-xs tracking-widest bg-blue-800/60 px-3 py-1.5 rounded-full border border-blue-700">
            {t('about.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {t('about.title')}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed font-semibold">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story, Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        

        {/* Right column: Mission & Vision Cards */}
<div className="lg:col-span-12 max-w-5xl mx-auto flex flex-col gap-6 font-semibold">
          
          {/* Mission */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-sm text-left flex items-start gap-4 font-semibold">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-blue-950 text-lg mb-2">{t('about.mission_title')}</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                {t('about.mission_text')}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-sm text-left flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-blue-950 text-lg mb-2">{t('about.vision_title')}</h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed">
                {t('about.vision_text')}
              </p>
            </div>
          </div>

          {/* Certificate banner */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-lg border border-blue-700 text-left flex flex-col gap-4">
            <div className="flex gap-2.5 items-center font-bold">
              <Award className="w-7 h-7 text-blue-200" />
              <h3 className="font-extrabold text-lg">{t('about.cert_title')}</h3>
            </div>
            <p className="text-xs text-blue-100 font-semibold leading-relaxed">
              {t('about.cert_text')}
            </p>
            <div className="flex flex-col gap-1 text-[11px] text-blue-200 mt-2 font-black border-t border-blue-500/30 pt-4">
              <span>{t('about.cert_num')}</span>
              <span>{t('about.cert_region')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Our Founder's Story Section */}
      <section className="bg-white py-20 border-t border-blue-50 overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[450px] rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-slate-50 border border-slate-100">
                <img
                  src={founderPortrait}
                  alt="Emmanuel Isodje"
                  className="w-full h-auto object-contain rounded-2xl select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Story Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 min-h-fit">
              <div className="flex flex-col gap-2">
                <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full self-start">
                  {t('about.founder_badge')}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight leading-tight">
                  {t('about.founder_heading')}
                </h2>
              </div>

              {language === 'de' ? (
                <div className="space-y-6 text-slate-700 text-sm md:text-base leading-8 font-semibold w-full break-words">
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
                <div
  className="
    space-y-6
    text-slate-700
    text-sm
    md:text-base
    leading-8
    font-semibold
    max-h-[700px]
    overflow-y-auto
    pr-4
    scrollbar-thin
    scrollbar-thumb-blue-300
    scrollbar-track-transparent
  "
>
  <p>
    My name is <strong className="font-extrabold text-blue-950">Emmanuel Isodje</strong>, and I founded Emmasco ReinigungsTeam UG in May 2025—just a few days after my beloved mother passed away at the age of 93.
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
    <h4 className="font-extrabold text-blue-950 text-lg mb-4">
      We support:
    </h4>

    <ul className="space-y-4">

      <li className="flex items-start gap-3">
        <span className="text-blue-600 font-bold mt-1">✓</span>
        <span>People with Pflegegrad 1–5 through the Entlastungsbetrag of €131 per month.</span>
      </li>

      <li className="flex items-start gap-3">
        <span className="text-blue-600 font-bold mt-1">✓</span>
        <span>Expectant mothers and families with newborn babies through household assistance under § 38 SGB V.</span>
      </li>

      <li className="flex items-start gap-3">
        <span className="text-blue-600 font-bold mt-1">✓</span>
        <span>People entitled to household assistance under statutory accident insurance pursuant to § 39 SGB VII.</span>
      </li>

      <li className="flex items-start gap-3">
        <span className="text-blue-600 font-bold mt-1">✓</span>
        <span>Private customers who need reliable help in their homes.</span>
      </li>

    </ul>
  </div>

  <p>
    We cooperate with health insurance funds, long-term care insurance funds, accident insurance funds and employers’ liability insurance associations. Where approval and the necessary requirements are in place, we can bill the responsible institution directly—helping to reduce paperwork and giving you one less thing to worry about.
  </p>

  <p>
    Within the approved or agreed service hours, we carefully provide the household assistance that best meets your individual needs. We listen to you, respect your wishes and do our very best to make everyday life at home easier.
  </p>

  <p>
    Thank you for placing your trust in Emmasco ReinigungsTeam UG. It is our privilege to be there for you when you need a helping hand.
  </p>

  <div className="pt-8 mt-8 border-t border-blue-100">

    <p className="text-slate-500 font-bold">
      Warm regards,
    </p>

    <p className="text-xl font-black text-blue-950 mt-2">
      Emmanuel Isodje
    </p>

    <p className="text-sm font-bold text-slate-600">
      Founder and Managing Director
    </p>

    <p className="text-sm text-slate-500">
      Emmasco ReinigungsTeam UG (haftungsbeschränkt)
    </p>

  </div>

</div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white border-y border-blue-50 text-left">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {t('about.values_badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
              {t('about.values_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((val, i) => (
              <div 
                key={i} 
                className="bg-[#F6FAFF] border border-blue-50 p-6 rounded-2xl flex flex-col gap-3 hover:bg-white hover:border-blue-250 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                  {i + 1}
                </div>
                <h3 className="font-extrabold text-blue-950 text-base">{val.title}</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Team Members Grid */}
      <section className="py-16 bg-white text-left">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {t('about.team_badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
              {t('about.team_title')}
            </h2>
            <p className="text-gray-500 text-sm font-semibold">
              {t('about.team_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div 
                key={i} 
                className="bg-[#F6FAFF] rounded-2xl overflow-hidden border border-blue-50 shadow-sm flex flex-col items-center p-6 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <h3 className="font-extrabold text-blue-950 text-lg">{member.name}</h3>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-3">
                  {member.role}
                </span>
                
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* History Timeline Component */}
      <section className="py-16 bg-[#F6FAFF] text-left">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2 mb-12">
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {t('about.timeline_badge')}
            </span>
            <h2 className="text-3xl font-extrabold text-blue-900">
              {t('about.timeline_title')}
            </h2>
          </div>

          <div className="relative border-l-2 border-blue-200 ml-4 md:ml-24 space-y-10">
            {timelineEvents.map((evt, i) => (
              <div key={i} className="relative pl-6 md:pl-10">
                {/* Visual marker dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-600 rounded-full border-4 border-[#F6FAFF] shadow-sm"></div>
                
                {/* Year tag visible on left */}
                <div className="md:absolute md:-left-24 md:top-1 font-black text-lg text-blue-600 select-none">
                  {evt.year}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-xs flex flex-col gap-1.5">
                  <span className="block md:hidden text-xs font-black text-blue-500 uppercase">{evt.year}</span>
                  <h3 className="font-extrabold text-blue-950 text-base">{evt.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{evt.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
