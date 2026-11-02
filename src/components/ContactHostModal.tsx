import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle } from 'lucide-react';

interface ContactHostModalProps {
  onClose: () => void;
  onMessageSent: (text: string) => void;
}

export const ContactHostModal: React.FC<ContactHostModalProps> = ({
  onClose,
  onMessageSent,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [topic, setTopic] = useState('Nomad Workspace & Wi-Fi');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;

    onMessageSent(`Message from ${guestName}: "${message}"`);
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-800" />
            <h3 className="text-base font-serif font-bold text-stone-900">
              Message Host Yulin Liao
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-center justify-between">
          <span className="text-stone-600">Urgent questions? Call or text:</span>
          <a
            href="tel:7577351024"
            className="font-bold text-amber-900 hover:underline"
          >
            (757) 735-1024
          </a>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-900">Message Delivered!</h4>
            <p className="text-xs text-stone-500">
              Yulin Liao usually responds within 30 minutes. You'll receive a copy at {guestEmail || 'your email'}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Your Email *</label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Inquiry Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="Nomad Workspace & Wi-Fi">Nomad Workspace & Wi-Fi Setup</option>
                <option value="Chic's Beach Proximity">Chic's Beach Proximity & Beach Gear</option>
                <option value="Kitchen Equipment">Kitchen Cooking Equipment</option>
                <option value="Early Check-in">Early Check-in / Late Check-out Request</option>
                <option value="Monthly Stay Discount">Extended Stay / Monthly Stays</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Your Message *</label>
              <textarea
                rows={3}
                required
                placeholder="Have questions about the studio at 4709 Tulip Dr? Ask Yulin Liao..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
