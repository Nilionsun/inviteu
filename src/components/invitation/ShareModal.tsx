'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, Share2, QrCode, Download, MessageSquare, Mail, Link2, Globe, Send, MessageCircle } from 'lucide-react';
import { cn, generateQRCodeDataURL } from '../../lib/utils';
import { Button, Input } from '../ui';
import { Modal } from '../ui';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationUrl: string;
  coupleNames: string;
  eventTitle: string;
  eventDate: string;
  heroImage?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  invitationUrl,
  coupleNames,
  eventTitle,
  eventDate,
  heroImage,
}: ShareModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const generateQRCode = useCallback(async () => {
    if (qrCodeDataUrl) return;
    setIsGeneratingQr(true);
    try {
      const dataUrl = await generateQRCodeDataURL(invitationUrl, {
        width: 256,
        margin: 2,
        color: { dark: '#341B16', light: '#FDF8F3' },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGeneratingQr(false);
    }
  }, [invitationUrl, qrCodeDataUrl]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const shareText = `You're invited to ${eventTitle} of ${coupleNames} on ${eventDate}!\n\n${invitationUrl}`;

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 hover:bg-green-50',
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Facebook',
      icon: Globe,
      color: 'text-blue-600 hover:bg-blue-50',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}&quote=${encodeURIComponent(`You're invited to ${eventTitle} of ${coupleNames}!`)}`,
    },
    {
      name: 'Twitter (X)',
      icon: Globe,
      color: 'text-sky-600 hover:bg-sky-50',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`You're invited to ${eventTitle} of ${coupleNames}!`)}&url=${encodeURIComponent(invitationUrl)}`,
    },
    {
      name: 'Instagram',
      icon: Globe,
      color: 'text-pink-600 hover:bg-pink-50',
      url: 'https://www.instagram.com/',
      isExternal: true,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-red-600 hover:bg-red-50',
      url: `mailto:?subject=${encodeURIComponent(`Invitation: ${eventTitle} of ${coupleNames}`)}&body=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'SMS',
      icon: MessageSquare,
      color: 'text-primary-gold hover:bg-primary-gold/10',
      url: `sms:?body=${encodeURIComponent(shareText)}`,
    },
  ];

  const copyableFields = [
    { label: 'Invitation Link', value: invitationUrl, icon: Link2 },
    { label: 'Event Title', value: eventTitle, icon: QrCode },
    { label: 'Couple Names', value: coupleNames, icon: Share2 },
    { label: 'Event Date', value: eventDate, icon: Download },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share This Invitation"
      description="Spread the joy with your loved ones"
      size="lg"
    >
      <div className="space-y-6">
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block p-4 bg-surface-cream rounded-2xl border border-border-gold/50">
            {isGeneratingQr ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-gold/20 border-t-primary-gold rounded-full animate-spin" />
              </div>
            ) : qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code for invitation"
                className="w-48 h-48"
              />
            ) : (
              <button
                onClick={generateQRCode}
                className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-primary-gold transition-colors"
              >
                <QrCode className="w-12 h-12" />
                <span className="text-body-sm">Generate QR Code</span>
              </button>
            )}
          </div>
          <p className="mt-3 text-body-sm text-text-muted">
            Scan to open invitation on mobile
          </p>
        </motion.div>

        <div className="gold-divider" aria-hidden="true" />

        {/* Copy Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="font-medium text-text-primary mb-3">Copy Invitation Link</h4>
          <div className="relative">
            <Input
              value={invitationUrl}
              readOnly
              className="pr-14 bg-primary-cream/50"
              aria-label="Invitation URL"
            />
            <button
              onClick={() => copyToClipboard(invitationUrl, 'link')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-muted hover:text-primary-gold hover:bg-primary-gold/10 transition-all"
              aria-label={copiedField === 'link' ? 'Copied!' : 'Copy link'}
            >
              {copiedField === 'link' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Additional Copyable Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-medium text-text-primary mb-3">Copy Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {copyableFields.map((field) => (
              <div
                key={field.label}
                className="relative p-3 bg-primary-cream/50 rounded-xl border border-border-gold/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <field.icon className="w-4 h-4 text-text-muted" />
                  <span className="text-caption text-text-muted uppercase tracking-wide">{field.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={field.value}
                    readOnly
                    className="flex-1 bg-transparent border-0 focus:ring-0 text-body-sm"
                    aria-label={field.label}
                  />
                  <button
                    onClick={() => copyToClipboard(field.value, field.label)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-primary-gold hover:bg-primary-gold/10 transition-all"
                    aria-label={copiedField === field.label ? 'Copied!' : `Copy ${field.label}`}
                  >
                    {copiedField === field.label ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="gold-divider" aria-hidden="true" />

        {/* Social Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="font-medium text-text-primary mb-3">Share on Social Media</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.isExternal ? '_blank' : undefined}
                rel={social.isExternal ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-gold/50',
                  'text-body font-medium transition-all duration-300',
                  social.color,
                  'group'
                )}
                aria-label={`Share on ${social.name}`}
              >
                <social.icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', social.color.replace('hover:bg-', '').replace('text-', ''))} />
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Native Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {navigator.share && (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: `Invitation: ${eventTitle} of ${coupleNames}`,
                    text: shareText,
                    url: invitationUrl,
                  });
                } catch (error) {
                  if ((error as Error).name !== 'AbortError') {
                    console.error('Share failed:', error);
                  }
                }
              }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share via System Menu
            </Button>
          )}
        </motion.div>

        {/* Download Invitation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              // This would trigger a download of a generated invitation image
              // For now, we'll just copy the link
              copyToClipboard(invitationUrl, 'download');
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            Save Invitation as Image
          </Button>
          <p className="text-center mt-2 text-body-sm text-text-muted">
            Feature coming soon — generates a beautiful invitation card
          </p>
        </motion.div>
      </div>
    </Modal>
  );
}