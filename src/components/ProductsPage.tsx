import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Download,
  Hand,
  Layers,
  Play,
  Radio,
  Search,
  SlidersHorizontal,
  ToggleRight,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type {
  OperatingSystemOption,
  ProductItem,
  ProductTaxonomyCategory,
  TechnicalDocument,
} from '../types/casmura.ts';
import { SafeImage } from './SafeImage.tsx';

interface ProductsPageProps {
  products: ProductItem[];
  documents: TechnicalDocument[];
  activeTaxonomy: ProductTaxonomyCategory | 'All';
  onChangeTaxonomy: (cat: ProductTaxonomyCategory | 'All') => void;
  activeProductSlug: string | null;
  onSelectProductDetail: (product: ProductItem | null) => void;
  onInquireProduct: (productTitle: string) => void;
  onBookConsultation?: (interest?: string) => void;
}

const TAXONOMY_TABS: Array<{ label: string; value: ProductTaxonomyCategory | 'All' }> = [
  { label: 'All Systems', value: 'All' },
  { label: 'Indoor Curtains & Blinds', value: 'Indoor Curtains & Blinds' },
  {
    label: 'Outdoor Curtains & Weather Blinds',
    value: 'Outdoor Curtains & Weather Blinds',
  },
  {
    label: 'Pergolas, Tents, & Roofing Tiles',
    value: 'Pergolas, Tents, & Roofing Tiles',
  },
  { label: 'Interior Decor Essentials', value: 'Interior Decor Essentials' },
];

function getOperatingIcon(option: OperatingSystemOption) {
  switch (option) {
    case 'Motorized Drive':
      return Cpu;
    case 'Smart Remote':
      return Radio;
    case 'Wall Switch':
      return ToggleRight;
    case 'Architectural Fixed':
      return Layers;
    case 'Manual Track':
    case 'Cord Draw':
    case 'Cordless Spring':
    case 'Hand Baton':
    default:
      return Hand;
  }
}

