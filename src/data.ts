import { Salon, Professional, Review, Service } from './types';

export const HYDERABAD_LOCALITIES = [
  'All Localities',
  'Jubilee Hills',
  'Gachibowli',
  'Banjara Hills',
  'Kondapur',
  'Madhapur'
];

export const SALONS_DATA: Salon[] = [
  {
    id: 'salon-1',
    name: 'GlowSphere Premium Atelier',
    tagline: 'High-Tech AI Skin Analytics & Couture Hair Design',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    address: 'Road No. 36, Beside Metro Station, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 324,
    isLuxury: true,
    isTrending: true,
    averagePrice: 2500,
    latitude: 17.4325,
    longitude: 78.4072,
    features: ['AI Skin Analysis', 'Private VVIP Suites', 'Champagne Lounge', 'Valet Parking', 'Smart Mirrors'],
    services: [
      { id: 's1', name: 'AI Skin Tone Perfecting HydraFacial', category: 'treatments', price: 4500, duration: 60, description: 'Medical-grade custom facial based on AI skin analysis. deep exfoliation and peptide infusion.', popular: true },
      { id: 's2', name: 'Signature Precision Haircut & Styling', category: 'hair', price: 1800, duration: 45, description: 'Elite haircut tailored to your face shape by master stylist.', popular: true },
      { id: 's3', name: 'Balayage & Couture Hair Contouring', category: 'hair', price: 6500, duration: 150, description: 'Artisanal hand-painted highlights utilizing smart shade matching technology.' },
      { id: 's4', name: 'HD Airbrush Bridal Makeup Masterclass', category: 'bridal', price: 22000, duration: 180, description: 'Complete high-definition bridal transformation with trial.', popular: true },
      { id: 's5', name: 'Therapeutic Hot Stone Spa Ritual', category: 'spa', price: 3500, duration: 90, description: 'Balinese massage using heated volcanic basalt stones.' }
    ]
  },
  {
    id: 'salon-2',
    name: 'The Obsidian Couture Lounge',
    tagline: 'Avant-Garde Men & Women Styling Sanctuary',
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    address: 'Road No. 2, Near KBR Park, Banjara Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 198,
    isLuxury: true,
    isTrending: false,
    averagePrice: 1900,
    latitude: 17.4208,
    longitude: 78.4322,
    features: ['Espresso Bar', 'Soundproof Grooming Pods', 'Personal iPads', 'Dyson Airwrap Station'],
    services: [
      { id: 's6', name: 'Couture Blowout & Luxury Hair Mask', category: 'hair', price: 1500, duration: 45, description: 'Voluminous blowout accompanied by Kerastase Chronologiste caviar hair treatment.', popular: true },
      { id: 's7', name: 'Luxe Charcoal Detox Facial & Scalp Therapy', category: 'treatments', price: 2800, duration: 60, description: 'Double charcoal extract formula targeting deep pores and dry scalp relief.' },
      { id: 's8', name: 'Bespoke Grooming & Beard Sculpting', category: 'hair', price: 1200, duration: 40, description: 'Luxury wet shave, hot towel treatment, and beard oil sculpting.', popular: true },
      { id: 's9', name: 'Chrome French Gel Manicure', category: 'nails', price: 1800, duration: 50, description: 'Minimalistic French tips with a premium metallic chrome finish.' }
    ]
  },
  {
    id: 'salon-3',
    name: 'Estoria Tech Beauty Lab',
    tagline: 'Data-Driven Hair Therapies & Advanced Aesthetic Skincare',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Financial District, Near ICICI Towers, Gachibowli, Hyderabad',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 152,
    isLuxury: false,
    isTrending: true,
    averagePrice: 1200,
    latitude: 17.4139,
    longitude: 78.3411,
    features: ['Digital Hairstyle Simulation', 'Contactless Self Check-in', 'Ergonomic Lay-flat Sinks'],
    services: [
      { id: 's10', name: 'Olplex bond-multiplier Hair Therapy', category: 'hair', price: 2800, duration: 75, description: 'Three-step professional deep bonding restructuring therapy.', popular: true },
      { id: 's11', name: 'AI-Recommended Botanical Glow Facial', category: 'skin', price: 2200, duration: 60, description: 'Infusion of tea tree, marigold, and Vitamin C matching oily skin characteristics.' },
      { id: 's12', name: 'Acrylic Nail Extensions & Holographic Art', category: 'nails', price: 2500, duration: 90, description: 'Full set durableExtensions with mesmerizing iridescent holographic foil overlay.', popular: true }
    ]
  },
  {
    id: 'salon-4',
    name: 'Aura Organic Wellness Spa',
    tagline: 'Holistic Beauty, Vedic Therapies & Clean Cosmetics',
    city: 'Hyderabad',
    locality: 'Kondapur',
    address: 'Main Road, Opposite Botanical Garden, Kondapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 410,
    isLuxury: false,
    isTrending: true,
    averagePrice: 1500,
    latitude: 17.4619,
    longitude: 78.3688,
    features: ['100% Vegan Products', 'Steam Chambers', 'Aromatherapy Oxygen Bar', 'Outdoor Zen Garden'],
    services: [
      { id: 's13', name: 'Kumkumadi Ayurvedic Facial Ritual', category: 'skin', price: 2400, duration: 70, description: 'Saffron oil based facial that brightens skin and reverses pigmentation organically.', popular: true },
      { id: 's14', name: 'Deep Tissue Swedish Muscle Melt', category: 'spa', price: 2900, duration: 60, description: 'Traditional Swedish therapy utilizing cold-pressed sesame and lavender oils.', popular: true },
      { id: 's15', name: 'Organic Aloe & Mint Cooling Body Wrap', category: 'spa', price: 3200, duration: 80, description: 'Hydrating body detox wrap using fresh organic mint leaves and pure aloe gel.' }
    ]
  },
  {
    id: 'salon-5',
    name: 'Mirrors Luxury Suite',
    tagline: 'Where South Indian Royalty meets Contemporary Elegance',
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Hitech City Road, Kavuri Hills, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 285,
    isLuxury: true,
    isTrending: true,
    averagePrice: 3200,
    latitude: 17.4435,
    longitude: 78.3974,
    features: ['Celebrity Stylists', 'Bridal Jewelry Trial Room', 'Private Photoshoot Wall', 'Smart Dimmable Lighting'],
    services: [
      { id: 's16', name: 'Royal Nizam Bridal Makeover Package', category: 'bridal', price: 35000, duration: 240, description: 'Ultra-luxurious transformation with jewelry draping, professional photography portrait, and silk drape.', popular: true },
      { id: 's17', name: 'Premium Keratin Silkening Treatment', category: 'treatments', price: 7500, duration: 120, description: 'Formaldehyde-free luxury botanical keratin smoothing formula for frizz-free locks.' },
      { id: 's18', name: 'Exotic Charcoal Pedicure & Foot Spa', category: 'nails', price: 1800, duration: 55, description: 'Aromatic therapeutic bath, scrub, clay mask, and hot-stone foot massage.' }
    ]
  },
  {
    id: 'salon-6',
    name: 'Toni & Guy Flagship Atelier',
    tagline: 'Avant-Garde Hair Collections & Custom Colouring Studio',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    address: 'Road No. 36, Near Peddamma Temple Metro, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 512,
    isLuxury: true,
    isTrending: true,
    averagePrice: 2800,
    latitude: 17.4350,
    longitude: 78.4010,
    features: ['Master Colour Technicians', 'Premium Kerastase Rituals', 'Complimentary Hot Beverages', 'Valet Parking'],
    services: [
      { id: 's19', name: 'Global Fashion Colouring & Toner', category: 'hair', price: 5800, duration: 120, description: 'Custom full head high-fashion shade contouring with premium colorplex protection.', popular: true },
      { id: 's20', name: 'Designer Hair Transformation & Wash', category: 'hair', price: 2200, duration: 60, description: 'Full hair restyle consultation, professional wash, cut, and thermal styling.', popular: true },
      { id: 's21', name: 'Olaplex Reconstructing Spa Ritual', category: 'spa', price: 3200, duration: 75, description: 'Ultimate multi-step active bond-multiplying system for highly damaged hair.' }
    ]
  },
  {
    id: 'salon-7',
    name: 'Page 3 Luxury Salon & Studio',
    tagline: 'High-Fashion Makeovers, Editorial Styling & Glow Facials',
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    address: 'Road No. 12, Opposite Fortune Park Vallabha, Banjara Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 367,
    isLuxury: true,
    isTrending: true,
    averagePrice: 2200,
    latitude: 17.4180,
    longitude: 78.4290,
    features: ['VVIP Private Styling Lounges', 'Celebrity Makeup Artistry', 'Premium O.P.I Nail Bar', 'Dyson Powered'],
    services: [
      { id: 's22', name: 'Page 3 Radiance Glow Facelifting Therapy', category: 'skin', price: 4200, duration: 80, description: 'Deep muscle lymphatic drainage facial with bio-active skin plumping serum.', popular: true },
      { id: 's23', name: 'Red Carpet HD Airbrush Makeup Session', category: 'bridal', price: 15000, duration: 120, description: 'Luxury heavy HD makeovers ideal for galas, red carpet, and formal occasions.', popular: true },
      { id: 's24', name: 'Gel Extensions & Custom Nail Artistry', category: 'nails', price: 2800, duration: 75, description: 'Prismatic chrome nail extensions with premium hand-drawn luxury designs.' }
    ]
  },
  {
    id: 'salon-8',
    name: 'Bodycraft Salon, Spa & Clinic',
    tagline: 'Advanced Medi-facials, Laser Therapies & Luxury Spa Journeys',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    address: 'Road No. 10, Near Venkatagiri, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 244,
    isLuxury: false,
    isTrending: false,
    averagePrice: 1600,
    latitude: 17.4285,
    longitude: 78.4150,
    features: ['Dermatological Doctors On-Site', 'Premium Ayurvedic Therapies', 'Allergy-tested Products'],
    services: [
      { id: 's25', name: 'Insta-Glow Microdermabrasion Facial', category: 'skin', price: 3500, duration: 50, description: 'Professional micro-crystals extraction with skin brightening hydration serums.', popular: true },
      { id: 's26', name: 'Anti-Stress Swedish Deep Tissue Massage', category: 'spa', price: 2700, duration: 60, description: 'Classical full-body massage using lavender oils targeting deep muscular fatigue.' }
    ]
  },
  {
    id: 'salon-9',
    name: 'Lucas Salon & Bridal Academy',
    tagline: 'State-of-the-Art Hair Solutions & Master Bridal Transformations',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Beside DLF Cyber City Main Gate, Gachibowli, Hyderabad',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 189,
    isLuxury: false,
    isTrending: true,
    averagePrice: 1400,
    latitude: 17.4380,
    longitude: 78.3510,
    features: ['Cyber-City Corporate Discounts', 'Dyson Airwrap Styling Stations', 'Bridal Dress Rehearsal Area'],
    services: [
      { id: 's27', name: 'Lucas Ultra-Gloss Keratin Spa', category: 'hair', price: 4800, duration: 90, description: 'Intense micro-keratin hydration for silk smooth shine and flyaway correction.', popular: true },
      { id: 's28', name: 'Cyber-Detox Skin Purifying treatment', category: 'skin', price: 1800, duration: 45, description: 'Deep blue clay charcoal formula targeting city pollution and oil control.' }
    ]
  },
  {
    id: 'salon-10',
    name: 'Juice Salon & Nail Bar',
    tagline: 'Trendy Hair Cut Color, Organic Mani-Pedis & Gel Nails',
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Opposite Mindspace IT Park, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 215,
    isLuxury: false,
    isTrending: true,
    averagePrice: 1100,
    latitude: 17.4520,
    longitude: 78.3850,
    features: ['Dedicated Gel Nail Bar', 'Lay-Flat Luxury Sinks', 'Complimentary Cold Brews'],
    services: [
      { id: 's29', name: 'Juice Signature Gel Polish manicure', category: 'nails', price: 1200, duration: 45, description: 'Premium durable gel colors dried with high-end UV lamps. lasts up to 4 weeks.', popular: true },
      { id: 's30', name: 'Boho Sun-kissed Balayage Highlights', category: 'hair', price: 5500, duration: 130, description: 'Chic hand-painted caramel highlights tailored for warm Indian skin tones.' }
    ]
  }
];

