# طبيعة نقية - Tabia App

موقع متجر إلكتروني لبيع المنتجات الطبيعية، مع لوحة تحكم للأدمن.

## Run & Operate

- `NODE_ENV=development node_modules/.bin/tsx src/server/index.ts` — تشغيل السيرفر (development)
- `node build.mjs` — بناء المشروع للإنتاج (يبني الفرونت-إند والباك-إند)
- `node index.js` — تشغيل في الإنتاج (بعد البناء)
- `node_modules/.bin/drizzle-kit push` — تطبيق schema قاعدة البيانات
- `node_modules/.bin/drizzle-kit studio` — واجهة رسومية لقاعدة البيانات

## Required Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (مطلوب)
- `PORT` — رقم المنفذ (افتراضي: 8080)
- `SESSION_SECRET` — مفتاح الجلسة (افتراضي: tabia-secret-2024)
- `ADMIN_USERNAME` — اسم مستخدم الأدمن (افتراضي: admin)
- `ADMIN_PASSWORD` — كلمة سر الأدمن (افتراضي: admin123)

## Deploy على Render

1. أنشئ Web Service وربطه بمستودع GitHub
2. أنشئ PostgreSQL database على Render
3. اضبط متغيرات البيئة:
   - `DATABASE_URL` = رابط قاعدة البيانات من Render
   - `SESSION_SECRET` = مفتاح سري عشوائي
   - `ADMIN_USERNAME` و `ADMIN_PASSWORD` 
   - `NODE_ENV=production`
4. Build Command: `node build.mjs`
5. Start Command: `node index.js`
6. بعد النشر الأول شغّل: `node_modules/.bin/drizzle-kit push`

## Deploy على Fly.io

```bash
fly launch
fly postgres create
fly postgres attach <db-name>
fly secrets set SESSION_SECRET=... ADMIN_USERNAME=admin ADMIN_PASSWORD=...
fly deploy
```

## Stack

- Node.js 24, TypeScript
- Backend: Express 5
- Frontend: React 19 + Vite 8 + Tailwind CSS 4
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod v4

## Where things live

- `src/server/` — باك-إند Express
- `src/server/db/schema.ts` — schema قاعدة البيانات
- `src/server/routes/` — مسارات API
- `src/server/schemas.ts` — Zod schemas للـ API
- `src/` — فرونت-إند React
- `drizzle.config.ts` — إعدادات Drizzle ORM
- `build.mjs` — سكريبت البناء للإنتاج
- `index.js` — ملف التشغيل (يُنشأ بعد البناء)

## User Preferences

- المشروع مصمم للرفع على Render أو Fly.io
- قاعدة البيانات تُقرأ من DATABASE_URL (يدعم أي PostgreSQL خارجي)
