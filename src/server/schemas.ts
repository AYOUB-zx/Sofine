import * as zod from "zod";

export const HealthCheckResponse = zod.object({ status: zod.string() });

export const ListProductsResponseItem = zod.object({
  id: zod.number(),
  name: zod.string(),
  description: zod.string().nullish(),
  price: zod.number(),
  imageUrl: zod.string().nullish(),
  inStock: zod.boolean(),
  createdAt: zod.string(),
  updatedAt: zod.string().nullish(),
});
export const ListProductsResponse = zod.array(ListProductsResponseItem);

export const CreateProductBody = zod.object({
  name: zod.string(),
  description: zod.string().nullish(),
  price: zod.number(),
  imageUrl: zod.string().nullish(),
  inStock: zod.boolean().optional(),
});

export const GetProductParams = zod.object({ id: zod.coerce.number() });
export const GetProductResponse = zod.object({
  id: zod.number(),
  name: zod.string(),
  description: zod.string().nullish(),
  price: zod.number(),
  imageUrl: zod.string().nullish(),
  inStock: zod.boolean(),
  createdAt: zod.string(),
  updatedAt: zod.string().nullish(),
});

export const UpdateProductParams = zod.object({ id: zod.coerce.number() });
export const UpdateProductBody = zod.object({
  name: zod.string().optional(),
  description: zod.string().nullish(),
  price: zod.number().optional(),
  imageUrl: zod.string().nullish(),
  inStock: zod.boolean().optional(),
});
export const UpdateProductResponse = GetProductResponse;
export const DeleteProductParams = zod.object({ id: zod.coerce.number() });

export const ListOrdersResponseItem = zod.object({
  id: zod.number(),
  productId: zod.number(),
  productName: zod.string(),
  productImageUrl: zod.string().nullish(),
  firstName: zod.string(),
  lastName: zod.string(),
  phone: zod.string(),
  wilaya: zod.string(),
  quantity: zod.number(),
  totalPrice: zod.number(),
  status: zod.string(),
  createdAt: zod.string(),
  updatedAt: zod.string().nullish(),
});
export const ListOrdersResponse = zod.array(ListOrdersResponseItem);

export const CreateOrderBody = zod.object({
  productId: zod.number(),
  firstName: zod.string(),
  lastName: zod.string(),
  phone: zod.string(),
  wilaya: zod.string(),
  quantity: zod.number(),
});

export const GetOrderParams = zod.object({ id: zod.coerce.number() });
export const GetOrderResponse = zod.object({
  id: zod.number(),
  productId: zod.number(),
  productName: zod.string(),
  productImageUrl: zod.string().nullish(),
  firstName: zod.string(),
  lastName: zod.string(),
  phone: zod.string(),
  wilaya: zod.string(),
  quantity: zod.number(),
  totalPrice: zod.number(),
  status: zod.string(),
  createdAt: zod.string(),
  updatedAt: zod.string().nullish(),
});

export const UpdateOrderStatusParams = zod.object({ id: zod.coerce.number() });
export const UpdateOrderStatusBody = zod.object({
  status: zod.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});
export const UpdateOrderStatusResponse = GetOrderResponse;

export const AdminLoginBody = zod.object({ username: zod.string(), password: zod.string() });
export const AdminLoginResponse = zod.object({ username: zod.string() });
export const AdminLogoutResponse = zod.object({ success: zod.boolean() });
export const GetAdminMeResponse = zod.object({ username: zod.string() });
export const GetAdminStatsResponse = zod.object({
  totalProducts: zod.number(),
  totalOrders: zod.number(),
  pendingOrders: zod.number(),
  totalRevenue: zod.number(),
});
