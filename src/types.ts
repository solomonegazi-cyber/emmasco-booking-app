/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  category: 'haushalt' | 'reinigung' | 'begleitung' | 'zusatz';
  description: string;
  detailedDescription?: string;
  price: string;
  priceValue: number; // numeric value for calculations
  iconName: string; // Key in Lucide Icons
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'offline_queued';
  notes: string;
  totalPrice: number;
  createdAt: string;
  cleanerName?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: 'Cleaning Tips' | 'Health' | 'Lifestyle';
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface UserDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'admin';
  timestamp: string;
}
