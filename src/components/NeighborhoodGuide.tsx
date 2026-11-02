import React, { useState } from 'react';
import { LOCAL_ATTRACTIONS } from '../data/mockData';
import {
  MapPin,
  Compass,
  Footprints,
  Car,
  Bike,
  Waves,
  Coffee,
  Utensils,
  Beer,
  Trees,
  ExternalLink,
} from 'lucide-react';

export const NeighborhoodGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Beach', 'Dining', 'Coffee', 'Brewery', 'Nature'];

  const filteredAttractions =
    activeCategory === 'All'
      ? LOCAL_ATTRACTIONS
      : LOCAL_ATTRACTIONS.filter((item) => item.category === activeCategory);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Walk':
        return <Footprints className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Bike':
        return <Bike className="w-3.5 h-3.5 text-sky-700" />;
      case 'Drive':
      default:
        return <Car className="w-3.5 h-3.5 text-stone-700" />;
    }
  };

  return (
    <section id="neighborhood" className="py-14 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-800 uppercase mb-1">
              Chic's Beach Neighborhood Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              The Best of Virginia Beach Bay Life
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Located on 4709 Tulip Dr, you are nestled right in the heart of Virginia Beach's beloved Chesapeake Beach neighborhood—renowned for tranquil bay waters and local food culture.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg overflow-x-auto self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Local Attractions Grid + Interactive Neighborhood Map Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Attractions List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredAttractions.map((spot) => (
              <div
                key={spot.id}
                className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                      <span>{spot.name}</span>
                    </h3>

                    {/* Mode and Distance metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
                      {getModeIcon(spot.mode)}
                      <span className="font-semibold text-stone-800">{spot.travelTime}</span>
                      <span className="text-stone-400">({spot.distance})</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                    {spot.description}
                  </p>
                </div>

                {/* Local Insider Tip */}
                <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-amber-950 bg-amber-50/60 p-2.5 rounded-lg">
                  <span className="font-semibold text-amber-900 shrink-0">Insider Tip:</span>
                  <span className="text-amber-900/90">{spot.insiderTip}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Neighborhood Location & Directions Map Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-800" />
                <h3 className="text-sm font-semibold text-stone-900">
                  Address & Directions
                </h3>
              </div>
              <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                5 Min Walk to Beach
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-4">
              <div className="font-bold text-stone-900 text-sm">4709 Tulip Dr</div>
              <div className="text-stone-600">Virginia Beach, VA 23455</div>
              <div className="text-stone-500">Chic's Beach (Chesapeake Beach District)</div>
            </div>

            {/* Stylized Visual Map Diagram */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-sky-50 border border-sky-100 p-4 flex flex-col justify-between">
              {/* Chesapeake Bay Water Banner */}
              <div className="p-2.5 bg-sky-600/90 text-white rounded-lg text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2">
                <Waves className="w-4 h-4 text-sky-200" />
                <span>Chesapeake Bay / Chic's Beach Sands</span>
              </div>

              {/* Connecting path */}
              <div className="my-auto py-2 flex flex-col items-center">
                <div className="h-10 border-l-2 border-dashed border-amber-600 flex items-center justify-center">
                  <span className="bg-white text-[10px] text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                    0.3 mi · 5 Min Stroll
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium">Ocean View Ave Crossing</div>
              </div>

              {/* Vacation Rental Marker */}
              <div className="p-3 bg-stone-900 text-white rounded-xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xs">
                    4709
                  </div>
                  <div>
                    <div className="text-xs font-bold">Tulip Studio</div>
                    <div className="text-[10px] text-stone-300">Quiet Tulip Dr cul-de-sac</div>
                  </div>
                </div>
                <span className="text-[10px] bg-stone-800 text-amber-300 font-mono px-2 py-0.5 rounded">
                  $98/day
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-700">Norfolk Airport (ORF):</span>
                <span>14 min drive (9.2 miles)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-700">VB Oceanfront Boardwalk:</span>
                <span>18 min drive (12 miles)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-stone-700">Town Center Virginia Beach:</span>
                <span>12 min drive (7.5 miles)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
