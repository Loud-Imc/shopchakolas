import Link from 'next/link';
import Image from 'next/image';
import { productsAPI, bannersAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { getImageUrl } from '@/lib/utils';
import HeroSlider from '@/components/HeroSlider';

async function getFeaturedProducts() {
    try {
        const response = await productsAPI.getAll({ isFeatured: true, limit: 8 });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getBanners() {
    try {
        const response = await bannersAPI.getActive();
        return response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

export default async function Home() {
    const products = await getFeaturedProducts();
    const banners = await getBanners();

    return (
        <div>
            {/* Hero Section */}
            <HeroSlider banners={banners} />

            {/* Featured Products */}
            <section className="py-2 bg-[#fcfdfc]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                            {products.slice(0, 2).map((product: any) => (
                                <div key={product.id} className="transform hover:-translate-y-4 transition-all duration-700">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-center text-center mt-20 mb-16">
                            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-4">
                                Curated Collection
                            </span>
                            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
                                Our Signature Products
                            </h2>
                            <div className="h-1.5 w-24 bg-primary/20 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-primary rounded-full"></div>
                            </div>
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg font-medium">Coming Soon...</p>
                                <p className="text-sm mt-2">We are preparing our signature Ayurvedic formulas.</p>
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="mt-16 text-center">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs hover:gap-5 transition-all duration-300 group"
                                >
                                    View Full Apothecary
                                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Why Choose Chakolas?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Authentic Ayurveda</h3>
                            <p className="text-gray-600">Traditional recipes since 1922</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Pure Ingredients</h3>
                            <p className="text-gray-600">100% natural herbal extracts</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Global Shipping</h3>
                            <p className="text-gray-600">Delivering wellness worldwide</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
