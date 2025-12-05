import { Link } from "react-router-dom";

export default function VenueCategories() {
  const categories = [
    { name: "City Lofts", image: "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Coastal Villas", image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Mountain Cabins", image: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Unique Stays", image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
          Browse by category
        </h2>
        <p className="mt-4 text-base opacity-80 md:text-lg">
          Find the perfect type of venue for your next adventure.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link to="/venues" key={category.name} className="block">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[var(--ink)]">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
