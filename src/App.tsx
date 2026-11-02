import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroGallery } from './components/HeroGallery';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { NomadSpotlight } from './components/NomadSpotlight';
import { PropertyDetails } from './components/PropertyDetails';
import { GuestReviews } from './components/GuestReviews';
import { NeighborhoodGuide } from './components/NeighborhoodGuide';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { HostAdminDrawer } from './components/HostAdminDrawer';
import { ContactHostModal } from './components/ContactHostModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { AppStoreModal } from './components/AppStoreModal';
import { ShareModal } from './components/ShareModal';
import { ChatBox } from './components/ChatBox';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { PROPERTY_DATA, INITIAL_BLOCKED_DATES, INITIAL_REVIEWS } from './data/mockData';
import { Property, Booking, Review } from './types/rental';
import { sanitizeProperty } from './utils/imageUtils';

export default function App() {
  // State for Property (price updates possible by host)
  const [property, setProperty] = useState<Property>(() => {
    const savedV5 = localStorage.getItem('tulip_property_data_v5');
    if (savedV5) {
      try {
        return sanitizeProperty(JSON.parse(savedV5));
      } catch (e) {
        // ignore
      }
    }
    const savedV4 = localStorage.getItem('tulip_property_data_v4');
    if (savedV4) {
      try {
        return sanitizeProperty(JSON.parse(savedV4));
      } catch (e) {
        // ignore
      }
    }
    return PROPERTY_DATA;
  });

  // Blocked dates state (real-time availability calendar)
  const [blockedDates, setBlockedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('tulip_blocked_dates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_BLOCKED_DATES;
  });

  // Selected Guest Reviews state (Zen Vacation House positive reviews)
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('tulip_zen_reviews_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_REVIEWS;
  });

  // User's confirmed bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tulip_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  // Calendar selection state
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  // Modals & Drawers state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [hostDrawerOpen, setHostDrawerOpen] = useState(false);
  const [contactHostOpen, setContactHostOpen] = useState(false);
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [photoUploadTab, setPhotoUploadTab] = useState<'upload' | 'manage'>('upload');
  const [appStoreOpen, setAppStoreOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem('tulip_blocked_dates', JSON.stringify(blockedDates));
  }, [blockedDates]);

  useEffect(() => {
    localStorage.setItem('tulip_property_data_v5', JSON.stringify(property));
    localStorage.setItem('tulip_property_data_v4', JSON.stringify(property));
  }, [property]);

  useEffect(() => {
    localStorage.setItem('tulip_zen_reviews_v5', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('tulip_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Maintain verified property ratings and review count
  useEffect(() => {
    setProperty((prev) => ({
      ...prev,
      rating: 4.97,
      reviewCount: 880 + reviews.length,
    }));
  }, [reviews]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      text,
    });
  };

  // Handle Share
  const handleShare = () => {
    setShareModalOpen(true);
  };

  // Toggle Wishlist
  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      showToast(next ? 'Saved to your Virginia Beach favorites!' : 'Removed from saved favorites', 'info');
      return next;
    });
  };

  // Calendar Date selection handler
  const handleSelectDates = (cin: string | null, cout: string | null) => {
    setCheckIn(cin);
    setCheckOut(cout);
  };

  // Toggle date blocking (for Host Mode)
  const handleToggleDateBlock = (dateStr: string) => {
    setBlockedDates((prev) => {
      const exists = prev.includes(dateStr);
      const next = exists ? prev.filter((d) => d !== dateStr) : [...prev, dateStr];
      showToast(
        exists ? `Unblocked ${dateStr} for guests` : `Blocked ${dateStr} on calendar`,
        'info'
      );
      return next;
    });
  };

  // Confirm booking & auto block dates in real time
  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Generate array of dates between checkIn and checkOut
    const start = new Date(newBooking.checkIn);
    const end = new Date(newBooking.checkOut);
    const datesToBlock: string[] = [];

    const cur = new Date(start);
    while (cur < end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      datesToBlock.push(`${y}-${m}-${d}`);
      cur.setDate(cur.getDate() + 1);
    }

    setBlockedDates((prev) => Array.from(new Set([...prev, ...datesToBlock])));
    showToast(
      `Reservation ${newBooking.confirmationCode} confirmed! Calendar dates updated in real-time.`,
      'success'
    );
  };

  // Cancel booking & release dates in real time
  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return;

    // Determine dates that should be unblocked
    const start = new Date(bookingToCancel.checkIn);
    const end = new Date(bookingToCancel.checkOut);
    const datesToUnblock: string[] = [];

    const cur = new Date(start);
    while (cur < end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      datesToUnblock.push(`${y}-${m}-${d}`);
      cur.setDate(cur.getDate() + 1);
    }

    setBlockedDates((prev) => prev.filter((d) => !datesToUnblock.includes(d)));
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast('Reservation cancelled. The calendar dates have been freed up.', 'info');
  };

  // Add review
  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you! Your guest review has been published.', 'success');
  };

  // Host rate update
  const handleUpdatePrice = (newPrice: number) => {
    setProperty((prev) => ({
      ...prev,
      pricePerNight: newPrice,
    }));
    showToast(`Nightly base rate updated to $${newPrice}/night.`, 'success');
  };

  // Photo gallery update
  const handleUpdateImages = (updatedImages: Property['images']) => {
    setProperty((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleOpenPhotoUpload = (tab: 'upload' | 'manage' = 'upload') => {
    setPhotoUploadTab(tab);
    setPhotoUploadOpen(true);
  };

  const handleDeleteAdditionalPhoto = (photoId: string) => {
    setProperty((prev) => {
      const updated = { ...prev.images };
      if (updated.additionalPhotos) {
        updated.additionalPhotos = updated.additionalPhotos.filter((p) => p.id !== photoId);
      }
      return { ...prev, images: updated };
    });
    showToast('Photo permanently deleted from gallery.', 'info');
  };

  const handleResetSlotPhoto = (slot: 'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach') => {
    setProperty((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [slot]: PROPERTY_DATA.images[slot],
      },
    }));
    showToast(`Restored original default photo for ${slot}.`, 'success');
  };

  // Reset default blocks
  const handleClearAllCustomBlocks = () => {
    setBlockedDates(INITIAL_BLOCKED_DATES);
    showToast('Calendar blocked dates restored to default schedule.', 'info');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navbar with 3-Zone contract */}
      <Navbar
        onReserveClick={() => {
          const el = document.getElementById('calendar');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onMyBookingsClick={() => setMyBookingsOpen(true)}
        onOpenAppStore={() => setAppStoreOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
        bookingsCount={bookings.length}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => {
          setIsAdminMode((prev) => !prev);
          setHostDrawerOpen((prev) => !prev);
        }}
      />

      <main className="flex-1">
        {/* Hero & 5-Photo Gallery */}
        <HeroGallery
          property={property}
          onShare={handleShare}
          onWishlistToggle={handleWishlistToggle}
          isWishlisted={isWishlisted}
          onOpenUploadModal={handleOpenPhotoUpload}
          onDeletePhoto={handleDeleteAdditionalPhoto}
          onResetSlotPhoto={handleResetSlotPhoto}
        />

        {/* Real-Time Availability Calendar & Instant Pricing */}
        <AvailabilityCalendar
          property={property}
          blockedDates={blockedDates}
          checkIn={checkIn}
          checkOut={checkOut}
          onSelectDates={handleSelectDates}
          onOpenBooking={() => setBookingModalOpen(true)}
          isAdminMode={isAdminMode}
          onToggleDateBlock={handleToggleDateBlock}
        />

        {/* Dedicated Digital Nomad Spotlight & Speed Test */}
        <NomadSpotlight />

        {/* Property Specs, 2 Queen Beds, Private Kitchen, Bathroom & House Rules */}
        <PropertyDetails
          property={property}
          onContactHost={() => setContactHostOpen(true)}
        />

        {/* Verified Guest Reviews & Ratings System */}
        <GuestReviews
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* Chic's Beach Neighborhood & Commute Guide */}
        <NeighborhoodGuide />
      </main>

      {/* Footer */}
      <Footer onOpenAppStore={() => setAppStoreOpen(true)} />

      {/* Modals & Drawers */}
      {bookingModalOpen && checkIn && checkOut && (
        <BookingModal
          property={property}
          checkIn={checkIn}
          checkOut={checkOut}
          onClose={() => setBookingModalOpen(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {myBookingsOpen && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setMyBookingsOpen(false)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      <HostAdminDrawer
        property={property}
        blockedDates={blockedDates}
        bookings={bookings}
        isOpen={hostDrawerOpen}
        onClose={() => setHostDrawerOpen(false)}
        onUpdatePrice={handleUpdatePrice}
        onToggleDateBlock={handleToggleDateBlock}
        onClearAllCustomBlocks={handleClearAllCustomBlocks}
        onOpenPhotoUpload={() => handleOpenPhotoUpload('manage')}
      />

      {contactHostOpen && (
        <ContactHostModal
          onClose={() => setContactHostOpen(false)}
          onMessageSent={(msg) => showToast('Inquiry sent to Yulin Liao!', 'success')}
        />
      )}

      <PhotoUploadModal
        property={property}
        isOpen={photoUploadOpen}
        onClose={() => setPhotoUploadOpen(false)}
        onUpdateImages={handleUpdateImages}
        onShowToast={showToast}
        initialTab={photoUploadTab}
      />

      <AppStoreModal
        isOpen={appStoreOpen}
        onClose={() => setAppStoreOpen(false)}
        onShowToast={showToast}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating 24/7 Guest & Host Chatbox */}
      <ChatBox
        property={property}
        onOpenBooking={() => setBookingModalOpen(true)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
