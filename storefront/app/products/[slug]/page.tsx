'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/lib/store';
import { productsAPI, cartAPI } from '@/lib/api';
import { addToCart } from '@/lib/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/lib/store/wishlistSlice';
import { formatPrice, calculateDiscountedPrice, getImageUrl } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);



    // Fetch product
    useEffect(() => {
        productsAPI
            .getBySlug(slug)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    const isWishlisted = product && wishlistItems.some((item: any) => item.product.id === product.id);

    const toggleWishlist = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=' + window.location.pathname);
            return;
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
        } else {
            dispatch(addToWishlist(product.id));
        }
    };

    // Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            if (isLeftSwipe) {
                setActiveImage((prev) => (prev + 1) % product.images.length);
            } else {
                setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
            }
        }
    };



    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
                <button
                    onClick={() => router.push('/products')}
                    className="text-primary hover:underline"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        // Sync with backend if authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await cartAPI.add({ productId: product.id, quantity });
            } catch (error) {
                console.error('Failed to sync cart with backend', error);
            }
        }

        dispatch(
            addToCart({
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                quantity,
                image: product.images[0],
                stock: product.stock,
            })
        );

        // Brief delay for visual feedback before redirect
        setTimeout(() => {
            router.push('/cart');
        }, 500);
    };

    const handleBuyNow = async () => {
        setBuyingNow(true);
        // Sync with backend if authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await cartAPI.add({ productId: product.id, quantity });
            } catch (error) {
                console.error('Failed to sync cart with backend', error);
            }
        }

        dispatch(
            addToCart({
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                quantity,
                image: product.images[0],
                stock: product.stock,
            })
        );

        setTimeout(() => {
            router.push('/checkout');
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 lg:gap-16 items-start">
                    {/* Images */}
                    <div className="space-y-4 max-w-[450px] w-full mx-auto lg:mx-0">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square w-full bg-white rounded-3xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {getImageUrl(product.images[activeImage]).startsWith('data:') ? (
                                <img
                                    src={getImageUrl(product.images[activeImage])}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={getImageUrl(product.images[activeImage])}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.preventDefault(); toggleWishlist(); }}
                                className={`absolute top-4 left-4 z-20 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            {product.offerLabel && (
                                <div className="absolute top-20 right-4 z-20 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl animate-pulse-subtle">
                                    {product.offerLabel}
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-gray-800 border border-gray-200/50 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center hover:text-primary"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-gray-800 border border-gray-200/50 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center hover:text-primary"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails (Small Image Carousel) */}
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mt-6">
                                {product.images.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${activeImage === index
                                            ? 'border-primary ring-4 ring-primary/10 scale-95'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={getImageUrl(image)}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {activeImage !== index && (
                                            <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-all"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">{product.name}</h1>

                        <div className="flex flex-col mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-4xl font-black text-primary">
                                    {formatPrice(discountedPrice)}
                                </span>
                                {product.discount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl text-gray-400 line-through decoration-red-500/50 decoration-2">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-emerald-100">
                                            {Math.round(product.discount)}% OFF
                                        </span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-md border border-emerald-100/50">
                                            Save {formatPrice(product.price - discountedPrice)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs font-black tracking-widest text-gray-400 uppercase mt-2">Inclusive of GST</span>
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-l-2 border-primary/20 pl-4 py-1">
                            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-8">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    In Stock ({product.stock} Units)
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-100">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity */}
                        {product.stock > 0 && (
                            <div className="mb-8 flex items-center gap-4">
                                <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                    QTY
                                </span>
                                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm active:scale-95 transition flex items-center justify-center font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-bold w-10 text-center text-gray-800">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-8 h-8 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm active:scale-95 transition flex items-center justify-center font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actions: Add to Cart and Buy Now */}
                        {product.stock > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || buyingNow}
                                    className={`flex-1 py-4 px-6 rounded-2xl text-base font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 border-2 border-primary/20 ${addingToCart
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-primary hover:bg-primary/5 hover:border-primary/40 active:scale-[0.98]'
                                        }`}
                                >
                                    {addingToCart ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={addingToCart || buyingNow}
                                    className={`flex-1 py-4 px-6 rounded-2xl text-base font-black uppercase tracking-wider transition-all duration-300 shadow-[0_10px_20px_rgba(45,81,67,0.15)] hover:shadow-[0_15px_30px_rgba(45,81,67,0.3)] flex items-center justify-center gap-2.5 ${buyingNow
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-primary text-white hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.98]'
                                        }`}
                                >
                                    {buyingNow ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Buy Now
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Gallery Section */}
                {product.images && product.images.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight uppercase">
                            Product Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {product.images.map((image: string, index: number) => (
                                <div key={index} className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-gray-100/60 p-4 sm:p-6 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] hover:border-gray-200/80">
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                        <Image
                                            src={getImageUrl(image)}
                                            alt={`${product.name} showcase ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
