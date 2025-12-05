// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white/80 px-6 py-3 backdrop-blur">
      <Link
        to="/"
        className="text-lg font-semibold tracking-tight text-[var(--ink)]"
      >
        Holidaze
      </Link>
      <Navigation />
    </header>
  );
}

