import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  MessageSquare,
  Mail,
  Send,
  Download,
  Printer,
  Sparkles,
  Globe,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import {
  getCustomDomain,
  setCustomDomain,
  RECOMMENDED_DOMAINS,
  DEFAULT_PREVIEW_URL,
} from '../utils/domainUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(getCustomDomain());

  useEffect(() => {
    setSelectedDomain(getCustomDomain());
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = selectedDomain || (
    typeof window !== 'undefined'
      ? window.location.origin || window.location.href
      : DEFAULT_PREVIEW_URL
  );

  const shareText = `Check out VBZH (VB Zen House) Tulip Studio at 4709 Tulip Dr, Virginia Beach VA ($98/night, 2 Queen Beds): ${currentUrl}`;
  // High-resolution QR code (360x360)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(
    currentUrl
  )}&margin=12&format=png`;

  // Copy app webpage link
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopiedLink(true);
        onShowToast('Web link copied to clipboard! (已复制网址链接)', 'success');
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (err) {
      onShowToast('Could not copy link to clipboard.', 'info');
    }
  };

  // Copy QR Code (barcode) Image or link to clipboard
  const handleCopyQrCode = async () => {
    try {
      setCopiedQr(true);
      // Fetch image and write PNG blob to clipboard if supported
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new window.ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          onShowToast('QR Code image copied to clipboard! (已复制二维码图片)', 'success');
        } catch (clipboardErr) {
          // If browser restricts image writing, copy the QR image URL
          await navigator.clipboard.writeText(qrCodeUrl);
          onShowToast('QR code link copied! You can paste or send it anywhere. (已复制二维码直链)', 'success');
        }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(qrCodeUrl);
        onShowToast('QR code link copied! (已复制二维码直链)', 'success');
      }
      setTimeout(() => setCopiedQr(false), 2500);
    } catch (err) {
      // Fallback: copy current URL
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        onShowToast('Link copied to clipboard! (已复制链接)', 'info');
      }
      setTimeout(() => setCopiedQr(false), 2500);
    }
  };

  // Download QR code PNG to device
  const handleDownloadQrCode = async () => {
    try {
      setDownloading(true);
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'VBZH-Tulip-Studio-4709-TulipDr-QRCode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      onShowToast('QR Code downloaded successfully! (二维码图片已下载)', 'success');
    } catch (err) {
      // Direct open fallback
      window.open(qrCodeUrl, '_blank');
      onShowToast('Opened QR Code in new tab. Long-press or right-click to save.', 'info');
    } finally {
      setDownloading(false);
    }
  };

  // Native share sheet
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VBZH Tulip Studio - Virginia Beach',
          text: 'Private Studio at 4709 Tulip Dr, Virginia Beach. 2 Queen Beds, Kitchen, Garden.',
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Quick print welcome sheet
  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onShowToast('Please allow popups to print welcome card', 'info');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Welcome to VBZH · VB Zen House - 4709 Tulip Dr</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 40px; color: #1c1917; }
            .card { max-width: 440px; margin: 0 auto; border: 2px solid #e7e5e4; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            h1 { font-size: 24px; margin-bottom: 4px; color: #1c1917; }
            p.sub { font-size: 14px; color: #78716c; margin-top: 0; margin-bottom: 24px; }
            .qr-wrap { background: #fff; padding: 16px; display: inline-block; border-radius: 16px; border: 1px solid #d6d3d1; margin-bottom: 20px; }
            .qr-wrap img { width: 240px; height: 240px; display: block; }
            .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px; }
            .info { font-size: 13px; line-height: 1.6; color: #44403c; margin-top: 16px; border-top: 1px solid #e7e5e4; pt-16px; padding-top: 16px; }
            .url { font-family: monospace; font-size: 11px; color: #0284c7; word-break: break-all; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">Scan to Open Guest Guide & Direct Booking</div>
            <h1>VBZH · VB Zen House</h1>
            <p class="sub">4709 Tulip Dr, Virginia Beach, VA 23455</p>
            <div class="qr-wrap">
              <img src="${qrCodeUrl}" alt="QR Barcode" />
            </div>
            <div class="info">
              <strong>Scan with Phone Camera or WeChat</strong><br/>
              微信或手机相机直接扫描二维码，即刻查看房源指南、无线网络、入住退房及在线预订。<br/>
              <strong>Wi-Fi:</strong> High-Speed Fiber 500+ Mbps · <strong>Host:</strong> Yulin Liao
            </div>
            <div class="url">${currentUrl}</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <img
              src="/vbzh-logo.png"
              alt="VBZH App Logo"
              className="w-11 h-11 rounded-2xl shadow-xs border border-amber-900/15 object-cover shrink-0"
            />
            <div>
              <h3 className="font-semibold text-stone-900 text-lg leading-tight flex items-center gap-1.5">
                <span>VBZH (VB Zen House) Barcode / QR Code</span>
              </h3>
              <p className="text-xs text-stone-500">
                VBZH · VB Zen House · 4709 Tulip Dr, Virginia Beach
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero QR Code Card (Dedicated Section to Copy & Download Barcode) */}
        <div className="mt-5 p-5 bg-gradient-to-b from-amber-50/70 to-stone-50 rounded-2xl border border-amber-200/70 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>Scan with Camera or WeChat / 微信或手机相机扫码</span>
          </div>

          {/* QR Code Graphic Box */}
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-stone-200 mb-3 group relative">
            <img
              src={qrCodeUrl}
              alt="VBZH VB Zen House QR Code Barcode"
              className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
            />
            <div className="text-[10px] text-stone-400 mt-1 font-mono tracking-tight truncate max-w-[210px]">
              {currentUrl.replace('https://', '')}
            </div>
          </div>

          <p className="text-xs text-stone-600 max-w-sm leading-relaxed mb-4">
            Guests and friends can scan this barcode with any smartphone camera or WeChat to instantly open the app.
            <br />
            客人或朋友用手机相机或微信扫描此条码/二维码，即可直接进入房源系统。
          </p>

          {/* Action Buttons: Copy Barcode & Download Barcode */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
            {/* Copy QR Code Button */}
            <button
              onClick={handleCopyQrCode}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                copiedQr
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
              }`}
            >
              {copiedQr ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied! / 已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy QR / 复制二维码</span>
                </>
              )}
            </button>

            {/* Download PNG Button */}
            <button
              onClick={handleDownloadQrCode}
              disabled={downloading}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs active:scale-98 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download PNG / 保存图片'}</span>
            </button>

            {/* Print Welcome Card Button */}
            <button
              onClick={handlePrintCard}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
              title="Print guest room welcome flyer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print / 打印房卡</span>
            </button>
          </div>
        </div>

        {/* Subdomain & Domain Selector */}
        <div className="mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>Target Subdomain / Domain for QR Code:</span>
            </span>
            <span className="text-[10px] text-stone-500 font-normal">vbzenhouse</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {RECOMMENDED_DOMAINS.slice(0, 4).map((dom) => (
              <button
                key={dom.value}
                onClick={() => {
                  setSelectedDomain(dom.value);
                  setCustomDomain(dom.value);
                  onShowToast(`QR code updated to ${dom.value}`, 'info');
                }}
                className={`py-1.5 px-2 rounded-lg border text-left truncate font-mono transition-colors cursor-pointer ${
                  selectedDomain === dom.value
                    ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-bold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                {dom.value.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Public Live URL Box */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Public App Link / 公开网址链接
            </span>
            <span className="text-[10px] text-stone-400 font-normal">No install needed</span>
          </label>
          <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-2xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs sm:text-sm text-stone-800 flex-1 outline-none font-mono truncate px-1 select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800 hover:bg-stone-900 text-white'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied! / 已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Send Options (SMS, WhatsApp, Email, Native Share) */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
            Send Directly to Guests / 快捷发送
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 text-amber-600" />
              <span>Share Sheet</span>
            </button>

            <a
              href={`sms:?body=${encodeURIComponent(shareText)}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>SMS / 短信</span>
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
            >
              <Send className="w-4 h-4 text-green-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(
                'VBZH Tulip Studio - 4709 Tulip Dr Vacation Rental'
              )}&body=${encodeURIComponent(shareText)}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors col-span-2 sm:col-span-3"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Email Link to Guests / 发送给客人</span>
            </a>
          </div>
        </div>

        {/* Tip for Guests */}
        <div className="mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Smartphone className="w-4 h-4 text-stone-700" />
            <h5 className="text-xs font-bold text-stone-900">
              Phone Camera Tip (手机扫码说明)
            </h5>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed pl-1">
            Open the regular camera on iPhone or Android, aim at the QR code above, and a yellow banner will pop up to tap and open the site instantly.
            <br />
            打开 iPhone 或安卓手机自带相机，对准屏幕上的二维码，即可直接轻触弹出的黄色提示框打开网站。
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done / 关闭
          </button>
        </div>
      </div>
    </div>
  );
};
