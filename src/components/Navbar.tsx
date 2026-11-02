import React from 'react';
import { Calendar, UserCheck, Shield, Smartphone, MessageSquare, QrCode } from 'lucide-react';

interface NavbarProps {
  onReserveClick: () => void;
  onMyBookingsClick: () => void;
  onOpenAppStore: () => void;
  onOpenShare?: () => void;
  bookingsCount: number;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReserveClick,
  onMyBookingsClick,
  onOpenAppStore,
  onOpenShare,
  bookingsCount,
  isAdminMode,
  onToggleAdminMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Brand wordmark with VBZH logo icon - mobile-optimized */}
        <a
          href="#"
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group py-1"
          title="VBZH · VB Zen House"
        >
          <img
            src="/vbzh-logo.png"
            alt="VBZH Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-xs border border-amber-900/15 object-cover shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-lg sm:text-2xl text-stone-900 tracking-tight group-hover:text-amber-800 transition-colors">
                VBZH
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300/60 hidden xs:inline-block">
                Zen House
              </span>
            </div>
            <span className="text-[10px] font-sans text-stone-500 font-medium tracking-tight hidden sm:block mt-0.5">
              VB Zen House · 4709 Tulip Dr
            </span>
          </div>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          <a
            href="#overview"
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Overview
          </a>
          <a
            href="#calendar"
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Availability Calendar
          </a>
          <a
            href="#nomad-workspace"
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Nomad Workspace
          </a>
          <a
            href="#selected-reviews"
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Selected Guest Reviews
          </a>
          <a
            href="#neighborhood"
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Chic's Beach Guide
          </a>
        </nav>

        {/* Zone 3: 1 primary action + subtle utility controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* QR Code / Barcode Button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-2 text-xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              title="View, copy, or download your app QR barcode (二维码)"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">QR Code (二维码)</span>
              <span className="sm:hidden text-[11px]">二维码</span>
            </button>
          )}

          {/* App Store / Install App Button */}
          <button
            onClick={onOpenAppStore}
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            title="Install VBZH App or upload to App Store"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">VBZH App</span>
            <span className="sm:hidden text-[11px]">App</span>
          </button>

          {/* Quick Chat with Host button (visible on md screens to keep mobile header clean) */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbox'))}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            title="Chat with Host Yulin Liao & 24/7 Concierge"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
            <span>Live Chat</span>
          </button>

          {bookingsCount > 0 && (
            <button
              onClick={onMyBookingsClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="View your confirmed reservations"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>Trips ({bookingsCount})</span>
            </button>
          )}

          <button
            onClick={onToggleAdminMode}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              isAdminMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="Toggle Host / Calendar Admin mode"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Host Mode (Active)' : 'Host Mode'}</span>
          </button>

          <button
            onClick={onReserveClick}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm hover:shadow whitespace-nowrap shrink-0 active:scale-[0.98] cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span className="hidden sm:inline">Check Dates · $98</span>
            <span className="sm:hidden">$98/night</span>
          </button>
        </div>
      </div>
    </header>
  );
};
