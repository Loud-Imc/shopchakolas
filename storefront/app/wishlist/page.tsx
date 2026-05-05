'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
    const { items, loading } = useSelector((state: RootState) => state.wishlist);
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50">
                    <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Your Private Gallery</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">Sign in to curate your personal collection of Ayurvedic essentials and access them from any device.</p>
                    <Link
                        href="/login?redirect=/wishlist"
                        className="block w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition shadow-2xl shadow-primary/30"
                    >
                        Sign In to View
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-32 pb-16">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-3 block">Personal Collection</span>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
                    <p className="text-gray-500 mt-4 font-medium">{items.length} exquisite pieces saved</p>
                </div>
                <Link
                    href="/products"
                    className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-sm font-black uppercase tracking-widest text-primary"
                >
                    Continue Shopping
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </header>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 lg:gap-16">
                    {items.map((item) => (
                        <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ProductCard product={item.product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-10">
                        <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Your collection is empty</h2>
                    <p className="text-gray-400 mb-12 max-w-sm mx-auto leading-relaxed">Begin your journey towards radiant skin by exploring our curated heritage collection.</p>
                    <Link
                        href="/products"
                        className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl shadow-primary/20 transition-all"
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
}
