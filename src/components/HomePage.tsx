import {
  Award,
  Building,
  CheckCircle2,
  CreditCard,
  Download,
  Headphones,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  SlidersHorizontal,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { REGIONS_SERVED } from '../../server/seedData.ts';
import type {
  ClientLogo,
  PageRoute,
  ProductItem,
  ProjectCaseStudy,
  SiteContentConfig,
  TechnicalDocument,
  TestimonialItem,
} from '../types/casmura.ts';
import { AutomationPartnersGrid } from './AutomationPartnersGrid.tsx';
import { ClientLogoMarquee } from './ClientLogoMarquee.tsx';
import { InteractiveCurtainSimulator } from './InteractiveCurtainSimulator.tsx';
import { MaterialComparisonSection } from './MaterialComparisonSection.tsx';
import { SafeImage } from './SafeImage.tsx';

interface HomePageProps {
  products: ProductItem[];
  projects: ProjectCaseStudy[];
  clients: ClientLogo[];
  documents: TechnicalDocument[];
  testimonials: TestimonialItem[];
  siteContent: SiteContentConfig;
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectProject: (project: ProjectCaseStudy) => void;
  onOpenConsultation: (interest?: string) => void;
}

export function HomePage({
  products,
  projects,
  clients: _clients,
  documents,
  testimonials,
  siteContent,
  onNavigate,
  onSelectProduct,
  onSelectProject,
  onOpenConsultation,
}: HomePageProps) {
  const [productTab, setProductTab] = useState<
    'Featured' | 'Curtains' | 'Indoor Blinds' | 'Outdoor Blinds'
  >('Featured');
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPrefs = () => {
      setIsMobileViewport(mobileQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };
    syncPrefs();
    mobileQuery.addEventListener('change', syncPrefs);
    motionQuery.addEventListener('change', syncPrefs);
    return () => {
      mobileQuery.removeEventListener('change', syncPrefs);
      motionQuery.removeEventListener('change', syncPrefs);
    };
  }, []);

  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setHeroInView(entries[0].isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const heroVideoSrc = isMobileViewport
    ? '/assets/video/casmura-hero-mobile.mp4'
    : '/assets/video/casmura-hero-desktop.mp4';

  useEffect(() => {
    setHeroVideoReady(false);
  }, [heroVideoSrc]);

  useEffect(() => {
    const videoEl = heroVideoRef.current;
    if (!videoEl || prefersReducedMotion || heroVideoFailed) return;
    videoEl.muted = true;
    if (heroInView) {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Fallback keeps poster visible if autoplay is blocked
        });
      }
    } else {
      videoEl.pause();
    }
  }, [heroVideoSrc, heroInView, prefersReducedMotion, heroVideoFailed]);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroMediaScale = useTransform(heroScrollProgress, [0, 1], [1, 1.08]);
  const heroMediaY = useTransform(heroScrollProgress, [0, 1], ['0%', '8%']);
  const heroContentY = useTransform(heroScrollProgress, [0, 1], ['0px', '32px']);
  const heroContentOpacity = useTransform(heroScrollProgress, [0, 0.78], [1, 0.14]);

  // Quick Home Inquiry Form state
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [projectLocation, setProjectLocation] = useState('Maldives');
  const [scopeNotes, setScopeNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessRef, setFormSuccessRef] = useState<string | null>(null);

  const displayedProducts =
    productTab === 'Featured'
      ? products.filter((p) => p.featuredOnHome).slice(0, 3)
      : products.filter((p) => p.category === productTab).slice(0, 3);

  const productCards = displayedProducts.length ? displayedProducts : products.slice(0, 3);

  const featuredProjects = projects.filter((p) => p.featuredOnHome).slice(0, 3);
  const displayProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 3);

  const verifiedTestimonials = testimonials.filter((t) => t.verified);

  const handleHomeInquiry = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inquiry',
          fullName,
          companyName,
          email,
          projectLocation,
          message: scopeNotes || 'Technical proposal request submitted from homepage.',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Please check your input and try again.');
      } else {
        setFormSuccessRef(data.referenceCode);
        setFullName('');
        setCompanyName('');
        setEmail('');
        setScopeNotes('');
      }
    } catch {
      setFormError('Unable to reach estimation server. Please try WhatsApp or email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* BAND 1: Signature Cinematic Luxury Hospitality Video Hero */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[560px] h-[74vh] sm:h-[80vh] lg:h-[86vh] max-h-[840px] w-full overflow-hidden bg-[#191F2B]"
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { scale: heroMediaScale, y: heroMediaY }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Instant Poster Layer Behind Video for Zero First-Paint Flash */}
          <SafeImage
            src="/assets/video/casmura-hero-poster.jpg"
            alt="Luxury coastal pavilion with sunlit floor-to-ceiling sheer drapery and architectural vertical louvers"
            className="w-full h-full object-cover object-center"
          />

          {!prefersReducedMotion && !heroVideoFailed && (
            <video
              key={heroVideoSrc}
              ref={heroVideoRef}
              src={heroVideoSrc}
              poster="/assets/video/casmura-hero-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onCanPlay={() => setHeroVideoReady(true)}
              onError={() => setHeroVideoFailed(true)}
              aria-label="Cinematic showcase of luxury hospitality interiors with floor-to-ceiling curtains, sheer drapery, and architectural shading"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                heroVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </motion.div>

        {/* Refined Multi-Stop Contrast Scrim & Vignette */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(25,31,43,0.22)_0%,rgba(25,31,43,0.52)_100%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#191F2B]/55 via-[#191F2B]/26 to-[#142B49]/92 pointer-events-none"
          aria-hidden="true"
        />

        <motion.div
          style={prefersReducedMotion ? undefined : { y: heroContentY, opacity: heroContentOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-5 sm:px-6 text-center will-change-transform"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-5 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.22em] text-[#C5A15B] whitespace-nowrap">
              <span className="w-4 sm:w-6 h-px bg-[#C5A15B]/75" aria-hidden="true" />
              <span>Hospitality & Architectural Shading</span>
              <span className="w-4 sm:w-6 h-px bg-[#C5A15B]/75" aria-hidden="true" />
            </div>

            <h1 className="font-display text-white text-3xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.1] [text-wrap:balance] whitespace-pre-line drop-shadow-[0_4px_24px_rgba(25,31,43,0.55)]">
              {siteContent.heroHeadline}
            </h1>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-100/95 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(25,31,43,0.55)]">
              {siteContent.heroSubheadline}
            </p>

            {/* Restrained Glass Architectural Action Dock */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 glass-panel-dark px-4 py-3 rounded-xl">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6B2D]" />
                <span>Explore Our Solutions</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('case-studies')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/35 hover:border-[#C5A15B] text-white hover:text-[#C5A15B] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Discover Our Projects</span>
                <Play className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          </motion.div>
        </motion.div>

        <a
          href="#light-simulator-studio"
          aria-label="Scroll to Architectural Elegance Curtain Simulator"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 group"
        >
          <span className="h-7 w-px bg-gradient-to-b from-[#C5A15B] to-transparent group-hover:h-9 transition-all" />
        </a>
      </section>

      {/* Seamless Infinite Client Logo Marquee (Directly After Hero Curtain Experience) */}
      <ClientLogoMarquee />

      {/* BAND 2: Deep Navy Signature Interactive Curtain & Sunlight Studio */}
      <section
        id="light-simulator-studio"
        className="glass-ambient-navy text-white py-14 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy, KPIs & Dual Actions */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-[1.18] tracking-tight [text-wrap:balance]">
                  {siteContent.introHeading}
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-300">
                  {siteContent.introSummary}
                </p>
              </div>

              {/* 3 KPI Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#C5A15B]/25">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    16+
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A15B] mt-0.5">
                    Years Exp.
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    300+
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A15B] mt-0.5">
                    Clients
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    100+
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A15B] mt-0.5">
                    Intl. Projects
                  </div>
                </div>
              </div>

              {/* Primary + Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenConsultation('General Contract Consultation')}
                  className="bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase tracking-[0.06em] px-5 py-3 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Consultation
                </button>
                <a
                  href="/api/documents/doc-master-catalogue/download"
                  className="inline-flex items-center gap-2 border border-white/30 hover:border-[#C5A15B] text-white hover:text-[#C5A15B] text-xs font-bold uppercase tracking-[0.06em] px-5 py-3 rounded-md transition-colors whitespace-nowrap"
                >
                  <span>Explore Catalog</span>
                  <Play className="w-2.5 h-2.5 fill-current" />
                </a>
              </div>
            </motion.div>

            {/* Right Interactive Draggable Curtain & Sunlight Studio */}
            <div className="lg:col-span-7">
              <InteractiveCurtainSimulator onInquireSystem={onOpenConsultation} />
            </div>
          </div>
        </div>
      </section>

      {/* BAND 3: Trust Cards + 11 Regions Served */}
      <section className="glass-ambient-light py-12 lg:py-14 border-b border-[#142B49]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <a
              href="#why-choose-us"
              className="glass-panel-navy glass-card-hover text-white rounded-xl py-7 px-6 text-center cursor-pointer group block"
            >
              <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-300">
                Subsidiary of
              </span>
              <span className="block font-display text-xl font-bold mt-1.5 group-hover:text-[#C5A15B] transition-colors">
                Avarna Holdings
              </span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="glass-panel-navy glass-card-hover text-white rounded-xl py-7 px-6 text-center cursor-pointer group"
            >
              <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-300">
                Guarantee
              </span>
              <span className="block font-display text-xl font-bold mt-1.5 group-hover:text-[#C5A15B] transition-colors">
                Premium Quality Products
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className="glass-panel-navy glass-card-hover text-white rounded-xl py-7 px-6 text-center cursor-pointer group"
            >
              <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-300">
                Hospitality Projects
              </span>
              <span className="block font-display text-xl font-bold mt-1.5 group-hover:text-[#C5A15B] transition-colors">
                100+ Luxury Resorts
              </span>
            </button>
          </div>

          <div className="text-center space-y-2.5 max-w-4xl mx-auto">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8C6B2D]">
              Regions Served
            </p>
            <p className="text-sm sm:text-[15px] font-semibold text-[#142B49] leading-relaxed">
              {REGIONS_SERVED.join('  |  ')}
            </p>
          </div>
        </div>
      </section>

      {/* BAND 4: Comprehensive Interior & Shading Products with Glass Tabs */}
      <section className="glass-ambient-light py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 mb-10 border-b border-[#142B49]/12">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#142B49] tracking-tight">
              Comprehensive Interior & Shading Products
            </h2>

            {/* Glass Category Navigation Tabs */}
            <div
              className="glass-tabs inline-flex flex-wrap items-center gap-1 p-1 rounded-lg self-start"
              role="tablist"
              aria-label="Filter featured product categories"
            >
              {(['Featured', 'Curtains', 'Indoor Blinds', 'Outdoor Blinds'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={productTab === tab}
                    onClick={() => setProductTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      productTab === tab
                        ? 'bg-[#142B49] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#142B49]'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {productCards.map((product) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel-light glass-card-hover rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-200 relative">
                    <SafeImage
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2.5">
                    <h3 className="font-display text-xl font-bold text-[#142B49]">
                      {product.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#142B49]/10 flex items-center justify-between text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-slate-600 hover:text-[#8C6B2D] transition-colors cursor-pointer"
                  >
                    View Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(product.title)}
                    className="inline-flex items-center gap-1.5 text-[#142B49] hover:text-[#8C6B2D] font-bold transition-colors cursor-pointer"
                  >
                    <span>Inquire</span>
                    <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 bg-[#142B49] hover:bg-[#191F2B] text-white text-sm font-bold px-8 py-3 rounded-md border border-[#C5A15B]/35 transition-colors cursor-pointer shadow-sm"
            >
              <span>See All Products</span>
              <Play className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
            </button>
          </div>
        </div>
      </section>

      {/* BAND 5: Material Craftsmanship & Before/After Light Control */}
      <MaterialComparisonSection onInquireMaterial={onOpenConsultation} />

      {/* BAND 6: Portfolio Highlights (Deep Navy) */}
      <section className="glass-ambient-navy text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-10 border-b border-[#C5A15B]/25">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#C5A15B]">
                Portfolio Highlights
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1.5 tracking-tight">
                100+ Luxury Resort & Villa Projects
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md lg:text-right leading-relaxed">
              Showcasing iconic hospitality drapery and outdoor shading installations
              across Indian Ocean destination sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {displayProjects.map((project) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel-dark glass-card-hover rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#191F2B]">
                    <SafeImage
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2.5">
                    <h3 className="font-display text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {project.location}, {project.country}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#C5A15B] transition-colors cursor-pointer"
                  >
                    <span>Read More</span>
                    <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-sm font-bold px-8 py-3 rounded-md transition-colors cursor-pointer"
            >
              <span>See All Case Studies</span>
              <Play className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
            </button>
          </div>
        </div>
      </section>

      {/* Conditional Verified Testimonials Section */}
      {verifiedTestimonials.length > 0 && (
        <section className="bg-white py-14 border-b border-[#142B49]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-1 mb-10">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#8C6B2D]">
                Verified Client Feedback
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B49]">
                Hospitality Partner Perspectives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedTestimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="glass-panel-light rounded-xl p-6 flex flex-col justify-between space-y-4"
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "{t.quote}"
                  </p>
                  <footer className="pt-3 border-t border-[#142B49]/10">
                    <div className="text-sm font-bold text-[#142B49]">{t.authorName}</div>
                    <div className="text-xs text-slate-500">
                      {t.role} · {t.organization}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BAND 7: Smart Architectural Integration */}
      <section className="glass-ambient-light py-16 lg:py-20 border-t border-[#142B49]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-2 mb-10"
          >
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#8C6B2D]">
              Smart Architectural Integration
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#142B49] tracking-tight">
              Automated Drapery & Home Systems
            </h2>
          </motion.div>

          <AutomationPartnersGrid
            showExploreLink
            onExplore={() => onNavigate('automation')}
          />
        </div>
      </section>

      {/* BAND 8: Why Choose Us (Deep Navy) */}
      <section id="why-choose-us" className="glass-ambient-navy text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-2 mb-12"
          >
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#C5A15B]">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Hospitality & Contract Solutions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 text-center">
            {[
              {
                icon: Award,
                title: 'Hospitality Supply Expert',
                desc: 'Specialized supply solutions designed to meet the unique needs of the hospitality industry.',
              },
              {
                icon: Layers,
                title: 'Wide Contract Product Portfolio',
                desc: 'A comprehensive range of quality products for residential, commercial, and hospitality spaces.',
              },
              {
                icon: Building,
                title: 'Client-Centric Project Solutions',
                desc: "Personalized solutions tailored to each client's requirements and project goals.",
              },
              {
                icon: Wrench,
                title: 'Expert Installation',
                desc: 'Professional installation ensuring precision, quality, and lasting performance.',
              },
              {
                icon: Headphones,
                title: 'After-Sales Service',
                desc: 'Reliable ongoing support to ensure customer satisfaction and product durability.',
              },
              {
                icon: CreditCard,
                title: 'Tailored Payment Structure',
                desc: 'Flexible payment options designed to suit individual project budgets and requirements.',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-white text-[#142B49] border border-[#C5A15B]/45 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BAND 9: Catalogue Download Bar */}
      {documents.length > 0 && (
        <section className="glass-ambient-light py-14 border-b border-[#142B49]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel-light glass-card-hover rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                  Catalogue & Technical Specifications
                </p>
                <h2 className="font-display text-xl font-bold text-[#142B49]">
                  Download Architectural Specification Schedules
                </h2>
                <p className="text-sm text-slate-600">
                  Access master catalogues, BMS/KNX wiring diagrams, and flame-retardancy
                  schedules for tender documentation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                {documents.slice(0, 2).map((doc) => (
                  <a
                    key={doc.id}
                    href={`/api/documents/${doc.id}/download`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#142B49] hover:bg-[#191F2B] text-white text-xs font-bold border border-[#C5A15B]/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A15B]" />
                    <span>{doc.category}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BAND 10: Get In Touch / Contact Us & Send a Project Inquiry */}
      <section id="home-contact" className="glass-ambient-light py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-7">
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#8C6B2D]">
                  Get In Touch
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#142B49] tracking-tight">
                  Contact Us
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  Our solution experts are available for site visits, product sampling
                  presentations, and technical drawings anywhere across our served regions.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#142B49] text-[#C5A15B] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#142B49]">
                      Casmura Contract
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {siteContent.contactAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#142B49] text-[#C5A15B] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#142B49]">
                      Email Consultation
                    </h3>
                    <a
                      href={`mailto:${siteContent.contactEmail}`}
                      className="text-sm text-slate-600 hover:text-[#8C6B2D] mt-0.5 block"
                    >
                      {siteContent.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#142B49] text-[#C5A15B] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#142B49]">
                      Direct Line
                    </h3>
                    <a
                      href={`tel:${siteContent.contactPhone.replace(/\s+/g, '')}`}
                      className="text-sm text-slate-600 hover:text-[#8C6B2D] mt-0.5 block tabular-nums"
                    >
                      {siteContent.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteContent.whatsappNumber}?text=Hello%20Casmura%20Contract%2C%20I%20would%20like%20to%20request%20a%20project%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#142B49] hover:bg-[#191F2B] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md border border-[#C5A15B]/35 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A15B]" />
                  <span>WhatsApp Project Desk</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 border border-[#142B49]/25 hover:border-[#C5A15B] hover:text-[#8C6B2D] text-[#142B49] text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Multi-Step RFQ Wizard</span>
                </button>
              </div>
            </div>

            {/* Right Deep Navy Glass Project Inquiry Form */}
            <div className="lg:col-span-7 glass-panel-navy text-white rounded-xl p-7 sm:p-9">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold">
                  Send a Project Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Fill out the form below for immediate technical response from our
                  estimation team.
                </p>
              </div>

              {formSuccessRef ? (
                <div className="bg-white/10 border border-[#C5A15B]/45 rounded-lg p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#C5A15B] mx-auto" />
                  <h4 className="font-display text-lg font-bold">
                    Technical Proposal Request Received
                  </h4>
                  <p className="text-sm text-slate-200">
                    Reference Code:{' '}
                    <span className="font-mono text-[#C5A15B] font-semibold">
                      {formSuccessRef}
                    </span>
                  </p>
                  <p className="text-xs text-slate-300">
                    Our estimation engineers will respond with sampling schedules and
                    BOQ guidance.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSuccessRef(null)}
                    className="mt-2 px-5 py-2 rounded bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-bold uppercase cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleHomeInquiry} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded bg-red-500/20 border border-red-400/40 text-xs text-red-100">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Arch. / Eng. / Mr. / Mrs."
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm focus:outline-2 focus:outline-[#C5A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Resort, Hotel Group, or Practice"
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm focus:outline-2 focus:outline-[#C5A15B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                        Corporate Mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm focus:outline-2 focus:outline-[#C5A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                        Project Location *
                      </label>
                      <select
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm focus:outline-2 focus:outline-[#C5A15B]"
                      >
                        {REGIONS_SERVED.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                        <option value="Other International">Other International</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                      Project Scope & Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={scopeNotes}
                      onChange={(e) => setScopeNotes(e.target.value)}
                      placeholder="Mention number of rooms, motorized integration needs, product need, timeline..."
                      className="w-full px-3.5 py-2.5 rounded-md bg-white text-[#142B49] text-sm focus:outline-2 focus:outline-[#C5A15B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white hover:bg-[#F3F1EC] disabled:opacity-60 text-[#142B49] text-xs font-extrabold uppercase tracking-[0.06em] py-3.5 rounded-md transition-colors cursor-pointer"
                  >
                    {submitting
                      ? 'Submitting Request...'
                      : 'Submit Technical Proposal Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
