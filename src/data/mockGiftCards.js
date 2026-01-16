// mockGiftCards.js
// Dummy/mock gift card data for GiftCardForm and gift card listing

const mockGiftCards = [
  {
    id: 'gift-1',
    name: 'Welcome Gift Card',
    code: 'WELCOME100',
    value: 100,
    qty: 20,
    description: '<p>Use this card for a <strong>special</strong> welcome offer!</p>',
    image: '',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-10',
  },
  {
    id: 'gift-2',
    name: 'Holiday Gift Card',
    code: 'HOLIDAY50',
    value: 50,
    qty: 10,
    description: '<p>Enjoy the <em>holidays</em> with this card!</p>',
    image: '',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-12',
  },
];

export default mockGiftCards;
