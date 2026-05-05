'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { categoriesAPI } from '@/lib/api';

export default function Header() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.auth.user);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const [categories, setCategories] = useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getTree();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 pointer-events-none">
            <div className={`container mx-auto bg-primary text-white shadow-[0_20px_50px_rgba(45,81,67,0.3)] px-10 pointer-events-auto ${isMenuOpen ? 'rounded-t-[1.5rem] rounded-b-[4rem]' : 'rounded-full'
                }`}>
                <div className="flex items-center justify-between h-15 py-1">

                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="hover:opacity-80 transition">
                            <Image
                                src="/images/chakolas-logo.png"
                                alt="CHAKOLAS"
                                width={250}
                                height={10}
                                className="w-40 md:w-[200px]"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Section: Navigation & Icons */}
                    <div className="flex items-center gap-8">
                        <nav className="hidden lg:flex items-center gap-10 mr-2">
                            <Link href="/" className="font-bold hover:text-white/80 transition text-[13px] uppercase tracking-[0.2em]">
                                Home
                            </Link>
                            <Link href="/products" className="font-bold hover:text-white/80 transition text-[13px] uppercase tracking-[0.2em]">
                                Shop
                            </Link>
                            <Link href="/track-order" className="font-bold hover:text-white/80 transition text-[13px] uppercase tracking-[0.2em]">
                                Track Order
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4 lg:border-l lg:border-white/20 lg:pl-8">
                            <Link href="/wishlist" className="p-1.5 text-white/90 hover:text-white transition relative group" title="Wishlist">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            <Link href="/cart" className="p-1.5 text-white/90 hover:text-white transition relative group" title="Cart">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <Link href="/dashboard" className="flex items-center gap-2 p-1.5 pl-3 pr-4 bg-white/10 hover:bg-white/20 rounded-full transition text-white">
                                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold text-white">
                                        {user.firstName[0]}
                                    </div>
                                    <span className="text-xs font-bold hidden xl:inline">{user.firstName}</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="ml-2 bg-white text-primary px-6 py-2 rounded-xl hover:bg-primary-50 transition text-xs font-black uppercase tracking-widest hidden sm:block">
                                    LOGIN
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden pt-8 pb-16 border-t border-white/10 mt-2 animate-in slide-in-from-top duration-300">
                        <nav className="flex flex-col gap-10">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-bold uppercase tracking-[0.3em] text-lg hover:text-white/70 transition-colors px-2">Home</Link>
                            <Link href="/products" onClick={() => setIsMenuOpen(false)} className="font-bold uppercase tracking-[0.3em] text-lg hover:text-white/70 transition-colors px-2">Shop</Link>
                            <Link href="/track-order" onClick={() => setIsMenuOpen(false)} className="font-bold uppercase tracking-[0.3em] text-lg hover:text-white/70 transition-colors px-2">Track Order</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
