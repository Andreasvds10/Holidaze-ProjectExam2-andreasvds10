// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/60 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-[var(--ink)]"
            >
              Holidaze
            </Link>
            <p className="mt-3 text-xs opacity-70">
              Your trusted platform for finding and booking exclusive
              accommodations worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-xs opacity-70">
              <li>
                <Link to="/venues" className="hover:underline">
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:underline">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/manager/venues" className="hover:underline">
                  Venue Manager
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">About</h3>
            <ul className="mt-3 space-y-2 text-xs opacity-70">
              <li>
                <Link to="/venues" className="hover:underline">
                  How it works
                </Link>
              </li>
              <li>
                <span className="cursor-default">Verified hosts</span>
              </li>
              <li>
                <span className="cursor-default">Safety & security</span>
              </li>
              <li>
                <span className="cursor-default">Terms & conditions</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">Contact</h3>
            <ul className="mt-3 space-y-2 text-xs opacity-70">
              <li>support@holidaze.com</li>
              <li>+47 123 45 678</li>
              <li className="mt-4">
                <span className="text-[10px] opacity-60">
                  Powered by Noroff Holidaze API
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-black/5 pt-8 text-center text-xs opacity-60">
          <p>
            © {new Date().getFullYear()} Holidaze. All rights reserved. Built
            for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

