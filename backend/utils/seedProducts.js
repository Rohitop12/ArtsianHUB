const Product = require('../models/Product');

const sampleProducts = [
    {
        title: 'Rustic Clay Bowl',
        description: 'Hand-thrown ceramic bowl with earthy tones and natural glaze. Perfect for serving or display.',
        price: 45,
        category: 'Pottery',
        image: 'https://picsum.photos/seed/rustic-clay-bowl/600/400',
    },
    {
        title: 'Terracotta Plant Pot',
        description: 'Handcrafted terracotta pot with carved geometric patterns, ideal for indoor plants.',
        price: 32,
        category: 'Pottery',
        image: 'https://picsum.photos/seed/terracotta-plant-pot/600/400',
    },
    {
        title: 'Stoneware Coffee Mug',
        description: 'Sturdy stoneware mug with a smooth matte finish and comfortable handle.',
        price: 28,
        category: 'Pottery',
        image: 'https://picsum.photos/seed/stoneware-coffee-mug/600/400',
    },
    {
        title: 'Silver Leaf Earrings',
        description: 'Delicate hand-hammered silver earrings inspired by autumn leaves.',
        price: 75,
        category: 'Jewelry',
        image: 'https://picsum.photos/seed/silver-leaf-earrings/600/400',
    },
    {
        title: 'Turquoise Beaded Bracelet',
        description: 'Vibrant turquoise stones hand-strung on silk thread with a silver clasp.',
        price: 55,
        category: 'Jewelry',
        image: 'https://picsum.photos/seed/turquoise-beaded-bracelet/600/400',
    },
    {
        title: 'Copper Wire Pendant',
        description: 'Artisan-wrapped copper wire pendant with a natural crystal centerpiece.',
        price: 62,
        category: 'Jewelry',
        image: 'https://picsum.photos/seed/copper-wire-pendant/600/400',
    },
    {
        title: 'Hand-Woven Wool Scarf',
        description: 'Luxuriously soft merino wool scarf woven with traditional patterns in warm autumn colors.',
        price: 88,
        category: 'Textiles',
        image: 'https://picsum.photos/seed/hand-woven-wool-scarf/600/400',
    },
    {
        title: 'Batik Cotton Tote Bag',
        description: 'Eco-friendly cotton tote with hand-applied batik dye in indigo and cream.',
        price: 40,
        category: 'Textiles',
        image: 'https://picsum.photos/seed/batik-cotton-tote-bag/600/400',
    },
    {
        title: 'Macramé Wall Hanging',
        description: 'Large boho macramé wall hanging made from natural cotton rope with wooden dowel.',
        price: 95,
        category: 'Textiles',
        image: 'https://picsum.photos/seed/macrame-wall-hanging/600/400',
    },
    {
        title: 'Oak Serving Board',
        description: 'Handcrafted solid oak charcuterie and serving board with engraved floral border.',
        price: 110,
        category: 'Woodwork',
        image: 'https://picsum.photos/seed/oak-serving-board/600/400',
    },
    {
        title: 'Walnut Keepsake Box',
        description: 'Small walnut jewelry box with dovetail joints and velvet-lined interior.',
        price: 135,
        category: 'Woodwork',
        image: 'https://picsum.photos/seed/walnut-keepsake-box/600/400',
    },
    {
        title: 'Carved Bamboo Vase',
        description: 'Elegant bamboo vase with hand-carved lotus flower motifs, sealed with natural lacquer.',
        price: 58,
        category: 'Woodwork',
        image: 'https://picsum.photos/seed/carved-bamboo-vase/600/400',
    },
];

const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(sampleProducts);
            console.log('🌱 Seeded 12 sample products');
        } else {
            console.log(`📦 Products already exist (${count} found), skipping seed`);
        }
    } catch (error) {
        console.error('❌ Seed error:', error.message);
    }
};

module.exports = seedProducts;
