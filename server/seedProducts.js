require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Sample grocery products across all categories
const products = [
  // Fruits
  {
    name: 'Bananas',
    description: 'Fresh ripe bananas, naturally sweet and rich in potassium.',
    price: 40,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    unit: '1 dozen',
    stock: 150
  },
  {
    name: 'Apples',
    description: 'Crisp and juicy red apples, perfect for snacking.',
    price: 180,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    unit: '1 kg',
    stock: 120
  },
  {
    name: 'Oranges',
    description: 'Sweet and tangy oranges, packed with vitamin C.',
    price: 90,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e',
    unit: '1 kg',
    stock: 100
  },
  {
    name: 'Mangoes',
    description: 'Juicy Alphonso mangoes, the king of fruits.',
    price: 250,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078',
    unit: '1 kg',
    stock: 80
  },
  {
    name: 'Grapes',
    description: 'Seedless green grapes, sweet and refreshing.',
    price: 120,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133',
    unit: '500 g',
    stock: 90

  },

  // Vegetables
  {
    name: 'Tomatoes',
    description: 'Fresh red tomatoes, ideal for curries and salads.',
    price: 40,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
    unit: '1 kg',
    stock: 200
  },
  {
    name: 'Potatoes',
    description: 'Farm-fresh potatoes, a kitchen staple.',
    price: 35,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    unit: '1 kg',
    stock: 250
  },
  {
    name: 'Onions',
    description: 'Fresh onions, essential for everyday cooking.',
    price: 45,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1',
    unit: '1 kg',
    stock: 220
  },
  {
    name: 'Carrots',
    description: 'Crunchy orange carrots, great for salads and juices.',
    price: 60,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
    unit: '500 g',
    stock: 130
  },
  {
    name: 'Spinach',
    description: 'Fresh green spinach leaves, rich in iron.',
    price: 30,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    unit: '250 g',
    stock: 100
  },

  // Dairy
  {
    name: 'Milk',
    description: 'Fresh pasteurized full-cream milk.',
    price: 60,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    unit: '1 litre',
    stock: 180
  },
  {
    name: 'Cheese',
    description: 'Creamy processed cheese slices, perfect for sandwiches.',
    price: 140,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d',
    unit: '200 g',
    stock: 90
  },
  {
    name: 'Yogurt',
    description: 'Thick and creamy plain yogurt, great for digestion.',
    price: 50,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1571212515416-fca988083b70',
    unit: '400 g',
    stock: 110
  },
  {
    name: 'Butter',
    description: 'Rich and creamy salted butter.',
    price: 55,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    unit: '100 g',
    stock: 95
  },

  // Bakery
  {
    name: 'Bread',
    description: 'Soft and fresh white sandwich bread.',
    price: 45,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    unit: '400 g loaf',
    stock: 100
  },
  {
    name: 'Croissant',
    description: 'Buttery and flaky French-style croissants.',
    price: 90,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    unit: 'pack of 2',
    stock: 60
  },
  {
    name: 'Muffins',
    description: 'Soft chocolate chip muffins, freshly baked.',
    price: 120,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa',
    unit: 'pack of 4',
    stock: 70
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: '100% natural orange juice, no added sugar.',
    price: 110,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423',
    unit: '1 litre',
    stock: 85
  },
  {
    name: 'Coffee',
    description: 'Rich and aromatic instant coffee powder.',
    price: 250,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
    unit: '200 g',
    stock: 75
  },
  {
    name: 'Green Tea',
    description: 'Refreshing green tea bags, rich in antioxidants.',
    price: 180,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5',
    unit: 'pack of 25',
    stock: 65
  },

  // Snacks
  {
    name: 'Potato Chips',
    description: 'Crispy and salted potato chips.',
    price: 30,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
    unit: '150 g',
    stock: 200
  },
  {
    name: 'Cookies',
    description: 'Crunchy chocolate chip cookies.',
    price: 80,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    unit: '300 g',
    stock: 140
  },
  {
    name: 'Mixed Nuts',
    description: 'A healthy mix of almonds, cashews, and raisins.',
    price: 320,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
    unit: '250 g',
    stock: 55
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products removed');

    // Insert new products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);

    console.log('Product seeding completed successfully');
  } catch (error) {
    console.error('Error seeding products:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedProducts();