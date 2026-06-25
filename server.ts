import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SALONS_DATA, PROFESSIONALS_DATA, REVIEWS_DATA } from './src/data';
import { Booking, WalletTransaction } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON parsing with a higher limit for base64 image uploads
app.use(express.json({ limit: '10mb' }));

// Initialise Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn('GEMINI_API_KEY is not defined. AI features will fallback to premium mock responses.');
}

// In-memory Database state
let bookingsState: Booking[] = [
  {
    id: 'b-1',
    salonId: 'salon-1',
    salonName: 'GlowSphere Premium Atelier',
    salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    locality: 'Jubilee Hills',
    serviceId: 's1',
    serviceName: 'AI Skin Tone Perfecting HydraFacial',
    price: 4500,
    professionalId: 'prof-1',
    professionalName: 'Ananya Roy',
    date: '2026-06-28',
    time: '11:30 AM',
    status: 'upcoming',
    customerName: 'Upoorna Lakshmi',
    customerEmail: 'upoorna@example.com',
    isHomeService: false,
    paymentStatus: 'paid',
    couponCode: 'GLOWAI20'
  }
];

let walletState: { balance: number; transactions: WalletTransaction[] } = {
  balance: 1850,
  transactions: [
    { id: 'wt-1', amount: 500, type: 'credit', description: 'Gold Signup Bonus', date: 'June 24, 2026' },
    { id: 'wt-2', amount: 1350, type: 'credit', description: 'Added via Razorpay', date: 'June 24, 2026' }
  ]
};

let reviewsState = [...REVIEWS_DATA];

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// 1. Get all salons with simple filter capabilities
app.get('/api/salons', (req, res) => {
  const { locality, category, search } = req.query;
  let filtered = [...SALONS_DATA];

  if (locality && locality !== 'All Localities') {
    filtered = filtered.filter(s => s.locality.toLowerCase() === (locality as string).toLowerCase());
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.services.some(svc => svc.category === category));
  }

  if (search) {
    const term = (search as string).toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.locality.toLowerCase().includes(term) ||
      s.tagline.toLowerCase().includes(term) ||
      s.services.some(svc => svc.name.toLowerCase().includes(term))
    );
  }

  res.json(filtered);
});

// 2. Get single salon details
app.get('/api/salons/:id', (req, res) => {
  const salon = SALONS_DATA.find(s => s.id === req.params.id);
  if (!salon) {
    return res.status(404).json({ error: 'Salon not found' });
  }
  const reviews = reviewsState.filter(r => r.salonId === req.params.id);
  const professionals = PROFESSIONALS_DATA.filter(p => p.salonId === req.params.id);
  res.json({ ...salon, reviews, professionals });
});

