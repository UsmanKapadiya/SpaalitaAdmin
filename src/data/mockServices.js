// mockServices.js
// Dummy/mock service data for ServicesForm and service listing

const mockServices = [
  {
    id: 'svc-1',
    name: 'Facials',
    code: 'FACIALS',
    value: 120,
    qty: 15,
    description: '<p>Relaxing <strong>facial</strong> treatment for glowing skin.</p>',
    image: '',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-10',
  },
  {
    id: 'svc-2',
    name: 'Massages',
    code: 'MASSAGES',
    value: 200,
    qty: 8,
    description: '<p>Therapeutic <em>massage</em> for stress relief.</p>',
    image: '',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-12',
  },
];

export default mockServices;
