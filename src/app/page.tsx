import { AddressSearchWrapper } from "@/components/address-search-wrapper";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 animate-gradient-slow">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
            Find Your Roof
          </h1>
          <p className="mb-8 text-xl leading-8 text-gray-100 drop-shadow">
            Enter your address to get an instant roof estimate
          </p>
          <div className="backdrop-blur-md bg-white/15 p-8 rounded-2xl shadow-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
            <AddressSearchWrapper />
          </div>
        </div>
      </div>
    </main>
  );
}