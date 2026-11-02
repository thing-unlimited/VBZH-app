import React, { useState } from 'react';
import { Booking } from '../types/rental';
import {
  X,
  Calendar,
  Key,
  MapPin,
  Trash2,
  AlertCircle,
  Copy,
  CheckCircle,
} from 'lucide-react';

interface MyBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onCancelBooking,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (booking: Booking) => {
    navigator.clipboard.writeText(
      `Tulip Studio Reservation ${booking.confirmationCode} · Check-in: ${booking.checkIn} · Door PIN: ${booking.doorPin} · 4709 Tulip Dr, VA Beach`
    );
    setCopiedId(booking.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmCancel = (id: string) => {
    onCancelBooking(id);
    setCancellingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              My Trips & Reservations
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your confirmed bookings for 4709 Tulip Dr
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p>You have no active reservations yet.</p>
            <p className="text-xs text-stone-400">
              Select dates on the calendar and click "Instant Reserve" to book your stay.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2.5 py-1 rounded-md">
                      {b.confirmationCode}
                    </span>
                    <span className="text-xs text-stone-500">Booked on {b.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-medium self-start sm:self-auto">
                    <Key className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Door PIN: {b.doorPin}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-stone-400 text-[10px] uppercase">Dates</div>
                    <div className="font-semibold text-stone-900">
                      {b.checkIn} → {b.checkOut}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px] uppercase">Duration</div>
                    <div className="font-semibold text-stone-900">
                      {b.nights} night{b.nights > 1 ? 's' : ''} · {b.guestsCount} guests
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px] uppercase">Total Paid</div>
                    <div className="font-semibold font-mono text-stone-900 tabular-nums">
                      ${b.grandTotal}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px] uppercase">Address</div>
                    <div className="font-semibold text-stone-900 truncate">4709 Tulip Dr</div>
                  </div>
                </div>

                {cancellingId === b.id ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      <span>Cancel this reservation and release the calendar dates?</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setCancellingId(null)}
                        className="px-2.5 py-1 font-medium text-stone-600 hover:bg-stone-200/50 rounded"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => confirmCancel(b.id)}
                        className="px-2.5 py-1 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      onClick={() => handleCopy(b)}
                      className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === b.id ? 'Copied Details' : 'Copy Check-in Pass'}</span>
                    </button>

                    <button
                      onClick={() => setCancellingId(b.id)}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Reservation</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-5 border-t border-stone-100 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
