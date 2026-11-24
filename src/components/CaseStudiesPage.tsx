import { Download, MapPin, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ProjectCaseStudy } from '../types/casmura.ts';
import { BrandMark } from './BrandMark.tsx';
import { SafeImage } from './SafeImage.tsx';

interface CaseStudiesPageProps {
  projects: ProjectCaseStudy[];
  onSelectProject: (project: ProjectCaseStudy) => void;
  onInquireSimilar: (title: string) => void;
}

const SYSTEM_CATEGORIES: Array<'All' | 'CURTAIN' | 'INDOOR' | 'OUTDOOR' | 'PERGOLAS'> = [
  'All',
  'CURTAIN',
  'INDOOR',
  'OUTDOOR',
  'PERGOLAS',
];

export function CaseStudiesPage({
  projects,
  onSelectProject,
  onInquireSimilar,
}: CaseStudiesPageProps) {
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [systemFilter, setSystemFilter] = useState<string>('All');

  const countries = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.country)))],
    [projects]
  );

  const featuredEditorial = useMemo(
    () =>
      projects.filter((p) => {
        if (!p.featuredEditorial) return false;
        const cOk = countryFilter === 'All' || p.country === countryFilter;
        const sOk = systemFilter === 'All' || p.systemCategory === systemFilter;
        return cOk && sOk;
      }),
    [projects, countryFilter, systemFilter]
  );

  const gridProjects = useMemo(() => {
    return projects.filter((p) => {
      const cOk = countryFilter === 'All' || p.country === countryFilter;
      const sOk = systemFilter === 'All' || p.systemCategory === systemFilter;
      return !p.featuredEditorial && cOk && sOk;
    });
  }, [projects, countryFilter, systemFilter]);

  return (
    <div className="bg-white">
      {/* Case Studies Hero Banner (PDF 3) */}
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
                Hospitality Project Portfolio
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                Real Spaces. Lasting Impressions.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Discover how CASMURA transforms spaces with timeless design and
                exceptional craftsmanship across Sri Lanka, the Maldives, Seychelles,
                and premier hospitality destinations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onInquireSimilar('Hospitality Project Quotation')}
              className="bg-white hover:bg-[#F3F1EC] text-[#142B49] text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-md transition-colors cursor-pointer"
            >
              Request a Quote
            </button>
            <a
              href="/api/documents/doc-master-catalogue/download"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-[#C5A15B] text-white hover:text-[#C5A15B] text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Catalogue</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter Bar (System Category Tabs + Country Selector) */}
      <section className="glass-ambient-light border-b border-[#142B49]/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="glass-tabs inline-flex flex-wrap items-center gap-1 p-1 rounded-lg">
            {SYSTEM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSystemFilter(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  systemFilter === cat
                    ? 'bg-[#142B49] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#142B49]'
                }`}
              >
                {cat === 'All' ? 'All Systems' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="country-select" className="text-xs font-semibold text-slate-500">
              Destination:
            </label>
            <select
              id="country-select"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-semibold text-[#142B49] cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Regions' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Featured Alternating Editorial Case Studies (PDF 3: Hotel Jordan, AGRA Hotel) */}
      {featuredEditorial.length > 0 && (
        <section className="glass-ambient-light pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {featuredEditorial.map((project, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <article
                  key={project.id}
                  className="glass-panel-light rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm border border-[#142B49]/12"
                >
                  <div
                    className={`lg:col-span-6 aspect-[16/10] lg:aspect-auto min-h-[280px] bg-slate-200 overflow-hidden ${
                      reversed ? 'lg:order-2' : ''
                    }`}
                  >
                    <SafeImage
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>

                  <div
                    className={`lg:col-span-6 p-7 sm:p-10 flex flex-col justify-between space-y-6 ${
                      reversed ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6B2D]">
                        <span>{project.systemCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {project.location}, {project.country}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B49] leading-tight">
                        {project.title}
                      </h2>
                      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                        {(project.narrativeParagraphs?.length
                          ? project.narrativeParagraphs
                          : [project.shortDescription, project.solution]
                        ).map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#142B49]/10 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-500">
                        {project.systemsInstalled.join(' · ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="inline-flex items-center gap-2 bg-[#142B49] hover:bg-[#191F2B] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md border border-[#C5A15B]/30 transition-colors cursor-pointer"
                      >
                        <span>Inspect Project Brief</span>
                        <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* More Case Studies Grid */}
      <section className="glass-ambient-light py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#142B49]/12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6B2D]">
                Regional Showcase
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B49] mt-1">
                More Case Studies
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Showing {gridProjects.length + featuredEditorial.length} hospitality & contract installations
            </p>
          </div>

          {gridProjects.length === 0 && featuredEditorial.length === 0 ? (
            <div className="glass-panel-light rounded-xl p-12 text-center space-y-3">
              <p className="font-display text-lg font-bold text-[#142B49]">
                No case studies match this combination
              </p>
              <button
                type="button"
                onClick={() => {
                  setSystemFilter('All');
                  setCountryFilter('All');
                }}
                className="px-4 py-2 rounded-md bg-[#142B49] text-white text-xs font-semibold cursor-pointer"
              >
                Show All Case Studies
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {gridProjects.map((project) => (
                <article
                  key={project.id}
                  className="glass-panel-navy glass-card-hover text-white rounded-xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-[#191F2B]">
                      <SafeImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="text-xs text-[#C5A15B] flex items-center gap-2 font-medium">
                        <span>{project.systemCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{project.year}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {project.shortDescription}
                      </p>
                      <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A15B]" />
                        <span>
                          {project.location}, {project.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#191F2B] border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      {project.systemsInstalled.join(' · ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#C5A15B] transition-colors cursor-pointer shrink-0"
                    >
                      <span>Read More</span>
                      <Play className="w-2.5 h-2.5 fill-[#C5A15B] text-[#C5A15B]" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
