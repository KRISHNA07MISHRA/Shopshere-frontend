import { getImageUrl } from '../services/ImageService'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-[#f4f1eb] px-4 py-5 sm:px-6 sm:py-8">
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#25251f] shadow-2xl shadow-stone-900/15 md:min-h-[540px] md:grid-cols-[1fr_0.92fr]">
        <div className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-7 py-14 sm:px-12 md:px-14 lg:px-16">
          <p className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 sm:text-sm">
            <Sparkles size={15} /> Discover. Shop. Enjoy.
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Good things,
            <span className="mt-2 block font-serif italic text-amber-200">
              for everyday.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
            Thoughtful finds, trusted brands, and little upgrades that make
            every day feel better.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-6 py-3.5 text-sm font-bold text-stone-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-amber-100"
            >
              Shop the collection <ArrowRight size={17} />
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Explore products
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-stone-300">
            <span className="flex -space-x-2">
              <span className="h-8 w-8 rounded-full border-2 border-[#25251f] bg-rose-200" />
              <span className="h-8 w-8 rounded-full border-2 border-[#25251f] bg-amber-200" />
              <span className="h-8 w-8 rounded-full border-2 border-[#25251f] bg-emerald-200" />
            </span>
            <span><strong className="text-white">10 categories</strong> to make yours</span>
          </div>
        </div>

        <div className="relative min-h-[300px] p-4 pt-0 sm:min-h-[380px] sm:p-6 md:min-h-full md:p-5">
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-[1.5rem] bg-stone-800 sm:min-h-[380px] md:min-h-[500px]">
            <img
              src={getImageUrl('/images/Hero/hero.jpg')}
              alt="A curated selection of ShopShere products"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/15 p-4 text-white shadow-xl backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-100">The everyday edit</p>
              <p className="mt-1 text-lg font-semibold sm:text-xl">A little something for every kind of day.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero