import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import { Property } from '../types/rental';

interface AvailabilityCalendarProps {
  property: Property;
  blockedDates: string[];
  checkIn: string | null;
  checkOut: string | null;
  onSelectDates: (checkIn: string | null, checkOut: string | null) => void;
  onOpenBooking: () => void;
  isAdminMode: boolean;
  onToggleDateBlock: (dateStr: string) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  property,
  blockedDates,
  checkIn,
  checkOut,
  onSelectDates,
  onOpenBooking,
  isAdminMode,
  onToggleDateBlock,
}) => {
  // Base date set around October 2026 per current mock timestamp
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Oct 2026, 1 = Nov 2026, etc.
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);

  const baseYear = 2026;
  const baseMonth = 9; // October (0-indexed: 9 is October)

  // Current display month 1 and month 2
  const firstMonthDate = useMemo(() => {
    return new Date(baseYear, baseMonth + currentMonthIndex, 1);
  }, [baseYear, baseMonth, currentMonthIndex]);

  const secondMonthDate = useMemo(() => {
    return new Date(baseYear, baseMonth + currentMonthIndex + 1, 1);
  }, [baseYear, baseMonth, currentMonthIndex]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Helper to format Date to YYYY-MM-DD
  const formatDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Generate calendar days for a given year & month
  const getDaysForMonth = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysCount = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 for Sunday

    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean; isPast: boolean }[] = [];

    // Empty slots before 1st of month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        dateStr: `blank-start-${i}`,
        dayNumber: 0,
        isCurrentMonth: false,
        isPast: true,
      });
    }

    const todayStr = '2026-10-16';

    for (let d = 1; d <= daysCount; d++) {
      const cur = new Date(year, month, d);
      const str = formatDateStr(cur);
      days.push({
        dateStr: str,
        dayNumber: d,
        isCurrentMonth: true,
        isPast: str < todayStr,
      });
    }

    return days;
  };

  const daysMonth1 = useMemo(() => getDaysForMonth(firstMonthDate), [firstMonthDate]);
  const daysMonth2 = useMemo(() => getDaysForMonth(secondMonthDate), [secondMonthDate]);

  // Click on date logic
  const handleDateClick = (dateStr: string, isPast: boolean) => {
    if (isPast) return;

    if (isAdminMode) {
      // In Admin mode, clicking toggles block/unblock
      onToggleDateBlock(dateStr);
      return;
    }

    const isBlocked = blockedDates.includes(dateStr);
    if (isBlocked) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Starting new selection
      onSelectDates(dateStr, null);
    } else if (checkIn && !checkOut) {
      if (dateStr <= checkIn) {
        // Reset or pick earlier date as new check-in
        onSelectDates(dateStr, null);
      } else {
        // Check if any date in between is blocked
        let hasBlockedBetween = false;
        const start = new Date(checkIn);
        const end = new Date(dateStr);
        const cur = new Date(start);
        cur.setDate(cur.getDate() + 1);

        while (cur < end) {
          if (blockedDates.includes(formatDateStr(cur))) {
            hasBlockedBetween = true;
            break;
          }
          cur.setDate(cur.getDate() + 1);
        }

        if (hasBlockedBetween) {
          // Cannot span over blocked dates, start fresh from clicked date
          onSelectDates(dateStr, null);
        } else {
          onSelectDates(checkIn, dateStr);
        }
      }
    }
  };

  // Pricing calculations
  const { nights, basePrice, cleaningFee, serviceFee, taxes, discount, grandTotal } = useMemo(() => {
    if (!checkIn || !checkOut) {
      return {
        nights: 0,
        basePrice: property.pricePerNight,
        cleaningFee: property.cleaningFee,
        serviceFee: property.serviceFee,
        taxes: 0,
        discount: 0,
        grandTotal: 0,
      };
    }

    const dIn = new Date(checkIn);
    const dOut = new Date(checkOut);
    const diffTime = Math.abs(dOut.getTime() - dIn.getTime());
    const n = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const base = n * property.pricePerNight;
    const disc = n >= 7 ? Math.round(base * 0.1) : 0; // 10% off for weekly stays
    const clean = property.cleaningFee;
    const serv = property.serviceFee;
    const tax = Math.round((base - disc + clean + serv) * property.taxRate);
    const total = base - disc + clean + serv + tax;

    return {
      nights: n,
      basePrice: base,
      cleaningFee: clean,
      serviceFee: serv,
      taxes: tax,
      discount: disc,
      grandTotal: total,
    };
  }, [checkIn, checkOut, property]);

  const isDateSelected = (dateStr: string) => {
    return dateStr === checkIn || dateStr === checkOut;
  };

  const isDateInRange = (dateStr: string) => {
    if (checkIn && checkOut) {
      return dateStr > checkIn && dateStr < checkOut;
    }
    if (checkIn && !checkOut && hoveredDate) {
      return dateStr > checkIn && dateStr <= hoveredDate;
    }
    return false;
  };

  const renderMonthGrid = (dateObj: Date, days: ReturnType<typeof getDaysForMonth>) => {
    const monthTitle = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="text-center font-semibold text-stone-900 mb-4 text-sm sm:text-base">
          {monthTitle}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 mb-2">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((item, idx) => {
            if (!item.isCurrentMonth) {
              return <div key={idx} className="h-9 sm:h-10 w-full" />;
            }

            const isBlocked = blockedDates.includes(item.dateStr);
            const isSelected = isDateSelected(item.dateStr);
            const inRange = isDateInRange(item.dateStr);
            const isCheckInDay = item.dateStr === checkIn;
            const isCheckOutDay = item.dateStr === checkOut;

            let buttonClasses = 'relative h-9 sm:h-10 w-full text-xs sm:text-sm font-medium transition-all rounded-lg flex flex-col items-center justify-center';

            if (item.isPast) {
              buttonClasses += ' text-stone-300 cursor-not-allowed';
            } else if (isAdminMode) {
              if (isBlocked) {
                buttonClasses += ' bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 cursor-pointer';
              } else {
                buttonClasses += ' bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer';
              }
            } else if (isBlocked) {
              buttonClasses += ' text-stone-300 bg-stone-100/70 line-through cursor-not-allowed';
            } else if (isSelected) {
              buttonClasses += ' bg-stone-900 text-white font-bold shadow-sm';
            } else if (inRange) {
              buttonClasses += ' bg-amber-100 text-amber-900 rounded-none';
            } else {
              buttonClasses += ' text-stone-700 hover:bg-stone-100 hover:text-stone-900 cursor-pointer';
            }

            return (
              <button
                key={item.dateStr}
                disabled={item.isPast || (!isAdminMode && isBlocked)}
                onClick={() => handleDateClick(item.dateStr, item.isPast)}
                onMouseEnter={() => !item.isPast && !isBlocked && setHoveredDate(item.dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={buttonClasses}
                title={
                  isAdminMode
                    ? `${item.dateStr}: Click to ${isBlocked ? 'Unblock' : 'Block'}`
                    : isBlocked
                    ? 'Unavailable / Booked'
                    : isSelected
                    ? 'Selected'
                    : 'Available for $98/night'
                }
              >
                <span>{item.dayNumber}</span>
                {isAdminMode && !item.isPast && (
                  <span className="text-[9px] -mt-0.5 opacity-80">
                    {isBlocked ? <Lock className="w-2.5 h-2.5 inline" /> : <Unlock className="w-2.5 h-2.5 inline" />}
                  </span>
                )}
                {isCheckInDay && (
                  <span className="absolute -bottom-1 text-[8px] tracking-tight uppercase text-amber-300 font-bold hidden sm:block">
                    In
                  </span>
                )}
                {isCheckOutDay && (
                  <span className="absolute -bottom-1 text-[8px] tracking-tight uppercase text-amber-300 font-bold hidden sm:block">
                    Out
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section id="calendar" className="py-12 border-t border-stone-200 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-800 uppercase mb-1">
              Real-Time Availability
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Select Your Travel Dates
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Minimum 1 night stay. Two plush Queen beds at 4709 Tulip Dr, Virginia Beach. 5 minutes from Chic's Beach with high-speed Wi-Fi and workstation.
            </p>
          </div>

          {/* Quick Date Reset or Status indicator */}
          <div className="flex items-center gap-3">
            {checkIn && (
              <button
                onClick={() => onSelectDates(null, null)}
                className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Clear Selected Dates
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>
        </div>

        {/* Admin Mode Alert Banner */}
        {isAdminMode && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Host Calendar Management Mode:</strong> Click any date on the calendar to toggle availability (Block for maintenance/personal stay or unblock for guests).
              </span>
            </div>
            <span className="font-mono text-xs bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold shrink-0">
              {blockedDates.length} blocked dates
            </span>
          </div>
        )}

        {/* 2-Column Responsive Layout: Dual-Month Calendar (Left 65%) + Contiguous Pricing & Booking Module (Right 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Surface (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-800" />
                <span className="text-sm font-semibold text-stone-900">
                  {checkIn && checkOut
                    ? `${nights} Night${nights > 1 ? 's' : ''} Selected`
                    : checkIn
                    ? 'Select Check-out Date'
                    : 'Select Check-in Date'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentMonthIndex === 0}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 transition-colors"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentMonthIndex((prev) => prev + 1)}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grids */}
            <div className="flex flex-col sm:flex-row gap-8">
              {renderMonthGrid(firstMonthDate, daysMonth1)}
              <div className="hidden sm:block w-[1px] bg-stone-100 self-stretch" />
              <div className="hidden sm:block flex-1">
                {renderMonthGrid(secondMonthDate, daysMonth2)}
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-stone-100 text-xs text-stone-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-white border border-stone-300" />
                  <span>Available ($98)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-stone-900" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-stone-200 text-[10px] flex items-center justify-center line-through text-stone-500">
                    ✕
                  </span>
                  <span>Booked / Reserved</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Check-in: 3:00 PM · Check-out: 11:00 AM</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking Summary Card (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-md">
            {/* Nightly Rate Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  ${property.pricePerNight}
                </span>
                <span className="text-sm text-stone-500 ml-1">/ night</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Best Price Direct</span>
              </div>
            </div>

            {/* Check-In / Check-Out Inputs */}
            <div className="mt-4 grid grid-cols-2 gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div className="p-2 border-r border-stone-200">
                <label className="block uppercase tracking-wider text-[10px] font-bold text-stone-500 mb-0.5">
                  Check-In
                </label>
                <div className="font-semibold text-stone-900 text-sm truncate">
                  {checkIn ? checkIn : 'Select date'}
                </div>
              </div>
              <div className="p-2">
                <label className="block uppercase tracking-wider text-[10px] font-bold text-stone-500 mb-0.5">
                  Check-Out
                </label>
                <div className="font-semibold text-stone-900 text-sm truncate">
                  {checkOut ? checkOut : 'Select date'}
                </div>
              </div>
            </div>

            {/* Guests selector */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span className="block uppercase tracking-wider text-[10px] font-bold text-stone-500">
                  Guests (2 Queen Beds)
                </span>
                <span className="font-semibold text-stone-900 text-sm">
                  {guestCount} Guest{guestCount > 1 ? 's' : ''} (Sleeps up to 4)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                  disabled={guestCount <= 1}
                  className="w-7 h-7 rounded-md border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 flex items-center justify-center font-bold text-stone-700"
                >
                  -
                </button>
                <span className="font-mono text-sm font-semibold">{guestCount}</span>
                <button
                  type="button"
                  onClick={() => setGuestCount((g) => Math.min(4, g + 1))}
                  disabled={guestCount >= 4}
                  className="w-7 h-7 rounded-md border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 flex items-center justify-center font-bold text-stone-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Instant Reserve Button */}
            <button
              onClick={onOpenBooking}
              disabled={!checkIn || !checkOut}
              className={`w-full mt-5 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                checkIn && checkOut
                  ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {checkIn && checkOut
                  ? `Instant Reserve (${nights} Night${nights > 1 ? 's' : ''})`
                  : 'Select Check-in & Check-out'}
              </span>
            </button>

            <div className="text-center text-stone-400 text-xs mt-2">
              You won't be charged yet · Free cancellation up to 48h before arrival
            </div>

            {/* Itemized Price Breakdown */}
            {checkIn && checkOut && (
              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>
                    ${property.pricePerNight} × {nights} nights
                  </span>
                  <span className="font-mono tabular-nums text-stone-900">${basePrice}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Weekly stay discount (10%)</span>
                    <span className="font-mono tabular-nums">-${discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1" title="Includes sanitization and fresh linens">
                    Cleaning fee
                    <Info className="w-3 h-3 text-stone-400" />
                  </span>
                  <span className="font-mono tabular-nums text-stone-900">${cleaningFee}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1" title="Covers 24/7 guest support and lock code provisioning">
                    Direct booking service fee
                    <Info className="w-3 h-3 text-stone-400" />
                  </span>
                  <span className="font-mono tabular-nums text-stone-900">${serviceFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Virginia Beach occupancy & sales tax (8%)</span>
                  <span className="font-mono tabular-nums text-stone-900">${taxes}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-stone-900 font-semibold text-sm">
                  <span>Total before taxes & fees</span>
                  <span className="font-serif text-lg font-bold tabular-nums">
                    ${grandTotal}
                  </span>
                </div>
              </div>
            )}

            {/* Perks reminder */}
            <div className="mt-5 p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Complimentary 460 Mbps Wi-Fi & Workstation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Private kitchen & free driveway parking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Beach chairs & umbrella included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
