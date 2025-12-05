import { Link } from "react-router-dom";

export default function FeaturedVenues() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
          Our most popular venues
        </h2>
        <p className="mt-4 text-base opacity-80 md:text-lg">
          Discover a selection of our most loved and highly-rated venues, perfect for any occasion.
        </p>

        {/* Placeholder for venue cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Venue 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[var(--ink)]">Cozy Mountain Cabin</h3>
              <p className="text-sm opacity-75">A perfect retreat in the wilderness.</p>
              <p className="mt-2 text-sm font-semibold">NOK 1 500 / night</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.pexels.com/photos/209037/pexels-photo-209037.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Venue 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[var(--ink)]">Modern City Apartment</h3>
              <p className="text-sm opacity-75">Stylish living in the heart of the city.</p>
              <p className="mt-2 text-sm font-semibold">NOK 2 200 / night</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Venue 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[var(--ink)]">Beachfront Villa</h3>
              <p className="text-sm opacity-75">Relax by the sea with stunning views.</p>
              <p className="mt-2 text-sm font-semibold">NOK 3 000 / night</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/venues"
            className="inline-flex h-11 items-center rounded-full bg-[var(--ink)] px-7 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-black"
          >
            Explore all venues
          </Link>
        </div>
      </div>
    </section>
  );
}
