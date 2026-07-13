import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MapPin, Clock, CheckCircle2, Play, AlertTriangle, FileImage, 
  User, Phone, ChevronRight, Check, X, LogOut, Navigation, Award, DollarSign,
  TrendingUp, CalendarDays, Eye, Camera, RefreshCw
} from 'lucide-react';
import { useToast } from '../ToastContext';
import { motion, AnimatePresence } from 'motion/react';

interface StaffDashboardProps {
  userEmail: string;
  userName: string;
  onLogout: () => void;
}

interface AssignedJob {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  coords?: [number, number]; // Berlin coordinates
}

export default function StaffDashboard({
  userEmail,
  userName,
  onLogout
}: StaffDashboardProps) {
  const { success, error, warning, info } = useToast();
  const [jobs, setJobs] = useState<AssignedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<AssignedJob | null>(null);
  
  // Timer state for active check-in
  const [checkedInJobId, setCheckedInJobId] = useState<string | null>(() => localStorage.getItem('checkedInJobId'));
  const [timerSeconds, setTimerSeconds] = useState<number>(() => Number(localStorage.getItem('timerSeconds') || '0'));
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Completion photo upload
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [photoTitles, setPhotoTitles] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [problemReport, setProblemReport] = useState('');
  const [showProblemModal, setShowProblemModal] = useState(false);

  // Availability calendar state (weekly grid)
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    Montag: true,
    Dienstag: true,
    Mittwoch: true,
    Donnerstag: true,
    Freitag: true,
    Samstag: false,
    Sonntag: false
  });

  // Load Leaflet stylesheet dynamically
  useEffect(() => {
    const linkId = 'leaflet-style-link';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Fetch jobs assigned to this cleaner
  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter jobs. For the demo, if cleanerName matches or if they are assigned
          const staffJobs = data.filter((b: any) => 
            b.cleanerName?.toLowerCase() === userName.toLowerCase() || 
            b.cleanerName?.toLowerCase() === userEmail.toLowerCase() ||
            b.status === 'assigned' ||
            b.status === 'in_progress' ||
            // Pre-populated demo assignments
            (userName.toLowerCase().includes('friend') && b.id.startsWith('EM-'))
          );

          // Map with some dummy coordinates in Berlin for mapping
          const mapped: AssignedJob[] = staffJobs.map((j: any, idx: number) => {
            const berlinLat = 52.520008 + (Math.random() - 0.5) * 0.1;
            const berlinLng = 13.404954 + (Math.random() - 0.5) * 0.1;
            return {
              ...j,
              coords: [berlinLat, berlinLng]
            };
          });

          setJobs(mapped);
          if (mapped.length > 0 && !selectedJob) {
            setSelectedJob(mapped[0]);
          }
        }
      })
      .catch(err => {
        error('Fehler beim Laden der Aufträge.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [userName, userEmail]);

  // Leaflet Map Initialization
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedJob || !mapContainerRef.current) return;

    // Reset previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    import('leaflet').then((L) => {
      const jobCoords = selectedJob.coords || [52.520008, 13.404954];
      const cleanerCoords: [number, number] = [jobCoords[0] + 0.015, jobCoords[1] - 0.012]; // Simulated cleaner starting location

      const map = L.map(mapContainerRef.current!).setView(cleanerCoords, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // Custom markers
      const cleanerIcon = L.divIcon({
        className: 'custom-cleaner-icon',
        html: `<div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const customerIcon = L.divIcon({
        className: 'custom-customer-icon',
        html: `<div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Markers
      L.marker(cleanerCoords, { icon: cleanerIcon })
        .addTo(map)
        .bindPopup('<b>Ihr Standort (Start)</b>')
        .openPopup();

      L.marker(jobCoords, { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>Kunde: ${selectedJob.customerName}</b><br/>${selectedJob.address}`);

      // Draw route line
      const routeLine = L.polyline([cleanerCoords, jobCoords], {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);

      // Fit bounds
      map.fitBounds([cleanerCoords, jobCoords], { padding: [40, 40] });
      
      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedJob]);

  // Handle active check-in timer tick
  useEffect(() => {
    if (checkedInJobId) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          const next = prev + 1;
          localStorage.setItem('timerSeconds', next.toString());
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [checkedInJobId]);

  // Formatted Timer Display (hh:mm:ss)
  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check In handler
  const handleCheckIn = (jobId: string) => {
    setCheckedInJobId(jobId);
    setTimerSeconds(0);
    localStorage.setItem('checkedInJobId', jobId);
    localStorage.setItem('timerSeconds', '0');

    // Call API to mark job status as 'in_progress'
    updateJobStatus(jobId, 'in_progress');
    success('Erfolgreich eingecheckt! Der Timer läuft.');
  };

  // Check Out handler
  const handleCheckOut = () => {
    if (!checkedInJobId) return;
    const finalTimeFormatted = formatTimer(timerSeconds);

    // Call API to mark job status as 'completed'
    updateJobStatus(checkedInJobId, 'completed');

    // Notify backend/log completion with details
    fetch(`/api/bookings/${checkedInJobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'completed',
        notes: `Arbeitszeit: ${finalTimeFormatted}. Notizen: ${sessionNotes}.`
      })
    })
    .then(() => {
      // Clear localStorage timer
      localStorage.removeItem('checkedInJobId');
      localStorage.removeItem('timerSeconds');
      setCheckedInJobId(null);
      setTimerSeconds(0);
      setSessionNotes('');
      setCompletionPhotos([]);
      setPhotoTitles([]);
      success(`Arbeit abgeschlossen! Dauer: ${finalTimeFormatted}`);
      fetchJobs();
    });
  };

  const updateJobStatus = (jobId: string, status: any) => {
    fetch(`/api/bookings/${jobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => {
      fetchJobs();
    });
  };

  const handleAcceptJob = (jobId: string) => {
    updateJobStatus(jobId, 'confirmed');
    success('Auftrag erfolgreich angenommen!');
  };

  const handleRejectJob = (jobId: string) => {
    updateJobStatus(jobId, 'cancelled');
    warning('Auftrag abgelehnt.');
  };

  // Handle drag-and-drop file upload for completion photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCompletionPhotos(prev => [...prev, reader.result as string]);
          setPhotoTitles(prev => [...prev, file.name]);
          // Sync photo to backend gallery as a Completed Job Photo category
          fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `Completion Photo: ${selectedJob?.customerName} (${file.name})`,
              category: 'before_after',
              url: reader.result,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              isBefore: false
            })
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Toggle availability days
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => {
      const updated = { ...prev, [day]: !prev[day] };
      // Save availability changes in localStorage or API
      info(`Verfügbarkeit für ${day} aktualisiert.`);
      return updated;
    });
  };

  const handleReportProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemReport.trim()) return;

    // Send notification/warning email automatically
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: 'solomonegazi@gmail.com', // alert admin
        title: 'PROBLEMMELDUNG: Mitarbeiter vor Ort',
        message: `Mitarbeiter ${userName} meldet folgendes Problem für Auftrag ${selectedJob?.id} (${selectedJob?.customerName}): "${problemReport}"`
      })
    })
    .then(() => {
      warning('Problem an den Administrator gemeldet!');
      setShowProblemModal(false);
      setProblemReport('');
    });
  };

  // Calculate statistics
  const completedJobsCount = jobs.filter(j => j.status === 'completed').length;
  const pendingJobsCount = jobs.filter(j => j.status === 'assigned' || j.status === 'confirmed').length;
  const estimatedEarnings = jobs
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + (j.totalPrice || 120), 0) * 0.75; // Cleaner receives 75% commission

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/60 pb-16 transition-colors duration-300">
      {/* Upper Brand / Welcome bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-10 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Mitarbeiter Portal</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                Hallo, {userName}! 
                <span className="text-emerald-300 text-base animate-pulse font-medium flex items-center gap-1">
                  ● Aktiv im Dienst
                </span>
              </h1>
              <p className="text-blue-100/90 text-xs font-semibold mt-1">E-Mail: {userEmail}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Aktualisieren
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 active:scale-95 text-red-100 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-red-400/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              Abmelden
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Stats/Jobs List Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Dashboard Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Erledigt</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{completedJobsCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm text-left">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-slate-800/70 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Anstehend</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{pendingJobsCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Verdienst</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{estimatedEarnings.toFixed(2)} €</p>
            </div>
          </div>

          {/* Jobs List Panel */}
          <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-3xl shadow-md p-6 flex flex-col">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-500" />
              Ihr Arbeitsplan ({jobs.length} Aufträge)
            </h2>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <p className="text-xs">Lade zugewiesene Schichten...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-slate-500 bg-gray-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Award className="w-10 h-10 mx-auto text-gray-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-bold">Keine aktuellen Aufträge zugewiesen.</p>
                <p className="text-[11px] mt-1">Verfügbarkeiten prüfen oder Administrator kontaktieren.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {jobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  const isCompleted = job.status === 'completed';
                  const isInProgress = job.status === 'in_progress';

                  return (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center group cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-slate-800/40'
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : isInProgress
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 animate-pulse'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-gray-900 dark:text-white">{job.customerName}</span>
                            <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                              {job.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold mt-0.5">{job.serviceName}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400 font-bold font-mono">
                            <span className="flex items-center gap-0.5">
                              <CalendarDays className="w-3 h-3 text-blue-500" />
                              {job.date}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-blue-500" />
                              {job.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'translate-x-1 text-blue-500' : ''}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Availability Grid */}
          <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-3xl shadow-md p-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              Mitarbeiter-Verfügbarkeit
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 font-semibold leading-relaxed">
              Klicken Sie auf Ihre Arbeitstage, um dem Administrator zu signalisieren, an welchen Wochentagen Sie Schichten übernehmen können.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(availability).map(day => {
                const active = availability[day];
                return (
                  <button
                    key={day}
                    onClick={() => toggleDayAvailability(day)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/60'
                    }`}
                  >
                    <span>{day.substring(0, 3)}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${active ? 'bg-white text-blue-600 border-white' : 'border-gray-300'}`}>
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Active Session / Job Details Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {selectedJob ? (
            <>
              {/* Check-In timer card if active */}
              {checkedInJobId === selectedJob.id && (
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                      Aktiver Einsatz läuft
                    </span>
                    <h3 className="text-xl font-black mt-1.5">{selectedJob.customerName}</h3>
                    <p className="text-xs text-emerald-100 font-semibold mt-0.5">{selectedJob.address}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black tracking-widest font-mono">{formatTimer(timerSeconds)}</span>
                    <span className="text-[9px] text-emerald-200 uppercase tracking-wider mt-1">Aktuelle Arbeitszeit</span>
                  </div>
                </div>
              )}

              {/* Job Details Card */}
              <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-3xl shadow-md p-6">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      Auftragsdetails
                    </span>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                      {selectedJob.customerName}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedJob.status === 'assigned' && (
                      <>
                        <button
                          onClick={() => handleAcceptJob(selectedJob.id)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Zusagen
                        </button>
                        <button
                          onClick={() => handleRejectJob(selectedJob.id)}
                          className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Ablehnen
                        </button>
                      </>
                    )}

                    {selectedJob.status === 'confirmed' && !checkedInJobId && (
                      <button
                        onClick={() => handleCheckIn(selectedJob.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Dienst Einchecken
                      </button>
                    )}

                    {checkedInJobId !== selectedJob.id && selectedJob.status === 'in_progress' && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-full text-xs font-bold animate-pulse">
                        Anderer Mitarbeiter eingecheckt
                      </span>
                    )}

                    {selectedJob.status === 'completed' && (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Einsatz Abgeschlossen
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Address Info & Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Adresse</p>
                        <p className="text-xs font-black text-gray-800 dark:text-slate-200 mt-0.5">{selectedJob.address}</p>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(selectedJob.address)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 mt-1"
                        >
                          <Navigation className="w-3 h-3" />
                          In Google Maps öffnen
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <User className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Kontakt</p>
                        <p className="text-xs font-black text-gray-800 dark:text-slate-200 mt-0.5">{selectedJob.customerName}</p>
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400 font-semibold font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {selectedJob.phone || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Gebuchte Dienstleistung</p>
                        <p className="text-xs font-black text-gray-800 dark:text-slate-200 mt-0.5">{selectedJob.serviceName}</p>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold mt-1">Notiz: {selectedJob.notes || 'Keine speziellen Notizen hinterlegt.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Leaflet Map Box */}
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-inner h-[180px] relative bg-slate-100">
                    <div ref={mapContainerRef} className="w-full h-full z-10" id="staff-map-container" />
                  </div>
                </div>

                {/* Problem Reporting & Help Trigger */}
                {selectedJob.status !== 'completed' && (
                  <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-100/50 dark:border-red-900/40 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                      <div className="text-left">
                        <p className="text-[11px] font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Problem vor Ort?</p>
                        <p className="text-[10px] text-red-600/80 dark:text-red-400/80 font-semibold mt-0.5">Verschmutzung zu stark, Schlüssel fehlt, etc.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProblemModal(true)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shrink-0 active:scale-95 cursor-pointer shadow-sm"
                    >
                      Problem Melden
                    </button>
                  </div>
                )}
              </div>

              {/* Check-Out Panel (Shown only when checked in) */}
              {checkedInJobId === selectedJob.id && (
                <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-3xl shadow-md p-6 flex flex-col gap-5 text-left">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Diensteinsatz abschließen & protokollieren
                  </h3>

                  {/* Completion Notes */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Bericht / Arbeitsnotizen
                    </label>
                    <textarea
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Welche Aufgaben wurden durchgeführt? Gab es Besonderheiten? (z.B. Küche glänzt, Müll entsorgt)"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  {/* Drag and Drop Uploader with Previews */}
                  <div>
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                      Nachher-Fotos Hochladen (Dokumentation)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Photo Box */}
                      <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                        <Camera className="w-6 h-6 text-slate-400" />
                        <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">Completion Foto aufnehmen</span>
                        <span className="text-[9px] text-gray-400 font-semibold">Bilder oder Dokumente per Drag & Drop</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Photo Previews */}
                      <div className="flex flex-wrap gap-2 content-start border border-dashed border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 min-h-[100px]">
                        {completionPhotos.length === 0 ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-slate-700 py-4">
                            <FileImage className="w-6 h-6" />
                            <p className="text-[10px] mt-1 font-semibold">Keine Fotos hochgeladen</p>
                          </div>
                        ) : (
                          completionPhotos.map((photo, pIdx) => (
                            <div key={pIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm">
                              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => {
                                  setCompletionPhotos(prev => prev.filter((_, idx) => idx !== pIdx));
                                  setPhotoTitles(prev => prev.filter((_, idx) => idx !== pIdx));
                                }}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                    <button
                      onClick={handleCheckOut}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Einsatz Beenden & Auschecken
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-blue-50/60 dark:border-slate-800/80 rounded-3xl p-12 text-center text-gray-400 shadow-md">
              <Clock className="w-12 h-12 mx-auto text-blue-200 mb-4 animate-bounce" />
              <h3 className="text-base font-black text-gray-800 dark:text-white">Arbeitsplan Auswählen</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                Bitte wählen Sie links eine Schicht aus, um die Route zu berechnen und einzuchecken.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Problem Report Modal */}
      <AnimatePresence>
        {showProblemModal && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-red-50 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowProblemModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-black tracking-tight">Einsatzproblem Melden</h3>
              </div>

              <form onSubmit={handleReportProblemSubmit} className="space-y-4 text-left">
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Das Büro wird sofort über dieses Problem benachrichtigt. Der Administrator wird sich bei Bedarf direkt mit dem Kunden in Verbindung setzen.
                </p>

                <div>
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Problembeschreibung
                  </label>
                  <textarea
                    required
                    value={problemReport}
                    onChange={(e) => setProblemReport(e.target.value)}
                    placeholder="Beschreiben Sie das Problem (z.B. 'Der Schlüssel liegt nicht im vereinbarten Safe', 'Kundin öffnet die Tür nicht')"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white focus:outline-none focus:border-red-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProblemModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Problem absenden
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
