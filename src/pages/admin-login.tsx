import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe, getGetAdminMeQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole, Leaf } from "lucide-react";
import { motion } from "framer-motion";
const logoImg = "/images/logo.png";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const login = useAdminLogin();

  const { data: admin } = useGetAdminMe({ query: { retry: false } });
  if (admin) setLocation("/admin/dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { username, password } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
        toast({ title: "تم تسجيل الدخول بنجاح" });
        setLocation("/admin/dashboard");
      },
      onError: () => {
        toast({ title: "فشل تسجيل الدخول", description: "اسم المستخدم أو كلمة المرور غير صحيحة", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f8f5] relative overflow-hidden px-4">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#c8e6d4] opacity-30 blur-3xl -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#d6edde] opacity-20 blur-3xl -bottom-32 -left-32 pointer-events-none" />
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} className="absolute opacity-[0.07] pointer-events-none"
          style={{ left: `${8 + i * 22}%`, top: `${15 + (i % 3) * 28}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.6 }}>
          <Leaf className="w-10 h-10 text-[#1e5c38]" />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 180, damping: 22 }}
        className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-green-100 mb-4">
            <img src={logoImg} alt="طبيعة نقية" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-[#1a4d2e]">طبيعة نقية</h1>
          <p className="text-gray-400 text-sm mt-0.5">منطقة الإدارة</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-green-50 border border-green-50 p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
              <LockKeyhole className="w-5 h-5 text-[#1e5c38]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">تسجيل الدخول</h2>
              <p className="text-gray-400 text-xs">أدخل بياناتك للوصول</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-sm">اسم المستخدم</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required dir="ltr" placeholder="admin"
                className="rounded-xl border-gray-200 h-11 focus:border-[#1e5c38] focus:ring-[#1e5c38]/20 bg-gray-50 placeholder:text-gray-300" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-sm">كلمة المرور</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required dir="ltr" placeholder="••••••••"
                className="rounded-xl border-gray-200 h-11 focus:border-[#1e5c38] focus:ring-[#1e5c38]/20 bg-gray-50 placeholder:text-gray-300" />
            </div>
            <Button type="submit" disabled={login.isPending}
              className="w-full h-12 rounded-xl bg-[#1e5c38] hover:bg-[#174d2f] text-white font-bold text-base shadow-lg shadow-green-800/10 mt-2 transition-all">
              {login.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  جاري الدخول...
                </span>
              ) : "دخول"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
