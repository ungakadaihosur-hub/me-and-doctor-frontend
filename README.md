Me & Doctor — Frontend (Phase 1 MVP)
React/Vite frontend for the Me & Doctor (Clinic OS) product.
Setup
npm install
cp .env.example .env   # set VITE_API_BASE_URL to the Railway backend URL
npm run dev
Deploy to Vercel, same pattern as Me & Coach. Set VITE_API_BASE_URL explicitly in the Vercel project's build environment variables — a missing value fails loudly at startup (src/lib/api.js) instead of silently returning HTML 404s, the bug hit during Me & Coach's launch.
Design system
Tokens are drawn directly from the Me & Doctor logo (brass gold + ink navy on warm cream):
Colors: cream #FAF6EE background, ink #16233D text/nav, brass #B8935A accent, sage/clay for status
Type: Fraunces (display, token numbers, clinic name), Inter (UI), Noto Sans Tamil (Tamil labels — this is a Tamil-first product, not an English product with Tamil translations bolted on)
Signature element: every card ('.chit' class in src/index.css) reads as a clinic paper artifact — a token chit, a prescription slip — with a torn/perforated bottom edge, instead of a generic rounded card. It's the one visual idea the whole UI is built around.
Structure
src/hooks/useAuth.jsx — phone+OTP session, token in localStorage
src/hooks/useClinicData.js — one hook per domain: clinic, patients, patient detail, visits, prescriptions, queue (15s polling, no websocket needed for MVP), billing
src/pages/Dashboard.jsx — today's queue board (the token-chit signature element)
src/pages/Patients.jsx / PatientDetail.jsx — list, add, timeline, new visit + prescription form with "repeat last Rx" and WhatsApp share
src/pages/Billing.jsx — day/month collection summary
Notes
Single-user (doctor-only) for MVP — no staff/assistant login, so there's no role-based UI branching yet
Matches backend spec exactly: free-text medicines (no drug dropdown), one clinic per account
