import React, { useState, useRef, useEffect } from 'react';
import { Property, GalleryPhoto } from '../types/rental';
import { PROPERTY_DATA } from '../data/mockData';
import { resolveImageUrl, AUTHENTIC_IMAGES } from '../utils/imageUtils';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileImage,
  Link as LinkIcon,
  Sparkles,
  RotateCcw,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface PhotoUploadModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onUpdateImages: (updatedImages: Property['images']) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
  initialTab?: 'upload' | 'manage';
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  property,
  isOpen,
  onClose,
  onUpdateImages,
  onShowToast,
  initialTab = 'upload',
}) => {
  const [targetSlot, setTargetSlot] = useState<
    'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach' | 'additional'
  >('hero');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>(initialTab);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setConfirmDeleteId(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Compress & resize image to maintain fast local storage performance
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload a valid image file (PNG, JPG, WEBP).', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Load into canvas to compress if large
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewUrl(compressedDataUrl);
          if (!photoTitle) {
            setPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
        } else {
          setPreviewUrl(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    if (!photoTitle) {
      setPhotoTitle('New Vacation Rental Photo');
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      onShowToast('Please select or upload an image first.', 'info');
      return;
    }

    const currentImages = { ...property.images };

    if (targetSlot === 'additional') {
      const newAdditional: GalleryPhoto = {
        id: `photo-${Date.now()}`,
        url: previewUrl,
        title: photoTitle.trim() || 'New Property Photo',
        caption: photoCaption.trim() || 'Guest favorite feature at 4709 Tulip Dr.',
        createdAt: new Date().toLocaleDateString(),
      };
      const existing = currentImages.additionalPhotos || [];
      currentImages.additionalPhotos = [...existing, newAdditional];
      onShowToast('New photo successfully added to gallery!', 'success');
    } else {
      currentImages[targetSlot] = previewUrl;
      const slotNames: Record<string, string> = {
        hero: 'Main Studio & Queen Bed',
        workspace: 'Living Area & Armchair',
        kitchen: 'Kitchenette, TV & Private Bath',
        bathroom: 'Garden Trellis & Arbor',
        beach: "Chic's Beach View",
      };
      onShowToast(`${slotNames[targetSlot]} photo updated!`, 'success');
    }

    onUpdateImages(currentImages);
    setPreviewUrl(null);
    setUrlInput('');
    setPhotoTitle('');
    setPhotoCaption('');
    onClose();
  };

  const handleDeleteAdditionalPhoto = (photoId: string) => {
    const currentImages = { ...property.images };
    if (currentImages.additionalPhotos) {
      currentImages.additionalPhotos = currentImages.additionalPhotos.filter((p) => p.id !== photoId);
      onUpdateImages(currentImages);
      setConfirmDeleteId(null);
      onShowToast('Photo deleted from gallery.', 'info');
    }
  };

  const handleResetSlotPhoto = (slot: 'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach') => {
    const currentImages = { ...property.images };
    currentImages[slot] = PROPERTY_DATA.images[slot];
    onUpdateImages(currentImages);
    onShowToast(`Reset ${slot} photo to original.`, 'success');
  };

  const handleResetAllToDefault = () => {
    onUpdateImages({
      ...PROPERTY_DATA.images,
      additionalPhotos: PROPERTY_DATA.images.additionalPhotos || [],
    });
    onShowToast('All photos restored to original property gallery.', 'info');
  };

  const slotOptions = [
    { id: 'hero', label: 'Main Studio & Queen Bed (Hero Banner)' },
    { id: 'workspace', label: 'Living Area & Armchair Seating' },
    { id: 'kitchen', label: 'Kitchenette, TV & Private Bath' },
    { id: 'bathroom', label: 'Garden Trellis & Grape Arbor' },
    { id: 'beach', label: "Chic's Beach Bay Coastline" },
    { id: 'additional', label: '＋ Add as New Photo in Gallery' },
  ];

  const totalPhotoCount = 5 + (property.images.additionalPhotos?.length || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-800">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Property Photo Manager
              </h3>
              <p className="text-[11px] text-stone-500">
                4709 Tulip Dr · Upload, delete, or reset photos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Upload vs Manage & Delete */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-amber-800" />
            <span>Upload New Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Manage & Delete Photos ({totalPhotoCount})</span>
          </button>
        </div>

        {activeTab === 'upload' ? (
          <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
            {/* Target Slot Selector */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Where should this photo appear? *
              </label>
              <select
                value={targetSlot}
                onChange={(e) =>
                  setTargetSlot(
                    e.target.value as 'hero' | 'workspace' | 'kitchen' | 'bathroom' | 'beach' | 'additional'
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
              >
                {slotOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Method Toggle: File Upload vs URL */}
            <div className="flex items-center gap-4 text-stone-600 text-xs py-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={uploadMode === 'file'}
                  onChange={() => setUploadMode('file')}
                  className="text-amber-800 focus:ring-amber-800"
                />
                <span>Upload from Device (File)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={uploadMode === 'url'}
                  onChange={() => setUploadMode('url')}
                  className="text-amber-800 focus:ring-amber-800"
                />
                <span>Paste Image URL</span>
              </label>
            </div>

            {uploadMode === 'file' ? (
              /* Drag & Drop File Dropzone */
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-600 bg-amber-50/50'
                      : previewUrl
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                  <p className="font-semibold text-stone-800">
                    Click to browse or drag & drop your photo
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Supports JPG, PNG, WEBP from your phone or computer
                  </p>
                </div>
              </div>
            ) : (
              /* URL Input */
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://example.com/tulip-dr-bedroom.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg"
                >
                  Load
                </button>
              </div>
            )}

            {/* Live Preview Stage */}
            {previewUrl && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-stone-600 text-xs">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Photo Ready to Apply</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setUrlInput('');
                    }}
                    className="text-stone-400 hover:text-rose-600 text-[11px]"
                  >
                    Clear
                  </button>
                </div>

                <div className="w-full aspect-video rounded-lg overflow-hidden bg-stone-200 relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded photo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Photo Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Queen Bed & Balcony"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warm natural afternoon light"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!previewUrl}
                className="px-5 py-2 font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Apply Photo to Listing
              </button>
            </div>
          </form>
        ) : (
          /* Manage & Delete Photos Tab */
          <div className="space-y-4 text-xs">
            {/* Helpful How-To Guide Box */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-xs text-amber-950">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>How to Delete or Replace Photos</span>
              </div>
              <ul className="text-[11px] text-amber-800 space-y-0.5 list-disc list-inside">
                <li>
                  <span className="font-medium">Added Photos:</span> Click the red <span className="text-rose-700 font-semibold">Delete Photo</span> button next to any photo you uploaded.
                </li>
                <li>
                  <span className="font-medium">Main Spaces (Bedrooms, Kitchen, Nomad Desk, Bath, Beach):</span> Click <span className="font-semibold">Reset to Original</span> to remove your custom photo or <span className="font-semibold">Replace</span> to choose a different one.
                </li>
              </ul>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {/* Additional custom photos section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Added Gallery Photos ({property.images.additionalPhotos?.length || 0})</span>
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    Can be permanently deleted anytime
                  </span>
                </div>

                {property.images.additionalPhotos && property.images.additionalPhotos.length > 0 ? (
                  <div className="space-y-2">
                    {property.images.additionalPhotos.map((p) => {
                      const isConfirming = confirmDeleteId === p.id;
                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isConfirming
                              ? 'bg-rose-50 border-rose-300 shadow-xs'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={resolveImageUrl(p.url)}
                              alt={p.title}
                              onError={(e) => {
                                if (e.currentTarget.src !== AUTHENTIC_IMAGES.hero) {
                                  e.currentTarget.src = AUTHENTIC_IMAGES.hero;
                                }
                              }}
                              className="w-16 h-12 object-cover rounded-lg bg-stone-200 shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-stone-900 truncate">{p.title}</div>
                              <div className="text-[11px] text-stone-500 line-clamp-1">{p.caption}</div>
                              {p.createdAt && (
                                <div className="text-[10px] text-stone-400 mt-0.5">Added on {p.createdAt}</div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {isConfirming ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdditionalPhoto(p.id)}
                                  className="px-2.5 py-1.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Yes, Delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1.5 text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(p.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                title="Delete this photo"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Delete Photo</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center text-stone-500 text-xs">
                    No custom additional photos uploaded yet. Click "Upload New Photo" above to add more.
                  </div>
                )}
              </div>

              {/* Primary Slots Section */}
              <div>
                <div className="flex items-center justify-between mb-2 pt-2 border-t border-stone-100">
                  <h4 className="font-semibold text-stone-900 text-xs">
                    Main Room & Feature Photos (5 core slots)
                  </h4>
                  <span className="text-[10px] text-stone-500">
                    Replace or reset to original
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { slot: 'hero' as const, name: 'Main Studio & Two Queen Beds' },
                    { slot: 'workspace' as const, name: 'Nomad Workspace & Monitor' },
                    { slot: 'kitchen' as const, name: 'Private Kitchen' },
                    { slot: 'bathroom' as const, name: 'Private Bathroom' },
                    { slot: 'beach' as const, name: "Chic's Beach Bay View" },
                  ].map((item) => {
                    const isCustomized = property.images[item.slot] !== PROPERTY_DATA.images[item.slot];
                    return (
                      <div
                        key={item.slot}
                        className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={resolveImageUrl(property.images[item.slot], item.slot)}
                            alt={item.name}
                            onError={(e) => {
                              const fallback = AUTHENTIC_IMAGES[item.slot];
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                            className="w-14 h-11 object-cover rounded-md bg-stone-200 shrink-0 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 truncate">{item.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isCustomized ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-medium rounded">
                                  Custom photo active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-stone-200 text-stone-700 text-[10px] rounded">
                                  Original photo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isCustomized && (
                            <button
                              type="button"
                              onClick={() => handleResetSlotPhoto(item.slot)}
                              className="px-2.5 py-1.5 text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded-lg flex items-center gap-1 cursor-pointer"
                              title="Delete custom photo and reset to original"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              <span>Reset</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setTargetSlot(item.slot);
                              setActiveTab('upload');
                            }}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-stone-500" />
                            <span>Replace</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleResetAllToDefault}
                className="text-[11px] text-stone-500 hover:text-rose-700 underline flex items-center gap-1 cursor-pointer"
                title="Restore all 4709 Tulip Dr default photos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all photos to default</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetSlot('additional');
                  setActiveTab('upload');
                }}
                className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Another Photo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
