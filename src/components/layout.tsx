import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Leaf, ShieldCheck, Phone } from "lucide-react";
const logoImg = "/images/logo.png";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1e5c38]/20 shadow-sm group-hover:border-[#d4af37]/50 transition-colors">
              <img src={logoImg} alt="طبيعة نقية" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-lg font-black text-[#0e2b1a] tracking-tight">طبيعة نقية</span>
              <span className="text-[#d4af37] text-xs block leading-none font-medium">جمال طبيعي</span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${location === "/" ? "bg-[#e8f5ee] text-[#1e5c38]" : "text-gray-500 hover:text-[#1e5c38] hover:bg-gray-50"}`}>الرئيسية</span>
            </Link>
            <Link href="/products">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${location === "/products" || location.startsWith("/products/") ? "bg-[#e8f5ee] text-[#1e5c38]" : "text-gray-500 hover:text-[#1e5c38] hover:bg-gray-50"}`}>
                <ShoppingBag className="w-3.5 h-3.5" />المنتجات
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="bg-[#0e2b1a] text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37]/40">
                  <img src={logoImg} alt="طبيعة نقية" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-lg font-black text-[#d4af37]">طبيعة نقية</span>
                  <span className="text-white/40 text-xs block">جمال طبيعي</span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                منتجات طبيعية عضوية مستخلصة بعناية لتناسب احتياجاتكم، لجمال طبيعي وصحة دائمة.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[#d4af37] font-bold mb-1">روابط سريعة</h3>
              <Link href="/"><span className="text-white/50 hover:text-white text-sm transition-colors">الرئيسية</span></Link>
              <Link href="/products"><span className="text-white/50 hover:text-white text-sm transition-colors">متجرنا</span></Link>
              <Link href="/admin"><span className="text-white/50 hover:text-white text-sm transition-colors">منطقة الإدارة</span></Link>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-[#d4af37] font-bold mb-1">تواصل معنا</h3>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span dir="ltr">+213 676 920 292</span>
              </div>
              <div className="flex gap-6 mt-2">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#1a4d2e] flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <span className="text-white/40 text-xs">طبيعي 100%</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#1a4d2e] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <span className="text-white/40 text-xs">جودة مضمونة</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-white/30 text-sm">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} طبيعة نقية
          </div>
        </div>
      </footer>
    </div>
  );
}
