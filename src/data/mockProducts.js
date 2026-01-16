// mockProducts.js
// Dummy/mock product data for ProductForm and product listing

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Sample Product 1',
    sku: 'SKU001',
    price: 19.99,
    qty: 10,
    description: '<p>This is a <strong>sample</strong> product description.</p>',
    images: [],
    imagePreviews: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-10',
  },
  {
    id: 'prod-2',
    name: 'Sample Product 2',
    sku: 'SKU002',
    price: 29.99,
    qty: 5,
    description: '<p>Another <em>sample</em> product description.</p>',
    images: [],
    imagePreviews: [],
    createdAt: '2026-01-05',
    updatedAt: '2026-01-12',
  },
];

export default mockProducts;
