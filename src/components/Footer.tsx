import { MapPin, ShieldCheck, Mail, Phone, Waves, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenAppStore?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAppStore }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800 text-xs">
          {/* Col 1: Property Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/vbzh-logo.png"
                alt="VBZH Logo"
                className="w-9 h-9 rounded-xl border border-amber-400/20 shadow-md object-cover"
              />
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                VBZH · VB Zen House
              </h3>
            </div>
            <p className="text-stone-400 leading-relaxed">
              VB Zen House (Tulip Studio) — Cozy coastal 1-bedroom studio with two queen beds, private kitchen, dedicated digital nomad workspace, and fiber Wi-Fi. 5 minutes near Chic's Beach.
            </p>
            <div className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>4709 Tulip Dr, Virginia Beach, VA 23455</span>
            </div>
            {onOpenAppStore && (
              <button
                onClick={onOpenAppStore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Get the VBZH App</span>
              </button>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Explore
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Studio Overview & Gallery
                </a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-white transition-colors">
                  Availability Calendar & Rates
                </a>
              </li>
              <li>
                <a href="#nomad-workspace" className="hover:text-white transition-colors">
                  Nomad Workspace & Wi-Fi Specs
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Guest Reviews & Ratings
                </a>
              </li>
              <li>
                <a href="#neighborhood" className="hover:text-white transition-colors">
                  Chic's Beach Area Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Chic's Beach Perks */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Stay Highlights
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>· Two Queen Beds (Sleeps 4)</li>
              <li>· $98 per day flat base rate</li>
              <li>· Private kitchen with range & oven</li>
              <li>· 460 Mbps high-speed Wi-Fi</li>
              <li>· Walk-in subway tile shower</li>
              <li>· 5 min walk to Chesapeake Bay</li>
            </ul>
          </div>

          {/* Col 4: Contact & Peace of Mind */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Guest Care
            </h4>
            <p className="text-stone-400 leading-relaxed">
              Self check-in with smart keypad PIN provided upon booking confirmation. Direct support from local Superhost Yulin Liao.
            </p>
            <div className="pt-2 text-stone-300 space-y-1">
              <div>Email: host@tulipstudiovabeach.com</div>
              <div>
                Direct Phone:{' '}
                <a
                  href="tel:7577351024"
                  className="text-amber-400 hover:underline font-semibold"
                >
                  (757) 735-1024
                </a>
              </div>
              <div className="text-[11px] text-stone-400">880+ Positive Airbnb Reviews · Superhost</div>
            </div>
          </div>
        </div>

        {/* Quiet copyright & bottom legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} VBZH · VB Zen House (Tulip Studio). 4709 Tulip Dr, Virginia Beach, VA. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 transition-colors">Terms of Stay</span>
            <span className="hover:text-stone-400 transition-colors">House Rules</span>
            <span className="hover:text-stone-400 transition-colors">Chic's Beach Local Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
