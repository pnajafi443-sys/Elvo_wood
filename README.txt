ELVO WOOD V6 — Supabase connected catalog
===========================================

This is a real Supabase-connected static site + admin panel.
No checkout, cart, payment, or online purchase is included.

1) In Supabase SQL Editor, run setup.sql ONCE.
2) Keep product-images and product-360 buckets public.
3) Open admin.html through a web server (not directly from Android file://).
4) Sign in using the Supabase Auth user you created.
5) Add products, main images, gallery images, and ordered 360 frames.
6) index.html and product.html read the same Supabase data.

IMPORTANT:
- config.js contains the Supabase Project URL and PUBLISHABLE key only.
- Never put a Supabase Secret key in browser code.
- Replace the placeholder WhatsApp and Instagram values in config.js before launch.
- For a production launch, deploy this folder to Vercel/Netlify/GitHub Pages or another HTTPS web host.
