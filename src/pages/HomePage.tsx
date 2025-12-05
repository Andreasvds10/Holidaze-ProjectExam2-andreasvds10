// src/pages/HomePage.tsx
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import InfoSection from "../components/home/InfoSection";

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-20">
      <Hero />
      <Features />
      <InfoSection />
    </div>
  );
}

