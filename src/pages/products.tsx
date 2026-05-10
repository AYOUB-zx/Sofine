import { Link } from "wouter";
import { useListProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Leaf, Search, ArrowRight, Sparkles, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${5 + (i * 5.3) % 90}%`,
  top:  `${10 + (i * 4.7) % 80}%`,
  size: 2 + (i % 3),
  dur:  6 + (i % 4) * 2,
  delay: (i * 0.4) % 4,
  color: i % 3 === 0 ? "#d4af37" : i % 3 === 1 ? "#22c55e" : "#86efac",
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
            boxShadow: `0 0 6px ${p.color}60` }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0); }}
          className="bg-white rounded-3xl overflow-hidden border border-gray-100 h-full flex flex-col cursor-pointer relative"
          style={{
            boxShadow: hovered
              ? "0 25px 60px rgba(30,92,56,0.18), 0 8px 20px rgba(30,92,56,0.1)"
              : "0 2px 16px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Shimmer line on top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px z-10"
            style={{
              background: "linear-gradient(to right, transparent, #1e5c38, transparent)",
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Image area */}
          <div className="aspect-square relative overflow-hidden bg-gray-50">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name}
                  className="w-full h-full object-cover"
                  style={{
                    transform: hovered ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }} />
              : <div className="w-full h-full flex items-center justify-center">
                  <motion.div animate={{ rotate: hovered ? 15 : 0 }} transition={{ duration: 0.4 }}>
                    <Leaf className="w-14 h-14 text-gray-200" />
                  </motion.div>
                </div>}

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[2px]">
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white text-gray-800 font-black px-4 py-1.5 rounded-full text-xs shadow-xl">
                  نفذت الكمية
                </motion.span>
              </div>
            )}

            {/* Top badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {product.inStock && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/60"
                />
              )}
            </div>

            {/* Hover badge */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(212,175,55,0.95)", color: "#041a0c" }}>
                  <Star className="w-2.5 h-2.5" />
                  طبيعي
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.08), transparent)" }} />
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-snug"
              style={{
                color: hovered ? "#1e5c38" : "#111827",
                transition: "color 0.3s ease",
              }}>
              {product.name}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-1 mb-3 flex-1">{product.description}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="text-[#1e5c38] font-black text-base" dir="ltr">
                {product.price}
                <span className="text-xs text-gray-400 font-normal mr-1">د.ج</span>
              </span>
              <motion.div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                animate={{
                  background: hovered ? "#1e5c38" : "#e8f5ee",
                  scale: hovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}>
                <ShoppingBag className="w-4 h-4" style={{ color: hovered ? "#fff" : "#1e5c38", transition: "color 0.3s" }} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function Products() {
  const { data: products, isLoading } = useListProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = products?.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="w-full min-h-screen relative" style={{
      backgroundImage: "url('/images/hero-bg-ref.png')",
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundAttachment: "fixed",
    }}>
      {/* Very light overlay so products are readable */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "rgba(240,252,240,0.82)",
        backdropFilter: "blur(0.5px)",
      }} />

      {/* ── Header ── */}
      <div className="pt-6 pb-28 px-6 relative overflow-hidden" style={{ minHeight: 280 }}>

        {/* Crystal mint background image */}
        <div className="absolute inset-0">
          <img src="/images/crystal-mint.png" alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }} />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(4,20,10,0.82) 0%, rgba(8,35,18,0.72) 40%, rgba(4,20,10,0.88) 100%)" }} />
          {/* Bottom fade to page bg */}
          <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #f7fdf9)" }} />
        </div>

        <FloatingParticles />

        {/* Back link */}
        <div className="relative z-10 max-w-3xl mx-auto mb-8">
          <Link href="/">
            <motion.button
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)" }}>
              <ArrowRight className="w-4 h-4" />
              الرئيسية
            </motion.button>
          </Link>
        </div>

        {/* Title */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80",
              border: "1px solid rgba(34,197,94,0.2)" }}>
            <Sparkles className="w-3 h-3" />
            متجرنا
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ textShadow: "0 0 40px rgba(34,197,94,0.2)" }}>
            مجموعتنا الطبيعية
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-white/45 text-base max-w-2xl mx-auto">
            اكتشف تشكيلة منتجاتنا العضوية للعناية بالصحة والجمال
          </motion.p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="container mx-auto px-6 -mt-14 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, type: "spring" }}
          className="max-w-xl mx-auto mb-10">
          <div
            className="bg-white rounded-2xl border flex items-center gap-3 p-4 transition-all duration-300"
            style={{
              boxShadow: searchFocused
                ? "0 20px 60px rgba(30,92,56,0.18), 0 0 0 3px rgba(30,92,56,0.1)"
                : "0 8px 40px rgba(0,0,0,0.08)",
              borderColor: searchFocused ? "rgba(30,92,56,0.3)" : "#f0f0f0",
            }}>
            <motion.div
              animate={{ scale: searchFocused ? 1.1 : 1, rotate: searchFocused ? -10 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-[#1e5c38]" />
            </motion.div>
            <Input
              placeholder="ابحث عن منتج..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none text-gray-700 placeholder:text-gray-300"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearchTerm("")}
                  className="text-gray-300 hover:text-gray-500 text-xs px-2 font-medium">
                  مسح
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Count */}
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="text-gray-400 text-sm mb-8 text-center">
              <motion.span
                key={filtered.length}
                initial={{ scale: 1.4, color: "#1e5c38" }}
                animate={{ scale: 1, color: "#9ca3af" }}
                className="font-bold inline-block">
                {filtered.length}
              </motion.span>
              {" "}منتج
            </motion.p>
          )}
        </AnimatePresence>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 pb-20">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <div className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100"
                    style={{ animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite` }} />
                </div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 pb-20"
            layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-3xl p-16 border border-gray-100 shadow-sm max-w-md mx-auto mb-20">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-gray-200" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400 text-sm mb-6">لم نجد منتجات تطابق بحثك.</p>
            <Button variant="outline"
              className="rounded-xl border-[#1e5c38]/30 text-[#1e5c38] hover:bg-[#1e5c38] hover:text-white"
              onClick={() => setSearchTerm("")}>
              مسح البحث
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
