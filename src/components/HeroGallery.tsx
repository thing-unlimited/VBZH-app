import React, { useState } from 'react';
import { Property } from '../types/rental';
import { PROPERTY_DATA } from '../data/mockData';
import { resolveImageUrl, AUTHENTIC_IMAGES } from '../utils/imageUtils';
import {
  MapPin,
  Star,
  Share2,
  Heart,
  Grid,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wifi,
  BedDouble,
  UtensilsCrossed,
  Laptop,
  Upload,
  Camera,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface HeroGalleryProps {
  property: Property;
  onShare: () => void;
  onWishlistToggle: () => void;
  isWishlisted: boolean;
  onOpenUploadModal: (tab?: 'upload' | 'manage') => void;
  onDeletePhoto?: (photoId: string) => void;
  onResetSlotPhoto?: (slot: 'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach') => void;
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({
  property,
  onShare,
  onWishlistToggle,
  isWishlisted,
  onOpenUploadModal,
  onDeletePhoto,
  onResetSlotPhoto,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const baseGallery = [
    {
      id: 'slot-hero',
      slot: 'hero' as const,
      isAdditional: false,
      url: resolveImageUrl(property.images.hero, 'hero'),
      title: 'Studio Suite & Four-Poster Queen Bed',
      caption: 'Handcrafted wooden four-poster queen bed, bedside lighting, and quiet ambient comfort.',
    },
    {
      id: 'slot-workspace',
      slot: 'workspace' as const,
      isAdditional: false,
      url: resolveImageUrl(property.images.workspace, 'workspace'),
      title: 'Cozy Living Area & Armchair Seating',
      caption: 'Comfortable sofa, plush armchair, ceiling fan, and direct doorway opening out to the garden trellis.',
    },
    {
      id: 'slot-kitchen',
      slot: 'kitchen' as const,
      isAdditional: false,
      url: resolveImageUrl(property.images.kitchen, 'kitchen'),
      title: 'Kitchenette, Wall-Mounted TV & Bath',
      caption: 'Private kitchenette with microwave, coffee maker, white cabinetry, wall-mounted flat-screen TV, and bath suite access.',
    },
    {
      id: 'slot-bathroom',
      slot: 'bathroom' as const,
      isAdditional: false,
      url: resolveImageUrl(property.images.bathroom, 'bathroom'),
      title: 'Zen Garden Trellis & Grape Arbor',
      caption: 'Quiet vegetable garden with fresh bitter melon and grape vines right outside the Zen house.',
    },
    {
      id: 'slot-beach',
      slot: 'beach' as const,
      isAdditional: false,
      url: resolveImageUrl(property.images.beach, 'beach'),
      title: 'Chic\'s Beach (5 Min Walk)',
      caption: 'Chesapeake Bay serene calm waters, soft sand dunes, dolphin watching, and stunning sunsets.',
    },
  ];

  const customPhotos = (property.images.additionalPhotos || []).map((p) => ({
    id: p.id,
    slot: undefined as 'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach' | undefined,
    isAdditional: true,
    url: resolveImageUrl(p.url),
    title: p.title,
    caption: p.caption,
  }));

  const galleryList = [...baseGallery, ...customPhotos];

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % galleryList.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      {/* Title & Metadata Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-amber-800">Rare Find</span>
            <span aria-hidden="true">·</span>
            <span>Chic's Beach (Chesapeake Bay)</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Superhost
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight text-balance">
            <span className="text-amber-900">VBZH</span> · {property.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-1 font-semibold text-stone-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{property.rating}</span>
            </div>
            <a
              href="#selected-reviews"
              className="underline hover:text-stone-900 transition-colors cursor-pointer"
            >
              ({property.reviewCount} positive reviews · Selected Guest Reviews)
            </a>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-medium text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-900 font-medium bg-amber-50 px-2 py-0.5 rounded text-xs">
              5 min walk to Chic's Beach
            </span>
          </div>
        </div>

        {/* Upload, Manage, Share & Wishlist buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => onOpenUploadModal('upload')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title="Upload photo to listing"
          >
            <Upload className="w-4 h-4 text-amber-800" />
            <span className="hidden sm:inline">Upload Photo</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <button
            onClick={() => onOpenUploadModal('manage')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title="Manage and delete listing photos"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Manage / Delete</span>
            <span className="sm:hidden">Delete</span>
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={onWishlistToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium border rounded-lg transition-colors shadow-2xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isWishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 5-Photo Bento Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] max-h-[540px] bg-stone-100">
        {/* Main Hero Photo (Takes 2 cols & full height) */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 relative group cursor-pointer overflow-hidden bg-stone-200 h-full"
        >
          <img
            src={baseGallery[0].url}
            alt="Tulip Studio Queen Bed and bedroom suite"
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (e.currentTarget.src !== AUTHENTIC_IMAGES.hero) {
                e.currentTarget.src = AUTHENTIC_IMAGES.hero;
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white text-sm font-medium drop-shadow-sm">
              Studio Suite & Four-Poster Queen Bed
            </span>
          </div>

          {/* Mobile Badge on Hero Photo */}
          <div className="md:hidden absolute top-3 left-3 bg-stone-900/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-md">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>1 of {galleryList.length} Photos</span>
          </div>
        </div>

        {/* 2nd column: Living Area & Kitchen */}
        <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
          <div
            onClick={() => openLightbox(1)}
            className="relative group cursor-pointer overflow-hidden bg-stone-200 h-full"
          >
            <img
              src={baseGallery[1].url}
              alt="Cozy living room area with armchair, sofa, and ceiling fan"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== AUTHENTIC_IMAGES.workspace) {
                  e.currentTarget.src = AUTHENTIC_IMAGES.workspace;
                }
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-medium drop-shadow-sm">
                Living Area & Armchair
              </span>
            </div>
          </div>
          <div
            onClick={() => openLightbox(2)}
            className="relative group cursor-pointer overflow-hidden bg-stone-200 h-full"
          >
            <img
              src={baseGallery[2].url}
              alt="Kitchenette with white cabinetry, microwave, TV, and bath access"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== AUTHENTIC_IMAGES.kitchen) {
                  e.currentTarget.src = AUTHENTIC_IMAGES.kitchen;
                }
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-medium drop-shadow-sm">
                Kitchenette, TV & Bath Suite
              </span>
            </div>
          </div>
        </div>

        {/* 3rd column: Bathroom & Beach */}
        <div className="hidden md:grid grid-rows-2 gap-2.5 h-full">
          <div
            onClick={() => openLightbox(3)}
            className="relative group cursor-pointer overflow-hidden bg-stone-200 h-full"
          >
            <img
              src={baseGallery[3].url}
              alt="Lush Zen house garden arbor with grape vines and bitter melon"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== AUTHENTIC_IMAGES.bathroom) {
                  e.currentTarget.src = AUTHENTIC_IMAGES.bathroom;
                }
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-medium drop-shadow-sm">
                Garden Trellis & Arbor
              </span>
            </div>
          </div>
          <div
            onClick={() => openLightbox(4)}
            className="relative group cursor-pointer overflow-hidden bg-stone-200 h-full"
          >
            <img
              src={baseGallery[4].url}
              alt="Chic's Beach sunset over the Chesapeake Bay"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== AUTHENTIC_IMAGES.beach) {
                  e.currentTarget.src = AUTHENTIC_IMAGES.beach;
                }
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-medium drop-shadow-sm">
                Chic's Beach (5 min walk)
              </span>
            </div>
          </div>
        </div>

        {/* Photo Action Overlay */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenUploadModal('upload')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-white/95 hover:bg-white backdrop-blur-md rounded-lg shadow-md border border-stone-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Upload a new photo"
          >
            <Camera className="w-4 h-4 text-amber-800" />
            <span className="hidden sm:inline">Upload Photo</span>
            <span className="sm:hidden">Upload</span>
          </button>

          <button
            onClick={() => openLightbox(0)}
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-stone-900 bg-white/95 hover:bg-white backdrop-blur-md rounded-lg shadow-md border border-stone-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Grid className="w-4 h-4 text-stone-700" />
            <span>Show all {galleryList.length} photos</span>
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Quick Photo Strip (Phone users can swipe & tap any photo) */}
      <div className="md:hidden mt-3">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-xs font-semibold text-stone-700">
            Property Photos ({galleryList.length})
          </span>
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="text-xs font-medium text-amber-800 hover:text-amber-900 underline"
          >
            View all fullscreen
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {galleryList.map((photo, idx) => (
            <button
              key={photo.id || idx}
              type="button"
              onClick={() => openLightbox(idx)}
              className="shrink-0 w-24 text-left group focus:outline-none"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 border border-stone-200 shadow-2xs">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  onError={(e) => {
                    const fallback = resolveImageUrl(undefined, 'hero');
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] text-white px-1 rounded font-mono">
                  {idx + 1}
                </div>
              </div>
              <p className="text-[10px] font-medium text-stone-600 truncate mt-1">
                {photo.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-stone-200">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <BedDouble className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="text-xs text-stone-500">Beds</div>
            <div className="text-sm font-semibold text-stone-900">2 Queen Beds (Sleeps 4)</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <div className="text-xs text-stone-500">Nomad Workspace</div>
            <div className="text-sm font-semibold text-stone-900">Dedicated Desk & Monitor</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5 text-sky-800" />
          </div>
          <div>
            <div className="text-xs text-stone-500">High-Speed Wi-Fi</div>
            <div className="text-sm font-semibold text-stone-900">460 Mbps Fiber Mesh</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-orange-800" />
          </div>
          <div>
            <div className="text-xs text-stone-500">Private Kitchen</div>
            <div className="text-sm font-semibold text-stone-900">Full Range & Appliances</div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-white max-w-6xl w-full mx-auto pb-4 border-b border-stone-800">
            <div className="text-sm font-medium">
              Photo {currentPhotoIndex + 1} of {galleryList.length} ·{' '}
              <span className="text-stone-300 font-semibold">{galleryList[currentPhotoIndex]?.title}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Direct Delete button if current photo is an additional photo */}
              {galleryList[currentPhotoIndex]?.isAdditional && onDeletePhoto && (
                <button
                  type="button"
                  onClick={() => {
                    const item = galleryList[currentPhotoIndex];
                    if (item && window.confirm(`Delete "${item.title}" from gallery?`)) {
                      onDeletePhoto(item.id);
                      setCurrentPhotoIndex((prev) => Math.max(0, prev - 1));
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 rounded-lg transition-colors cursor-pointer"
                  title="Delete this photo"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Photo</span>
                </button>
              )}

              {/* Reset button if primary slot is customized */}
              {galleryList[currentPhotoIndex]?.slot &&
                onResetSlotPhoto &&
                property.images[galleryList[currentPhotoIndex].slot!] !== PROPERTY_DATA.images[galleryList[currentPhotoIndex].slot!] && (
                  <button
                    type="button"
                    onClick={() => {
                      const item = galleryList[currentPhotoIndex];
                      if (item?.slot) {
                        onResetSlotPhoto(item.slot);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 rounded-lg transition-colors cursor-pointer"
                    title="Reset to default original photo"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset to Default</span>
                  </button>
                )}

              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false);
                  onOpenUploadModal('manage');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg transition-colors cursor-pointer"
                title="Open photo manager"
              >
                <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Manage & Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                title="Close gallery (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-auto overflow-hidden">
            <button
              onClick={prevPhoto}
              className="absolute left-2 z-10 p-2.5 text-white bg-stone-900/70 hover:bg-stone-900 rounded-full border border-stone-700 transition-all hover:scale-110"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryList[currentPhotoIndex]?.url || AUTHENTIC_IMAGES.hero}
              alt={galleryList[currentPhotoIndex]?.title || 'Property photo'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== AUTHENTIC_IMAGES.hero) {
                  e.currentTarget.src = AUTHENTIC_IMAGES.hero;
                }
              }}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={nextPhoto}
              className="absolute right-2 z-10 p-2.5 text-white bg-stone-900/70 hover:bg-stone-900 rounded-full border border-stone-700 transition-all hover:scale-110"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer Caption & Thumbnails */}
          <div className="max-w-6xl w-full mx-auto pt-4 text-center">
            <p className="text-sm text-stone-300 max-w-2xl mx-auto mb-4">
              {galleryList[currentPhotoIndex]?.caption}
            </p>
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {galleryList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    idx === currentPhotoIndex
                      ? 'border-amber-400 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== AUTHENTIC_IMAGES.hero) {
                        e.currentTarget.src = AUTHENTIC_IMAGES.hero;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