// 2b. Submit a salon review
app.post('/api/salons/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { customerName, rating, text, serviceName } = req.body;
  
  if (!customerName || !rating || !text) {
    return res.status(400).json({ error: 'Name, rating, and feedback text are required' });
  }

  const salon = SALONS_DATA.find(s => s.id === id);
  if (!salon) {
    return res.status(404).json({ error: 'Salon not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    salonId: id,
    customerName,
    rating: Number(rating),
    text,
    serviceName: serviceName || 'General Service',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  reviewsState.unshift(newReview);

  // Recalculate average rating and review count for this salon in memory
  const salonReviews = reviewsState.filter(r => r.salonId === id);
  const avgRating = salonReviews.reduce((sum, r) => sum + r.rating, 0) / salonReviews.length;
  salon.rating = parseFloat(avgRating.toFixed(1));
  salon.reviewsCount = salonReviews.length;

  res.status(201).json(newReview);
});

// 3. Get featured professionals
app.get('/api/professionals', (req, res) => {
  res.json(PROFESSIONALS_DATA);
});

// 4. Create and manage bookings
app.get('/api/bookings', (req, res) => {
  const { email } = req.query;
  if (email) {
    const userBookings = bookingsState.filter(b => b.customerEmail.toLowerCase() === (email as string).toLowerCase());
    return res.json(userBookings);
  }
  res.json(bookingsState);
});

app.post('/api/bookings', (req, res) => {
  const { salonId, serviceId, serviceIds, professionalId, date, time, customerName, customerEmail, isHomeService, couponCode } = req.body;
  
  const salon = SALONS_DATA.find(s => s.id === salonId);
  if (!salon) return res.status(404).json({ error: 'Salon not found' });

  const ids = Array.isArray(serviceIds) ? serviceIds : [serviceId];
  const selectedServices = salon.services.filter(s => ids.includes(s.id));
  
  if (selectedServices.length === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  let professionalName = 'Any Professional';
  if (professionalId) {
    const prof = PROFESSIONALS_DATA.find(p => p.id === professionalId);
    if (prof) professionalName = prof.name;
  }

  const createdBookings = [];

  for (const service of selectedServices) {
    let finalPrice = service.price;
    if (couponCode === 'GLOWAI20') {
      finalPrice = Math.round(service.price * 0.8); // 20% discount
    }

    const newBooking = {
      id: `b-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      salonId,
      salonName: salon.name,
      salonImage: salon.image,
      locality: salon.locality,
      serviceId: service.id,
      serviceName: service.name,
      price: finalPrice,
      professionalId,
      professionalName,
      date,
      time,
      status: 'upcoming' as const,
      customerName: customerName || 'Valued Guest',
      customerEmail: customerEmail || 'upoorna@example.com',
      isHomeService: !!isHomeService,
      paymentStatus: 'paid' as const,
      couponCode
    };

    bookingsState.unshift(newBooking);

    // Deduct from wallet if user chooses wallet payment (for simple flow, we assume auto wallet debit)
    walletState.transactions.unshift({
      id: `wt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: finalPrice,
      type: 'debit',
      description: `Booked ${service.name} @ ${salon.name}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    walletState.balance = Math.max(0, walletState.balance - finalPrice);

    createdBookings.push(newBooking);
  }

  if (createdBookings.length > 1) {
    const totalP = createdBookings.reduce((sum, b) => sum + b.price, 0);
    const names = createdBookings.map(b => b.serviceName).join(', ');
    const combinedBooking = {
      ...createdBookings[0],
      serviceName: names,
      price: totalP
    };
    res.status(201).json(combinedBooking);
  } else {
    res.status(201).json(createdBookings[0]);
  }
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const booking = bookingsState.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';

  // Refund wallet
  walletState.transactions.unshift({
    id: `wt-${Date.now()}`,
    amount: booking.price,
    type: 'credit',
    description: `Refunded: ${booking.serviceName} Cancelled`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });
  walletState.balance += booking.price;

  res.json(booking);
});

// 5. Wallet
app.get('/api/wallet', (req, res) => {
  res.json(walletState);
});

app.post('/api/wallet/add', (req, res) => {
  const { amount } = req.body;
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  walletState.balance += numAmount;
  walletState.transactions.unshift({
    id: `wt-${Date.now()}`,
    amount: numAmount,
    type: 'credit',
    description: 'Added funds via UPI / Card',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  res.json(walletState);
});

// 6. Analytics dashboard endpoints
app.get('/api/dashboard/stats', (req, res) => {
  const totalRevenue = bookingsState
    .filter(b => b.status === 'upcoming' || b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0) + 124500; // Simulated historical revenue

  const totalBookingsCount = bookingsState.length + 84; // Simulated baseline

  res.json({
    revenue: totalRevenue,
    bookingsCount: totalBookingsCount,
    customerSatisfaction: 4.88,
    activeStaff: 12,
    bookingsByLocality: [
      { name: 'Jubilee Hills', count: 48 },
      { name: 'Banjara Hills', count: 32 },
      { name: 'Gachibowli', count: 25 },
      { name: 'Kondapur', count: 18 },
      { name: 'Madhapur', count: 14 }
    ],
    revenueTrend: [
      { month: 'Jan', amount: 82000 },
      { month: 'Feb', amount: 95000 },
      { month: 'Mar', amount: 110000 },
      { month: 'Apr', amount: 118000 },
      { month: 'May', amount: 124500 },
      { month: 'Jun', amount: totalRevenue }
    ],
    bookingsList: bookingsState
  });
});


// -----------------------------------------------------------------------------
// AI INTEGRATION ENDPOINTS (GEMINI API)
// -----------------------------------------------------------------------------

// AI.1: Natural language AI beauty consultation & chat
app.post('/api/gemini/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid message structure' });
  }

  // Format historical conversation for Gemini API
  const thread = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const userQuery = messages[messages.length - 1]?.text || 'Hello';

  // System instructions for the GlowSphere AI Advisor
  const systemInstruction = `
    You are "GlowSphere AI", the world-class ultra-premium beauty consultant & booking assistant for GlowSphere AI, India's smartest salon marketplace based in Hyderabad.
    Your tone is elegant, helpful, knowledgeable, and highly sophisticated—like a beauty editor at Vogue India mixed with a top dermatologist.
    
    You know everything about:
    - Salons in Hyderabad, specifically:
      1. GlowSphere Premium Atelier, Jubilee Hills (High-tech HydraFacials, luxury hair color)
      2. The Obsidian Couture Lounge, Banjara Hills (Precision cuts, elite beard grooming, dark high-fashion feel)
      3. Estoria Tech Beauty Lab, Gachibowli (Data-driven treatments, affordable tech, nail art)
      4. Aura Organic Wellness Spa, Kondapur (Holistic vegan ayurveda, Deep Tissue, Ayurvedic Facials)
      5. Mirrors Luxury Suite, Madhapur (Magnificent bridal makeup, keratin, luxury pedicures)
    - Skincare routines (oily, dry, acne-prone, hyperpigmentation)
    - Hair styling (matching haircuts to round, oval, square, or heart face shapes)
    - Bridal aesthetic trends in South India (glowing Nizam-style makeup, elegant draping, traditional jasmine pairings).
    
    Guidelines:
    1. Provide specific, tailored advice. Refer to the real salons listed above when recommending places in Hyderabad.
    2. Guide users naturally towards booking. For example: "I highly recommend the AI Skin Tone Perfecting HydraFacial at GlowSphere Premium Atelier in Jubilee Hills. Would you like me to book this for you?"
    3. Keep responses highly formatted, using elegant bullet points and styling headers.
    4. Speak like an AI, but with deep human warmth and absolute expertise. Avoid generic medical disclaimers; instead, offer premium beauty advice.
  `;

  if (!ai) {
    // Elegant fallback response when API key is missing
    const fallbackText = `Hello! I am your **GlowSphere AI Personal Beauty Advisor**. 
    
It seems we are in a preview workspace without an active Gemini API key. No worries! As a premium concierge, I can still guide you:

Based on my curated wisdom, here are my top recommendations for Hyderabad's beauty elite:
1. **Skin Glow & Radiance**: Try the *AI Skin Tone Perfecting HydraFacial* at **GlowSphere Premium Atelier** in Jubilee Hills.
2. **Precision Hairstyle**: Vikram Mehta at Jubilee Hills specializes in custom haircuts tailored to your specific facial geometry.
3. **Organic Bliss**: Enjoy the Ayurvedic saffron rituals at **Aura Organic Wellness Spa** in Kondapur.

Would you like me to guide you to our active booking portal or simulate a custom skin analysis?`;
    
    return res.json({ text: fallbackText });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: 'AI processing failed. Please verify your Gemini API Key in secrets.' });
  }
});

// AI.2: Simulated/Real Camera Face & Skincare Analysis
app.post('/api/gemini/analyze-face', async (req, res) => {
  const { imageBase64, customPrompt } = req.body;

  const systemInstruction = `
    You are an advanced AI Aesthetician and Face Architect. Your task is to analyze the user's face shape, skin tone, and hair texture to provide luxurious beauty guidance.
    
    You MUST respond with a valid JSON object matching this structure EXACTLY:
    {
      "faceShape": "Oval" | "Round" | "Square" | "Heart" | "Diamond",
      "skinTone": "Fair with warm gold undertones" | "Medium Olive" | "Deep Rich Espresso" | "Light neutral beige" | "Warm Honey",
      "skinToneHex": "#F3D2B5" (a matching hex code for the UI palette),
      "hairType": "Curly, medium density" | "Fine, straight with natural volume" | "Wavy, coarse texture" | "Thick, textured",
      "recommendedHairstyles": ["Chipped Lob", "Textured Pixie", "Curtain Bangs with soft layers"],
      "recommendedSkincare": ["Niacinamide hydration serum", "Gentle Salicylic acid wash", "Broad Spectrum SPF 50 Gel"],
      "suitableColors": ["Warm peach", "Royal Emerald", "Champagne Gold"]
    }

    Keep recommendations ultra-modern, premium, and specific to Indian skin/hair profiles.
  `;

  if (!ai) {
    // Beautiful mock analysis that simulates a high-quality result
    const mockAnalysis = {
      faceShape: 'Oval',
      skinTone: 'Warm Honey with golden undertones',
      skinToneHex: '#E5A65D',
      hairType: 'Wavy, medium density, prone to monsoon frizz',
      recommendedHairstyles: [
        'Curtain Bangs with dynamic layers',
        'Textured Shoulder-Length Lob',
        'Sleek high-shine blowouts'
      ],
      recommendedSkincare: [
        'Vitamin C Brightening Serum at sunrise',
        'Saffron & Sandalwood botanical mist',
        'Hyaluronic Acid moisture-lock sleeping mask'
      ],
      suitableColors: ['Warm Terracotta', 'Royal Emerald Green', 'Deep Plum', 'Champagne Gold']
    };
    return res.json(mockAnalysis);
  }

  try {
    let response;
    if (imageBase64) {
      // Remove data header if exists
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      };
      
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          imagePart,
          { text: customPrompt || 'Perform an ultra-premium face shape, skin tone, and hair analysis for this portrait.' }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });
    } else {
      // Text only prompt if no image is uploaded
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: 'Provide a mock premium face analysis for a stylish person in Hyderabad.',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });
    }

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.error('Gemini face analysis error:', error);
    res.status(500).json({ error: 'Aesthetic analysis failed. Please ensure correct image format.' });
  }
});

// AI.3: AI Salon Matches and Price Predictions
app.post('/api/gemini/recommend-salons', async (req, res) => {
  const { query, budget } = req.body;

  const systemInstruction = `
    You are the "GlowSphere AI Allocator". Analyze the user's natural query and budget constraints, and recommend the best matching salon IDs and services.
    
    You MUST return a JSON object matching this structure:
    {
      "matchingSalonIds": ["salon-1", "salon-5"],
      "aiRationale": "Based on your focus on bridal luxury and premium care, we matching these elite salons.",
      "pricePrediction": "We predict prices will rise by 15% next week due to the upcoming wedding season. Booking today saves you ₹1,500."
    }
  `;

  if (!ai) {
    return res.json({
      matchingSalonIds: ['salon-1', 'salon-5'],
      aiRationale: 'Based on your search for premium hair design and bridal perfection, we match Jubilee Hills elite ateliers.',
      pricePrediction: 'Monsoon bridal season is starting. Demand is rising by 22%. Booking right now secures the current dynamic price rates!'
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Query: ${query || 'Best hair styling and facial'}. Budget: ${budget || 5000} INR`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error) {
    console.error('Gemini recommendation error:', error);
    res.status(500).json({ error: 'Recommendation matching failed.' });
  }
});


// -----------------------------------------------------------------------------
// VITE AND STATIC ASSETS ROUTING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlowSphere AI Dev Server running on http://localhost:${PORT}`);
  });
}

startServer();
