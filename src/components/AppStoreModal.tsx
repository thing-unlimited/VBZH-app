import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Apple,
  Layers,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  QrCode,
  Globe,
  Server,
  Link2,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  getCustomDomain,
  setCustomDomain,
  RECOMMENDED_DOMAINS,
  DEFAULT_PREVIEW_URL,
} from '../utils/domainUtils';

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AppStoreModal: React.FC<AppStoreModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'domain' | 'publish'>('domain');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedDns, setCopiedDns] = useState(false);
  const [activeDomain, setActiveDomainState] = useState(getCustomDomain());
  const [customDomainInput, setCustomDomainInput] = useState(getCustomDomain());

  useEffect(() => {
    const current = getCustomDomain();
    setActiveDomainState(current);
    setCustomDomainInput(current);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAppUrl = activeDomain || (typeof window !== 'undefined' ? window.location.origin : 'https://vbzenhouse.com');

  const copyUrl = (textToCopy?: string) => {
    const text = textToCopy || currentAppUrl;
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    onShowToast(`Copied ${text} to clipboard!`, 'info');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleApplyDomain = (newDomain: string) => {
    let formatted = newDomain.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    setCustomDomain(formatted);
    setActiveDomainState(formatted);
    setCustomDomainInput(formatted);
    onShowToast(`Active subdomain/domain updated to ${formatted}`, 'success');
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onShowToast('VBZH App installed successfully!', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Header with App Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-3">
            <img
              src="/vbzh-logo.png"
              alt="VBZH App Logo"
              className="w-12 h-12 rounded-2xl shadow-md border border-stone-200 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  VBZH App
                </h3>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Virginia Beach Vacation Rental · 4709 Tulip Dr
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Quick Install vs Subdomain / Custom Domain vs App Stores */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'domain'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌐 Subdomain (vbzenhouse)
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'install'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📱 Save to Phone
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'publish'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🚀 App Stores
          </button>
        </div>

        {activeTab === 'domain' && (
          <div className="space-y-5 text-xs text-stone-700 animate-in fade-in duration-150">
            {/* Header banner */}
            <div className="p-4 bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 rounded-2xl text-white shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-sm text-white">vbzenhouse Domain & Subdomain Setup</span>
              </div>
              <p className="text-amber-100/90 text-xs leading-relaxed">
                Connect your custom subdomain or domain so guests can open <strong>vbzenhouse</strong> directly, and all QR codes automatically link to your clean branded address.
              </p>
            </div>

            {/* Current Active Domain Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-amber-700" />
                  Active Domain / Subdomain for VBZH:
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Live & Linked
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="e.g. https://stay.vbzenhouse.com or https://vbzenhouse.com"
                  className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 flex-1 shadow-2xs focus:border-amber-600 focus:outline-none"
                />
                <button
                  onClick={() => handleApplyDomain(customDomainInput)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer text-xs shrink-0"
                >
                  Save Active
                </button>
              </div>

              {/* Quick Pick Subdomain Chips */}
              <div>
                <div className="text-[11px] font-semibold text-stone-500 mb-2">
                  Quick Select Recommended vbzenhouse addresses:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RECOMMENDED_DOMAINS.map((dom) => (
                    <button
                      key={dom.value}
                      onClick={() => handleApplyDomain(dom.value)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                        activeDomain === dom.value
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] truncate">{dom.value.replace('https://', '')}</span>
                        {activeDomain === dom.value && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{dom.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DNS Setup Guide for Custom Subdomain */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Link2 className="w-4 h-4 text-amber-700" />
                <span>How to connect your subdomain (e.g. stay.vbzenhouse.com)</span>
              </h4>

              <div className="text-stone-600 space-y-2 text-xs leading-relaxed">
                <p>
                  To point a custom subdomain like <code>stay.vbzenhouse.com</code> or <code>app.vbzenhouse.com</code> to this app, add this <strong>CNAME record</strong> at your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains):
                </p>

                {/* DNS Table */}
                <div className="overflow-x-auto bg-white rounded-xl border border-stone-200 p-2.5">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-500 text-[10px] uppercase">
                        <th className="pb-1">Type</th>
                        <th className="pb-1">Host / Name</th>
                        <th className="pb-1">Target / Value</th>
                        <th className="pb-1 text-right">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      <tr>
                        <td className="py-1.5 font-bold text-amber-900">CNAME</td>
                        <td className="py-1.5 text-stone-800">stay <span className="text-[10px] text-stone-400 font-sans">(or vbzenhouse)</span></td>
                        <td className="py-1.5 text-stone-700 truncate max-w-[200px]" title="ais-pre-jqshzsk7mviud42zwym3kp-886028545573.us-east1.run.app">
                          ais-pre-jqshzsk7mviud42zwym3kp-886028545573.us-east1.run.app
                        </td>
                        <td className="py-1.5 text-right text-stone-500">Auto</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-stone-500">Target Server Hostname:</span>
                  <button
                    onClick={() => copyUrl('ais-pre-jqshzsk7mviud42zwym3kp-886028545573.us-east1.run.app')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Target URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instant Free Vanity Link Option (Zero Cost / No DNS Waiting) */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Instant 30-Second Option: Free Custom Vanity Link (无需购买域名)</span>
              </div>
              <p className="text-stone-700 text-[11px] leading-relaxed">
                If you don't have a domain registrar yet, you can create a free custom redirect link in 30 seconds:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px] pl-1">
                <li>Go to <strong>TinyURL.com</strong> or <strong>Bitly.com</strong> (free).</li>
                <li>Paste your live app URL: <code>{DEFAULT_PREVIEW_URL}</code>.</li>
                <li>Set the custom alias to <strong>vbzenhouse</strong>.</li>
                <li>You immediately get <code>tinyurl.com/vbzenhouse</code> or <code>bit.ly/vbzenhouse</code> to print on cards or text to guests!</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'install' && (
          <div className="space-y-5 text-xs text-stone-700">
            {/* Logo showcase card */}
            <div className="p-4 bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl text-white flex items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src="/vbzh-logo.png"
                  alt="VBZH Logo"
                  className="w-14 h-14 rounded-2xl border-2 border-amber-400/30 shadow-lg object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-white">VBZH App · VB Zen House</h4>
                  <p className="text-xs text-stone-300">
                    4709 Tulip Dr · Real-Time Calendar & Direct Booking
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-300">
                    <span>★ 4.97 (880+ reviews)</span>
                    <span>· Free Download</span>
                  </div>
                </div>
              </div>

              {isInstallable && (
                <button
                  onClick={handleNativeInstall}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                >
                  Install Now
                </button>
              )}
            </div>

            {/* iOS Safari Instructions */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                <Apple className="w-4 h-4 text-stone-800" />
                <span>iPhone / iPad (苹果手机保存到主屏幕)</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-stone-600 pl-1 leading-relaxed text-xs">
                <li>
                  Open this link in <strong>Safari</strong> (在 <strong>Safari 浏览器</strong> 中打开此页面).
                </li>
                <li>
                  Tap the bottom <strong className="inline-flex items-center gap-1 text-stone-900"><Share2 className="w-3.5 h-3.5" /> Share (分享)</strong> button (屏幕底部中间的“向上箭头分享”图标).
                </li>
                <li>
                  Scroll down and tap <strong className="text-stone-900">"Add to Home Screen"</strong> (下滑点击 <strong>“添加到主屏幕”</strong>).
                </li>
                <li>
                  Tap <strong className="text-stone-900">"Add"</strong> in the top right (点击右上角 <strong>“添加”</strong>).
                </li>
              </ol>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-950 text-[11px] leading-relaxed">
                ✨ <strong>VBZH (VB Zen House)</strong> 图标就会像原生 App 一样出现在手机桌面上，点开即全屏无地址栏！
              </div>
            </div>

            {/* Android / Chrome instructions */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Android & Chrome (安卓手机 / 微信用户)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-600 pl-1 leading-relaxed text-xs">
                <li>
                  Tap the three dots <strong>(⋮)</strong> in Chrome (点击浏览器右上角三个点 <strong>⋮</strong>).
                </li>
                <li>
                  Select <strong className="text-stone-900">"Add to Home screen"</strong> or <strong className="text-stone-900">"Install app"</strong> (选择 <strong>“添加到主屏幕”</strong> 或 <strong>“安装应用”</strong>).
                </li>
                <li>
                  Confirm to install (确认添加，桌面上立即生成 <strong>VBZH</strong> 图标).
                </li>
              </ol>
            </div>

            {/* Quick Barcode / QR Code scan to open on mobile */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-xs border border-stone-200 shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    currentAppUrl
                  )}&margin=8`}
                  alt="QR Barcode"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-semibold text-stone-900 text-xs mb-1">
                  <QrCode className="w-3.5 h-3.5 text-amber-800" />
                  <span>Scan Barcode / QR Code (微信/手机相机扫码)</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed mb-2">
                  Scan this barcode with any smartphone camera to open the app on your mobile device immediately.
                </p>
                <div className="text-[10px] font-mono text-stone-500 truncate mb-2">
                  {currentAppUrl}
                </div>
                <button
                  onClick={() => copyUrl()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied Link! / 已复制' : 'Copy App Link / 复制链接'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          /* Publish to App Store Guide */
          <div className="space-y-4 text-xs text-stone-700">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-800" />
                <span>Upload to Apple App Store & Google Play</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                This app is already built with a full <strong>Web App Manifest</strong>, service worker, and high-resolution <strong>512x512 VBZH icons</strong>. You can package it for official App Store and Play Store submission in 3 steps:
              </p>

              <div className="space-y-2 pt-1">
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Copy App Web URL</div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={currentAppUrl}
                        className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-[11px] font-mono text-stone-700 w-48 sm:w-64"
                      />
                      <button
                        onClick={() => copyUrl()}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-900">Open PWABuilder (Official Packaging Tool)</div>
                    <p className="text-stone-500 leading-relaxed">
                      Microsoft PWABuilder packages your PWA URL into an Apple App Store package (Xcode <code>.ipa</code>) and Google Play package (<code>.aab</code>) automatically.
                    </p>
                    <a
                      href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentAppUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg mt-1 text-xs"
                    >
                      <span>Package on PWABuilder</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Upload to App Store Connect / Play Console</div>
                    <p className="text-stone-500 leading-relaxed mt-0.5">
                      Upload the generated package to <strong>App Store Connect</strong> with your Apple Developer account ($99/yr) or <strong>Google Play Console</strong> ($25 one-time).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Store Metadata Checklist */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="font-semibold text-stone-900">Pre-configured App Store Metadata:</div>
              <div className="grid grid-cols-2 gap-2 text-stone-600 text-[11px]">
                <div>• App Title: <strong>VBZH · VB Zen House</strong></div>
                <div>• Category: <strong>Travel & Local</strong></div>
                <div>• Developer Phone: <strong>(757) 735-1024</strong></div>
                <div>• Content Rating: <strong>4+ (Everyone)</strong></div>
                <div>• Icons: <strong>512x512 PNG included</strong></div>
                <div>• Offline Support: <strong>Enabled</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-5 border-t border-stone-100 mt-5">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PWA Verified & Install Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