export const PROFESSIONALS_DATA: Professional[] = [
  {
    id: 'prof-1',
    name: 'Ananya Roy',
    salonId: 'salon-1',
    salonName: 'GlowSphere Premium Atelier',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.95,
    specialization: 'High-Tech Skin Aesthetics & HydraFacials',
    experienceYears: 8,
    availability: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
    isFeatured: true
  },
  {
    id: 'prof-2',
    name: 'Vikram Mehta',
    salonId: 'salon-1',
    salonName: 'GlowSphere Premium Atelier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    specialization: 'Precision Haircuts & Contouring',
    experienceYears: 12,
    availability: ['11:00 AM', '1:00 PM', '3:30 PM', '6:00 PM'],
    isFeatured: true
  },
  {
    id: 'prof-3',
    name: 'Kavitha Reddy',
    salonId: 'salon-5',
    salonName: 'Mirrors Luxury Suite',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 4.97,
    specialization: 'HD Airbrush Bridal Makeup & Styling',
    experienceYears: 14,
    availability: ['10:00 AM', '2:00 PM', '5:00 PM'],
    isFeatured: true
  },
  {
    id: 'prof-4',
    name: 'Rahul Sen',
    salonId: 'salon-2',
    salonName: 'The Obsidian Couture Lounge',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.85,
    specialization: 'Bespoke Beard Sculpting & Wet Shaves',
    experienceYears: 6,
    availability: ['12:00 PM', '2:30 PM', '4:00 PM', '7:30 PM']
  },
  {
    id: 'prof-5',
    name: 'Priyanka Das',
    salonId: 'salon-4',
    salonName: 'Aura Organic Wellness Spa',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 4.92,
    specialization: 'Ayurvedic Healing & Deep Tissue Spa',
    experienceYears: 9,
    availability: ['10:30 AM', '1:30 PM', '4:00 PM', '6:30 PM']
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    salonId: 'salon-1',
    customerName: 'Shalini Rao',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'The HydraFacial here is an absolute game changer! The AI skin analysis recommended specific ingredients and the outcome is incredibly glowing skin. Best luxury salon in Jubilee Hills!',
    date: 'June 18, 2026',
    serviceName: 'AI Skin Tone Perfecting HydraFacial',
    aiSummarized: true
  },
  {
    id: 'rev-2',
    salonId: 'salon-1',
    customerName: 'Arjun K.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Highly professional master cutting. Vikram is extremely precise. Worth every rupee for the amazing treatment and environment.',
    date: 'June 12, 2026',
    serviceName: 'Signature Precision Haircut & Styling'
  },
  {
    id: 'rev-3',
    salonId: 'salon-5',
    customerName: 'Meghana Naidu',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Kavitha did my bridal makeup and it was magical! I felt like royalty. The Nizam package is perfect. She completely captured my style with high precision. Best in Hyderabad.',
    date: 'May 29, 2026',
    serviceName: 'Royal Nizam Bridal Makeover Package',
    aiSummarized: true
  }
];

