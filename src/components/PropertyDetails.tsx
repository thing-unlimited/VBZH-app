import React, { useState } from 'react';
import { Property } from '../types/rental';
import { AMENITIES_CATALOG } from '../data/mockData';
import {
  BedDouble,
  UtensilsCrossed,
  Bath,
  Wifi,
  Waves,
  ShieldCheck,
  Check,
  Sparkles,
  Clock,
  Car,
  Key,
  Flame,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  onContactHost: () => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  onContactHost,
}) => {
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState<string>('All');

  const categories = ['All', ...AMENITIES_CATALOG.map((c) => c.category)];

  const filteredAmenities =
    selectedAmenityCategory === 'All'
      ? AMENITIES_CATALOG
      : AMENITIES_CATALOG.filter((c) => c.category === selectedAmenityCategory);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left main content (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Studio Story & Sleeping Arrangement */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-4">
              About Tulip Studio
            </h2>
            <div className="text-stone-700 leading-relaxed text-sm sm:text-base space-y-4">
              <p>
                Welcome to your coastal sanctuary at <strong>4709 Tulip Dr</strong> in Virginia Beach. Tucked away on a quiet residential avenue, this breezy 1-bedroom studio was thoughtfully designed from the ground up for travelers, remote professionals, and couples craving a calm coastal getaway.
              </p>
              <p>
                Just a <strong>5-minute stroll</strong> from the tranquil sands of <strong>Chic's Beach (Chesapeake Beach)</strong>, you can spend your mornings taking a bayfront dip, your afternoons working on fiber Wi-Fi at the dedicated workstation, and your evenings catching world-class golden sunsets with local oysters.
              </p>
              <p>
                Unlike standard hotel rooms, Tulip Studio features <strong>two full plush Queen beds</strong> fitted with 1,000-thread count linens, a <strong>fully equipped private kitchen</strong> to prepare home-cooked meals, and a pristine <strong>private bathroom</strong> with a walk-in subway tile shower.
              </p>
            </div>

            {/* Sleeping & Key Spaces Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-200">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <BedDouble className="w-5 h-5 text-amber-800 mb-2" />
                <h4 className="text-sm font-semibold text-stone-900">Sleeping Area</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Two Queen beds with hybrid memory foam mattresses. Sleeps up to 4 guests comfortably.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <UtensilsCrossed className="w-5 h-5 text-amber-800 mb-2" />
                <h4 className="text-sm font-semibold text-stone-900">Private Kitchen</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Full stove, oven, refrigerator, microwave, Chemex coffee bar, cookware & dining table.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <Bath className="w-5 h-5 text-amber-800 mb-2" />
                <h4 className="text-sm font-semibold text-stone-900">Private Bathroom</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Walk-in glass shower, plush towels, organic toiletries, hairdryer, and high water pressure.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Amenities Showcase */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Curated Amenities
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Everything you need for extended nomad stints or quick weekend beach escapes
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedAmenityCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedAmenityCategory === cat
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {filteredAmenities.map((group) => (
                <div key={group.category} className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {group.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-stone-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Policies */}
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">
              House Rules & Stay Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  <strong>Check-in:</strong> 3:00 PM · <strong>Check-out:</strong> 11:00 AM
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  <strong>Self Check-in:</strong> Keyless smart lock PIN sent on booking
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  <strong>Parking:</strong> Free driveway parking space at 4709 Tulip Dr
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  <strong>Quiet Hours:</strong> 10:00 PM – 8:00 AM (Respect neighbors)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: Host Profile & Contact (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                YL
              </div>
              <div>
                <h4 className="text-base font-semibold text-stone-900">Hosted by Yulin Liao</h4>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Superhost
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Chic's Beach Local</span>
                </div>
              </div>
            </div>

            {/* 880+ Reviews Badge Banner */}
            <div className="mb-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center gap-3 text-xs text-amber-950">
              <div className="w-9 h-9 rounded-lg bg-amber-400 text-stone-950 flex flex-col items-center justify-center font-bold shrink-0">
                <span className="text-[11px] leading-tight font-mono">880+</span>
                <span className="text-[8px] uppercase tracking-tighter">Reviews</span>
              </div>
              <div>
                <div className="font-bold text-amber-950 text-xs">880+ Positive Airbnb Reviews</div>
                <div className="text-[11px] text-amber-900/80">4.97 ★ Top Tier Guest Favorite</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              "We have hosted over 880 happy guests across our Virginia Beach properties. We take immense pride in pristine cleanliness, prompt communication, and ensuring your stay at 4709 Tulip Dr is comfortable."
            </p>

            <div className="space-y-2 text-xs text-stone-600 mb-5 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>Direct Phone:</span>
                <a
                  href="tel:7577351024"
                  className="font-semibold text-amber-900 hover:underline"
                >
                  (757) 735-1024
                </a>
              </div>
              <div className="flex justify-between">
                <span>Response rate:</span>
                <span className="font-semibold text-stone-900">100% (within 30 mins)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Stays:</span>
                <span className="font-semibold text-stone-900">880+ Verified 5-Star Stays</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:7577351024"
                className="py-2.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Call Host"
              >
                <span>Call (757) 735-1024</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-chatbox'));
                }}
                className="py-2.5 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Chat with Host</span>
              </button>
            </div>
          </div>

          {/* Quick neighborhood callout card */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80 text-amber-950">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1.5">
              <Waves className="w-4 h-4 text-amber-800" />
              <span>Why Guests Love Chic's Beach</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Unlike the bustling oceanfront Atlantic boardwalk, Chesapeake Beach offers a quieter local coastal culture, warmer bay waters for swimming, and dolphins surfacing right off the sand dunes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
