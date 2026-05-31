# NutriVision Backend

Backend NutriVision Stack Express + PostgreSQL + Prisma.

## Fitur fondasi

- API versioning di `/api/v1`
- Middleware `cors`, `helmet`, `rate limit`, request logger, dan global error handler
- Auth flow dasar:
  - register
  - login
  - Google auth placeholder
  - refresh token
  - verify email
  - forgot password
  - reset password
  - logout
- Domain dasar:
  - onboarding
  - dashboard
  - scan food
  - recipes
  - account settings
- Prisma schema awal
- Docker dan docker-compose awal

## Menjalankan

```bash
npm install
docker compose up -d postgres
npx prisma db push
npm run dev
```

## Base URL

```txt
http://localhost:5050/api/v1
```

## Catatan implementasi

- Runtime backend sekarang memakai Prisma + PostgreSQL container/local instance sesuai `.env`.
- Folder model Keras yang dipakai oleh endpoint scan diambil dari `MODEL_DIR`, default ke `../model_3_best`.
- Label kelas model saat ini masih fallback `class_0` sampai `class_19` karena folder model belum menyertakan file label dataset.
- Email verification, forgot password, dan Google auth masih bersifat mock placeholder pada layer service.
