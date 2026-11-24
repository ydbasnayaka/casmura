import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { REGIONS_SERVED } from '../../server/seedData.ts';
import type { TechnicalDocument } from '../types/casmura.ts';
import { BrandMark } from './BrandMark.tsx';

interface ContactPageProps {
  documents: TechnicalDocument[];
}

export function ContactPage({ documents }: ContactPageProps) {
  const [activeTab, setActiveTab] = useState<'rfq' | 'consultation'>('rfq');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Multi-step RFQ fields
  const [projectLocation, setProjectLocation] = useState('Maldives');
  const [companyName, setCompanyName] = useState('');
  const [roomCount, setRoomCount] = useState('25 - 75 Villas / Suites');
  const [productInterest, setProductInterest] = useState<string[]>([
    'Curtains & Drapery',
  ]);
  const [automationNeeded, setAutomationNeeded] = useState('KNX / GRMS Motorized');
  const [timeline, setTimeline] = useState('Q3 2026');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Consultation tab fields
  const [consultDate, setConsultDate] = useState('');
  const [consultFormat, setConsultFormat] = useState('Virtual Technical Briefing');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const toggleProduct = (label: string) => {
    setProductInterest((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab === 'rfq' ? 'quote' : 'consultation',
          fullName,
          companyName,
          email,
          phone,
          projectLocation,
          productInterest: productInterest.join(', ') || 'Contract Shading Systems',
          roomCount,
          automationNeeded,
          timeline,
          consultationDate: activeTab === 'consultation' ? consultDate : undefined,
          consultationFormat: activeTab === 'consultation' ? consultFormat : undefined,
          message:
            message ||
            `${activeTab === 'rfq' ? 'Multi-step RFQ' : 'Consultation'} for ${roomCount} in ${projectLocation}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed. Please verify required fields.');
      } else {
        setSubmittedRef(data.referenceCode);
      }
    } catch {
      setError('Network error while connecting to the estimation server.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setStep(1);
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="glass-ambient-light">
      {/* Page Hero Banner (PDF 4) */}
      <section className="relative bg-[#191F2B] text-white py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,161,91,0.16),transparent_55%)] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <BrandMark variant="dark" />
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C5A15B]">
                Estimation & Specification Desk
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                Let's Create Something Exceptional.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Submit your project BOQ requirements, schedule a sampling presentation,
                or connect directly with our Colombo contract desk via WhatsApp.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/94777771775?text=Hello%20Casmura%20Contract%2C%20we%20would%20like%20to%20discuss%20a%20hospitality%20project%20quotation."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#142B49] hover:bg-[#1B365A] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md border border-[#C5A15B]/45 transition-colors self-start lg:self-auto shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#C5A15B]" />
            <span>Direct WhatsApp Desk</span>
          </a>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels & Document Downloads */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel-light glass-card-hover rounded-xl p-6 space-y-5">
              <h2 className="font-display text-lg font-bold text-[#142B49]">
                Regional Headquarters
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#142B49]">Casmura Contract</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      No. 25/1/1, Elibank Rd, Colombo, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#142B49]">Email Consultation</p>
                    <a
                      href="mailto:contract.marketing@lightnshade.com"
                      className="text-slate-600 hover:text-[#8C6B2D] text-xs mt-0.5 block break-all"
                    >
                      contract.marketing@lightnshade.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#142B49]">Direct Line & WhatsApp</p>
                    <a
                      href="tel:+94777771775"
                      className="text-slate-600 hover:text-[#8C6B2D] text-xs mt-0.5 block tabular-nums"
                    >
                      +94 77 777 1 775
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#142B49]">Business Hours</p>
                    <p className="text-slate-600 text-xs mt-0.5 tabular-nums">
                      09.00 AM – 05.00 PM (Mon – Sat)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel-light glass-card-hover rounded-xl p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-[#142B49]">
                Download Specification Packs
              </h2>
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/api/documents/${doc.id}/download`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#142B49]/12 hover:border-[#C5A15B] text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#142B49] truncate">{doc.title}</p>
                      <p className="text-[11px] font-mono text-slate-500">{doc.fileCode}</p>
                    </div>
                    <Download className="w-4 h-4 text-[#C5A15B] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Smart Multi-Step RFQ & Consultation Form */}
          <div className="lg:col-span-8 glass-panel-navy text-white rounded-xl p-6 sm:p-9">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {activeTab === 'rfq'
                    ? 'Smart Multi-Step Project RFQ'
                    : 'Schedule Technical Consultation'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Structured for resort developers, architects, and procurement teams.
                </p>
              </div>

              <div className="inline-flex p-1 glass-tabs-dark rounded-lg self-start">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('rfq');
                    setSubmittedRef(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'rfq'
                      ? 'bg-white text-[#142B49]'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Request Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('consultation');
                    setSubmittedRef(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'consultation'
                      ? 'bg-white text-[#142B49]'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Book Consultation
                </button>
              </div>
            </div>

            {submittedRef ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#C5A15B] mx-auto" />
                <h3 className="font-display text-2xl font-bold">
                  Submission Confirmed
                </h3>
                <p className="text-sm text-slate-300">
                  Your estimation reference number is{' '}
                  <span className="font-mono text-[#C5A15B] font-bold">
                    {submittedRef}
                  </span>
                </p>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been logged in the Casmura estimation pipeline. You may
                  also send architectural drawings or CAD schedules directly via WhatsApp.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/94777771775?text=${encodeURIComponent(
                      `Hello Casmura Contract, referencing ${submittedRef} for ${companyName || fullName} (${projectLocation}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#191F2B] hover:bg-[#1B365A] border border-[#C5A15B]/45 text-white text-xs font-bold uppercase"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C5A15B]" />
                    <span>Attach Drawings on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-md bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-bold uppercase cursor-pointer"
                  >
                    New Request
                  </button>
                </div>
              </div>
            ) : activeTab === 'rfq' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step Indicator */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-bold uppercase tracking-wider">
                  {[
                    { num: 1, label: '01. Project Profile' },
                    { num: 2, label: '02. Shading & BMS Scope' },
                    { num: 3, label: '03. Contact & Submit' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setStep(s.num as 1 | 2 | 3)}
                      className={`py-2 px-3 rounded text-left border transition-colors cursor-pointer ${
                        step === s.num
                          ? 'bg-[#C5A15B]/20 border-[#C5A15B] text-white'
                          : step > s.num
                          ? 'bg-white/5 border-white/25 text-white'
                          : 'bg-transparent border-white/10 text-slate-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="p-3 rounded bg-red-500/20 border border-red-400/40 text-xs text-red-100">
                    {error}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Project Country / Atoll *
                        </label>
                        <select
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        >
                          {REGIONS_SERVED.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                          <option value="Other International">Other International</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Hospitality Brand / Development Name
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g., Island Sanctuary Resort"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Approximate Key / Villa Count
                        </label>
                        <select
                          value={roomCount}
                          onChange={(e) => setRoomCount(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        >
                          <option>Under 25 Villas / Suites</option>
                          <option>25 - 75 Villas / Suites</option>
                          <option>75 - 150 Guest Rooms</option>
                          <option>150+ Multi-Wing Resort</option>
                          <option>Private Luxury Residence</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Target Commissioning Window
                        </label>
                        <input
                          type="text"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          placeholder="e.g., Q3 2026"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase px-6 py-3 rounded-md cursor-pointer"
                      >
                        <span>Next: Shading Scope</span>
                        <Play className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Required Product Systems (Select all applicable)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'Curtains & Drapery',
                          'Indoor Solar & Blackout Blinds',
                          'Outdoor Marine Zip-Screens & Monsoon Blinds',
                          'Bioclimatic Pergolas & Retractable Roofs',
                          'Motorized Track Systems',
                          'Loose Furniture, Carpets & Upholstery',
                        ].map((item) => {
                          const active = productInterest.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleProduct(item)}
                              className={`px-3.5 py-2.5 rounded-md text-left text-xs font-semibold border transition-colors cursor-pointer ${
                                active
                                  ? 'bg-white text-[#142B49] border-white'
                                  : 'bg-white/5 text-white border-white/15 hover:border-[#C5A15B]/60'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Motorization & BMS Integration Requirement
                      </label>
                      <select
                        value={automationNeeded}
                        onChange={(e) => setAutomationNeeded(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                      >
                        <option>KNX / GRMS Motorized</option>
                        <option>Crestron / Control4 / Lutron</option>
                        <option>Standalone RF / Wall Switch Motorized</option>
                        <option>Manual Contract Tracks Only</option>
                        <option>Mixed Motorized (Villas) + Manual</option>
                      </select>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-md border border-white/25 text-xs font-bold uppercase cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase px-6 py-3 rounded-md cursor-pointer"
                      >
                        <span>Next: Contact Details</span>
                        <Play className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Full Name & Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Arch. / Eng. / Procurement Lead"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Direct Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 77 ..."
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Additional Specifications or Window Schedule Notes
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Mention ceiling pocket dimensions, fire safety codes (NFPA 701 / BS 5867), or sample dispatch address..."
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-md border border-white/25 text-xs font-bold uppercase cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-white hover:bg-[#F3F1EC] disabled:opacity-60 text-[#142B49] text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-md cursor-pointer"
                      >
                        {submitting ? 'Submitting RFQ...' : 'Submit Technical Proposal Request'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded bg-red-500/20 border border-red-400/40 text-xs text-red-100">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Arch. / Eng. / Mr. / Mrs."
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Company / Resort
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Organization name"
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Project Location *
                    </label>
                    <select
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                    >
                      {REGIONS_SERVED.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Preferred Consultation Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={consultDate}
                        onChange={(e) => setConsultDate(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Meeting Format
                    </label>
                    <select
                      value={consultFormat}
                      onChange={(e) => setConsultFormat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                    >
                      <option>Virtual Technical Briefing</option>
                      <option>Colombo Showroom Sampling</option>
                      <option>On-Site Resort Assessment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Agenda / Topics to Cover
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Fabric sample selection, BMS wiring review, or site measurement scheduling..."
                    className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white hover:bg-[#F3F1EC] disabled:opacity-60 text-[#142B49] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-md cursor-pointer"
                >
                  {submitting ? 'Booking...' : 'Confirm Technical Consultation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
