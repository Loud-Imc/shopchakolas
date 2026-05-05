'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { formatPrice, calculateDiscountedPrice, getImageUrl } from '@/lib/utils';
import { RootState, AppDispatch } from '@/lib/store';
import { addToWishlist, removeFromWishlist } from '@/lib/store/wishlistSlice';
import { addToCart } from '@/lib/store/cartSlice';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    isFeatured?: boolean;
    offerType?: string;
    offerLabel?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isInWishlist = wishlistItems.some(item => item.productId === product.id);

    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const imageUrl = getImageUrl(product.images[0]);
    const isDataUrl = imageUrl?.startsWith('data:');

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push(`/login?redirect=${window.location.pathname}`);
            return;
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product.id));
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) return;

        setAdding(true);
        dispatch(addToCart({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            quantity: 1,
            image: product.images[0],
            stock: product.stock
        }));

        setTimeout(() => setAdding(false), 800);
    };

    return (
        <div className="group relative h-full flex flex-col">
            <Link
                href={`/products/${product.slug}`}
                className="flex-1 bg-white rounded-[3.5rem] p-8 sm:p-10 transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(45,81,67,0.25)] border border-gray-100/50 flex flex-col group/card relative overflow-hidden"
            >
                {/* Image Section - Majestic Presentation */}
                <div className="relative aspect-[1/1] rounded-[2rem] bg-[#f8f9f8] overflow-hidden group/image">
                    {isDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-0 transform group-hover/card:scale-105 transition-transform duration-1000 ease-out"
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-0 transform group-hover/card:scale-105 transition-transform duration-1000 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}

                    {/* Offer Badge - Vibrant & Attractive */}
                    {product.offerLabel && (
                        <div className="absolute top-6 left-6 z-10">
                            <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(239,68,68,0.4)] animate-pulse-subtle">
                                {product.offerLabel}
                            </span>
                        </div>
                    )}

                    {/* Sophisticated Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating "View Details" on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 z-10">
                        <span className="bg-primary text-white px-10 py-4 rounded-full text-sm font-black tracking-widest uppercase shadow-2xl">
                            Explore Secret
                        </span>
                    </div>

                    {/* Stock status badge */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[6px] flex items-center justify-center z-20">
                            <span className="bg-white/90 text-gray-900 px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section - Majestic & Luxury */}
                <div className="pt-10 pb-4 px-4 flex flex-col flex-1 text-center">
                    <div className="flex justify-center mb-4">
                        <span className="text-[12px] font-black tracking-[0.3em] uppercase text-accent-600 bg-accent-50/50 px-5 py-2 rounded-full">
                            Pure Heritage Extract
                        </span>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tighter group-hover/card:text-primary transition-colors duration-500">
                        {product.name}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl font-black text-primary tracking-tighter">
                                {formatPrice(discountedPrice)}
                            </span>
                            {product.discount > 0 && (
                                <span className="relative text-xl text-gray-500 font-bold px-1">
                                    {formatPrice(product.price)}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="w-full h-[2px] bg-red-700 -rotate-3 transform shadow-sm opacity-80"></span>
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Interaction Footer - Grand & Elegant */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-50/50 pt-8 px-4">
                   <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Legacy Collection</span>
                        <span className="text-[12px] text-primary-800 font-bold">Ayurvedic Certification</span>
                   </div>
                   <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || adding}
                        className={`h-14 px-10 flex items-center justify-center rounded-2xl transition-all duration-700 font-black text-[13px] uppercase tracking-[0.2em] ${adding
                            ? 'bg-accent-500 text-white scale-95'
                            : 'bg-primary text-white hover:bg-primary-dark shadow-[0_15px_30px_rgba(45,81,67,0.3)] hover:shadow-[0_20px_40px_rgba(45,81,67,0.5)] active:scale-95 disabled:bg-gray-50 disabled:text-gray-300 disabled:shadow-none'
                            }`}
                    >
                        {adding ? 'Secured' : 'Acquire'}
                    </button>
                </div>
            </Link>

            {/* Premium Wishlist Toggle */}
            <button
                onClick={handleToggleWishlist}
                className={`absolute top-8 right-8 z-20 h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-500 border border-white/50 ${isInWishlist
                    ? 'bg-red-500 text-white shadow-[0_10px_20px_rgba(239,68,68,0.4)]'
                    : 'bg-white/60 text-gray-400 hover:text-red-500 hover:bg-white shadow-lg'
                    }`}
            >
                <svg
                    className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'fill-none'}`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>
        </div>
    );
}

