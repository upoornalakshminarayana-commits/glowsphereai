export type UserRole = 'customer' | 'owner' | 'admin' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  city?: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'bridal' | 'spa' | 'nails' | 'treatments';
  price: number;
  duration: number; // in minutes
  description: string;
  popular?: boolean;
}

export interface Salon {
  id: string;
  name: string;
  tagline: string;
  city: string;
  locality: string; // e.g. Jubilee Hills, Gachibowli, Banjara Hills, Kondapur, Madhapur
  address: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isLuxury: boolean;
  isTrending: boolean;
  averagePrice: number;
  services: Service[];
  latitude: number;
  longitude: number;
  features: string[]; // e.g., ["Valet Parking", "AI Consultation", "Champagne Bar", "Private Rooms"]
}

export interface Professional {
  id: string;
  name: string;
  salonId: string;
  salonName: string;
  avatar: string;
  rating: number;
  specialization: string;
  experienceYears: number;
  availability: string[]; // e.g. ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"]
  isFeatured?: boolean;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  salonImage: string;
  locality: string;
  serviceId: string;
  serviceName: string;
  price: number;
  professionalId?: string;
  professionalName?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  isHomeService: boolean;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  couponCode?: string;
}

export interface Review {
  id: string;
  salonId: string;
  customerName: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  serviceName: string;
  aiSummarized?: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface FaceAnalysis {
  faceShape: string;
  skinTone: string;
  skinToneHex: string;
  hairType: string;
  recommendedHairstyles: string[];
  recommendedSkincare: string[];
  suitableColors: string[];
}
