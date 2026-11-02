import React, { useState } from 'react';
import { Property, Booking } from '../types/rental';
import {
  X,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Laptop,
  Waves,
  Key,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';

interface BookingModalProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  checkIn,
  checkOut,
  onClose,
  onConfirmBooking,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Details, 2 = Confirmed Pass
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [purpose, setPurpose] = useState<Booking['purpose']>('remote_work');
  const [needsWorkstation, setNeedsWorkstation] = useState(true);
  const [needsBeachGear, setNeedsBeachGear] = useState(true);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Nights calculation
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const diffTime = Math.abs(dOut.getTime() - dIn.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseTotal = nights * property.pricePerNight;
  const discount = nights >= 7 ? Math.round(baseTotal * 0.1) : 0;
  const cleaningFee = property.cleaningFee;
  const serviceFee = property.serviceFee;
  const taxes = Math.round((baseTotal - discount + cleaningFee + serviceFee) * property.taxRate);
  const grandTotal = baseTotal - discount + cleaningFee + serviceFee + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const confirmationCode = `TS-VB-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPin = `${Math.floor(1000 + Math.random() * 9000)}#`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      confirmationCode,
      checkIn,
      checkOut,
      nights,
      guestsCount: guestCount,
      guestName: name.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim() || 'Not provided',
      purpose,
      needsWorkstationSetup: needsWorkstation,
      needsBeachGear: needsBeachGear,
      baseTotal,
      cleaningFee,
      serviceFee,
      taxes,
      discount,
      grandTotal,
      doorPin: randomPin,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setConfirmedBooking(newBooking);
    onConfirmBooking(newBooking);
    setStep(2);
  };

  const copyConfirmation = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(
      `Tulip Studio Reservation: ${confirmedBooking.confirmationCode} · Check-in: ${confirmedBooking.checkIn} · Door PIN: ${confirmedBooking.doorPin} · Address: 4709 Tulip Dr, Virginia Beach`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[95vh] overflow-y-auto">
        {step === 1 ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Complete Your Reservation
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tulip Studio · 4709 Tulip Dr, Virginia Beach (5 Min to Chic's Beach)
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dates & Price Summary Pill */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">
                    {checkIn} to {checkOut}
                  </div>
                  <div className="text-stone-500">{nights} night stay · 2 Queen Beds</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-serif font-bold text-stone-900 tabular-nums">
                  ${grandTotal} Total
                </div>
                <div className="text-[11px] text-stone-500">Includes all fees & taxes</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Primary Guest Contact
                </h4>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number (for door PIN)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="(757) 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Preferences */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Stay Preferences & Setup
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Number of Guests
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                    >
                      <option value={1}>1 Guest (1 or 2 Queen beds)</option>
                      <option value={2}>2 Guests (Two Queen beds)</option>
                      <option value={3}>3 Guests (Two Queen beds)</option>
                      <option value={4}>4 Guests (Two Queen beds)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Trip Purpose
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as Booking['purpose'])}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                    >
                      <option value="remote_work">Remote Work / Digital Nomad</option>
                      <option value="vacation">Chic's Beach Vacation</option>
                      <option value="family">Visiting Family in VA Beach</option>
                      <option value="other">Other Getaway</option>
                    </select>
                  </div>
                </div>

                {/* Nomad & Beach Gear Checkboxes */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsWorkstation}
                      onChange={(e) => setNeedsWorkstation(e.target.checked)}
                      className="rounded text-amber-800 focus:ring-amber-800"
                    />
                    <Laptop className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Prep 27" external monitor & USB-C hub at workstation</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsBeachGear}
                      onChange={(e) => setNeedsBeachGear(e.target.checked)}
                      className="rounded text-amber-800 focus:ring-amber-800"
                    />
                    <Waves className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Include 2 backpack beach chairs, umbrella & cooler tote</span>
                  </label>
                </div>
              </div>

              {/* Free Cancellation Guarantee */}
              <div className="flex items-center gap-2 text-xs text-stone-500 py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Instant booking confirmed immediately · No booking fees</span>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
                >
                  Confirm Reservation · ${grandTotal}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Instant Booking Pass */
          <div className="space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Reservation Confirmed!
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600">
              Your stay at <strong>4709 Tulip Dr</strong> is locked in. We have blocked your selected dates in real-time on the calendar.
            </p>

            {/* Guest Pass Ticket Card */}
            <div className="p-5 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Confirmation Code
                  </div>
                  <div className="text-lg font-mono font-bold tracking-wider">
                    {confirmedBooking?.confirmationCode}
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400">
                    Smart Lock Door PIN
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-400 flex items-center sm:justify-end gap-1.5">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>{confirmedBooking?.doorPin}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-stone-400 text-[10px] uppercase">Guest</div>
                  <div className="font-semibold text-white">{confirmedBooking?.guestName}</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[10px] uppercase">Dates</div>
                  <div className="font-semibold text-white">
                    {confirmedBooking?.checkIn} → {confirmedBooking?.checkOut}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[10px] uppercase">Property</div>
                  <div className="font-semibold text-white">4709 Tulip Dr, VA Beach</div>
                </div>
                <div>
                  <div className="text-stone-400 text-[10px] uppercase">Total Paid</div>
                  <div className="font-semibold font-mono text-amber-400">
                    ${confirmedBooking?.grandTotal}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-800/90 rounded-xl text-[11px] text-stone-300 space-y-1">
                <div><strong>Check-In:</strong> 3:00 PM on arrival day</div>
                <div><strong>Wi-Fi Network:</strong> TulipStudio_5G (Pass: chicsbeach2026)</div>
                <div><strong>Parking:</strong> Reserved spot directly in the driveway</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={copyConfirmation}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Itinerary'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
