/**
 * VLOOP Phase 13 — Commerce Flow Mock Data
 * Mock/demo data only. No backend, no payment integration.
 */

export type MockProduct = {
  id: string;
  name: string;
  merchant: string;
  merchantId: string;
  image: string;
  unitPrice: number;
  mrp: number;
  stock: number;
  category: string;
  rating: number;
  comboEligible: boolean;
};

export type MockAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
};

export type MockDeliveryOption = {
  id: string;
  label: string;
  desc: string;
  etaDays: number;
  price: number;
  icon: string;
};

export type MockPaymentOption = {
  id: 'wallet' | 'upi' | 'card' | 'netbanking' | 'cod';
  label: string;
  desc: string;
  icon: string;
  available: boolean;
  badge?: string;
};

export type MockOrderItem = {
  productId: string;
  name: string;
  merchant: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

export type MockOrder = {
  id: string;
  items: MockOrderItem[];
  subtotal: number;
  comboSavings: number;
  deliveryFee: number;
  tax: number;
  total: number;
  smartPoints: number;
  paymentMethod: string;
  address: MockAddress;
  deliveryOption: MockDeliveryOption;
  placedAt: string;
  estimatedDelivery: string;
  status: MockOrderStatus;
};

export type MockOrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export const mockProducts: MockProduct[] = [
  {
    id: 'p1',
    name: 'Organic Basmati Rice 5kg',
    merchant: 'VLOOP Mart',
    merchantId: 'm1',
    image: 'https://images.pexels.com/photos/7428095/pexels-photo-7428095.jpeg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 649,
    mrp: 899,
    stock: 42,
    category: 'Groceries',
    rating: 4.6,
    comboEligible: true,
  },
  {
    id: 'p2',
    name: 'Cold Pressed Sunflower Oil 1L',
    merchant: 'VLOOP Mart',
    merchantId: 'm1',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 289,
    mrp: 399,
    stock: 60,
    category: 'Groceries',
    rating: 4.4,
    comboEligible: true,
  },
  {
    id: 'p3',
    name: 'Premium Tiffin Set (3 Containers)',
    merchant: 'Home Comforts',
    merchantId: 'm2',
    image: 'https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 549,
    mrp: 799,
    stock: 18,
    category: 'Household',
    rating: 4.7,
    comboEligible: false,
  },
  {
    id: 'p4',
    name: 'Herbal Face Wash 200ml',
    merchant: 'Glow Essentials',
    merchantId: 'm3',
    image: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 199,
    mrp: 299,
    stock: 0,
    category: 'Personal Care',
    rating: 4.3,
    comboEligible: true,
  },
  {
    id: 'p5',
    name: 'Stainless Steel Water Bottle 1L',
    merchant: 'Home Comforts',
    merchantId: 'm2',
    image: 'https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 349,
    mrp: 499,
    stock: 7,
    category: 'Household',
    rating: 4.5,
    comboEligible: true,
  },
  {
    id: 'p6',
    name: 'Wireless Earbuds Pro',
    merchant: 'TechNova',
    merchantId: 'm4',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600',
    unitPrice: 1899,
    mrp: 2999,
    stock: 25,
    category: 'Electronics',
    rating: 4.8,
    comboEligible: false,
  },
];

export const mockAddresses: MockAddress[] = [
  {
    id: 'a1',
    label: 'Home',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    line1: 'Flat 402, Green Residency',
    line2: 'MG Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Work',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    line1: 'Tower B, 7th Floor',
    line2: 'Tech Park, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    type: 'Work',
    isDefault: false,
  },
];

export const mockDeliveryOptions: MockDeliveryOption[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    desc: 'Delivered in 4-6 business days',
    etaDays: 5,
    price: 0,
    icon: 'Truck',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    desc: 'Delivered in 2 business days',
    etaDays: 2,
    price: 79,
    icon: 'Zap',
  },
  {
    id: 'sameday',
    label: 'Same-Day Delivery',
    desc: 'Order before 12 PM for same-day',
    etaDays: 1,
    price: 149,
    icon: 'Rocket',
  },
];

export const mockPaymentOptions: MockPaymentOption[] = [
  {
    id: 'wallet',
    label: 'VLOOP Wallet',
    desc: 'Balance: ₹2,450 · Pay instantly',
    icon: 'Wallet',
    available: true,
    badge: 'Recommended',
  },
  {
    id: 'upi',
    label: 'UPI',
    desc: 'GPay, PhonePe, Paytm & more',
    icon: 'Smartphone',
    available: true,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, RuPay',
    icon: 'CreditCard',
    available: true,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    desc: 'All major banks supported',
    icon: 'Building2',
    available: true,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    desc: 'Pay when your order arrives',
    icon: 'Banknote',
    available: false,
    badge: 'Coming Soon',
  },
];

export const mockOrderStatusSteps: { key: MockOrderStatus; label: string; icon: string }[] = [
  { key: 'placed', label: 'Order Placed', icon: 'ShoppingBag' },
  { key: 'confirmed', label: 'Confirmed', icon: 'CheckCircle2' },
  { key: 'packed', label: 'Packed', icon: 'Package' },
  { key: 'shipped', label: 'Shipped', icon: 'Truck' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'Bike' },
  { key: 'delivered', label: 'Delivered', icon: 'Home' },
];

export const mockMerchantDetails: Record<string, { name: string; gstin: string; address: string; phone: string }> = {
  m1: { name: 'VLOOP Mart', gstin: '29ABCDE1234F1Z5', address: 'Warehouse 4, Bommasandra Industrial Area, Bengaluru 560099', phone: '+91 80 4567 8900' },
  m2: { name: 'Home Comforts', gstin: '29XYZAB5678G2H6', address: 'Plot 22, Peenya Industrial Zone, Bengaluru 560058', phone: '+91 80 6789 1200' },
  m3: { name: 'Glow Essentials', gstin: '29PQRST9012K3L7', address: 'Unit 8, Electronic City Phase 2, Bengaluru 560100', phone: '+91 80 7890 3400' },
  m4: { name: 'TechNova', gstin: '29LMNOP3456M4N8', address: 'Tower C, Manyata Tech Park, Bengaluru 560045', phone: '+91 80 8901 5600' },
};

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `VLP-${ts}${rand}`;
}

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function calcComboSavings(items: MockOrderItem[]): number {
  const comboItems = items.filter((i) => {
    const p = mockProducts.find((pp) => pp.id === i.productId);
    return p?.comboEligible;
  });
  if (comboItems.length < 2) return 0;
  const comboTotal = comboItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return Math.floor(comboTotal * 0.08);
}

export function calcTax(subtotal: number): number {
  return Math.floor(subtotal * 0.05);
}

export function calcSmartPoints(amount: number): number {
  return Math.floor(amount / 40);
}

export function estimatedDeliveryDate(etaDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + etaDays);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
