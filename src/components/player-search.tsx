'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface PlayerSearchProps {
  compact?: boolean;
  placeholder?: string;
}

export default function PlayerSearch({ compact = false, placeholder }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-full">
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
            placeholder={placeholder || 'Search by player, tournament, ECO code, or opening name…'}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            role="searchbox"
          />
        </div>
      </form>
    </div>
  );
}
