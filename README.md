<img src='https://raw.githubusercontent.com/saikat709/du-badhon/refs/heads/main/_readme_assets/title.png' height='60' width='170'/>

# Badhon Website

## # Overview
Badhon is a website built using **Next.js**, a React framework for fast and scalable web applications. The project leverages server-side rendering (SSR) and static site generation (SSG) for an optimized user experience.

## Features
- **Fast Performance** with Next.js
- **SEO Optimized**
- **Server-side Rendering (SSR) & Static Site Generation (SSG)**
- **Responsive Design**
- **API Integration**

## Project Structure
```
src/
├── components/          # Reusable UI Components
├── app/               # Next.js Page Routes
│   ├── (home)/page.tsx
│   ├── ...              # other page directories
│   ├── api/             # API Routes
├── public/              # Static Files (images, icons, etc.)
├── styles/              # Global and Component-specific Styles
├── .env.local           # Environment Variables
├── package.json         # Dependencies and Scripts
├── README.md            # Documentation
```

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/saikat709/du-badhon.git
   cd badhon
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## # Samples
![Badhon Sample 1](https://raw.githubusercontent.com/saikat709/du-badhon/refs/heads/main/_readme_assets/blood_requests.png)

## Deployment
### Vercel Deployment (Recommended)
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy:
   ```sh
   vercel
   ```

## Contributing
- Fork the repository
- Create a new branch (`git checkout -b feature-branch`)
- Commit changes (`git commit -m "Added new feature"`)
- Push to the branch (`git push origin feature-branch`)
- Open a Pull Request