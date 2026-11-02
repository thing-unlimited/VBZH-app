import React, { useState } from 'react';
import { Property, Booking } from '../types/rental';
import {
  X,
  Shield,
  DollarSign,
  Calendar,
  Lock,
  Unlock,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Users,
  Camera,
  Image as ImageIcon,
  Star,
} from 'lucide-react';

interface HostAdminDrawerProps {
  property: Property;
  blockedDates: string[];
  bookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrice: (newPrice: number) => void;
  onToggleDateBlock: (dateStr: string) => void;
  onClearAllCustomBlocks: () => void;
  onOpenPhotoUpload: () => void;
}

export const HostAdminDrawer: React.FC<HostAdminDrawerProps> = ({
  property,
  blockedDates,
  bookings,
  isOpen,
  onClose,
  onUpdatePrice,
  onToggleDateBlock,
  onClearAllCustomBlocks,
  onOpenPhotoUpload,
}) => {
  const [newRate, setNewRate] = useState<number>(property.pricePerNight);
  const [manualDateInput, setManualDateInput] = useState<string>('');
  const [rateUpdatedSuccess, setRateUpdatedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRate > 0) {
      onUpdatePrice(newRate);
      setRateUpdatedSuccess(true);
      setTimeout(() => setRateUpdatedSuccess(false), 2000);
    }
  };

  const handleManualAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualDateInput.trim()) {
      onToggleDateBlock(manualDateInput.trim());
      setManualDateInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold">Host Management Mode</h3>
              <p className="text-[11px] text-stone-300">4709 Tulip Dr Rental Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto text-xs text-stone-700">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-stone-400 text-[10px] uppercase font-bold">Base Rate</div>
              <div className="text-lg font-mono font-bold text-stone-900">${property.pricePerNight}</div>
              <div className="text-[10px] text-stone-500">per night</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-stone-400 text-[10px] uppercase font-bold">Blocked</div>
              <div className="text-lg font-mono font-bold text-rose-700">{blockedDates.length}</div>
              <div className="text-[10px] text-stone-500">days locked</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <div className="text-stone-400 text-[10px] uppercase font-bold">Bookings</div>
              <div className="text-lg font-mono font-bold text-emerald-700">{bookings.length}</div>
              <div className="text-[10px] text-stone-500">confirmed</div>
            </div>
          </div>

          {/* Nightly Rate Adjuster */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-xs">Set Nightly Base Rate</h4>
              {rateUpdatedSuccess && (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handlePriceSave} className="flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                Update
              </button>
            </form>
            <p className="text-[11px] text-stone-500">
              Default is $98/night. Updating this updates availability calculations across all booking flows in real-time.
            </p>
          </div>

          {/* Block Specific Date Form */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <h4 className="font-semibold text-stone-900 text-xs">Block / Unblock Single Date</h4>
            <form onSubmit={handleManualAddBlock} className="flex gap-2">
              <input
                type="date"
                value={manualDateInput}
                onChange={(e) => setManualDateInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer"
              >
                Toggle
              </button>
            </form>
            <p className="text-[11px] text-stone-500">
              You can also directly click any date on the main calendar view on the page to toggle block/unblock.
            </p>
          </div>

          {/* Property Photos & Gallery Manager */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-xs">Listing Photos & Gallery</h4>
              <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono font-bold">
                {5 + (property.images.additionalPhotos?.length || 0)} Photos
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Upload new photos of the two queen beds, nomad workstation, kitchen, or Chic's Beach.
            </p>
            <button
              type="button"
              onClick={onOpenPhotoUpload}
              className="w-full py-2 px-3 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload or Manage Photos</span>
            </button>
          </div>

          {/* Guest Reviews & Airbnb Feedback */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-xs">Guest Reviews & Airbnb Feedback</h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                880+ Verified
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Add new guest reviews, import feedback from Airbnb, or upload review screenshot badges.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('open-review-modal'));
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-stone-900 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Add / Import Review or Screenshot</span>
            </button>
          </div>

          {/* Blocked Dates List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-xs">
                Currently Blocked Calendar Dates ({blockedDates.length})
              </h4>
              <button
                onClick={onClearAllCustomBlocks}
                className="text-[11px] text-rose-700 hover:underline cursor-pointer"
              >
                Reset Default Blocks
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
              {blockedDates.length === 0 ? (
                <div className="text-center py-4 text-stone-400 text-xs">All calendar dates are open!</div>
              ) : (
                blockedDates.map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-stone-100 text-xs"
                  >
                    <span className="font-mono text-stone-800">{d}</span>
                    <button
                      onClick={() => onToggleDateBlock(d)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Unblock this date"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">Host Mode Active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
