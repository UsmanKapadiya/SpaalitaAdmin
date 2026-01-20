const createAddress = (orderId, name) => ({
  orderId,
  name,
  firstName:name,
  lastName:"sirName",
  address: "123 Demo Street",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "USA",
  email: "test@gmail.com",
  phone: "2502454578"
});

const mockOrders = [
  {
    id: 1,
    orderId: 1,
    customerName: "John Doe",
    items: [
      { productId: 101, name: "Shampoo", quantity: 2, price: 10, image: "https://via.placeholder.com/60x60?text=Shampoo" },
      { productId: 102, name: "Conditioner", quantity: 1, price: 12, image: "https://via.placeholder.com/60x60?text=Conditioner" },
    ],
    total: 32,
    status: "pending",
    createdAt: "2026-01-20T10:00:00Z",
    paymentOption: "Online Payment",
    billingAddress: createAddress(1, "John Doe"),
    shippingAddress: createAddress(1, "John Doe"),
    paymentUrl: "https://dummy-payment.com/order/1",
  },
  {
    id: 2,
    orderId: 2,
    customerName: "Jane Smith",
    items: [
      { productId: 103, name: "Facial Cream", quantity: 1, price: 25, image: "https://via.placeholder.com/60x60?text=Facial+Cream" },
    ],
    total: 25,
    status: "completed",
    createdAt: "2026-01-19T14:30:00Z",
    paymentOption: "Cash On Delivery",
    billingAddress: createAddress(2, "Jane Smith"),
    shippingAddress: createAddress(2, "Jane Smith"),
    paymentUrl: "https://dummy-payment.com/order/2",
  },
  {
    id: 3,
    orderId: 3,
    customerName: "Alice Brown",
    items: [
      { productId: 104, name: "Body Lotion", quantity: 3, price: 15, image: "https://via.placeholder.com/60x60?text=Body+Lotion" },
    ],
    total: 45,
    status: "pending",
    createdAt: "2026-01-18T09:15:00Z",
    paymentOption: "Online Payment",
    billingAddress: createAddress(3, "Alice Brown"),
    shippingAddress: createAddress(3, "Alice Brown"),
    paymentUrl: "https://dummy-payment.com/order/3",
  },
  {
    id: 4,
    orderId: 4,
    customerName: "Bob White",
    items: [
      { productId: 105, name: "Hair Oil", quantity: 1, price: 18, image: "https://via.placeholder.com/60x60?text=Hair+Oil" },
    ],
    total: 18,
    status: "Cancelled",
    createdAt: "2026-01-17T11:00:00Z",
    paymentOption: "Cash On Delivery",
    billingAddress: createAddress(4, "Bob White"),
    shippingAddress: createAddress(4, "Bob White"),
    paymentUrl: "https://dummy-payment.com/order/4",
  },
  {
    id: 5,
    orderId: 5,
    customerName: "Charlie Green",
    items: [
      { productId: 106, name: "Face Wash", quantity: 2, price: 14, image: "https://via.placeholder.com/60x60?text=Face+Wash" },
    ],
    total: 28,
    status: "completed",
    createdAt: "2026-01-16T16:45:00Z",
    paymentOption: "Online Payment",
    billingAddress: createAddress(5, "Charlie Green"),
    shippingAddress: createAddress(5, "Charlie Green"),
    paymentUrl: "https://dummy-payment.com/order/5",
  },

  // Orders 6–20 follow the SAME structure (already compatible)
  // Your existing address data for 6, 19, 20 can remain as-is
];

export default mockOrders;
