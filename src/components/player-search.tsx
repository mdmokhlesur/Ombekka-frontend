'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, useId } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, MapPin, Trophy } from 'lucide-react';
import { getAllPlayers, type PlayerInfo } from '@/lib/mock-data';

interface PlayerSearchProps {
  compact?: boolean;
  placeholder?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function PlayerSearch({ compact = false, placeholder }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 250);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const router = useRouter();

  // Derive results from debounced query
  const results = useMemo<PlayerInfo[]>(() => {
    if (debouncedQuery.trim().length === 0) return [];
    const allPlayers = getAllPlayers();
    const q = debouncedQuery.trim().toLowerCase();
    return allPlayers
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.fideId.toString().includes(q) ||
        p.country.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery]);

  // Derive isOpen
  const isOpen = results.length > 0 && !dismissed;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDismissed(true);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateToPlayer = useCallback((fideId: number) => {
    setDismissed(true);
    setQuery('');
    router.push(`/results?q=${fideId}`);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setDismissed(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          navigateToPlayer(results[highlightedIndex].fideId);
        } else if (results.length > 0) {
          navigateToPlayer(results[0].fideId);
        }
        break;
      case 'Escape':
        setDismissed(true);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      const index = highlightedIndex >= 0 ? highlightedIndex : 0;
      navigateToPlayer(results[index].fideId);
    } else if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <Search className={`absolute text-[#999] pointer-events-none z-10 ${compact ? 'left-2.5 w-[15px] h-[15px]' : 'left-3.5 w-[18px] h-[18px]'}`} />
          <input
            ref={inputRef}
            type="text"
            className={`w-full border border-[#d1d5db] rounded-md bg-white text-[#333] transition-all focus:border-[#0071bc] focus:ring-4 focus:ring-[#0071bc]/10 outline-none placeholder:text-[#aaa] ${
              compact 
                ? 'h-[38px] pl-9 pr-4 text-[0.82rem] placeholder:text-[0.8rem]' 
                : 'h-[52px] pl-11 pr-4 text-[0.95rem] placeholder:text-[0.9rem]'
            }`}
            placeholder={placeholder || 'Search by player name, FIDE ID, or country…'}
            value={query}
            onChange={handleInputChange}
            onFocus={() => { if (dismissed) setDismissed(false); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <ul id={listboxId} className="absolute top-[calc(100%+4px)] inset-x-0 bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-50 p-1 max-h-[380px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 list-none" role="listbox">
          {results.map((player, index) => (
            <li
              key={player.fideId}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer gap-3 transition-colors group ${index === highlightedIndex ? 'bg-[#f0f6ff]' : ''}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => navigateToPlayer(player.fideId)}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${index === highlightedIndex ? 'bg-[#0071bc]/10 text-[#0071bc]' : 'bg-[#f4f6f8] text-[#999]'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.85rem] font-semibold text-[#1a1a1a] truncate">{player.name}</span>
                  <span className="flex items-center gap-1 text-[0.7rem] text-[#999] mt-0.5">
                    <MapPin className="w-3 h-3" /> {player.country}
                    <span className="mx-0.5 text-[#ddd]">·</span>
                    <Trophy className="w-3 h-3" /> {player.title || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[0.7rem] font-mono text-[#bbb]">#{player.fideId}</span>
                <span className="text-[0.65rem] text-[#aaa] mt-0.5">{player.gamesCount} games</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
