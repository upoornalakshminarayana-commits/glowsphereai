# GlowSphere AI: India's Smartest AI Beauty Marketplace

Discover. Book. Glow. An ultra-premium, full-stack, AI-driven beauty salon marketplace designed for high-net-worth customers, elite salons, and certified freelancers in Hyderabad, India.

---

## 1. Product Strategy

GlowSphere AI is a seed-funded SaaS-marketplace hybrid solving critical frictions in India's ₹80,000 Cr luxury personal care industry.

### Core Value Propositions
*   **For Customers**: Eliminates blind beauty bookings. AI-driven contour mapping, tone matching, and stylist skill assessments secure precise aesthetic results before arriving at the atelier.
*   **For Salon Owners**: A comprehensive SaaS suite managing staffs, dynamic hourly yields, digital menu syncs, real-time demand modeling, and VVIP suite allocations.
*   **For Freelance Stylists**: Direct access to high-value home service bookings in wealthy pockets like Jubilee Hills and Banjara Hills.

---

## 2. Platform Architecture & Schema

### Scalable PostgreSQL Database Schema Design

```sql
-- Core users and security credentials
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer', -- 'customer', 'owner', 'admin', 'professional'
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Registered beauty salons & physical studios
CREATE TABLE salons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    locality VARCHAR(100) NOT NULL, -- e.g. 'Jubilee Hills'
    address TEXT NOT NULL,
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    is_luxury BOOLEAN DEFAULT false,
    average_price INTEGER NOT NULL,
    features TEXT[] -- e.g. '{"Champagne Room", "Smart Mirrors"}'
);

-- Salon Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'hair', 'skin', 'bridal'
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    description TEXT
);

-- Stylists & Certified beauty professionals
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    specialization VARCHAR(150),
    experience_years INTEGER NOT NULL
);

-- Bookings Registry (Uber + Airbnb design)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    salon_id UUID REFERENCES salons(id),
    service_id UUID REFERENCES services(id),
    professional_id UUID REFERENCES professionals(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming', -- 'upcoming', 'completed', 'cancelled'
    is_home_service BOOLEAN DEFAULT false,
    price_paid INTEGER NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'paid' -- 'pending', 'paid', 'refunded'
);
```

---

## 3. High-Fidelity AI Integrations

1.  **AI Aesthetic Mirror Scan**: Utilizes advanced **Gemini 1.5 Flash Vision API** to read the facial keypoints, mapping contour shape, skin melanin/undertone values, and listing customized haircut & serum suggestions.
2.  **Aesthetic Concierge Chatbot**: Context-aware natural language booking agent guiding users seamlessly to make appropriate appointments inside specific Hyderabad sub-regions.
3.  **Dynamic Allocator**: Algorithmic budget matcher matching user descriptions to salons with predictive price modeling alerts.

---

## 4. Quickstart Guide

### Pre-requisites
*   Node.js (v18+)
*   An active `GEMINI_API_KEY` loaded inside your system or Secrets panel.

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack development container
npm run dev

# 3. Compile the production bundle
npm run build

# 4. Fire up production server
npm start
```

---

## 5. Seed-Stage Roadmap (2026)
*   **Q3 2026**: Integrate live WebRTC smart mirrors for real-time video makeup trials.
*   **Q4 2026**: Expand the merchant SaaS suite to Bangalore, Mumbai, and Delhi NCR.
*   **Q1 2027**: Launch GlowSphere Credit Card with custom cashback partnerships.
