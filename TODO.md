# DU Badhon — Production Revamp & Implementation Tracker

All 16 specification items and 5 core milestones have been completed, verified with TypeScript / ESLint zero-warning checks, full Next.js production builds, and pushed to `main`.

- [x] **1. Pending donation page with sidebar entry (`/pending-donations`)**: Displays assigned donors awaiting completion with quick "Mark Verified & Recorded" and "Change / Unassign Donor" actions without altering base blood request records.
- [x] **2. "Live Calling in Progress" banner fixed**: Replaced static text with live interactive buttons in the header and on `/dashboard` that directly open the synchronized `CallDonorModal` console.
- [x] **3. Realtime synchronized call locking via SSE (`/api/locks/stream`)**: Server-backed calling locks with synchronized countdown timer computed directly from `expiresAt`, synchronized across multiple tabs and devices.
- [x] **4. "My Club" hall unit administration page (`/my-club`)**: Unit member roster with role-based promotions for executives (President, Secretary, Admin), member addition, and live unit coordination stats.
- [x] **5. Compact `/dashboard` hero card**: Redesigned hero card with high-density metrics and clear unit duty badges.
- [x] **6. 2-Step Blood Request Creation Modal**: Step 1 selects target hall units with "Don't ask today" preference caching; Step 2 gathers patient requisition details with validation.
- [x] **7. Technical wording cleanup**: Removed confusing jargon ("PWA & APK" -> "Install App", "Download for Android", "Local SQLite" -> "Secure Local Storage").
- [x] **8. Fixed-size uniform blood group badges**: Standardized blood badges across all cards, modals, and directories with `min-w-[48px] justify-center text-center`.
- [x] **9. Unified "All Units" Grid on `/hall-units`**: Responsive grid showing all members across 16 DU halls with hall unit badges.
- [x] **10. Developer recognition for Saikat Islam**: Added footer recognition across the platform (*"Designed & Developed with ❤️ by Saikat Islam"*) and a dedicated profile showcase page at `/developer`.
- [x] **11. Multi-volunteer search indicators ("Being searched by" chips)**: Live searcher heartbeats displayed on requisition cards when other volunteers are searching for donors.
- [x] **12. Real authentication & user profile management (`/profile`)**: Cookie-based JWT sessions, bcrypt passwords, Next.js route protection middleware, and personal profile/password editing.
- [x] **13. Memorable seed credentials**: Seeded test accounts (`member1`/`member1`, `member2`/`member2`, `president1`/`president1`, `admin`/`admin`) with one-click quick selector buttons on sign-in.
- [x] **14. Offline detection banner & retry screen**: Global offline banner detecting connection loss, notifying that cached records are active, with instant network retry.
- [x] **15. Turso libSQL / SQLite persistence**: Prisma models (`User`, `Donor`, `CallLock`, `BloodRequest`, `BagSlot`, `CallLog`) supporting remote Turso on Vercel and local dev without data loss.
- [x] **16. Mobile bottom navigation bar (`<MobileBottomNav />`)**: 5 primary thumb-friendly navigation icons for mobile screens (`< lg`) with `pb-safe` padding.
