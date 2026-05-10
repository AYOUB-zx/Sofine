import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dir, "../../../data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, "[]");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type Order = {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

function readProducts(): Product[] {
  try {
    const content = fs.readFileSync(PRODUCTS_FILE, "utf-8").trim();
    if (!content) { fs.writeFileSync(PRODUCTS_FILE, "[]"); return []; }
    return JSON.parse(content);
  } catch {
    fs.writeFileSync(PRODUCTS_FILE, "[]");
    return [];
  }
}

function writeProducts(products: Product[]): void {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function readOrders(): Order[] {
  try {
    const content = fs.readFileSync(ORDERS_FILE, "utf-8").trim();
    if (!content) { fs.writeFileSync(ORDERS_FILE, "[]"); return []; }
    return JSON.parse(content);
  } catch {
    fs.writeFileSync(ORDERS_FILE, "[]");
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function nextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

export const productsStore = {
  getAll(): Product[] {
    return readProducts().sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  },
  getById(id: number): Product | undefined {
    return readProducts().find((p) => p.id === id);
  },
  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const products = readProducts();
    const product: Product = {
      ...data,
      id: nextId(products),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    products.push(product);
    writeProducts(products);
    return product;
  },
  update(id: number, data: Partial<Omit<Product, "id" | "createdAt">>): Product | undefined {
    const products = readProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    products[idx] = { ...products[idx]!, ...data, updatedAt: new Date().toISOString() };
    writeProducts(products);
    return products[idx];
  },
  delete(id: number): boolean {
    const products = readProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    writeProducts(products);
    return true;
  },
};

export const ordersStore = {
  getAll(): Order[] {
    return readOrders().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  getById(id: number): Order | undefined {
    return readOrders().find((o) => o.id === id);
  },
  create(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const orders = readOrders();
    const order: Order = {
      ...data,
      id: nextId(orders),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    orders.push(order);
    writeOrders(orders);
    return order;
  },
  updateStatus(id: number, status: string): Order | undefined {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    orders[idx] = { ...orders[idx]!, status, updatedAt: new Date().toISOString() };
    writeOrders(orders);
    return orders[idx];
  },
  delete(id: number): boolean {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    orders.splice(idx, 1);
    writeOrders(orders);
    return true;
  },
  stats() {
    const orders = readOrders();
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  },
};
