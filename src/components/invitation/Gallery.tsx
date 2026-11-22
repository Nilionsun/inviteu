'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X, Play } from 'lucide-react';
import { cn, isVideoUrl, getYoutubeEmbedUrl } from '../../lib/utils';
import { Button } from '../ui';

export interface GalleryItem {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  caption: string;
  altText: string;
  width?: number;
  height?: number;
}

interface GalleryProps {
  title: string;
  subtitle: string;
  items: GalleryItem[];
}

export function Gallery({ title, subtitle, items }: GalleryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = 5;
  const maxIndex = Math.max(0, items.length - visibleCount);

  // Auto-scroll carousel
  useEffect(() => {
    if (items.length <= visibleCount) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length, maxIndex]);

  const scrollToIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    containerRef.current?.scrollTo({
      left: clampedIndex * (containerRef.current.offsetWidth / visibleCount),
      behavior: 'smooth',
    });
  }, [maxIndex, visibleCount]);

  const handleNext = useCallback(() => {
    scrollToIndex(currentIndex + 1);
  }, [currentIndex, scrollToIndex]);

  const handlePrev = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(null);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const lightboxItem = items[lightboxIndex];
  const isVideo = lightboxItem && isVideoUrl(lightboxItem.url);
  const youtubeUrl = lightboxItem && getYoutubeEmbedUrl(lightboxItem.url);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      else if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, items.length]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      aria-labelledby="gallery-title"
    >
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2
            id="gallery-title"
            className="font-serif font-medium text-section-title text-text-primary mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="font-sans text-section-subtitle text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          <div className="gold-divider mt-6" aria-hidden="true" />
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Image gallery carousel"
            tabIndex={0}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 w-[calc((100%-16px)/1)] sm:w-[calc((100%-32px)/2)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-64px)/4)] xl:w-[calc((100%-80px)/5)]"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1), ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <article className="gallery-image group relative" onClick={() => openLightbox(index)}>
                  {item.type === 'video' || youtubeUrl ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <motion.button
                          className="p-3 rounded-full bg-text-white/20 backdrop-blur-sm text-text-white hover:bg-text-white/30 hover:scale-110 transition-all"
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Play video: ${item.caption}`}
                        >
                          <Play className="w-8 h-8 ml-1" />
                        </motion.button>
                      </div>
                    </>
                  ) : null}
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.altText}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-text-white text-body-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption}
                  </figcaption>
                  <Expand
                    className="absolute top-3 right-3 w-5 h-5 text-text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                </article>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {items.length > visibleCount && (
            <>
              <motion.button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-8 z-20 p-3 rounded-full bg-surface-cream border border-border-gold/50 text-primary-gold shadow-card hover:bg-primary-cream hover:border-primary-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous images"
                aria-hidden="true"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-8 z-20 p-3 rounded-full bg-surface-cream border border-border-gold/50 text-primary-gold shadow-card hover:bg-primary-cream hover:border-primary-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next images"
                aria-hidden="true"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Pagination Dots */}
          {items.length > visibleCount && (
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Gallery pages">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    currentIndex === i
                      ? 'bg-primary-gold w-8'
                      : 'bg-border-gold/50 hover:bg-primary-gold/50'
                  )}
                  role="tab"
                  aria-selected={currentIndex === i}
                  aria-label={`Go to page ${i + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      {isLightboxOpen && lightboxItem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxItem.caption}, image ${lightboxIndex + 1} of ${items.length}`}
        >
          <motion.div
            className="relative max-w-5xl max-h-[90vh] w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 p-2 rounded-full bg-surface-cream/20 backdrop-blur-sm text-text-white hover:bg-surface-cream/30 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation in Lightbox */}
            {items.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 rounded-full bg-surface-cream/20 backdrop-blur-sm text-text-white hover:bg-surface-cream/30 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-3 rounded-full bg-surface-cream/20 backdrop-blur-sm text-text-white hover:bg-surface-cream/30 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Content */}
            {isVideo && youtubeUrl ? (
              <iframe
                src={youtubeUrl}
                title={lightboxItem.caption}
                className="w-full aspect-video rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVideo ? (
              <video
                src={lightboxItem.url}
                controls
                className="w-full max-h-[70vh] rounded-xl"
                autoPlay
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.altText}
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
            )}

            {/* Caption */}
            <div className="mt-4 text-center text-text-white/80 text-body">
              {lightboxItem.caption}
            </div>

            {/* Counter */}
            {items.length > 1 && (
              <div className="mt-2 text-center text-text-white/50 text-body-sm">
                {lightboxIndex + 1} / {items.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}