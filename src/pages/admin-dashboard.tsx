import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAdminMe, useAdminLogout, getGetAdminMeQueryKey,
  useGetAdminStats, useListOrders, useListProducts,
  useUpdateOrderStatus, useDeleteOrder, useCreateProduct, useUpdateProduct, useDeleteProduct,
  getListOrdersQueryKey, getListProductsQueryKey, getGetAdminStatsQueryKey,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, ShoppingBag, TrendingUp, Plus, Edit, Trash2, Clock, Upload, ImagePlus, X, Leaf } from "lucide-react";
import { format } from "date-fns";
const logoImg = "/images/logo.png";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logout = useAdminLogout();

  const { data: admin, isLoading: adminLoading } = useGetAdminMe({
    query: { retry: false, onError: () => setLocation("/admin") },
  });

  const { data: stats } = useGetAdminStats({ query: { enabled: !!admin } });
  const { data: orders } = useListOrders({ query: { enabled: !!admin } });
  const { data: products } = useListProducts();

  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleLogout = () => {
    logout.mutate({}, {
      onSuccess: () => {
        queryClient.setQueryData(getGetAdminMeQueryKey(), null);
        setLocation("/admin");
      },
    });
  };

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "", inStock: true });

  const resetProductForm = () => {
    setProductForm({ name: "", description: "", price: "", imageUrl: "", inStock: true });
    setEditingProduct(null);
    setImagePreview(null);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, description: product.description || "", price: product.price.toString(), imageUrl: product.imageUrl || "", inStock: product.inStock });
    setImagePreview(product.imageUrl || null);
    setIsProductDialogOpen(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setProductForm(f => ({ ...f, imageUrl: url }));
      toast({ title: "تم رفع الصورة بنجاح" });
    } catch {
      toast({ title: "فشل رفع الصورة", variant: "destructive" });
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: productForm.name, description: productForm.description, price: parseFloat(productForm.price), imageUrl: productForm.imageUrl, inStock: productForm.inStock };
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); toast({ title: "تم تحديث المنتج" }); setIsProductDialogOpen(false); resetProductForm(); },
      });
    } else {
      createProduct.mutate({ data }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); toast({ title: "تمت إضافة المنتج" }); setIsProductDialogOpen(false); resetProductForm(); },
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProduct.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); toast({ title: "تم حذف المنتج" }); } });
    }
  };

  const handleStatusChange = (orderId: number, status: string) => {
    updateOrderStatus.mutate({ id: orderId, data: { status } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() }); toast({ title: "تم تحديث حالة الطلب" }); },
    });
  };

  const handleDeleteOrder = (orderId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    deleteOrder.mutate({ id: orderId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "تم حذف الطلب" });
      },
    });
  };

  if (adminLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4faf6]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1e5c38] border-t-transparent" />
        <p className="text-[#1e5c38] font-medium">جاري التحميل...</p>
      </div>
    </div>
  );

  if (!admin) return null;

  const statCards = [
    { icon: ShoppingBag, label: "إجمالي الطلبات", value: stats?.totalOrders ?? 0, color: "#e8f5ee", iconColor: "#1e7a48", border: "#b8dfc8" },
    { icon: Clock, label: "قيد الانتظار", value: stats?.pendingOrders ?? 0, color: "#fef9ec", iconColor: "#b45309", border: "#f5d88a" },
    { icon: TrendingUp, label: "الإيرادات (د.ج)", value: stats?.totalRevenue ?? 0, color: "#edf7f1", iconColor: "#15803d", border: "#a7d9b8" },
    { icon: Package, label: "عدد المنتجات", value: stats?.totalProducts ?? 0, color: "#f0ebff", iconColor: "#7c3aed", border: "#c4b0f5" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f8f5]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="logo" className="w-9 h-9 rounded-full object-cover border border-green-100" />
            <div>
              <span className="font-bold text-[#1a4d2e] text-lg">لوحة تحكم الإدارة</span>
              <span className="text-gray-400 text-xs mr-3">مرحباً، {admin.username}</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm gap-2">
            <LogOut className="w-4 h-4" />تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl p-5 flex items-center gap-4 border" style={{ borderColor: s.border, boxShadow: `0 2px 12px ${s.border}60` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color }}>
                <s.icon className="w-5 h-5" style={{ color: s.iconColor }} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs mb-0.5 truncate">{s.label}</p>
                <p className="text-gray-800 text-2xl font-bold leading-none">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-white border border-gray-100 shadow-sm rounded-xl p-1 max-w-[280px] mb-6 h-auto gap-1">
            <TabsTrigger value="orders" className="rounded-lg text-gray-500 data-[state=active]:bg-[#1e5c38] data-[state=active]:text-white data-[state=active]:shadow-sm text-sm px-5 py-2 transition-all">الطلبات</TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg text-gray-500 data-[state=active]:bg-[#1e5c38] data-[state=active]:text-white data-[state=active]:shadow-sm text-sm px-5 py-2 transition-all">المنتجات</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1e5c38]" />
                <h2 className="font-bold text-gray-800">قائمة الطلبات</h2>
                {orders && <span className="mr-auto bg-[#e8f5ee] text-[#1e5c38] text-xs font-bold px-2.5 py-0.5 rounded-full">{orders.length}</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                      {["رقم", "التاريخ", "العميل", "الهاتف", "الولاية", "المنتج", "الإجمالي", "الحالة", ""].map((h, i) => (
                        <th key={i} className="px-5 py-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence>
                      {orders?.map((order, i) => (
                        <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#f8fdf9] transition-colors">
                          <td className="px-5 py-3.5 font-mono text-[#1e5c38] font-semibold text-xs">#{order.id}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs" dir="ltr">{format(new Date(order.createdAt), "yyyy-MM-dd")}</td>
                          <td className="px-5 py-3.5 font-medium text-gray-700">{order.firstName} {order.lastName}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs" dir="ltr">{order.phone}</td>
                          <td className="px-5 py-3.5 text-gray-600">{order.wilaya}</td>
                          <td className="px-5 py-3.5"><span className="font-medium text-[#1e5c38]">{order.productName}</span><span className="text-gray-400 text-xs mr-2">× {order.quantity}</span></td>
                          <td className="px-5 py-3.5 font-bold text-gray-800" dir="ltr">{order.totalPrice} <span className="text-xs text-gray-400 font-normal">د.ج</span></td>
                          <td className="px-5 py-3.5">
                            <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                              <SelectTrigger className={`h-7 w-32 border text-xs rounded-lg font-medium ${order.status === "pending" ? "bg-amber-50 border-amber-200 text-amber-700" : order.status === "completed" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">قيد الانتظار</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-3.5">
                            <Button size="sm" onClick={() => handleDeleteOrder(order.id)}
                              className="rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 h-7 w-7 p-0"
                              title="حذف الطلب">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {(!orders || orders.length === 0) && (
                      <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-300">
                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>لا توجد طلبات بعد</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#1e5c38]" />
                  <h2 className="font-bold text-gray-800">إدارة المنتجات</h2>
                  {products && <span className="bg-[#e8f5ee] text-[#1e5c38] text-xs font-bold px-2.5 py-0.5 rounded-full">{products.length}</span>}
                </div>
                <Dialog open={isProductDialogOpen} onOpenChange={(open) => { setIsProductDialogOpen(open); if (!open) resetProductForm(); }}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1e5c38] hover:bg-[#174d2f] text-white rounded-xl text-sm gap-1.5 h-9 px-4 shadow-sm">
                      <Plus className="w-4 h-4" />إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px] bg-white" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 text-lg">{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <Label className="text-gray-600 text-sm">اسم المنتج</Label>
                        <Input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required className="rounded-xl border-gray-200 focus:border-[#1e5c38] focus:ring-[#1e5c38]/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-600 text-sm">السعر (د.ج)</Label>
                        <Input type="number" min="0" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required className="rounded-xl border-gray-200 focus:border-[#1e5c38] focus:ring-[#1e5c38]/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-600 text-sm">الوصف</Label>
                        <Textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="rounded-xl border-gray-200 focus:border-[#1e5c38] focus:ring-[#1e5c38]/20 resize-none" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-600 text-sm">صورة المنتج</Label>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        {imagePreview ? (
                          <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={imagePreview} alt="معاينة" className="w-full h-44 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-800 hover:bg-gray-100 rounded-lg text-xs h-8">
                                <ImagePlus className="w-3.5 h-3.5 ml-1" /> تغيير
                              </Button>
                              <Button type="button" size="sm" variant="destructive" onClick={() => { setImagePreview(null); setProductForm(f => ({ ...f, imageUrl: "" })); }} className="rounded-lg h-8">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            {isUploadingImage && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-[#1e5c38] text-sm">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1e5c38] border-t-transparent" />
                                  جاري الرفع...
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1e5c38]/50 bg-gray-50 hover:bg-[#f4faf6] transition-all flex flex-col items-center justify-center gap-2.5 group">
                            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[#e8f5ee] flex items-center justify-center transition-colors">
                              <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#1e5c38] transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-sm group-hover:text-gray-600 transition-colors">اضغط لرفع صورة من جهازك</p>
                              <p className="text-gray-300 text-xs mt-0.5">PNG, JPG, WEBP — حتى 10 ميغا</p>
                            </div>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Checkbox id="inStock" checked={productForm.inStock} onCheckedChange={(c) => setProductForm({ ...productForm, inStock: c as boolean })}
                          className="border-gray-300 data-[state=checked]:bg-[#1e5c38] data-[state=checked]:border-[#1e5c38]" />
                        <Label htmlFor="inStock" className="text-gray-600 cursor-pointer text-sm">متوفر في المخزن</Label>
                      </div>
                      <Button type="submit" className="w-full h-11 rounded-xl bg-[#1e5c38] hover:bg-[#174d2f] text-white font-bold mt-1"
                        disabled={createProduct.isPending || updateProduct.isPending || isUploadingImage}>
                        {(createProduct.isPending || updateProduct.isPending) ? "جاري الحفظ..." : isUploadingImage ? "جاري رفع الصورة..." : "حفظ المنتج"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow bg-white">
                    <div className="h-40 relative overflow-hidden bg-gray-50">
                      {product.imageUrl
                        ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-200" /></div>}
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {product.inStock ? "متوفر" : "نفذ"}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{product.name}</h3>
                      <p className="text-[#1e5c38] font-bold text-base mb-3" dir="ltr">{product.price} <span className="text-xs text-gray-400 font-normal">د.ج</span></p>
                      <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" onClick={() => openEditProduct(product)} className="flex-1 rounded-lg border-gray-200 text-gray-600 hover:border-[#1e5c38] hover:text-[#1e5c38] h-8 text-xs">
                          <Edit className="w-3 h-3 ml-1" /> تعديل
                        </Button>
                        <Button size="sm" onClick={() => handleDeleteProduct(product.id)} className="rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 h-8 px-2.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {(!products || products.length === 0) && (
                <div className="text-center py-16 text-gray-300">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>لا توجد منتجات. أضف أول منتج.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
