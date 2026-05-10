import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetProduct, useCreateOrder, getGetProductQueryKey } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WILAYAS } from "@/lib/wilayas";
import { ArrowRight, ShoppingCart, Leaf, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: product, isLoading, isError } = useGetProduct(Number(id), {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(Number(id)) }
  });

  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", wilaya: "", quantity: 1,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "quantity" ? parseInt(value) || 1 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.wilaya) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: { productId: product.id, firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, wilaya: formData.wilaya, quantity: formData.quantity }
    }, {
      onSuccess: () => { setIsSuccess(true); toast({ title: "تم الطلب بنجاح", description: "تم تسجيل طلبك. سنتواصل معك قريباً لتأكيد الطلب." }); },
      onError: () => { toast({ title: "حدث خطأ", description: "لم نتمكن من تسجيل طلبك. يرجى المحاولة مرة أخرى.", variant: "destructive" }); }
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (isError || !product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Leaf className="w-16 h-16 text-muted-foreground/30 mb-4" />
      <h2 className="text-2xl font-bold mb-2">المنتج غير موجود</h2>
      <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
      <Link href="/products"><Button variant="outline" className="rounded-full"><ArrowRight className="w-4 h-4 ml-2" />العودة للمتجر</Button></Link>
    </div>
  );

  if (isSuccess) return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="bg-card rounded-3xl p-12 border border-border shadow-md">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">تم تسجيل طلبك بنجاح!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          شكراً لثقتكم بطبيعة نقية. سيقوم فريقنا بالتواصل معكم قريباً على الرقم <b dir="ltr">{formData.phone}</b> لتأكيد الطلب وتفاصيل التوصيل.
        </p>
        <div className="bg-muted p-6 rounded-2xl text-right mb-8">
          <h3 className="font-bold mb-2">ملخص الطلب:</h3>
          <ul className="space-y-2 text-sm">
            <li>المنتج: {product.name}</li>
            <li>الكمية: {formData.quantity}</li>
            <li>السعر الإجمالي: <span dir="ltr">{(product.price * formData.quantity)} د.ج</span></li>
          </ul>
        </div>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">مواصلة التسوق</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowRight className="w-4 h-4" />الرئيسية
        </Link>
        <span className="text-muted-foreground/40 text-xs">›</span>
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          المنتجات
        </Link>
      </div>
      <div className="bg-card rounded-3xl overflow-hidden shadow-md border border-border flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-6">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Leaf className="w-16 h-16 opacity-20" /></div>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-secondary-foreground mb-6" dir="ltr">
            {product.price} <span className="text-lg font-normal text-muted-foreground">د.ج</span>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground flex-1">
            <p className="leading-relaxed">{product.description || "لا يوجد وصف متوفر لهذا المنتج."}</p>
          </div>
          {!product.inStock && (
            <div className="mt-6 bg-destructive/10 text-destructive p-4 rounded-xl font-bold text-center border border-destructive/20">
              عذراً، هذا المنتج غير متوفر حالياً
            </div>
          )}
        </div>

        <div className="md:w-1/2 bg-muted/30 p-6 md:p-10 border-r border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
            <ShoppingCart className="w-6 h-6 ml-3 text-primary" />أطلب الآن
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="الاسم" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">اللقب</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="اللقب" required className="bg-background" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0555123456" required className="bg-background text-left" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wilaya">الولاية</Label>
              <Select value={formData.wilaya} onValueChange={(v) => setFormData(prev => ({ ...prev, wilaya: v }))} required>
                <SelectTrigger className="bg-background"><SelectValue placeholder="اختر الولاية" /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input id="quantity" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} required className="bg-background w-32" />
            </div>
            <div className="bg-card p-4 rounded-xl border border-border flex justify-between items-center shadow-sm">
              <span className="font-medium text-foreground">الإجمالي:</span>
              <span className="text-2xl font-bold text-secondary-foreground" dir="ltr">{(product.price * formData.quantity) || 0} د.ج</span>
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              disabled={!product.inStock || createOrder.isPending}>
              {createOrder.isPending ? "جاري الإرسال..." : "تأكيد الطلب"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
