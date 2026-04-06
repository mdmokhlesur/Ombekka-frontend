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
    <div ref={containerRef} className={`player-search-container ${compact ? 'player-search--compact' : ''}`}>
      <form onSubmit={handleSubmit} className="player-search-form">
        <div className="player-search-input-wrapper">
          <Search className="player-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className={`player-search-input ${compact ? 'player-search-input--compact' : ''}`}
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
        <ul id={listboxId} className="player-search-dropdown" role="listbox">
          {results.map((player, index) => (
            <li
              key={player.fideId}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`player-search-option ${index === highlightedIndex ? 'player-search-option--highlighted' : ''}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => navigateToPlayer(player.fideId)}
            >
              <div className="player-search-option-left">
                <div className="player-search-option-avatar">
                  <User className="w-4 h-4" />
                </div>
                <div className="player-search-option-info">
                  <span className="player-search-option-name">{player.name}</span>
                  <span className="player-search-option-meta">
                    <MapPin className="w-3 h-3" /> {player.country}
                    <span className="player-search-option-divider">·</span>
                    <Trophy className="w-3 h-3" /> {player.title || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="player-search-option-right">
                <span className="player-search-option-id">#{player.fideId}</span>
                <span className="player-search-option-games">{player.gamesCount} games</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
