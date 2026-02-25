import React from 'react';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';

const Home = () => {
    return (
        <main>
            <Hero />
            <NewArrivals />

            {/* Features Section */}
            <section className="py-20 bg-stone-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                            Why Choose <span className="text-amber-400">ArtisanHub?</span>
                        </h2>
                        <p className="text-stone-400 max-w-xl mx-auto">
                            We connect passionate artisans with conscious buyers who value authenticity and craftsmanship.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎨',
                                title: 'Authentic Craftsmanship',
                                desc: 'Every item is handmade with care, skill, and years of expertise from independent artisans.',
                            },
                            {
                                icon: '🌍',
                                title: 'Global Artisans',
                                desc: 'Connect with makers from around the world who pour their culture and story into every piece.',
                            },
                            {
                                icon: '♻️',
                                title: 'Sustainable & Ethical',
                                desc: 'Support fair trade practices and eco-friendly production methods that respect our planet.',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-stone-800 rounded-2xl p-8 text-center hover:bg-stone-700 transition-all duration-300 hover:-translate-y-1 border border-stone-700 hover:border-amber-500/30"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="font-serif font-bold text-xl text-white mb-3">{feature.title}</h3>
                                <p className="text-stone-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Find Your Perfect Piece?
                    </h2>
                    <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                        Browse hundreds of handcrafted items made with love by skilled artisans. Each piece tells a unique story.
                    </p>
                    <a href="/products" className="inline-block bg-white text-amber-700 font-bold text-lg py-4 px-10 rounded-xl hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Shop Now →
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-stone-900 font-serif font-bold">A</span>
                        </div>
                        <span className="font-serif font-bold text-xl text-white">
                            Artisan<span className="text-amber-400">Hub</span>
                        </span>
                    </div>
                    <p className="text-sm">© 2024 ArtisanHub. Crafted with ❤️ for artisans everywhere.</p>
                </div>
            </footer>
        </main>
    );
};

export default Home;