export function ProductsPage({
  products,
  documents,
  activeTaxonomy,
  onChangeTaxonomy,
  activeProductSlug,
  onSelectProductDetail,
  onInquireProduct,
  onBookConsultation,
}: ProductsPageProps) {
  const [motorFilter, setMotorFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [driveCompare, setDriveCompare] = useState<'motorized' | 'manual'>('motorized');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const selectedDetailProduct = useMemo(
    () =>
      activeProductSlug
        ? products.find((p) => p.slug === activeProductSlug) ?? null
        : null,
    [products, activeProductSlug]
  );

  useEffect(() => {
    setGalleryIndex(0);
  }, [selectedDetailProduct?.id]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        activeTaxonomy === 'All' || item.taxonomyCategory === activeTaxonomy;
      const matchMotor =
        motorFilter === 'All' ||
        (motorFilter === 'Motorized' &&
          item.motorization.toLowerCase().includes('motorized')) ||
        (motorFilter === 'Outdoor' &&
          item.taxonomyCategory === 'Outdoor Curtains & Weather Blinds');
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.application.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.flameRating.toLowerCase().includes(q) ||
        item.subGroup.toLowerCase().includes(q);
      return matchCat && matchMotor && matchSearch;
    });
  }, [products, activeTaxonomy, motorFilter, searchQuery]);

  // Product-Wise Detail View (PDF 5)
  if (selectedDetailProduct) {
    const gallery = selectedDetailProduct.gallery?.length
      ? selectedDetailProduct.gallery
      : [selectedDetailProduct.image];
    const currentImage = gallery[galleryIndex] || selectedDetailProduct.image;

    const categoryPeers = products.filter(
      (p) => p.taxonomyCategory === selectedDetailProduct.taxonomyCategory
    );
    const peerList = categoryPeers.length > 1 ? categoryPeers : products;
    const currentIdx = peerList.findIndex((p) => p.id === selectedDetailProduct.id);
    const prevProduct =
      peerList[(currentIdx - 1 + peerList.length) % peerList.length];
    const nextProduct = peerList[(currentIdx + 1) % peerList.length];

    const operatingSystems = selectedDetailProduct.operatingSystems?.length
      ? selectedDetailProduct.operatingSystems
      : (['Manual Track', 'Motorized Drive'] as OperatingSystemOption[]);

    const recommendedApps = selectedDetailProduct.recommendedApplications?.length
      ? selectedDetailProduct.recommendedApplications
      : [selectedDetailProduct.application];

    return (
      <div className="bg-white">
        {/* Product Detail Header & Breadcrumb */}
        <section className="bg-[#142B49] text-white py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectProductDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A15B] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Products</span>
              </button>
              <span className="text-xs text-slate-300">
                Products · {selectedDetailProduct.taxonomyCategory} ·{' '}
                <strong className="text-white">{selectedDetailProduct.title}</strong>
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C5A15B]">
                  {selectedDetailProduct.taxonomyCategory}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                  {selectedDetailProduct.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="/api/documents/doc-master-catalogue/download"
                  className="inline-flex items-center gap-2 border border-white/30 hover:border-[#C5A15B] text-white hover:text-[#C5A15B] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Spec Catalogue</span>
                </a>
                <button
                  type="button"
                  onClick={() => onInquireProduct(selectedDetailProduct.title)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors cursor-pointer"
                >
                  <span>Request Quote</span>
                  <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Product-Wise 2-Column Showcase */}
        <section className="glass-ambient-light py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left: Gallery & Thumbnails */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 border border-[#142B49]/12 shadow-lg">
                  <SafeImage
                    src={currentImage}
                    alt={selectedDetailProduct.title}
                    className="w-full h-full object-cover"
                  />
                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryIndex(
                            (prev) => (prev - 1 + gallery.length) % gallery.length
                          )
                        }
                        aria-label="Previous product image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#191F2B]/85 text-white hover:bg-[#142B49] border border-[#C5A15B]/45 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryIndex((prev) => (prev + 1) % gallery.length)
                        }
                        aria-label="Next product image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#191F2B]/85 text-white hover:bg-[#142B49] border border-[#C5A15B]/45 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={imgUrl + idx}
                        type="button"
                        onClick={() => setGalleryIndex(idx)}
                        className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          idx === galleryIndex
                            ? 'border-[#C5A15B] opacity-100 shadow-sm'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <SafeImage
                          src={imgUrl}
                          alt={`${selectedDetailProduct.title} preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Technical Specification Matrix Card */}
                <div className="glass-panel-light rounded-xl p-6 space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                    Technical Specifications & Compliance
                  </h2>
                  <dl className="divide-y divide-slate-200 border border-[#142B49]/12 rounded-lg bg-white">
                    {selectedDetailProduct.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="px-4 py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <dt className="text-slate-500 font-medium">{spec.label}</dt>
                        <dd className="text-[#142B49] font-semibold text-right tabular-nums">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                    <div className="px-4 py-3 flex items-center justify-between gap-4 text-xs">
                      <dt className="text-slate-500 font-medium">Flame Rating</dt>
                      <dd className="text-[#142B49] font-semibold text-right">
                        {selectedDetailProduct.flameRating}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Right: Overview, Options, Operating Systems & Recommended Applications */}
              <div className="lg:col-span-6 space-y-6">
                <div className="glass-panel-light rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                      Overview
                    </p>
                    <p className="text-base leading-relaxed text-slate-700">
                      {selectedDetailProduct.fullDescription}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="pt-4 border-t border-[#142B49]/10 space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#142B49]">
                      Options
                    </h2>
                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {selectedDetailProduct.customOptions.map((opt) => (
                        <li key={opt} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operating System Icon Grid */}
                  <div className="pt-4 border-t border-[#142B49]/10 space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#142B49]">
                      Operating System
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {operatingSystems.map((op) => {
                        const OpIcon = getOperatingIcon(op);
                        return (
                          <div
                            key={op}
                            className="flex flex-col items-center justify-center text-center gap-2 p-3.5 rounded-lg border border-[#142B49]/12 bg-white hover:border-[#C5A15B]/65 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#F3F1EC] text-[#142B49] border border-[#C5A15B]/35 flex items-center justify-center">
                              <OpIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-[#142B49]">
                              {op}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended Applications */}
                  <div className="pt-4 border-t border-[#142B49]/10 space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#142B49]">
                      Recommended Applications
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                      {recommendedApps.map((appItem) => (
                        <li key={appItem} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B] mt-2 shrink-0" />
                          <span>{appItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatible Ecosystems */}
                  {selectedDetailProduct.compatibleSystems.length > 0 && (
                    <div className="pt-4 border-t border-[#142B49]/10 space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#142B49]">
                        Compatible Ecosystems
                      </h2>
                      <p className="text-xs font-medium text-slate-600">
                        {selectedDetailProduct.compatibleSystems.join('  ·  ')}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#142B49]/10 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => onInquireProduct(selectedDetailProduct.title)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#142B49] hover:bg-[#191F2B] text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3.5 rounded-md border border-[#C5A15B]/35 transition-colors cursor-pointer"
                    >
                      <span>Request Project Quotation</span>
                      <Play className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        (onBookConsultation ?? onInquireProduct)(
                          `Sample Box Request: ${selectedDetailProduct.title}`
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 border border-[#142B49]/25 hover:border-[#C5A15B] text-[#142B49] hover:text-[#8C6B2D] text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Request Fabric Sample</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Previous / Next Product Bar (PDF 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#142B49]/12">
              <button
                type="button"
                onClick={() => onSelectProductDetail(prevProduct)}
                className="glass-panel-light glass-card-hover rounded-xl p-5 flex items-center gap-4 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F3F1EC] text-[#142B49] border border-[#C5A15B]/35 group-hover:bg-[#142B49] group-hover:text-[#C5A15B] flex items-center justify-center transition-colors shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Previous Product
                  </p>
                  <p className="font-display text-base font-bold text-[#142B49] truncate group-hover:text-[#8C6B2D]">
                    {prevProduct.title}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectProductDetail(nextProduct)}
                className="glass-panel-light glass-card-hover rounded-xl p-5 flex items-center justify-end gap-4 text-right cursor-pointer group"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Next Product
                  </p>
                  <p className="font-display text-base font-bold text-[#142B49] truncate group-hover:text-[#8C6B2D]">
                    {nextProduct.title}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F3F1EC] text-[#142B49] border border-[#C5A15B]/35 group-hover:bg-[#142B49] group-hover:text-[#C5A15B] flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="bg-[#142B49] text-white py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C5A15B]">
              Architectural Shading & Interior Systems
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Contract Product Specifications & Catalog
            </h1>
            <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
              Engineered for 5-star guest suites, oceanfront villas, bioclimatic pergolas,
              and bespoke hospitality interiors across tropical and coastal climates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-auto">
            <a
              href="/api/documents/doc-master-catalogue/download"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-md transition-colors"
            >
              <Download className="w-4 h-4 text-[#C5A15B]" />
              <span>Download Full Contract Catalogue</span>
            </a>
            <button
              type="button"
              onClick={() =>
                (onBookConsultation ?? onInquireProduct)('Product Specification Consultation')
              }
              className="inline-flex items-center gap-2 border border-white/25 hover:border-[#C5A15B] text-white hover:text-[#C5A15B] text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md transition-colors cursor-pointer"
            >
              <span>Book a Consultation</span>
              <Play className="w-2.5 h-2.5 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Collection Taxonomy Filter Bar (4 Main Categories from PDF 2) */}
      <section className="border-b border-[#142B49]/10 glass-ambient-light py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="glass-tabs inline-flex flex-wrap items-center gap-1 p-1 rounded-lg">
              {TAXONOMY_TABS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => onChangeTaxonomy(cat.value)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTaxonomy === cat.value
                      ? 'bg-[#142B49] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#142B49]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search & Motorization Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pergola, sheer, NFPA 701..."
                  className="pl-9 pr-3.5 py-2 rounded-md border border-slate-300 bg-white text-sm text-[#142B49] w-full sm:w-64 focus:outline-2 focus:outline-[#C5A15B]"
                />
              </div>

              <div className="inline-flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={motorFilter}
                  onChange={(e) => setMotorFilter(e.target.value)}
                  aria-label="Filter by operation type"
                  className="text-xs font-semibold text-[#142B49] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="All">All Operations</option>
                  <option value="Motorized">Motorized / BMS Ready</option>
                  <option value="Outdoor">Coastal Exterior Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="glass-ambient-light py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="glass-panel-light rounded-xl p-12 text-center space-y-3">
              <p className="font-display text-lg font-bold text-[#142B49]">
                No systems match your current filter
              </p>
              <p className="text-sm text-slate-600">
                Reset filters or contact our estimation desk for custom hospitality fabrication.
              </p>
              <button
                type="button"
                onClick={() => {
                  onChangeTaxonomy('All');
                  setMotorFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-md bg-[#142B49] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="glass-panel-light glass-card-hover rounded-xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectProductDetail(product)}
                      className="w-full block aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                    >
                      <SafeImage
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </button>

                    <div className="p-6 space-y-3">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-[#8C6B2D]">{product.subGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.motorization}</span>
                      </div>

                      <h2 className="font-display text-xl font-bold text-[#142B49]">
                        <button
                          type="button"
                          onClick={() => onSelectProductDetail(product)}
                          className="text-left hover:text-[#8C6B2D] transition-colors cursor-pointer"
                        >
                          {product.title}
                        </button>
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Application</span>
                          <span className="text-[#142B49] font-medium text-right truncate max-w-[190px]">
                            {product.application}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Compliance</span>
                          <span className="text-[#142B49] font-medium text-right">
                            {product.flameRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#F3F1EC] border-t border-[#142B49]/10 flex items-center justify-between text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => onSelectProductDetail(product)}
                      className="text-[#142B49] hover:text-[#8C6B2D] transition-colors cursor-pointer"
                    >
                      View Technical Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => onInquireProduct(product.title)}
                      className="inline-flex items-center gap-1.5 bg-[#142B49] hover:bg-[#191F2B] text-white px-3.5 py-2 rounded border border-[#C5A15B]/30 transition-colors cursor-pointer"
                    >
                      <span>Inquire</span>
                      <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Motorized vs Manual System Comparison */}
      <section className="glass-ambient-navy text-white py-14 border-t border-[#C5A15B]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C5A15B]">
              Drive Architecture Comparison
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Motorized BMS vs. Manual Contract Operation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Select the operating drive architecture suited to your guestroom key
              classification, ceiling pocket wiring, and housekeeping maintenance model.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="glass-tabs-dark inline-flex p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDriveCompare('motorized')}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    driveCompare === 'motorized'
                      ? 'bg-white text-[#142B49]'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Motorized / GRMS
                </button>
                <button
                  type="button"
                  onClick={() => setDriveCompare('manual')}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    driveCompare === 'manual'
                      ? 'bg-white text-[#142B49]'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  Manual Contract Track
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  onInquireProduct(
                    driveCompare === 'motorized'
                      ? 'Motorized / BMS Drapery System Quote'
                      : 'Manual Contract Track System Quote'
                  )
                }
                className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A15B] hover:text-white transition-colors cursor-pointer"
              >
                <span>Request a Quote</span>
                <Play className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel-dark rounded-xl p-6 sm:p-7 space-y-4">
            {driveCompare === 'motorized' ? (
              <>
                <h3 className="font-display text-lg font-bold text-[#C5A15B]">
                  Motorized Architectural Drives (Forest / Somfy / Motionblinds)
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                  {[
                    'Bedside keypad, KNX, Crestron & Lutron scene recall',
                    'Touch-motion start & manual power-failure override',
                    'Synchronized dual-track sheer & blackout sequencing',
                    'Reduces fabric wear from uneven manual pulling',
                    'Solar & twilight automated glare scheduling',
                    'Requires concealed 230V AC or 24V DC ceiling spur',
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold text-[#C5A15B]">
                  Manual Architectural Wave-Fold & Cord-Drawn Tracks
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                  {[
                    'Zero electrical conduit or BMS commissioning required',
                    'Low-friction wheeled carriers for effortless hand draw',
                    'Baton / wand draw eliminates fabric edge soiling',
                    'Custom bent curved tracks for bay & corner glazing',
                    'Ideal for back-of-house, spa suites & eco-villas',
                    'Lower upfront capex with simple mechanical upkeep',
                  ].map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Technical Documentation Centre Strip */}
      <section className="glass-ambient-light py-14 border-t border-[#142B49]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                MEP & Architect Resources
              </p>
              <h2 className="font-display text-2xl font-bold text-[#142B49] mt-1">
                Technical Document Download Centre
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Instant specification schedules for tender documentation and ceiling recess planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel-light glass-card-hover rounded-lg p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-500">
                    {doc.fileCode} · {doc.pages} pp.
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#142B49]">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <a
                  href={`/api/documents/${doc.id}/download`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 rounded border border-[#142B49]/20 hover:border-[#C5A15B] text-[#142B49] hover:text-[#8C6B2D] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A15B]" />
                  <span>Download Spec Sheet</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
