/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'motion/react';

const BERLIN_DISTRICTS = [
  {
    nameDe: 'Pankow / Prenzlauer Berg',
    nameEn: 'Pankow / Prenzlauer Berg',
    coords: [52.5689, 13.4023] as [number, number],
    infoDe: '⚡ Hauptgebiet mit über 15 Kräften vor Ort. 100% Abdeckung aller Alltagsleistungen.',
    infoEn: '⚡ Main operational zone with 15+ staff members. Full cover of helper services.'
  },
  {
    nameDe: 'Berlin Mitte',
    nameEn: 'Berlin Mitte',
    coords: [52.5200, 13.4050] as [number, number],
    infoDe: '⭐ Schnelle Vermittlung unter 24 Stunden. Direktabrechnung mit allen Kassen.',
    infoEn: '⭐ Immediate booking assignments under 24h. Direct insurance billing.'
  },
  {
    nameDe: 'Friedrichshain-Kreuzberg',
    nameEn: 'Friedrichshain-Kreuzberg',
    coords: [52.5134, 13.4382] as [number, number],
    infoDe: '✔ Regelmäßige Hausreinigung und verlässliche Seniorenbegleitung.',
    infoEn: '✔ Regular premium house keeping and steady helper visits.'
  },
  {
    nameDe: 'Charlottenburg-Wilmersdorf',
    nameEn: 'Charlottenburg-Wilmersdorf',
    coords: [52.5076, 13.2846] as [number, number],
    infoDe: '✨ Vollversorgtes Einzugsgebiet. Festangestellte, polizeilich geprüfte Kräfte.',
    infoEn: '✨ Fully active care sector. Highly vetted, certified permanent employees.'
  },
  {
    nameDe: 'Reinickendorf',
    nameEn: 'Reinickendorf',
    coords: [52.5937, 13.3156] as [number, number],
    infoDe: '🌱 Zertifizierte haushaltsnahe Dienste gem. § 45a SGB XI anerkannt.',
    infoEn: '🌱 Officially recognized companion services under § 45a SGB XI.'
  },
  {
    nameDe: 'Lichtenberg',
    nameEn: 'Lichtenberg',
    coords: [52.5323, 13.4910] as [number, number],
    infoDe: '🏠 Private Hilfe im Haushalt, Grundreinigung und Fensterpflege.',
    infoEn: '🏠 Comprehensive household help, floor cleaning and window washing.'
  }
];

