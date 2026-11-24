import { Facebook, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react';
import type { PageRoute } from '../types/casmura.ts';
import { BrandMark } from './BrandMark.tsx';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#191F2B] text-white border-t border-[#C5A15B]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            aria-label="Casmura Contract Home"
          >
            <BrandMark variant="dark" />
          </a>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-slate-300"
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#C5A15B] transition-colors cursor-pointer whitespace-nowrap"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="hover:text-[#C5A15B] transition-colors cursor-pointer whitespace-nowrap"
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className="hover:text-[#C5A15B] transition-colors cursor-pointer whitespace-nowrap"
            >
              Case Studies
            </button>
            <button
              type="button"
              onClick={() => onNavigate('automation')}
              className="hover:text-[#C5A15B] transition-colors cursor-pointer whitespace-nowrap"
            >
              Automation
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-[#C5A15B] transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/94777771775?text=Hello%20Casmura%20Contract%2C%20I%20would%20like%20to%20discuss%20a%20hospitality%20shading%20project."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Casmura Contract"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#C5A15B] hover:border-[#C5A15B]/70 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#C5A15B] hover:border-[#C5A15B]/70 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#C5A15B] hover:border-[#C5A15B]/70 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#C5A15B] hover:border-[#C5A15B]/70 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#C5A15B] hover:border-[#C5A15B]/70 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © 2026 Casmura Contract · Subsidiary of Avarna Holdings. All rights reserved.
          </p>
          <p>
            No. 25/1/1, Elibank Rd, Colombo, Sri Lanka · +94 77 777 1 775
          </p>
        </div>
      </div>
    </footer>
  );
}
