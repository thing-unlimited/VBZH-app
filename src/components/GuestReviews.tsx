import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Review, CategoryRatings } from '../types/rental';
import {
  Star,
  ThumbsUp,
  Search,
  MessageSquarePlus,
  ShieldCheck,
  Check,
  X,
  SlidersHorizontal,
  Upload,
  Camera,
  Trash2,
  FileImage,
} from 'lucide-react';

interface GuestReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const GuestReviews: React.FC<GuestReviewsProps> = ({
  reviews,
  onAddReview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Write Review Modal State
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTripType, setNewTripType] = useState<Review['category']>('Digital Nomad');
  const [newSource, setNewSource] = useState<'Airbnb' | 'Direct' | 'Google'>('Airbnb');
  const [newStayDate, setNewStayDate] = useState('October 2026');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewImage, setNewReviewImage] = useState<string | null>(null);
  const reviewFileInputRef = useRef<HTMLInputElement | null>(null);

  const [newCategories, setNewCategories] = useState<CategoryRatings>({
    cleanliness: 5,
    accuracy: 5,
    communication: 5,
    location: 5,
    checkIn: 5,
    value: 5,
  });

  useEffect(() => {
    const handleOpenModal = () => setWriteModalOpen(true);
    window.addEventListener('open-review-modal', handleOpenModal);
    return () => window.removeEventListener('open-review-modal', handleOpenModal);
  }, []);

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewReviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  // Toggle helpful
  const toggleHelpful = (id: string) => {
    setHelpfulLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered & Sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        const matchesCat = selectedCategory === 'All' || rev.category === selectedCategory;
        const matchesQuery =
          searchQuery.trim() === '' ||
          rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') {
          return b.rating - a.rating;
        }
        return b.id.localeCompare(a.id); // recent
      });
  }, [reviews, selectedCategory, searchQuery, sortBy]);

  // Aggregate Category Ratings calculation
  const categoryAverages = useMemo(() => {
    if (reviews.length === 0) return { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 };
    const sums = reviews.reduce(
      (acc, r) => {
        acc.cleanliness += r.categories.cleanliness;
        acc.accuracy += r.categories.accuracy;
        acc.communication += r.categories.communication;
        acc.location += r.categories.location;
        acc.checkIn += r.categories.checkIn;
        acc.value += r.categories.value;
        return acc;
      },
      { cleanliness: 0, accuracy: 0, communication: 0, location: 0, checkIn: 0, value: 0 }
    );
    const n = reviews.length;
    return {
      cleanliness: (sums.cleanliness / n).toFixed(2),
      accuracy: (sums.accuracy / n).toFixed(2),
      communication: (sums.communication / n).toFixed(2),
      location: (sums.location / n).toFixed(2),
      checkIn: (sums.checkIn / n).toFixed(2),
      value: (sums.value / n).toFixed(2),
    };
  }, [reviews]);

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return '5.00';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(2);
  }, [reviews]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const colors = ['bg-amber-700', 'bg-teal-700', 'bg-indigo-700', 'bg-emerald-700', 'bg-rose-700'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      authorLocation: newLocation.trim() || 'Guest Traveler',
      avatarBg: randomBg,
      date: 'Just now',
      stayDate: newStayDate.trim() || 'Verified Stay',
      rating: newRating,
      category: newTripType,
      categories: newCategories,
      comment: newComment.trim(),
      helpfulCount: 0,
      isVerifiedStay: true,
      reviewImage: newReviewImage || undefined,
      source: newSource,
    };

    onAddReview(createdReview);
    setWriteModalOpen(false);
    setNewAuthor('');
    setNewLocation('');
    setNewComment('');
    setNewReviewImage(null);
  };

  return (
    <section id="selected-reviews" className="py-14 bg-white border-t border-stone-200 scroll-mt-20 relative">
      <div id="reviews" className="absolute -top-20 left-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Strip with Overall Rating */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-800">
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono uppercase tracking-wider text-[11px]">
                Curated Feedback
              </span>
              <span>·</span>
              <span>VBZH Tulip Studio at Chic's Beach</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-3">
              Selected Guest Reviews
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-2xl font-serif font-bold text-stone-900">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                <span>4.97</span>
              </span>
              <span className="text-xl text-stone-400 font-light">/ 5.0</span>
              <span className="text-sm font-semibold text-stone-700 ml-2">
                · 880+ Verified Positive Reviews
              </span>
              <span className="text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                Airbnb Superhost
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Authentic guest experiences and positive feedback for 4709 Tulip Dr, Virginia Beach. Featuring genuine stays, ratings, and feedback from travelers, remote nomads, and couples.
            </p>
          </div>

          <button
            onClick={() => setWriteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-300" />
            <span>Add Selected Review</span>
          </button>
        </div>

        {/* 6 Category Progress Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-10 p-6 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Cleanliness</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.cleanliness}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.cleanliness) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Accuracy</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.accuracy}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.accuracy) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Communication</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.communication}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.communication) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Location (5 min to Chic's Beach)</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.location}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.location) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Check-in (Keyless Smart Lock)</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.checkIn}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.checkIn) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-stone-700">
              <span>Value ($98/night)</span>
              <span className="font-mono tabular-nums font-semibold">{categoryAverages.value}</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full"
                style={{ width: `${(Number(categoryAverages.value) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Trip Type Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto">
            {['All', 'Digital Nomad', 'Beach Escape', 'Couple', 'Solo Explorer'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Selected Reviews List */}
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Selected Guest Reviews
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto leading-relaxed">
                Ready for your positive guest reviews. Click below to add your reviews with accurate guest names, ratings, and review text!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-300" />
              <span>Add Selected Guest Review</span>
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-sm text-stone-500">No reviews found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-semibold text-amber-800 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => {
              const hasLiked = helpfulLiked[rev.id];
              const totalHelpful = rev.helpfulCount + (hasLiked ? 1 : 0);

              return (
                <div
                  key={rev.id}
                  className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    {/* Author & Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${rev.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                        >
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                            <span>{rev.author}</span>
                            {rev.isVerifiedStay && (
                              <span title="Verified Stay" className="inline-flex text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500">
                            {rev.authorLocation}
                          </div>
                        </div>
                      </div>

                      {/* Star score & source badge */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-stone-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{rev.rating.toFixed(1)}</span>
                        </div>
                        {rev.source && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                            {rev.source === 'Airbnb' ? 'Airbnb Verified' : rev.source}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata line (No pill boxes, clean typographic separators per skill) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                      <span className="font-medium text-amber-900">{rev.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.stayDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.date}</span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {/* Optional Attached Review Photo or Airbnb Screenshot */}
                    {rev.reviewImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 max-h-52">
                        <img
                          src={rev.reviewImage}
                          alt="Review verification screenshot"
                          className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(rev.reviewImage, '_blank')}
                          title="Click to view full image"
                        />
                      </div>
                    )}

                    {/* Host reply if available */}
                    {rev.hostResponse && (
                      <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600 space-y-1">
                        <div className="font-semibold text-stone-900">Response from Yulin Liao (Host):</div>
                        <p>"{rev.hostResponse}"</p>
                      </div>
                    )}
                  </div>

                  {/* Helpful Button Footer */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <button
                      onClick={() => toggleHelpful(rev.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        hasLiked ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-amber-800' : ''}`} />
                      <span>Helpful ({totalHelpful})</span>
                    </button>
                    <span className="text-[11px] text-stone-400">Verified Chic's Beach Stay</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Provenance Footnote */}
        <div className="mt-8 pt-4 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-500 italic max-w-2xl mx-auto">
            Selected positive guest reviews from 2022–2025. Ratings and feedback are authentic words from our guests at Zen Vacation House, Virginia Beach.
          </p>
        </div>

        {/* Write Review Modal */}
        {writeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Add to Selected Guest Reviews
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Add positive review with accurate guest name, rating, and feedback
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWriteModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-800 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jessica Miller"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Charlotte, NC"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Trip Purpose
                    </label>
                    <select
                      value={newTripType}
                      onChange={(e) => setNewTripType(e.target.value as Review['category'])}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                    >
                      <option value="Digital Nomad">Digital Nomad / Remote Work</option>
                      <option value="Beach Escape">Beach Getaway</option>
                      <option value="Couple">Couple Trip</option>
                      <option value="Solo Explorer">Solo Explorer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-stone-300 hover:text-amber-400 transition-colors"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Review Source
                    </label>
                    <select
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value as 'Airbnb' | 'Direct' | 'Google')}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                    >
                      <option value="Airbnb">Airbnb Verified (880+ Feedback)</option>
                      <option value="Direct">Direct Guest Stay</option>
                      <option value="Google">Google Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Stay Date / Month
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. October 2026"
                      value={newStayDate}
                      onChange={(e) => setNewStayDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Experience at 4709 Tulip Dr *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell future travelers about the two queen beds, the kitchen, the workspace, or the 5-minute walk to Chic's Beach..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 leading-relaxed"
                  />
                </div>

                {/* Optional Review Photo or Airbnb Screenshot Upload */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Attach Airbnb Review Screenshot or Stay Photo (Optional)
                  </label>
                  <input
                    type="file"
                    ref={reviewFileInputRef}
                    accept="image/*"
                    onChange={handleReviewPhotoUpload}
                    className="hidden"
                  />
                  {newReviewImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-amber-300 bg-amber-50/50 p-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={newReviewImage}
                          alt="Review attachment preview"
                          className="w-14 h-12 object-cover rounded-lg border border-stone-200"
                        />
                        <span className="text-xs text-stone-700 font-medium">
                          Photo / Screenshot attached
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewReviewImage(null)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-md cursor-pointer"
                        title="Remove attachment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => reviewFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 border border-dashed border-stone-300 hover:border-amber-700 hover:bg-amber-50/50 rounded-xl text-stone-600 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-800" />
                      <span>Upload Airbnb screenshot or stay photo</span>
                    </button>
                  )}
                  <p className="text-[10px] text-stone-400 mt-1">
                    Upload a screenshot of your 880+ Airbnb review or a photo from your stay.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setWriteModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Submit Review to Website
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
