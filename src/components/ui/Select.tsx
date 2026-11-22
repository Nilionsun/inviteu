'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string | number;
  onValueChange: React.Dispatch<React.SetStateAction<any>>;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function Select({ value, onValueChange, options, placeholder = 'Select an option', className = '', disabled = false, searchable = false }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option => {
    if (!searchable) return true;
    const searchLower = searchTerm.toLowerCase();
    return option.label.toLowerCase().includes(searchLower) || String(option.value).toLowerCase().includes(searchLower);
  });

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (isOpen) {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          if (inputRef.current) inputRef.current.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          break;
        case 'ArrowUp':
          e.preventDefault();
          break;
        case 'Enter':
          e.preventDefault();
          if (inputRef.current) inputRef.current.blur();
          setIsOpen(false);
          break;
      }
    } else {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setIsOpen(true);
      }
    }
  }, [isOpen]);

  const handleOptionSelect = React.useCallback((option: SelectOption) => {
    onValueChange(option.value);
    setIsOpen(false);
  }, [onValueChange]);

  return (
    <div className={cn(
      'relative w-full',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="flex items-center justify-between">
        <div
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className={cn(
            'flex-1 rounded-xl border border-border-gold/30 bg-white px-3 py-2.5 text-body focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 disabled:cursor-not-allowed',
            searchable && 'pr-8'
          )}
        >
          {searchable && (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-body outline-none placeholder:text-text-secondary"
              disabled={disabled}
              aria-label="Search options"
            />
          )}
          <span className={cn(
            'flex items-center gap-1 text-body/60',
            searchable && 'pr-2'
          )}>
            {searchable && searchTerm ? (
              <span className="text-body-xs text-text-muted">
                {filteredOptions.length > 0 ? 'Showing results for' : 'No results found'}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
          <ArrowDown className={cn('w-4 h-4 text-text-secondary transition-transform', isOpen && 'rotate-180')} />
        </div>

        {isOpen && (
          <div className="absolute right-0 left-full mt-2 w-64 rounded-xl border border-border-gold/30 bg-white shadow-lg z-10 overflow-auto max-h-80">
            {searchable && (
              <div className="p-2">
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-primary-cream/50 text-body rounded-md px-2 py-1 placeholder:text-text-secondary outline-none"
                  aria-label="Search options"
                />
              </div>
            )}
            <div className="max-h-80 overflow-y-auto">
              {filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md mb-1 transition-colors',
                      isSelected ? 'bg-primary-gold/10 text-primary-gold' : 'text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary-gold/20" />
                    <span>{option.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



