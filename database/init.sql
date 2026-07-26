CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "role" TEXT NOT NULL DEFAULT 'user',
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "listings" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "vehicleTypes" TEXT NOT NULL DEFAULT '',
  "fromCity" TEXT NOT NULL,
  "toCity" TEXT NOT NULL,
  "fromLat" TEXT,
  "fromLng" TEXT,
  "toLat" TEXT,
  "toLng" TEXT,
  "truckType" TEXT,
  "price" INTEGER,
  "loadDate" TEXT,
  "contactName" TEXT,
  "whatsapp" TEXT,
  "phone" TEXT,
  "imageUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email");
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user" ("role");
CREATE INDEX IF NOT EXISTS "listings_slug_idx" ON "listings" ("slug");
CREATE INDEX IF NOT EXISTS "listings_status_idx" ON "listings" ("status");
CREATE INDEX IF NOT EXISTS "listings_userId_idx" ON "listings" ("userId");
