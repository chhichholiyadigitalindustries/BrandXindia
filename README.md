# BrandX — Official Animated Website

BrandX is an all-in-one business super app designed specifically for Indian Vyaparis, Retailers, and MSMEs. This repository contains the complete, modern, premium animated official website built with pure HTML5, CSS3, and Vanilla JavaScript.

---

## 🚀 Key Highlights & Ultra-Premium Full 3D Cinematic Transformation

- **Reference Inspiration**:
  - Inspired by the luxury-grade storytelling, depth, transitions, and scroll choreography of the *Cartier Roadster Universe*, while establishing a completely original BrandX Indian Business Super App identity and visual aesthetic.

- **Realistic 3D iPhone-Style Smartphone**:
  - Genuine 3D unibody squircle geometry extruded with beveled edges and smooth continuous corner radiuses (`r = 0.48`).
  - Titanium PBR material with realistic metallic reflections, specular sheen, and brushed blue-cyan rim lighting.
  - Deeply rounded display mesh with custom normalized UV mapping so canvas screen graphics map cleanly without stretching or distortion.
  - Dynamic Island-inspired black pill with sensor dot and micro-speaker slit.
  - Hardware side buttons: Action button, Volume Up, Volume Down on the left; Power / Lock button on the right.
  - Rear triple camera plateau with 3 stepped titanium chamfer rings, dark barrels, sapphire optic elements, True Tone flash, and LiDAR sensor dot.
  - Screen content strictly clipped to the squircle display boundary via procedural 2D canvas `roundRect().clip()`.

- **Circular Screen Portal Transitions**:
  - Connected to the smartphone display: as the visitor scrolls towards chapter boundaries, the camera dollies forward, the phone screen fills more of the viewport, and a luminous circular portal emerges within the display.
  - The luminous circle expands smoothly beyond the smartphone display boundaries (up to scale 5.2), revealing the next 3D scene and dissolving as the new scene resolves.
  - Reversible scrubbing: scrolling backward shrinks the circular portal back into the display seamlessly.

- **Full 3D Opening Scene**:
  - Immersive midnight-blue cosmic environment with layered particle formations and stardust.
  - Authentic BrandX logo reveal with preserved typography and proportions.
  - Headline: *"Your Business. Everything in One App."* and copy: *"Billing se lekar business growth tak — sab ek jagah."*
  - Emotional narrative dedicated to Indian business owners (*"Har dukaan ke peeche ek sapna hota hai"*).

- **Entire Website in 3D Cinematic Chapters**:
  - **Chapter 1 — Capabilities**: *"EVERYTHING YOUR BUSINESS NEEDS."* with 3D Feature Constellation (orbiting 3D nodes, central polyhedral core, interactive stardust, and real-time hover/scroll links to feature cards).
  - **Chapter 2 — BrandX Feature Universe**: 8 operational modules (GST Billing & POS, Customer Khata, Product Management, Digital Dukaan, NFC Visiting Card, Festival Posters, UPI QR Standee, AI Business Copilot) with illustrative non-fake interfaces and circular portal connections.
  - **Chapter 3 — Pricing Stage**: *"SIMPLE, TRANSPARENT PRICING."* with 3D refractive glass prisms, interactive Monthly/Yearly toggle, and confirmed pricing (Free ₹0, Pro ₹349/month or ₹2,999/year).
  - **Chapter 4 — Download Launchpad**: *"TAKE BRANDX WHEREVER BUSINESS TAKES YOU."* with a 3D Smartphone Journey, floating rotation, surrounding luminous portal ring, and official store badges with "Coming Soon" notification modals.

- **Dimensional 3D Typography on All 3 Major Headings**:
  - Distinctive animation treatment for:
    1. `"EVERYTHING YOUR BUSINESS NEEDS."`
    2. `"SIMPLE, TRANSPARENT PRICING."`
    3. `"TAKE BRANDX WHEREVER BUSINESS TAKES YOU."`
  - Words emerge with 3D perspective depth, masked reveals, dimensional shadows, and synchronized electric-blue light sweeps that reverse smoothly when scrolled out of view.

- **Mobile-First Performance & Accessibility**:
  - Adaptive particle counts and rendering quality on mobile devices.
  - IntersectionObserver lifecycle management automatically pauses off-screen WebGL render loops to eliminate idle GPU load.
  - Full compliance with `prefers-reduced-motion` and graceful static fallbacks if WebGL is disabled.

---

## 📁 Technical Structure

```
Brandx-website/
├── index.html                   # Semantic HTML5 homepage with JSON-LD & OpenGraph metadata
├── css/
│   ├── style.css                # Core design system, cinema phone chassis, 8-module screens, cards
│   ├── animations.css           # Keyframes, floating motion, scroll-triggered reveals, Apple easings
│   └── responsive.css           # Mobile (375px, 390px), tablet (768px), laptop (1024px), ultra-wide (1440px+)
├── js/
│   ├── main.js                  # Central configuration, navbar, modals, pricing toggle, store handlers
│   └── animations.js            # Cinema scroll story engine, 3D tilt, card spotlights, AI orb & typewriter
├── assets/
│   ├── logo/
│   │   ├── brandx-logo.png      # Official uploaded BrandX logo (preserved unaltered)
│   │   ├── apple-touch-icon.png # Apple touch icon
│   │   ├── pwa-192.png          # PWA 192px icon
│   │   └── pwa-512.png          # PWA 512px icon
│   ├── icons/
│   │   └── icon.svg             # Brand icon SVG
│   ├── images/
│   │   └── playstore-feature-graphic.png # Play Store feature graphic asset
│   └── store-badges/
│       ├── google-play-badge.svg# Official Google Play SVG badge
│       └── app-store-badge.svg  # Official Apple App Store SVG badge
├── favicon.svg                  # Modern vector favicon
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # XML sitemap for SEO indexation
└── README.md                    # Documentation & configuration guide
```

---

## ⚙️ Configuration (`js/main.js`)

All dynamic parameters and official store URLs can be configured directly in `js/main.js`:

```javascript
const APP_CONFIG = {
  appName: "BrandX",
  tagline: "Your Business. Everything in One App.",
  
  // Official Store URLs:
  googlePlayUrl: "", // Paste live Google Play Store URL here when published
  appStoreUrl: "",   // Paste live Apple App Store URL here when published
  webAppUrl: "#download",
  
  supportEmail: "support@brandx.in",
  isPublishedOnStores: false, // Set to true when apps are live on stores
  launchYear: 2026
};
```

> **Note**: When `googlePlayUrl` or `appStoreUrl` are empty, clicking the download badges automatically opens an elegant "App Listing Coming Soon" notification modal rather than navigating to an invalid or broken link.

---

## 🌐 Running Locally & Deployment

### Running Locally
You can preview the website locally using any static web server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx -y serve .

# Or using PHP
php -S localhost:3000
```
Then visit `http://localhost:3000` in your web browser.

### Hosting & Deployment
Because the website is built with pure HTML5, CSS3, and Vanilla JavaScript with no build step required, it can be hosted instantly on:
- **GitHub Pages**
- **Vercel / Netlify / Cloudflare Pages**
- **Firebase Hosting**
- **Any Apache / Nginx / cPanel web hosting**

---

## 🛡️ License & Copyright
© 2026 BrandX. All rights reserved.
