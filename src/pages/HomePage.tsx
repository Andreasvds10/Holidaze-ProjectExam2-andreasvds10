// src/pages/HomePage.tsx
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import InfoSection from "../components/home/InfoSection";
import FeaturedVenues from "../components/home/FeaturedVenues";
import VenueCategories from "../components/home/VenueCategories";
import BecomeHost from "../components/home/BecomeHost";

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-20">
      <Hero />
      <Features />
      <FeaturedVenues />
      <VenueCategories />
      <BecomeHost />
      <InfoSection />
    </div>
  );
}

