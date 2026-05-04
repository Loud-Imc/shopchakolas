export default function AboutUsPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="bg-primary py-20 text-white text-center">
                <h1 className="text-5xl font-black mb-4">About Chakolas</h1>
                <p className="text-xl text-primary-100 max-w-2xl mx-auto px-4 italic">
                    "For every body, anywhere."
                </p>
            </div>

            <div className="container mx-auto px-4 py-16 space-y-24">
                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Heritage</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Since 1922, Chakolas has been a trusted name in authentic Ayurvedic skincare. Our journey began with a commitment to harness the power of nature and traditional wisdom to provide holistic healing for the skin.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            With over a century of experience, we combine ancient Ayurvedic principles with modern science to create products that are effective, safe, and pure.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center text-4xl overflow-hidden shadow-xl">
                        🌿
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition">
                        <div className="text-4xl mb-4">🍃</div>
                        <h3 className="text-xl font-bold mb-2">Purity First</h3>
                        <p className="text-gray-500">We use only the highest grade herbal ingredients and traditional oils, ensuring authenticity in every drop.</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition">
                        <div className="text-4xl mb-4">📜</div>
                        <h3 className="text-xl font-bold mb-2">Century of Wisdom</h3>
                        <p className="text-gray-500">Our formulas are passed down through generations, refined over 100 years of practice at Chakola Guru Kalari.</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-lg transition">
                        <div className="text-4xl mb-4">🌍</div>
                        <h3 className="text-xl font-bold mb-2">For Every Body</h3>
                        <p className="text-gray-500">Our mission is to make Ayurvedic wellness accessible to everyone, anywhere in the world.</p>
                    </div>
                </div>

                {/* Why Us? */}
                <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl font-black mb-6">Why Choose Chakolas?</h2>
                        <p className="text-gray-400 text-lg">
                            We don't just sell products; we offer a heritage of healing. Every Chakolas product is a result of meticulous traditional preparation, ensuring that you receive the true benefits of Ayurveda.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
