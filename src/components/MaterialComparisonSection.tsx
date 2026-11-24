import { GripVertical, Layers, Play } from 'lucide-react';
import { useRef, useState, type PointerEvent } from 'react';
import { SafeImage } from './SafeImage.tsx';

interface MaterialComparisonSectionProps {
  onInquireMaterial: (topic: string) => void;
}

const MATERIALS = [
  {
    id: 'blackout',
    tab: 'Acoustic Blackout',
    title: 'Triple-Pass Contract Blackout Weave',
    compliance: 'NFPA 701 & BS 5867 Part 2 Type B',
    summary:
      'Engineered with a dense multi-pass core to deliver room darkening and acoustic dampening in guest suites without stiff synthetic drape.',
    finishes: ['Warm Taupe', 'Coastal Slate', 'Sandstone', 'Deep Charcoal'],
  },
  {
    id: 'sheer',
    tab: 'Architectural Sheer',
    title: 'Wide-Width Linen-Look Hospitality Sheer',
    compliance: 'ISO 105-B02 UV Colorfastness Grade 6–7',
    summary:
      'Continuous 320 cm wide-width woven textile eliminating vertical seams across expansive villa glazing while softening coastal glare.',
    finishes: ['Ivory Linen', 'Alabaster', 'Oatmeal', 'Driftwood'],
  },
  {
    id: 'screen',
    tab: 'Solar Screen Mesh',
    title: 'Architectural PVC-Free & Marine Screen Mesh',
    compliance: 'EN 13501-1 Fire Rated · Coastal Salt-Air Resistant',
    summary:
      'Precision basketweave screens engineered to preserve outward ocean views during daylight hours while moderating interior glare.',
    finishes: ['1% Privacy', '3% Balanced View', '5% Open Horizon'],
  },
];

export function MaterialComparisonSection({
  onInquireMaterial,
}: MaterialComparisonSectionProps) {
  const [activeMat, setActiveMat] = useState(0);
  const [splitPct, setSplitPct] = useState(52);
  const [dragging, setDragging] = useState(false);
  const compareRef = useRef<HTMLDivElement | null>(null);

  const currentMaterial = MATERIALS[activeMat];

  const updateSplitFromClientX = (clientX: number) => {
    const el = compareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.round(Math.max(8, Math.min(92, pct))));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section className="glass-ambient-light py-16 lg:py-20 border-y border-[#142B49]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Macro Textile Exploration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                Material & Textile Architecture
              </p>
              <h2 className="font-display text-3xl font-bold text-[#142B49] tracking-tight">
                Contract Fabrics Engineered for Coastal Climates
              </h2>
            </div>

            {/* Restrained Glass Category Tabs */}
            <div
              className="glass-tabs inline-flex flex-wrap gap-1 p-1 rounded-lg"
              role="tablist"
              aria-label="Contract Material Categories"
            >
              {MATERIALS.map((mat, idx) => (
                <button
                  key={mat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeMat === idx}
                  onClick={() => setActiveMat(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeMat === idx
                      ? 'bg-[#142B49] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#142B49]'
                  }`}
                >
                  {mat.tab}
                </button>
              ))}
            </div>

            <div className="glass-panel-light glass-card-hover rounded-xl p-6 space-y-4">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-200">
                <SafeImage
                  src="/src/assets/images/fabric_weave_macro_1795075802234.jpg"
                  alt="Macro detail of Casmura contract blackout, sheer linen, and solar screen fabrics"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-mono text-[#8C6B2D] font-semibold">
                  {currentMaterial.compliance}
                </p>
                <h3 className="font-display text-lg font-bold text-[#142B49]">
                  {currentMaterial.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentMaterial.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-[#142B49]/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  {currentMaterial.finishes.join(' · ')}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onInquireMaterial(`Fabric Sample Box: ${currentMaterial.title}`)
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B49] hover:text-[#8C6B2D] cursor-pointer"
                >
                  <span>Request Sample Swatch</span>
                  <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Before & After Shading Comparison */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-[#142B49]">
                  Before & After Architectural Light Control
                </h3>
                <p className="text-xs text-slate-600">
                  Slide horizontally to compare raw glazing exposure against tailored
                  Casmura sheer & blackout drapery.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B49]">
                <Layers className="w-4 h-4 text-[#C5A15B]" />
                <span className="tabular-nums">{splitPct}% Shaded</span>
              </span>
            </div>

            <div
              ref={compareRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#142B49]/15 shadow-lg select-none touch-none cursor-ew-resize bg-[#191F2B]"
            >
              {/* After / Unshaded Glazing Layer */}
              <SafeImage
                src="/src/assets/images/suite_panoramic_open_daylight_1795075811593.jpg"
                alt="Unshaded panoramic hospitality glazing"
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Before / Tailored Contract Drapery Layer Clipped */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
              >
                <SafeImage
                  src="/src/assets/images/product_hotel_curtains_1795071937203.jpg"
                  alt="Suite fitted with Casmura wave-fold sheer and blackout drapery"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Divider Handle */}
              <div
                className="absolute inset-y-0 w-[2px] bg-[#C5A15B] shadow-[0_0_12px_rgba(197,161,91,0.55)] pointer-events-none"
                style={{ left: `${splitPct}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#142B49] border-2 border-[#C5A15B] text-white flex items-center justify-center shadow-lg">
                  <GripVertical className="w-4 h-4 text-[#C5A15B]" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 glass-panel-dark px-2.5 py-1 rounded text-[11px] font-semibold text-white pointer-events-none">
                With Contract Drapery
              </div>
              <div className="absolute bottom-3 right-3 glass-panel-dark px-2.5 py-1 rounded text-[11px] font-semibold text-white pointer-events-none">
                Unshaded Glazing
              </div>
            </div>

            <input
              type="range"
              min={8}
              max={92}
              value={splitPct}
              onChange={(e) => setSplitPct(Number(e.target.value))}
              aria-label="Before and after shading comparison slider"
              className="w-full accent-[#142B49] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