export const INVESTOR_METRICS = [
  { value: '₹42 Cr+', label: 'Gross Booking Volume (GMV)' },
  { value: '1.2M+', label: 'Appointments Booked' },
  { value: '450+', label: 'Curated Luxury Salons' },
  { value: '4.85/5', label: 'Average Customer Rating' }
];

export const PARTNERS_LOGOS = [
  { name: 'L’Oréal Professionnel', logo: 'L’ORÉAL' },
  { name: 'Kérastase Paris', logo: 'KÉRASTASE' },
  { name: 'O.P.I', logo: 'O·P·I' },
  { name: 'Dyson Beauty', logo: 'dyson' },
  { name: 'Estée Lauder', logo: 'ESTĒE LAUDER' }
];

export const FAQ_DATA = [
  {
    q: 'How does the GlowSphere AI Beauty Recommendation work?',
    a: 'Our AI model analyzes your facial contours, skin tone, and hair texture from an uploaded photo or video stream. It then provides personalized hairstyle ideas, color coordinates, and specific salon/stylist matching optimized for your unique anatomy.'
  },
  {
    q: 'Can I book a salon appointment for home service?',
    a: 'Yes! GlowSphere partners with premium home service stylists. Look for the "Home Salon Booking" option in our search filters or when checking out.'
  },
  {
    q: 'What is the GlowSphere AI Wallet and Subscriptions?',
    a: 'Our premium Wallet allows you to earn instant cashback (Glow Points), purchase gift cards, and unlock flat 15% discounts across all high-end salons in Hyderabad with a GlowSphere Gold Membership.'
  },
  {
    q: 'What is the cancellation and refund policy?',
    a: 'We offer a 100% full refund on cancellations made up to 2 hours before the scheduled slot, protected by our "Cancellation Shield" insurance.'
  }
];
