'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface SearchBarProps {
    isHeader?: boolean;
    isDark?: boolean;
}

function SearchBarContent({ isHeader, isDark }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const response = await productsAPI.getAll({ search: query, limit: 5 });
                    setSuggestions(response.data.data);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className={`w-full transition-all text-sm outline-none ${
                        isHeader 
                        ? (isDark 
                            ? 'bg-white/10 hover:bg-white/20 focus:bg-white/25 border border-white/10 text-white placeholder-white/40 pl-5 pr-12 py-2 rounded-full' 
                            : 'bg-gray-100/50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 text-gray-900 placeholder-gray-400 pl-5 pr-12 py-2 rounded-full'
                          )
                        : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20'
                    }`}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 transition-colors ${isHeader ? 'right-4' : 'left-4'} ${isDark ? 'text-white/40 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-primary'}`}>
                    {loading ? (
                        <div className={`animate-spin rounded-full h-4 w-4 border-2 ${isDark ? 'border-white/20 border-t-white' : 'border-gray-200 border-t-primary'}`}></div>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {suggestions.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                    <Image
                                        src={getImageUrl(product.images[0])}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-primary font-black mt-0.5">
                                        ₹{product.price.toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="bg-gray-50/50 p-3 border-t border-gray-100">
                        <button
                            onClick={handleSearch}
                            className="w-full py-2.5 text-xs font-black text-primary hover:bg-white rounded-xl transition uppercase tracking-widest border border-transparent hover:border-gray-200 shadow-sm"
                        >
                            All results for "{query}"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchBar({ isHeader, isDark }: SearchBarProps) {
    return (
        <Suspense fallback={
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search"
                    disabled
                    className={`w-full text-sm ${
                        isHeader 
                        ? (isDark ? 'bg-white/10 pl-5 pr-12 py-2 rounded-full' : 'bg-gray-100/50 pl-5 pr-12 py-2 rounded-full') 
                        : 'bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-xl'
                    }`}
                />
            </div>
        }>
            <SearchBarContent isHeader={isHeader} isDark={isDark} />
        </Suspense>
    );
}
