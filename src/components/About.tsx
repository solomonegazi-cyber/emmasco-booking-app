/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Heart, Award, Eye, Rocket, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

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
        
        {/* Left column: Story */}
        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-blue-50 shadow-sm text-left flex flex-col gap-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">
            {t('about.story_title')}
          </h2>
          
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed font-semibold">
            <p>
              {t('about.story_p1')}
            </p>
            <p>
              {t('about.story_p2')}
            </p>
            <p>
              <em>{t('about.story_p3')}</em>
            </p>
            <p>
              {t('about.story_p4')}
            </p>
          </div>

          {/* Core visual quote */}
          <div className="border-l-4 border-blue-600 bg-blue-50/50 p-5 rounded-r-2xl mt-4">
            <blockquote className="italic text-gray-700 font-bold text-sm">
              {t('about.quote_text')}
            </blockquote>
            <span className="block text-xs font-black text-blue-900 mt-2">— {t('about.quote_author')}</span>
          </div>
        </div>

        {/* Right column: Mission & Vision Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6 font-semibold">
          
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
