import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/api';

async function getProducts(searchParams: any) {
    try {
        const response = await productsAPI.getAll(searchParams);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;

    // Sanitize parameters: Only allow whitelisted keys to reach the backend
    // This prevents validation errors (e.g. from _rsc or other internal Next.js params)
    const apiParams: any = {
        page,
        ...(params.search && { search: params.search }),
        ...(params.category && { categoryId: params.category }),
    };

    // Forward other optional query parameters if they exist
    if ((params as any).sortBy) apiParams.sortBy = (params as any).sortBy;
    if ((params as any).sortOrder) apiParams.sortOrder = (params as any).sortOrder;
    if ((params as any).limit) apiParams.limit = Number((params as any).limit);
    if ((params as any).minPrice) apiParams.minPrice = Number((params as any).minPrice);
    if ((params as any).maxPrice) apiParams.maxPrice = Number((params as any).maxPrice);

    const result = await getProducts(apiParams);
    const { data: products, meta } = result;

    return (
        <div className="container mx-auto px-4 pt-36 pb-20 bg-[#fcfdfc]">
            <div className="max-w-6xl mx-auto mb-16 text-center">
                <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-4 block">
                    Heritage Apothecary
                </span>
                <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">Our Collection</h1>
                <p className="text-gray-500 text-lg font-medium italic">
                    Traditional Ayurvedic formulas, handcrafted for modern wellness.
                </p>
            </div>

            {/* Products Grid - Centered & Premium */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {products.map((product: any) => (
                        <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-500">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {products.length === 0 && (
                <div className="text-center py-20">
                    <svg
                        className="w-24 h-24 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <a
                            key={pageNum}
                            href={`/products?page=${pageNum}`}
                            className={`px-4 py-2 rounded-lg font-medium transition ${pageNum === page
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {pageNum}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
