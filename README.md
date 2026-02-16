# E-Tuition BD — Client (Frontend)

A responsive **Tuition Management System** where **students** can post tuition requirements, **tutors** can apply to jobs, and **admins** can moderate users/posts and track platform analytics.

## 🔗 Live Links
- **Live Site:** https://etutuitionbd.web.app  
- **Server API:** https://e-tution-bd-server-pearl.vercel.app/

## 🎯 Purpose
To solve the real problem of finding **qualified tutors** and **verified tuition posts**, reduce friction with automated workflows, and enable structured communication and transparent payments.

## ✨ Key Features

### Public Features
- Home page with:
  - Hero section
  - **Latest Tuition Posts** (fetched from backend)
  - **Latest Tutors** (fetched from backend)
  - **Animations** using Framer Motion (minimum 2)
  - “How the Platform Works” & “Why Choose Us” sections
- Tuition listing with search/filter + pagination
- Tuition details page
- Tutor listing + tutor profile details
- About & Contact pages
- Responsive navbar (auth-based) + footer with social icons (new **X** logo)

### Authentication
- Email/password login & registration
- Google login (default role: **Student**)
- Firebase authentication
- Role-based protected routing (Student / Tutor / Admin)

### Student Dashboard
- Post new tuition (creates **Pending** tuition for admin approval)
- Update/delete tuition posts (with confirmation)
- View applied tutors and accept/reject applications
- Stripe checkout for approving a tutor (tutor is **approved only after payment success**)
- Payments history
- Profile settings (update name/photo/etc.)

### Tutor Dashboard
- Apply to tuition from tuition details (modal form)
- Track applications (pending/approved/rejected)
- Ongoing approved tuitions
- Revenue history

### Admin Dashboard
- User management (view/update role/delete)
- Tuition management (approve/reject posts)
- Reports & analytics (charts/graphs)

## 🧰 Tech Stack
- **React + Vite**
- **React Router**
- **Firebase Auth**
- **MongoDB + Express API** (backend)
- **Stripe Checkout** (payment)
- **Tailwind CSS + DaisyUI**
- **TanStack React Query**
- **Axios**
- **Recharts** (admin analytics)
- **SweetAlert2** (alerts)
- **Lucide / React Icons**
- **Framer Motion** (animations)

## 📦 Packages Used
### Dependencies
- @tanstack/react-query
- axios
- firebase
- lucide-react
- react / react-dom
- react-hook-form
- react-icons
- react-router
- recharts
- sweetalert2
- tailwindcss
- (plus Tailwind Vite plugin)

### Dev Dependencies
- vite
- @vitejs/plugin-react
- daisyui
- eslint (+ react hooks / refresh plugins)

## ⚙️ Run Locally (Client)
### Prerequisites
- Node.js (LTS recommended)
- Firebase project set up (Auth + Hosting)

### Steps
```bash
git clone <your-client-repo-url>
cd e-tution-bd-client
npm install
npm run dev


🔐 Environment Variables (Client)

Create a .env file in the client root:
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_IMGBB_API_KEY=your_imgbb_key
# (Recommended) VITE_API_URL=https://your-server-api-url
✅ Make sure your Firebase authorized domain includes your live domain.