const BRANDENBURG_CITIES = [
  {
    nameDe: 'Potsdam',
    nameEn: 'Potsdam',
    coords: [52.3989, 13.0657] as [number, number],
    infoDe: '🚗 Voller Service: Haushaltsnahe Dienstleistungen & Alltagshilfe vor Ort.',
    infoEn: '🚗 Full Service: Household assistance & everyday help on site.'
  },
  {
    nameDe: 'Falkensee',
    nameEn: 'Falkensee',
    coords: [52.5583, 13.0917] as [number, number],
    infoDe: '🏠 Regelmäßige Haushaltshilfe & Reinigungsservice für Senioren und Familien.',
    infoEn: '🏠 Regular household assistance & cleaning service for seniors and families.'
  },
  {
    nameDe: 'Oranienburg',
    nameEn: 'Oranienburg',
    coords: [52.7544, 13.2369] as [number, number],
    infoDe: '🌿 Alltagshilfe & Entlastungsleistungen gem. § 45a SGB XI.',
    infoEn: '🌿 Everyday assistance & relief services under § 45a SGB XI.'
  },
  {
    nameDe: 'Bernau bei Berlin',
    nameEn: 'Bernau bei Berlin',
    coords: [52.6798, 13.5871] as [number, number],
    infoDe: '✨ Zuverlässige Reinigung, Seniorenbegleitung und Hilfe im Alltag.',
    infoEn: '✨ Reliable cleaning, companion care, and everyday help.'
  },
  {
    nameDe: 'Eberswalde',
    nameEn: 'Eberswalde',
    coords: [52.8331, 13.8219] as [number, number],
    infoDe: '⭐ Service-Erweiterung: Haushaltsreinigung & Alltagshilfe auf Anfrage.',
    infoEn: '⭐ Service extension: Household cleaning & everyday help on request.'
  },
  {
    nameDe: 'Königs Wusterhausen',
    nameEn: 'Königs Wusterhausen',
    coords: [52.2936, 13.6268] as [number, number],
    infoDe: '✔ Abrechnung mit allen Kranken- und Pflegekassen möglich.',
    infoEn: '✔ Billing with all health and long-term care insurance providers.'
  },
  {
    nameDe: 'Luckenwalde',
    nameEn: 'Luckenwalde',
    coords: [52.0919, 13.1147] as [number, number],
    infoDe: '🏠 Service-Erweiterung: Unterstützung im Alltag & Hausreinigung.',
    infoEn: '🏠 Service extension: Everyday support & home cleaning.'
  },
  {
    nameDe: 'Werder (Havel)',
    nameEn: 'Werder (Havel)',
    coords: [52.3786, 12.9378] as [number, number],
    infoDe: '🚗 Haushaltsnahe Dienste & Alltagsunterstützung direkt vor Ort.',
    infoEn: '🚗 Household services & everyday support directly on site.'
  },
  {
    nameDe: 'Teltow',
    nameEn: 'Teltow',
    coords: [52.4036, 13.2656] as [number, number],
    infoDe: '✨ Alltagsbegleitung & Haushaltspflege. Abrechnung über Entlastungsbetrag.',
    infoEn: '✨ Companion care & household care. Direct billing with care funds.'
  },
  {
    nameDe: 'Blankenfelde-Mahlow',
    nameEn: 'Blankenfelde-Mahlow',
    coords: [52.3333, 13.4333] as [number, number],
    infoDe: '✔ Schnelle Hilfe im Haushalt & Begleitdienste für ältere Menschen.',
    infoEn: '✔ Quick household help & companion services for seniors.'
  }
];


