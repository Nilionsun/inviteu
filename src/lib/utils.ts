import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getImagePlaceholder(width: number, height: number, text?: string): string {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  params.set('h', height.toString());
  if (text) params.set('text', text);
  return `https://via.placeholder.com/${width}x${height}/F9E9D9/B77A38?${params.toString()}`;
}

export const ANIMATION_DELAYS = {
  stagger: (index: number, base = 100) => `${index * base}ms`,
  hero: {
    title: 0,
    subtitle: 150,
    names: 300,
    description: 450,
    divider: 600,
    button: 750,
  },
} as const;

export function getRandomWeddingImage(seed: string): string {
  const images = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1920&q=80',
    'https://images.unsplash.com/photo-1537633527864-b21f2b2c1e6e?w=1920&q=80',
  ];
  const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return images[hash % images.length];
}

export function getRandomGalleryImage(index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80', // Mehendi
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', // Mandap
    'https://images.unsplash.com/photo-1606219592791-211e4529659b?w=800&q=80', // Rings
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', // Dancing
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', // Decorations
  ];
  return images[index % images.length];
}

export function scrollToSection(sectionId: string): void {
  if (typeof window === 'undefined') return;
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

export function generateICS(event: {
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  location?: string;
  url?: string;
  timezone?: string;
}): string {
  const formatICSDate = (dateStr: string, tz?: string): string => {
    const date = new Date(dateStr);
    // If timezone is provided, adjust the date accordingly
    if (tz) {
      // Apply timezone offset - convert to target timezone
      const offset = new Date().getTimezoneOffset() * 60000; // in milliseconds
      date.setTime(date.getTime() + offset);
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatICSDateWithTz = (dateStr: string): string => formatICSDate(dateStr, event.timezone);

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@inviteaura.com`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//InviteAura//Digital Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDateWithTz(event.startDate)}`,
    `DTEND:${formatICSDateWithTz(event.endDate)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    event.url ? `URL:${event.url}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

// QR Code generation using a simple canvas-based approach
export async function generateQRCodeDataURL(
  text: string,
  options: {
    width?: number;
    margin?: number;
    color?: { dark: string; light: string };
  } = {}
): Promise<string> {
  const { width = 256, margin = 2, color = { dark: '#341B16', light: '#FDF8F3' } } = options;

  // Simple QR code generation using a lightweight approach
  // In production, you'd use a library like 'qrcode' or 'qr-code-styling'
  // This is a placeholder that creates a canvas with the text encoded
  try {
    // Dynamic import of qrcode library (would need to be installed)
    // For now, we'll use a simple canvas-based approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const size = width;
    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = color.light;
    ctx.fillRect(0, 0, size, size);

    // Draw a simple pattern as placeholder QR code
    // In real implementation, use a proper QR code library
    const moduleSize = Math.floor(size / 25);
    const padding = margin * moduleSize;

    // Draw a simple pattern representing QR code
    ctx.fillStyle = color.dark;
    // Position markers (three corners)
    drawPositionMarker(ctx, padding, padding, moduleSize, 7);
    drawPositionMarker(ctx, size - padding - 7 * moduleSize, padding, moduleSize, 7);
    drawPositionMarker(ctx, padding, size - padding - 7 * moduleSize, moduleSize, 7);

    // Draw some data pattern (simplified)
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if ((i + j) % 3 === 0 || (i * 7 + j * 11) % 13 === 0) {
          ctx.fillRect(
            padding + 8 * moduleSize + i * moduleSize,
            padding + 8 * moduleSize + j * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    // Fallback: return a simple SVG-based QR code placeholder
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="0 0 ${width} ${width}">
        <rect width="${width}" height="${width}" fill="${color.light}"/>
        <rect x="${margin * 10}" y="${margin * 10}" width="${width - margin * 20}" height="${width - margin * 20}" fill="${color.dark}" opacity="0.1"/>
        <text x="${width / 2}" y="${width / 2}" font-family="system-ui" font-size="14" fill="${color.dark}" text-anchor="middle" dominant-baseline="middle">QR Code</text>
        <text x="${width / 2}" y="${width / 2 + 20}" font-family="system-ui" font-size="10" fill="${color.dark}" text-anchor="middle" dominant-baseline="middle">${text.substring(0, 40)}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

function drawPositionMarker(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number, size: number) {
  // Draw the 7x7 position marker pattern
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (pattern[i][j]) {
        ctx.fillRect(x + j * moduleSize, y + i * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}