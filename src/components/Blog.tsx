/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, User, Clock, ChevronRight, Tag, BookOpen, Newspaper } from 'lucide-react';
import { BlogArticle } from '../types';
import { useLanguage } from '../LanguageContext';

interface BlogProps {
  articles: BlogArticle[];
}

export default function Blog({ articles }: BlogProps) {
  const { language, t, blogArticles } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<BlogArticle | null>(null);

  // Use localized blog articles if available, fallback to props
  const currentArticles = blogArticles && blogArticles.length > 0 ? blogArticles : articles;

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Beiträge' : 'All Articles' },
    { id: 'Cleaning Tips', label: language === 'de' ? 'Hauswirtschaft & Reinigung' : 'Housekeeping & Cleaning' },
    { id: 'Health', label: language === 'de' ? 'Senioren & Gesundheit' : 'Seniors & Health' },
    { id: 'Lifestyle', label: language === 'de' ? 'Lebensstil & Familie' : 'Lifestyle & Family' }
  ];

  const filteredArticles = currentArticles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F6FAFF] min-h-screen pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-200" />
          <h1 className="text-4xl md:text-5xl font-black">
            {language === 'de' ? 'Emmasco Ratgeber & Blog' : 'Emmasco Guide & Blog'}
          </h1>
          <p className="text-sm md:text-base font-medium text-blue-105 max-w-xl">
            {language === 'de' 
              ? 'Professionelle Tipps rund um ein keimfreies Zuhause, gesundes Wohnen im Alter und die Abrechnung von Kassenleistungen.'
              : 'Professional tips for high hygiene, healthy aging in your own home, and health care funds billing.'}
          </p>
        </div>
      </section>

      {/* Main Blog Core Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 text-left">
        
        {/* Navigation and Search */}
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'de' ? 'Ratgeber durchsuchen...' : 'Search posts...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFF] border border-blue-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article 
              key={art.id} 
              id={`blog-card-${art.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-blue-50/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover image */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-blue-600/90 text-white font-black text-[9px] uppercase tracking-wider py-1 px-3 rounded-full shadow">
                  {art.category === 'Cleaning Tips' && (language === 'de' ? 'Putz-Tipps' : 'Cleaning Tips')}
                  {art.category === 'Health' && (language === 'de' ? 'Gesundheit' : 'Health')}
                  {art.category === 'Lifestyle' && (language === 'de' ? 'Lebensstil' : 'Lifestyle')}
                </span>
              </div>

              {/* Card body content */}
              <div className="p-6 text-left flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-extrabold select-none">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {art.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-blue-950 text-base md:text-lg hover:text-blue-600 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  {art.excerpt}
                </p>
              </div>

              {/* Action read block */}
              <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/20 text-left">
                <button
                  id={`read-article-btn-${art.id}`}
                  onClick={() => {
                    const foundInCollection = currentArticles.find((item) => item.id === art.id);
                    setReadingArticle(foundInCollection || art);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {language === 'de' ? 'Ganzes Kapitel lesen' : 'Read full chapter'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white border border-blue-50 rounded-2xl flex flex-col items-center gap-3">
              <span className="text-4xl">📚</span>
              <div>
                <h4 className="font-extrabold text-blue-950">
                  {language === 'de' ? 'Keine Beiträge gefunden' : 'No articles found'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'de' 
                    ? 'Geben Sie einen anderen Begriff wie "SGB", "Wäsche" oder "Bügeln" ein.'
                    : 'Enter another term such as "SGB", "laundry", or "ironing"'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reader Modal Panel (Single Article Details) */}
        {readingArticle && (
          <div className="mt-12 bg-white p-6 md:p-10 rounded-3xl border border-blue-150/80 shadow-2xl animate-fade-in flex flex-col gap-6 text-left relative scroll-mt-24">
            <button
              id="close-reader-btn"
              onClick={() => setReadingArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer text-sm font-bold"
            >
              {language === 'de' ? 'Schließen ✕' : 'Close ✕'}
            </button>

            <span className="inline-flex self-start py-1 px-3 bg-blue-50 text-blue-600 text-[10px] uppercase font-black rounded-lg">
              {language === 'de' ? 'Ratgeber' : 'Guide'} — {readingArticle.category}
            </span>

            <h2 className="text-2xl md:text-3xl font-black text-blue-900 leading-tight">
              {readingArticle.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-extrabold text-gray-400 border-b border-gray-100 pb-4 shrink-0">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {readingArticle.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {readingArticle.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {readingArticle.readTime}</span>
            </div>

            {/* Simulated cover image standard banner */}
            <div className="aspect-[21/9] w-full bg-slate-150 rounded-2xl overflow-hidden relative">
              <img 
                src={readingArticle.image} 
                alt={readingArticle.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Rich Text Area */}
            <div className="text-gray-700 text-sm md:text-base leading-relaxed font-semibold space-y-4 whitespace-pre-line mt-2">
              {readingArticle.content}
            </div>

            {/* Tag cloud footer */}
            <div className="flex flex-wrap gap-1.5 border-t border-gray-105 pt-6 mt-4 items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mr-1">
                <Tag className="w-4 h-4 text-gray-300" />
                Tags:
              </span>
              {readingArticle.tags.map((tag, tIndex) => (
                <span key={tIndex} className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex mt-2 justify-end">
              <button
                id="reader-back-to-list-btn"
                onClick={() => {
                  setReadingArticle(null);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs px-6 py-3.5 rounded-full cursor-pointer shadow-xs"
              >
                {language === 'de' ? 'Zurück zur Beitragsübersicht' : 'Back to overview'}
              </button>
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