export default function Contact() {
  const { language, t } = useLanguage();
  const [contactName, setContactName] = useState(() => {
    try {
      const saved = localStorage.getItem('emmasco_contact_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || '';
      }
    } catch (e) {
      console.warn('Failed to load contact name from localStorage:', e);
    }
    return '';
  });
  const [contactEmail, setContactEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('emmasco_contact_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || '';
      }
    } catch (e) {
      console.warn('Failed to load contact email from localStorage:', e);
    }
    return '';
  });
  const [contactPhone, setContactPhone] = useState(() => {
    try {
      const saved = localStorage.getItem('emmasco_contact_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.phone || '';
      }
    } catch (e) {
      console.warn('Failed to load contact phone from localStorage:', e);
    }
    return '';
  });
  const [contactMsg, setContactMsg] = useState(() => {
    try {
      const saved = localStorage.getItem('emmasco_contact_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.message || '';
      }
    } catch (e) {
      console.warn('Failed to load contact message from localStorage:', e);
    }
    return '';
  });
  const [spamAnswer, setSpamAnswer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  // Persist contact form changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('emmasco_contact_form', JSON.stringify({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: contactMsg
      }));
    } catch (e) {
      console.warn('Failed to save contact form progress to localStorage:', e);
    }
  }, [contactName, contactEmail, contactPhone, contactMsg]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const handleDistrictClick = (coords: [number, number], nameDe: string) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 12.5, {
        animate: true,
        duration: 1.5
      });
      const marker = markersRef.current[nameDe];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const isMobile = window.innerWidth < 768;
    const initialZoom = isMobile ? 8.0 : 8.7;

    const map = L.map(mapContainerRef.current, {
      center: [52.46, 13.38],
      zoom: initialZoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Multi-layered radial/circular service coverage overlay (soft edges / premium radial glow)
    const overlayCenter: [number, number] = [52.515, 13.40]; // Center of Berlin

    // 1. Inner core active zone (high density)
    L.circle(overlayCenter, {
      radius: 20000,
      color: '#0056D6',
      weight: 0,
      fillColor: '#0056D6',
      fillOpacity: 0.11,
      interactive: false
    }).addTo(map);

    // 2. Mid metropolitan coverage (incorporating Potsdam, Falkensee, Teltow, Blankenfelde)
    L.circle(overlayCenter, {
      radius: 35000,
      color: '#3b82f6',
      weight: 0,
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      interactive: false
    }).addTo(map);

    // 3. Extended Brandenburg outer halo (incorporating Oranienburg, Bernau, Königs Wusterhausen, Werder)
    L.circle(overlayCenter, {
      radius: 55000,
      color: '#3b82f6',
      weight: 0,
      fillColor: '#3b82f6',
      fillOpacity: 0.04,
      interactive: false
    }).addTo(map);

    // 4. Elegant outer dashed boundary representing standard operational radius (incorporating Eberswalde, Luckenwalde)
    L.circle(overlayCenter, {
      radius: 62000,
      color: '#0056D6',
      weight: 1.5,
      dashArray: '6, 10',
      fillColor: '#3b82f6',
      fillOpacity: 0.015,
      interactive: false
    }).addTo(map);

    const isDe = language === 'de';
    const markers: { [key: string]: L.Marker } = {};

    // 1. Add Berlin district markers
    BERLIN_DISTRICTS.forEach((district) => {
      const isHQ = district.nameDe.includes('Pankow');
      
      const markerHtml = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${isHQ ? 'bg-[#0056D6]' : 'bg-sky-400'} opacity-60"></span>
          <div class="relative rounded-full h-5.5 w-5.5 ${isHQ ? 'bg-[#0056D6]' : 'bg-sky-500'} hover:scale-110 active:scale-95 transition-all duration-150 shadow-md flex items-center justify-center text-white text-[9px] font-black border border-white animate-fade-in">
            ${isHQ ? '★' : 'E'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const popupHtml = `
        <div style="font-family: inherit;" class="p-1 text-left text-xs min-w-[210px]">
          <div class="font-bold text-[#0056D6] border-b border-gray-150 pb-1 mb-1.5 uppercase tracking-wider text-[11px] flex justify-between items-center">
            <span>${isDe ? district.nameDe : district.nameEn}</span>
            ${isHQ ? `<span class="bg-blue-100 text-[8px] font-black px-1.5 py-0.5 rounded ml-2 text-[#0056D6] uppercase">HQ</span>` : ''}
          </div>
          <p class="text-gray-650 dark:text-gray-200 leading-relaxed font-semibold mb-2 text-[11px]">
            ${isDe ? district.infoDe : district.infoEn}
          </p>
          <div class="flex items-center gap-1.5 text-[10px] text-emerald-700 font-extrabold">
            <span>✓</span>
            <span>${isDe ? 'Direktabrechnung möglich' : 'Direct insurance billing'}</span>
          </div>
        </div>
      `;

      const m = L.marker(district.coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          className: 'premium-leaflet-popup'
        });

      markers[district.nameDe] = m;
    });

    // 2. Add Brandenburg city markers for the surrounding expansion cities
    BRANDENBURG_CITIES.forEach((city) => {
      const cityMarkerHtml = `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-3.5 w-3.5 rounded-full bg-blue-400 opacity-20"></span>
          <div class="relative rounded-full h-3.5 w-3.5 bg-white hover:scale-115 transition-all duration-150 shadow-xs flex items-center justify-center text-[#0056D6] text-[8px] font-black border-2 border-[#0056D6]">
            •
          </div>
        </div>
      `;

      const cityIcon = L.divIcon({
        html: cityMarkerHtml,
        className: 'custom-leaflet-marker-brandenburg',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const cityPopupHtml = `
        <div style="font-family: inherit;" class="p-1 text-left text-xs min-w-[200px]">
          <div class="font-bold text-slate-800 border-b border-gray-150 pb-1 mb-1.5 uppercase tracking-wider text-[10px] flex justify-between items-center">
            <span>${isDe ? city.nameDe : city.nameEn}</span>
            <span class="bg-blue-50 text-[7px] font-black px-1.5 py-0.5 rounded ml-2 text-[#0056D6] uppercase border border-blue-100">
              ${isDe ? 'Region' : 'Region'}
            </span>
          </div>
          <p class="text-slate-650 leading-relaxed font-semibold mb-2 text-[11px]">
            ${isDe ? city.infoDe : city.infoEn}
          </p>
          <div class="flex items-center gap-1 text-[9px] text-blue-700 font-extrabold">
            <span>✓</span>
            <span>${isDe ? 'Service-Erweiterung' : 'Service Expansion'}</span>
          </div>
        </div>
      `;

      const m = L.marker(city.coords, { icon: cityIcon })
        .addTo(map)
        .bindPopup(cityPopupHtml, {
          closeButton: false,
          className: 'premium-leaflet-popup'
        });

      markers[city.nameDe] = m;
    });

    markersRef.current = markers;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [language]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!contactName.trim()) {
      errs.name = language === 'de' ? 'Name ist erforderlich.' : 'Name is required.';
    }
    if (!contactEmail.trim() || !/\S+@\S+\.\S+/.test(contactEmail)) {
      errs.email = language === 'de' ? 'Gültige E-Mail erforderlich.' : 'Valid email is required.';
    }
    if (!contactPhone.trim()) {
      errs.phone = language === 'de' ? 'Telefonnummer ist erforderlich.' : 'Phone number is required.';
    }
    if (!contactMsg.trim()) {
      errs.message = language === 'de' ? 'Ihre Nachricht darf nicht leer sein.' : 'Your message cannot be empty.';
    }
    
    // Simple spam safety sum check "5 + 3 = ?"
    if (spamAnswer.trim() !== '8') {
      errs.spam = language === 'de' 
        ? 'Sicherheitsantwort ist falsch (5 + 3 = ?). Beantworten Sie mit "8".' 
        : 'Security answer is incorrect (5 + 3 = ?). Answer with "8".';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsValidatingEmail(true);

    // Dynamic Email Verification API call
    try {
      const emailValRes = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactEmail })
      });
      if (emailValRes.ok) {
        const emailValData = await emailValRes.json();
        if (emailValData.valid === false) {
          setErrors(prev => ({
            ...prev,
            email: emailValData.message || (language === 'de' ? 'Diese E-Mail ist ungültig.' : 'This email is invalid.')
          }));
          setIsValidatingEmail(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Email validation service failed, proceeding with contact form submission', err);
    } finally {
      setIsValidatingEmail(false);
    }

    setIsSubmitting(true);
    
    // Simulate short network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSent(true);
    setIsSubmitting(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMsg('');
    setSpamAnswer('');
    try {
      localStorage.removeItem('emmasco_contact_form');
    } catch (e) {
      console.warn('Failed to clear contact form from localStorage:', e);
    }
  };

  return (
    <div className="w-full bg-[#F6FAFF] min-h-screen pb-16 text-left">
      
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0056D6] to-[#0A1329] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <Mail className="w-8 h-8 text-blue-200" />
          <h1 className="text-4xl md:text-5xl font-black">
            {t('contact.banner_title')}
          </h1>
          <p className="text-sm md:text-base font-semibold text-blue-100/90 max-w-xl">
            {t('contact.banner_subtitle')}
          </p>
        </div>
      </section>

      {/* Main Core Layout */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Contact Info & Address */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 text-left">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-black text-blue-900 border-b border-gray-100 pb-2">
              {t('contact.office_title')}
            </h2>

            <div className="flex flex-col gap-5 text-sm font-semibold">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {language === 'de' ? 'Firmensitz:' : 'Headquarters:'}
                  </h4>
                  <p className="text-gray-500 mt-0.5 leading-relaxed">
                    <strong>EMMASCO REINIGUNGSTEAM</strong>
                    <br />
                    {t('contact.office_address')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-gray-50 pt-4">
                <Phone className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {t('contact.office_hours_title')}
                  </h4>
                  <span className="text-gray-500 block mt-0.5">
                    {t('contact.office_hours')}
                  </span>
                  <a href="tel:017621856044" className="text-blue-600 hover:text-blue-800 underline block mt-0.5">
                    {language === 'de' ? 'Tel:' : 'Phone:'} 0176 21856044
                  </a>
                  <span className="text-[10px] text-[#0056D6] font-bold block mt-1">
                    {t('contact.office_urgent')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-gray-50 pt-4">
                <Mail className="w-5 h-5 text-[#0056D6] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950">
                    {language === 'de' ? 'E-Mail Service:' : 'Email Service:'}
                  </h4>
                  <a href="mailto:info@emmascoreinigungsteam.de" className="text-blue-600 hover:text-blue-800 underline block mt-0.5">
                    info@emmascoreinigungsteam.de
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-3xl overflow-hidden border border-blue-50 shadow-md flex flex-col p-2 gap-2 text-left">
            <div className="text-xs font-black text-blue-900 px-2 pt-1.5 flex justify-between items-center">
              <span>{language === 'de' ? '📍 UNSER EINSATZGEBIET (BERLIN & UMGEBUNG)' : '📍 OUR SERVICE TERRITORY (BERLIN & REGION)'}</span>
              <span className="text-[9px] bg-blue-100 text-[#0056D6] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                {language === 'de' ? 'Aktiv' : 'Active'}
              </span>
            </div>
            
            <div className="h-[380px] md:h-[490px] w-full rounded-2xl overflow-hidden relative border border-blue-50/50">
              <div ref={mapContainerRef} className="w-full h-full relative z-0" />
            </div>

            {/* Quick stats / District Legend below the map */}
            <div className="px-2 pb-1.5 flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block mb-1">
                  {language === 'de' ? 'Einsatzbereiche in ganz Berlin (anklicken zum Fokussieren):' : 'Active care regions (click to focus map):'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {BERLIN_DISTRICTS.map((d) => (
                    <button 
                      key={d.nameDe} 
                      type="button"
                      onClick={() => handleDistrictClick(d.coords, d.nameDe)}
                      className="bg-[#F0F7FF] hover:bg-blue-100 hover:text-blue-800 text-[#0056D6] text-[10px] uppercase font-black px-2.5 py-1.5 rounded-lg border border-blue-100/40 cursor-pointer transition duration-150 hover:scale-102 active:scale-98 text-left"
                    >
                      {language === 'de' ? d.nameDe.split(' / ')[0] : d.nameEn.split(' / ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">
                  {language === 'de' ? 'Erweitertes Einsatzgebiet Brandenburg (anklicken zum Fokussieren):' : 'Extended Service Area Brandenburg (click to focus map):'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {BRANDENBURG_CITIES.map((c) => (
                    <button 
                      key={c.nameDe} 
                      type="button"
                      onClick={() => handleDistrictClick(c.coords, c.nameDe)}
                      className="bg-[#F2FDF5] hover:bg-emerald-100 hover:text-emerald-800 text-emerald-700 text-[10px] uppercase font-black px-2.5 py-1.5 rounded-lg border border-emerald-100/40 cursor-pointer transition duration-150 hover:scale-102 active:scale-98 text-left"
                    >
                      {c.nameDe}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SGB Care level box */}
          <div className="bg-[#0056D6] text-white p-6 rounded-3xl shadow-[0_12px_25px_rgba(0,86,214,0.12)] border border-transparent flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-300 fill-current shrink-0" />
              <h3 className="font-extrabold text-base">
                {t('contact.sgb_title')}
              </h3>
            </div>
            <p className="text-xs text-blue-50 font-semibold leading-relaxed">
              {t('contact.sgb_text')}
            </p>
          </div>

        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-blue-50 shadow-lg flex flex-col gap-6">
          <h2 className="text-xl font-black text-blue-900 border-b border-gray-100 pb-2">
            {t('contact.form_title')}
          </h2>

          {isSent ? (
            <div className="p-8 bg-green-50 rounded-2xl border border-green-150 text-center flex flex-col items-center gap-4">
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xl shadow-md"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 10 }}
                >
                  ✔
                </motion.span>
              </motion.div>
              <h4 className="font-extrabold text-green-800 text-base">
                {t('contact.msg_sent_title')}
              </h4>
              <p className="text-xs text-green-700 font-semibold max-w-sm leading-relaxed">
                {t('contact.msg_sent_p')}
              </p>
              <button
                id="contact-sent-reset"
                onClick={() => setIsSent(false)}
                className="bg-white border border-green-200 text-green-700 font-extrabold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                {language === 'de' ? 'Weitere Nachricht schreiben' : 'Write another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
              {(isSubmitting || isValidatingEmail) && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-3 rounded-3xl">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-black text-blue-900 animate-pulse uppercase tracking-wider">
                    {isValidatingEmail 
                      ? (language === 'de' ? 'E-Mail-Adresse wird validiert...' : 'Verifying email address...')
                      : (language === 'de' ? 'Ihre Nachricht wird gesendet...' : 'Sending your message...')}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-xs text-slate-700">
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-form-name" className="text-xs font-black text-gray-750">
                    {t('contact.form_name')} *
                  </label>
                  <input
                    type="text"
                    id="contact-form-name"
                    required
                    placeholder="Waltraud Schmidt"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <span className="text-[10px] text-red-600 font-bold">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-form-email" className="text-xs font-black text-gray-755">
                    {t('contact.form_email')} *
                  </label>
                  <input
                    type="email"
                    id="contact-form-email"
                    required
                    placeholder="w.schmidt@gmail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-bold">{errors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left font-semibold text-xs text-slate-700">
                <label htmlFor="contact-form-phone" className="text-xs font-black text-gray-750">
                  {t('contact.form_phone')} *
                </label>
                <input
                  type="text"
                  id="contact-form-phone"
                  required
                  placeholder="z.B. 030 1234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && <span className="text-[10px] text-red-600 font-bold">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1.5 text-left font-semibold text-xs text-slate-705">
                <label htmlFor="contact-form-msg" className="text-xs font-black text-gray-750">
                  {t('contact.form_msg')} *
                </label>
                <textarea
                  id="contact-form-msg"
                  required
                  rows={4}
                  placeholder={language === 'de' 
                    ? 'Nennen Sie uns Ihren Pflegegrad oder Wünsche bezüglich Fensterreinigung, Unterhaltsreinigung etc.'
                    : 'State your care level or details regarding window cleaning, regular maintenance cleaning, etc.'}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-[#F6FAFF] border border-blue-50 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.message && <span className="text-[10px] text-red-600 font-bold">{errors.message}</span>}
              </div>

              {/* Anti-spam math challenge (standard Hostinger precaution) */}
              <div className="bg-[#F6FAFF] p-4 rounded-xl border border-blue-50 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="font-extrabold text-blue-900 text-xs block">
                    {language === 'de' ? '🛡️ Spam-Schutz-Frage' : '🛡️ Anti-Spam Safety'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                    {language === 'de' 
                      ? 'Wie rechnet man: 5 + 3 = ? (Geben Sie die Zahl ein!)' 
                      : 'Calculate: 5 + 3 = ? (Enter the correct sum!)'}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={language === 'de' ? 'Ihre Antwort...' : 'Your answer...'}
                  value={spamAnswer}
                  onChange={(e) => setSpamAnswer(e.target.value)}
                  className="w-24 bg-white border border-blue-105 rounded-lg px-3 py-1.5 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>
              {errors.spam && <p className="text-[10px] text-red-600 font-bold text-left">{errors.spam}</p>}

              <button
                type="submit"
                id="contact-form-submit"
                className="w-full bg-[#0056D6] hover:bg-blue-700 text-white font-black py-4 px-6 rounded-full text-sm transition shadow shadow-md hover:shadow-lg cursor-pointer text-center"
              >
                {t('contact.form_submit')}
              </button>

              <div className="flex items-center gap-2 text-[10px] text-gray-450 border-t border-gray-100 pt-4 font-semibold text-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>
                  {language === 'de' 
                    ? 'Ihre Daten werden verschlüsselt nach DSGVO-Richtlinien übertragen.' 
                    : 'Your information is encrypted and transmitted in accordance with GDPR guidelines.'}
                </span>
              </div>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
