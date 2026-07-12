import { useState } from 'react';
import {
  Star, MapPin, Phone, Mail, Clock, ShieldCheck, Package,
  TrendingUp, Users, Award, Heart, Share2, MessageCircle,
  ChevronRight, ExternalLink, Building2, Home, Globe,
  Calendar, ThumbsUp, Camera, Verified, BadgeCheck, Store
} from 'lucide-react';

interface SellerStorePageProps {
  onNavigate: (page: string) => void;
  onProductView: (productId: string) => void;
}

export default function SellerStorePage({ onNavigate, onProductView }: SellerStorePageProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews' | 'contact'>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock seller data
  const seller = {
    id: 'store-1',
    name: 'Fresh Farm Store',
    slug: 'fresh-farm-store',
    description: 'We bring you the freshest organic produce straight from local farms to your doorstep. Our commitment to quality ensures every product meets the highest standards.',
    banner: 'https://images.unsplash.com/photo-1542838132-2589913145b6?w=1200',
    logo: 'https://images.unsplash.com/photo-1488459716781-31dba5a5a769?w=200',
    rating: 4.8,
    reviewCount: 1250,
    totalProducts: 48,
    totalSales: 15420,
    totalOrders: 3200,
    address: '123 Main Street, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    phone: '+91-9876543210',
    email: 'store@freshfarm.com',
    isVerified: true,
    isWomenEntrepreneur: true,
    isHomeSeller: false,
    isVillageStore: false,
    joinedDate: '2023-01-15',
    businessHours: {
      weekdays: '09:00 AM - 09:00 PM',
      saturday: '10:00 AM - 08:00 PM',
      sunday: 'Closed'
    },
    categories: ['Grocery', 'Fruits', 'Vegetables', 'Dairy'],
    badges: ['Top Seller 2024', 'Customer Favorite', 'Quality Assured']
  };

  // Mock products
  const products = [
    { id: 'p1', name: 'Organic Tomatoes', price: 120, image: 'https://images.unsplash.com/photo-1546470427-13d47e3b0abd?w=300', rating: 4.9, reviews: 342 },
    { id: 'p2', name: 'Fresh Spinach Bundle', price: 45, image: 'https://images.unsplash.com/photo-1576045056765-d29da8f1d3b7?w=300', rating: 4.7, reviews: 189 },
    { id: 'p3', name: 'Organic Carrots', price: 80, image: 'https://images.unsplash.com/photo-1598170845058-08510b371d1c?w=300', rating: 4.8, reviews: 256 },
    { id: 'p4', name: 'Farm Fresh Eggs (12pc)', price: 150, image: 'https://images.unsplash.com/photo-1582722898537-76f61969161d?w=300', rating: 4.9, reviews: 478 },
    { id: 'p5', name: 'Organic Potatoes', price: 60, image: 'https://images.unsplash.com/photo-1518977676601-b53f82c2b6b0?w=300', rating: 4.6, reviews: 167 },
    { id: 'p6', name: 'Fresh Milk (1L)', price: 55, image: 'https://images.unsplash.com/photo-1550583724-b2612abe45a9?w=300', rating: 4.8, reviews: 523 },
  ];

  // Mock reviews
  const reviews = [
    {
      id: 'r1',
      customer: 'Priya Sharma',
      rating: 5,
      text: 'Amazing quality produce! Everything was fresh and delivered on time. Will definitely order again.',
      date: '2 days ago',
      verified: true
    },
    {
      id: 'r2',
      customer: 'Rahul Mehta',
      rating: 5,
      text: 'Best grocery store in the area. Their organic vegetables are top-notch.',
      date: '1 week ago',
      verified: true
    },
    {
      id: 'r3',
      customer: 'Anjali Patel',
      rating: 4,
      text: 'Good quality and reasonable prices. Packaging could be improved but overall satisfied.',
      date: '2 weeks ago',
      verified: true
    },
  ];

  const tabs = [
    { key: 'products', label: 'Products', icon: Package, count: seller.totalProducts },
    { key: 'about', label: 'About', icon: Building2 },
    { key: 'reviews', label: 'Reviews', icon: Star, count: seller.reviewCount },
    { key: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Store Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-emerald-600 to-teal-600">
        <img
          src={seller.banner}
          alt={seller.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Store Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={seller.logo}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {seller.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
                  <Verified className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="flex-1 pt-4 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{seller.name}</h1>
                    {seller.isVerified && (
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Seller
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {seller.city}, {seller.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      {seller.rating} ({seller.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {seller.isWomenEntrepreneur && (
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-medium flex items-center gap-1">
                <Users className="w-3 h-3" /> Women Entrepreneur
              </span>
            )}
            {seller.isHomeSeller && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center gap-1">
                <Home className="w-3 h-3" /> Home Seller
              </span>
            )}
            {seller.badges.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-medium flex items-center gap-1">
                <Award className="w-3 h-3" /> {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-blue-600">{seller.totalProducts}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-emerald-600">{seller.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-amber-600">{seller.rating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-card">
            <p className="text-2xl font-bold text-violet-600">{seller.totalSales.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Sales</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count && (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'products' && (
            <div>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
                  All
                </button>
                {seller.categories.map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => onProductView(product.id)}
                    className="bg-white rounded-xl shadow-card hover:shadow-xl transition-shadow overflow-hidden text-left"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        {product.rating} ({product.reviews})
                      </div>
                      <p className="font-bold text-blue-600">₹{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <h2 className="font-bold text-gray-900 mb-4">About {seller.name}</h2>
                <p className="text-gray-600 mb-6">{seller.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">January 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{seller.city}, {seller.state}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Business Hours
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">{seller.businessHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">{seller.businessHours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">{seller.businessHours.sunday}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['GST Registered', 'FSSAI Certified', 'Organic Certified'].map((cert) => (
                    <span key={cert} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl">
              {/* Rating Summary */}
              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900 mb-1">{seller.rating}</p>
                    <div className="flex items-center gap-1 justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Math.round(seller.rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{seller.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500 w-4">{rating}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-5 shadow-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {review.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.customer}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            {review.verified && (
                              <span className="text-xs text-emerald-500 flex items-center gap-1">
                                <Verified className="w-3 h-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.text}</p>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                        <ThumbsUp className="w-3 h-3" /> Helpful (12)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <h2 className="font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{seller.address}, {seller.city} - {seller.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{seller.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{seller.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-gray-900 mb-4">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="Enter subject"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                      placeholder="Write your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
