import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@chakolas.in' },
        update: {
            role: 'SUPER_ADMIN',
        },
        create: {
            email: 'admin@chakolas.in',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '+917829095229',
            role: 'SUPER_ADMIN',
            referralCode: 'CHAKOLA001',
        },
    });
    console.log('✓ Created super admin user:', admin.email);

    // Create customer user
    const customerPassword = await bcrypt.hash('Customer@123', 10);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@chakolas.in' },
        update: {},
        create: {
            email: 'customer@chakolas.in',
            password: customerPassword,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+919876543210',
            role: 'CUSTOMER',
            referralCode: 'CUST001',
        },
    });
    console.log('✓ Created customer user:', customer.email);

    // Create referral config
    const referralConfig = await prisma.referralConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            discountPercentage: 10,
            maxDiscountAmount: 500,
            referrerRewardPercentage: 5,
            maxReferrerRewardAmount: 500,
            minPurchaseAmount: 1000,
            referrerRewardEnabled: true,
            referredRewardEnabled: true,
        },
    });
    console.log('✓ Created referral config');

    // Create categories
    const faceCare = await prisma.category.upsert({
        where: { slug: 'face-care' },
        update: {},
        create: {
            name: 'Face Care',
            slug: 'face-care',
            description: 'Traditional Ayurvedic treatments for radiant face skin',
            image: '/uploads/cat-face-care.png',
            isActive: true,
            position: 1,
        },
    });
    console.log('✓ Created category: Face Care');

    const bodyCare = await prisma.category.upsert({
        where: { slug: 'body-care' },
        update: {},
        create: {
            name: 'Body Care',
            slug: 'body-care',
            description: 'Natural Ayurvedic oils and creams for the body',
            image: '/uploads/cat-body-care.png',
            isActive: true,
            position: 2,
        },
    });
    console.log('✓ Created category: Body Care');

    const hairCare = await prisma.category.upsert({
        where: { slug: 'hair-care' },
        update: {},
        create: {
            name: 'Hair Care',
            slug: 'hair-care',
            description: 'Herbal hair oils and treatments since 1922',
            image: '/uploads/cat-hair-care.png',
            isActive: true,
            position: 3,
        },
    });
    console.log('✓ Created category: Hair Care');

    // Create sample products
    const product1 = await prisma.product.upsert({
        where: { slug: 'ayurvedic-glow-serum' },
        update: {},
        create: {
            categoryId: faceCare.id,
            name: 'Ayurvedic Glow Serum',
            slug: 'ayurvedic-glow-serum',
            description: 'Authentic Ayurvedic face serum for natural radiance and glow',
            price: 1499,
            discount: 10,
            stock: 100,
            images: ['/uploads/glow-serum.png'],
            isActive: true,
            isFeatured: true,
            metaTitle: 'Ayurvedic Glow Serum - Chakolas',
            metaDescription: 'Authentic Ayurvedic face serum for natural radiance and glow',
        },
    });
    console.log('✓ Created product:', product1.name);

    const product2 = await prisma.product.upsert({
        where: { slug: 'traditional-hair-oil' },
        update: {},
        create: {
            categoryId: hairCare.id,
            name: 'Traditional Hair Oil',
            slug: 'traditional-hair-oil',
            description: 'Our century-old recipe for strong and healthy hair',
            price: 899,
            discount: 5,
            stock: 150,
            images: ['/uploads/hair-oil.png'],
            isActive: true,
            isFeatured: true,
            metaTitle: 'Traditional Hair Oil - Chakolas',
            metaDescription: 'Our century-old recipe for strong and healthy hair',
            offerType: '1+1',
            offerLabel: 'Buy 1 Get 1 Free',
        },
    });
    console.log('✓ Created product:', product2.name);

    // Create sample banners
    await prisma.banner.deleteMany({}); // Clear existing to avoid duplicate titles/positions

    const banner1 = await prisma.banner.create({
        data: {
            title: 'Authentic Ayurveda Since 1922',
            description: 'Discover the purity of traditional skincare recipes',
            image: '/uploads/hero-banner.png',
            link: '/products',
            position: 1,
            isActive: true,
        },
    });
    console.log('✓ Created banner:', banner1.title);

    const banner2 = await prisma.banner.create({
        data: {
            title: 'Face Care Collection',
            description: 'Restore your natural glow with our Ayurvedic serums',
            image: '/uploads/face-banner.png',
            link: '/products?category=face-care',
            position: 2,
            isActive: true,
        },
    });
    console.log('✓ Created banner:', banner2.title);

    const banner3 = await prisma.banner.create({
        data: {
            title: 'Centuries of Wisdom',
            description: 'Trusted by generations for holistic skin wellness',
            image: '/uploads/heritage-banner.png',
            link: '/about',
            position: 3,
            isActive: true,
        },
    });
    console.log('✓ Created banner:', banner3.title);

    // Create sample coupon
    const coupon = await prisma.coupon.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            type: 'PERCENTAGE',
            value: 10,
            minPurchase: 1000,
            maxDiscount: 500,
            validFrom: new Date(),
            validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            usageLimit: 100,
            isActive: true,
        },
    });
    console.log('✓ Created coupon:', coupon.code);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault credentials:');
    console.log('Admin: admin@chakolas.in / Admin@123');
    console.log('Customer: customer@chakolas.in / Customer@123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
