import ca from"dotenv";import W from"express";import la from"cors";import lr from"express";var Qt=r=>(n,t,a)=>{Promise.resolve(r(n,t,a)).catch(a)},m=Qt;var e=class extends Error{statusCode;isOperational;constructor(n,t,a=!0,s=""){super(t),this.statusCode=n,this.isOperational=a,s?this.stack=s:Error.captureStackTrace(this,this.constructor)}};var l=class{success;statusCode;message;data;constructor(n,t,a=null){this.statusCode=n,this.message=t,this.success=n<400,this.data=a}};import V from"crypto-js";var ie=()=>{let n=V.lib.WordArray.random(32).toString(V.enc.Hex),t=V.SHA256(n).toString(V.enc.Hex),a=new Date(Date.now()+1440*60*1e3);return{token:n,hashedToken:t,expires:a}};import Yt from"nodemailer";var oe=async(r,n,t)=>{await Yt.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:!0,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}).sendMail({from:`"BazarHub" <${process.env.SMTP_USER}>`,to:r,subject:n,html:t})};import Z from"bcryptjs";import sr from"crypto";import"dotenv/config";import{PrismaMariaDb as ar}from"@prisma/adapter-mariadb";import*as ue from"path";import{fileURLToPath as rr}from"url";import*as de from"@prisma/client/runtime/client";var Y={previewFeatures:[],clientVersion:"7.2.0",engineVersion:"0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",activeProvider:"mysql",inlineSchema:`// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}

model User {
  id                      String    @id @default(uuid())
  name                    String?
  email                   String    @unique
  password                String
  provider                Provider  @default(LOCAL)
  googleId                String?
  isEmailVerified         Boolean   @default(false)
  emailVerificationToken  String?
  emailVerificationExpiry DateTime?
  role                    Role      @default(USER)
  type                    Type      @default(RETAIL)

  refreshToken       String?
  refreshTokenExpiry DateTime?
  createdAt          DateTime  @default(now())

  // Relations
  cart       Cart? // One active cart per user
  orders     Order[] // Order history
  products   Product[] // Products created by the user
  employment Employee?
}

enum Role {
  ADMIN
  USER
}

enum Provider {
  LOCAL
  GOOGLE
}

enum Type {
  RETAIL
  WHOLESALE
}

// 1. Enums help manage state strictly
enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  COMPLETED
  CANCELLED
  RETURNED
  REFUNDED
  PENDING_REFUND
  COMPLETED_REFUND
  CANCELLED_REFUND
  RETURNED_REFUND
  REFUNDED_REFUND
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum Visibility {
  RETAIL
  WHOLESALE
  BOTH
}

model Product {
  id String @id @default(uuid())

  // Basic Info
  name_en        String
  name_bn        String?
  description_en String  @db.Text // Use Text type for long descriptions
  description_bn String? @db.Text

  // SEO & Access
  slug String? @unique

  // Business Logic
  sku             String?
  retailPrice     Decimal        @default(0.0) @db.Decimal(10, 2) // Always use Decimal for money
  wholesalePrice  Decimal?       @db.Decimal(10, 2)
  stock           Int            @default(0)
  minWholesaleQty Int            @default(0)
  status          ProductStatus  @default(DRAFT)
  isFeatured      Boolean        @default(false)
  type            Type?
  // Relations
  categoryId      String?
  category        Category?      @relation(fields: [categoryId], references: [id])
  images          ProductImage[]
  visibility      Visibility     @default(BOTH)
  isActive        Boolean        @default(true)
  isInhouse       Boolean        @default(false)
  sellerId        String?
  seller          User?          @relation(fields: [sellerId], references: [id], onDelete: SetNull)

  orders    OrderItem[]
  cartItems CartItem[]

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Indexing for performance
  @@index([categoryId])
  @@index([status])
}

model ProductImage {
  id        String  @id @default(uuid())
  url       String
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Category {
  id String @id @default(uuid())

  // Info
  name_en     String
  name_bn     String?
  slug        String  @unique
  description String? @db.Text
  imageUrl    String? // Category thumbnail

  // Hierarchy (Adjacency List Pattern)
  parentCategoryId String?
  parentCategory   Category?  @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id], onDelete: SetNull)
  childCategories  Category[] @relation("CategoryHierarchy")

  // Relations
  products Product[]

  // Settings
  sortOrder Int     @default(0)
  isActive  Boolean @default(true)

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([parentCategoryId])
}

// --- Cart System ---
model Cart {
  id String @id @default(uuid())

  // Can be null if you support "Guest Checkout" (tracked by session/cookie)
  userId String? @unique
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items CartItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CartItem {
  id String @id @default(uuid())

  cartId String
  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)

  image           String
  productId       String
  product         Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name            String
  minWholesaleQty Int
  retailPrice     Decimal @db.Decimal(10, 2)
  wholesalePrice  Decimal @db.Decimal(10, 2)
  quantity        Int     @default(1)
  buyerType       Type

  // Unique constraint ensures a product appears only once per cart
  @@unique([cartId, productId])
}

// --- Order System ---
model Order {
  id          String @id @default(uuid())
  orderNumber String @unique // Readable ID like "ORD-2023-1001"

  userId String? // Nullable if user is deleted, but order record remains
  user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)

  items OrderItem[]

  // Financials
  totalAmount Decimal @db.Decimal(10, 2)

  // State Management
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)

  // Shipping Details (Ideally linked to an Address model, strictly embedded here for simplicity)
  shippingAddress ShippingAddress?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderItem {
  id String @id @default(uuid())

  orderId String
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String // Nullable: If product is deleted, we still keep the order history
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  // --- SNAPSHOT FIELDS ---
  // We copy these from Product at the moment of purchase. 
  // If Product price changes later, this record must remain unchanged.
  name     String
  price    Decimal @db.Decimal(10, 2)
  quantity Int
  sku      String?
}

model ShippingAddress {
  id         String @id @default(uuid())
  address    String
  city       String
  postalCode String
  phone      String
  fullName   String

  orderId String @unique
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model BrandLogo {
  id        String   @id @default(uuid())
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Branding {
  id        String   @id @default(uuid())
  brandName String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Banner {
  id        String   @id @default(uuid())
  title     String
  imageUrl  String
  linkUrl   String?
  position  String
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PaymentGateway {
  id            String                @id @default(uuid())
  gateway_id    String
  name          String                @unique
  description   String?
  icon          String
  is_enabled    Boolean
  is_configured Boolean
  config        PaymentGatewayConfig?
}

model PaymentGatewayConfig {
  api_key          String
  paymentGatewayId String         @unique
  paymentGateway   PaymentGateway @relation(fields: [paymentGatewayId], references: [id], onDelete: Cascade)
}

enum EmployeeRole {
  MANAGER
  SUPPORT
  CONTENT
  WAREHOUSE
}

model Employee {
  id         String       @id @default(cuid())
  userId     String       @unique
  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  role       EmployeeRole @default(CONTENT)
  department String
  isActive   Boolean      @default(false)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

model DeliveryPersonnel {
  id          String  @id @default(uuid())
  name        String
  phoneNumber String
  email       String
  isActive    Boolean @default(false)
}
`,runtimeDataModel:{models:{},enums:{},types:{}}};Y.runtimeDataModel=JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"Provider"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"emailVerificationToken","kind":"scalar","type":"String"},{"name":"emailVerificationExpiry","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"type","kind":"enum","type":"Type"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"refreshTokenExpiry","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"products","kind":"object","type":"Product","relationName":"ProductToUser"},{"name":"employment","kind":"object","type":"Employee","relationName":"EmployeeToUser"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name_en","kind":"scalar","type":"String"},{"name":"name_bn","kind":"scalar","type":"String"},{"name":"description_en","kind":"scalar","type":"String"},{"name":"description_bn","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"retailPrice","kind":"scalar","type":"Decimal"},{"name":"wholesalePrice","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"minWholesaleQty","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ProductStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"type","kind":"enum","type":"Type"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isInhouse","kind":"scalar","type":"Boolean"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"ProductToUser"},{"name":"orders","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name_en","kind":"scalar","type":"String"},{"name":"name_bn","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"parentCategoryId","kind":"scalar","type":"String"},{"name":"parentCategory","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"childCategories","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"image","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"name","kind":"scalar","type":"String"},{"name":"minWholesaleQty","kind":"scalar","type":"Int"},{"name":"retailPrice","kind":"scalar","type":"Decimal"},{"name":"wholesalePrice","kind":"scalar","type":"Decimal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"buyerType","kind":"enum","type":"Type"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"shippingAddress","kind":"object","type":"ShippingAddress","relationName":"OrderToShippingAddress"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"sku","kind":"scalar","type":"String"}],"dbName":null},"ShippingAddress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToShippingAddress"}],"dbName":null},"BrandLogo":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Branding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"brandName","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Banner":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"linkUrl","kind":"scalar","type":"String"},{"name":"position","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"PaymentGateway":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"gateway_id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"is_enabled","kind":"scalar","type":"Boolean"},{"name":"is_configured","kind":"scalar","type":"Boolean"},{"name":"config","kind":"object","type":"PaymentGatewayConfig","relationName":"PaymentGatewayToPaymentGatewayConfig"}],"dbName":null},"PaymentGatewayConfig":{"fields":[{"name":"api_key","kind":"scalar","type":"String"},{"name":"paymentGatewayId","kind":"scalar","type":"String"},{"name":"paymentGateway","kind":"object","type":"PaymentGateway","relationName":"PaymentGatewayToPaymentGatewayConfig"}],"dbName":null},"Employee":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmployeeToUser"},{"name":"role","kind":"enum","type":"EmployeeRole"},{"name":"department","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DeliveryPersonnel":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"}],"dbName":null}},"enums":{},"types":{}}');async function Xt(r){let{Buffer:n}=await import("buffer"),t=n.from(r,"base64");return new WebAssembly.Module(t)}Y.compilerWasm={getRuntime:async()=>await import("@prisma/client/runtime/query_compiler_bg.mysql.mjs"),getQueryCompilerWasmModule:async()=>{let{wasm:r}=await import("@prisma/client/runtime/query_compiler_bg.mysql.wasm-base64.mjs");return await Xt(r)}};function le(){return de.getPrismaClient(Y)}import*as E from"@prisma/client/runtime/client";var Ua=E.Extensions.getExtensionContext;var Ia={DbNull:E.NullTypes.DbNull,JsonNull:E.NullTypes.JsonNull,AnyNull:E.NullTypes.AnyNull};var Oa=E.makeStrictEnum({ReadUncommitted:"ReadUncommitted",ReadCommitted:"ReadCommitted",RepeatableRead:"RepeatableRead",Serializable:"Serializable"});var Ca=E.Extensions.defineExtension;globalThis.__dirname=ue.dirname(rr(import.meta.url));var me=le();var nr=new ar({host:process.env.DATABASE_HOST,user:process.env.DATABASE_USER,password:process.env.DATABASE_PASSWORD,database:process.env.DATABASE_NAME,connectionLimit:5}),i=new me({adapter:nr});import{z as b}from"zod";import ye from"jsonwebtoken";var X=r=>{let n=process.env.ACCESS_TOKEN_SECRET,t=Number(process.env.ACCESS_TOKEN_EXPIRY),a=process.env.REFRESH_TOKEN_SECRET,s=Number(process.env.REFRESH_TOKEN_EXPIRY),o=t*1e3,d=s*1e3,u=ye.sign({id:r},n,{expiresIn:t}),c=ye.sign({id:r},a,{expiresIn:s});return{accessToken:u,refreshToken:c,accessTokenMaxAge:o,refreshTokenMaxAge:d}};var ir=b.object({email:b.string().email("Invalid email address"),password:b.string().min(6,"Password must be at least 6 characters long"),name:b.string().min(3,"Name must be at least 3 characters long"),type:b.enum(["RETAIL","WHOLESALE"])}),pe=m(async(r,n)=>{let{email:t,password:a,name:s,type:o}=r.body,d=ir.safeParse({email:t,password:a,name:s,type:o});if(!d.success)throw new e(400,d.error.message);if(await i.user.findUnique({where:{email:t}}))throw new e(409,"User already exists");let p=(process.env.ADMIN_EMAILS?.split(",")||[]).includes(t),{token:P,hashedToken:f,expires:g}=ie(),w=await Z.genSalt(10),D=await Z.hash(a,w),L=await i.user.create({data:{email:t,name:s,password:D,emailVerificationToken:f,emailVerificationExpiry:g,role:p?"ADMIN":"USER",type:o}}),k=`${process.env.CLIENT_URL}/api/auth/verify-email?token=${P}`;await oe(L.email,"Verify your email",`
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${k}">${k}</a>
      <p>This link expires in 24 hours.</p>
    `),n.status(201).json(new l(201,"Registration successful. Please check your email to verify."))}),ce=m(async(r,n)=>{let{token:t}=r.query;if(!t)throw new e(400,"Invalid verification token");let a=sr.createHash("sha256").update(t).digest("hex"),s=await i.user.findFirst({where:{emailVerificationToken:a,emailVerificationExpiry:{gt:new Date}}});if(!s)throw new e(400,"Token is invalid or expired");await i.user.update({where:{id:s.id},data:{isEmailVerified:!0,emailVerificationToken:null,emailVerificationExpiry:null}}),n.status(200).send(`
            <div>
                <h1 style="text-align: center; color: green; font-size: 36px; font-weight: bold;">Welcome To BazarHub</h1>
                <p style="color: green;text-align: center;padding: 20px;">Email verified successfully!</p>
                <p style="text-align: center; color: green; font-size: 24px; font-weight: bold;">Happy Shopping</p>
                <a href="http://localhost:8080/">Go To BazarHub</a>
            </div>
            `)}),or=b.object({email:b.string().email("Invalid email address"),password:b.string().min(6,"Password must be at least 6 characters long")}),ge=m(async(r,n)=>{let{email:t,password:a}=r.body;if(!t||!a)throw new e(400,"Email and password are required");let s=or.safeParse({email:t,password:a});if(!s.success)throw new e(400,s.error.message);let o=await i.user.findUnique({where:{email:t}});if(!o)throw new e(404,"User not found");if(!o.isEmailVerified)throw new e(400,"Please verify your email first");if(!await Z.compare(a,o.password))throw new e(401,"Invalid password");let{accessToken:u,refreshToken:c,accessTokenMaxAge:p,refreshTokenMaxAge:P}=X(o.id);await i.user.update({where:{id:o.id,email:o.email},data:{refreshToken:c,refreshTokenExpiry:new Date(Date.now()+P)}}),n.cookie("refreshToken",c,{httpOnly:!0,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:P}),n.cookie("accessToken",u,{httpOnly:!0,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:p}),n.status(200).json(new l(200,"Login successful"))}),Pe=m(async(r,n)=>{n.clearCookie("refreshToken"),n.clearCookie("accessToken"),await i.user.update({where:{id:r.user.id},data:{refreshToken:null,refreshTokenExpiry:null}}),n.status(200).json(new l(200,"Logout successful"))}),fe=m(async(r,n)=>{let t=r.cookies.refreshToken;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findFirst({where:{refreshToken:t}});if(!a)throw new e(401,"Unauthorized");let{accessToken:s,refreshToken:o,accessTokenMaxAge:d,refreshTokenMaxAge:u}=X(a.id);await i.user.update({where:{id:a.id},data:{refreshToken:o,refreshTokenExpiry:new Date(Date.now()+u)}}),n.cookie("accessToken",s,{httpOnly:!0,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:d}),n.cookie("refreshToken",o,{httpOnly:!0,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:u}),n.status(200).json(new l(200,"Access token refreshed successfully"))}),we=m(async(r,n)=>{let t=r.user.id,a=await i.user.findUnique({where:{id:t},select:{id:!0,name:!0,email:!0,role:!0,type:!0,isEmailVerified:!0,createdAt:!0}});if(!a)throw new e(404,"User not found");n.status(200).json(new l(200,"User profile fetched successfully",a))});import dr from"jsonwebtoken";var y=m(async(r,n,t)=>{let a="";if(r.cookies.accessToken?a=r.cookies.accessToken:r.headers.authorization?.startsWith("Bearer ")&&(a=r.headers.authorization.split("Bearer ")[1]),!a)throw new e(401,"Unauthorized");let s=dr.verify(a,process.env.ACCESS_TOKEN_SECRET);if(s.id)r.user=s,t();else throw new e(401,"Unauthorized")});var S=lr.Router();S.route("/register").post(pe);S.route("/verify-email").get(ce);S.route("/login").post(ge);S.route("/logout").post(y,Pe);S.route("/refresh-token").post(y,fe);S.route("/profile").get(y,we);var Ae=S;import Er from"express";import he from"multer";import ee from"path";import{fileURLToPath as ur}from"url";var mr=ur(import.meta.url),yr=ee.dirname(mr),pr=he.diskStorage({destination:(r,n,t)=>{t(null,ee.join(yr,"../../public/uploads"))},filename:(r,n,t)=>{t(null,`${Date.now()}-${n.fieldname}${ee.extname(n.originalname)}`)}}),cr=function(r,n,t){if(!n.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff|ico)$/))return t(new Error("Only image files are allowed!"),!1);t(null,!0)},gr=he({storage:pr,fileFilter:cr,limits:{fileSize:1024*1024*2,files:1}}),G=gr;import Te from"path";import Ee from"fs";import{fileURLToPath as Pr}from"url";var fr=Pr(import.meta.url),wr=Te.dirname(fr),Ar=async r=>{try{let n=Te.join(wr,"../../public","uploads",r);Ee.existsSync(n)&&Ee.unlinkSync(n)}catch(n){throw n}},I=Ar;import{z as xe}from"zod";var Ue=m((r,n)=>{if(r.file)return n.status(200).json(new l(200,"File uploaded successfully",{filename:r.file.filename}));throw new e(400,"File upload failed")}),Ie=m((r,n)=>{if(r.file)return n.status(200).json(new l(200,"File uploaded successfully",{filename:r.file.filename}));throw new e(400,"File upload failed")}),Oe=m((r,n)=>{let{filename:t}=r.body;if(!t)throw new e(400,"File name is required");return I(t),n.status(200).json(new l(200,"File deleted successfully"))}),Ce=m((r,n)=>{if(r.file)return n.status(200).json(new l(200,"Uploaded branding logo successfully",{filename:r.file.filename}));throw new e(400,"File upload failed")}),Re=m((r,n)=>{if(r.file)return n.status(200).json(new l(200,"Uploaded banner image successfully",{filename:r.file.filename}));throw new e(400,"File upload failed")}),hr=xe.object({bannerImageUrl:xe.string()}),be=m(async(r,n)=>{let t=hr.safeParse(r.body);if(!t.success)throw new e(400,"Invalid credentials");let{bannerImageUrl:a}=t.data,s=a.split("/uploads/"),o=s[s.length-1];return I(o||""),n.status(200).json(new l(200,"Deleted banner image successfully",{bannerImageUrl:a}))});var F=Er.Router();F.route("/category-thumbnail").post(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},G.single("category-thumbnail"),Ue);F.route("/product-thumbnail").post(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},G.single("product-thumbnail"),Ie);F.route("/product-thumbnail").delete(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},Oe);F.route("/branding-logo").post(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized access");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},G.single("branding-logo"),Ce);F.route("/banner-image").post(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},G.single("banner-image"),Re);F.route("/banner-image").delete(y,async(r,n,t)=>{let a=r.user.id;if(!a)throw new e(401,"Unauthorized");let s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},be);var Se=F;import Ir from"express";import Fe from"fs";import ve from"path";import{fileURLToPath as Tr}from"url";var xr=Tr(import.meta.url),Ur=ve.dirname(xr),De=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(403,"Unauthorized");let{filename:s}=r.body;if(!s)throw new e(400,"Filename is required");let o=ve.join(Ur,"../../public/uploads",s);if(!Fe.existsSync(o))throw new e(404,"File not found");Fe.unlink(o,d=>{if(d)throw new e(500,"Failed to delete file");n.status(200).json(new l(200,"File deleted successfully"))})});var ke=Ir.Router();ke.route("/category-thumbnail").delete(y,De);var Be=ke;import Fr from"express";import{z as A}from"zod";var Or=A.object({name_en:A.string().min(3,"Category name must be at least 3 characters long"),name_bn:A.string().nullable(),slug:A.string(),imageUrl:A.string().url("Invalid URL"),parentCategoryId:A.string().nullable(),sortOrder:A.number().nullable(),isActive:A.boolean().nullable()}),Ne=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(403,"Unauthorized");let s=Or.safeParse(r.body);if(!s.success)throw new e(400,s.error.message);let{name_en:o,name_bn:d,imageUrl:u,parentCategoryId:c,sortOrder:p,isActive:P,slug:f}=s.data,g=await i.category.create({data:{name_en:o,name_bn:d||"",imageUrl:u||"",parentCategoryId:c||null,sortOrder:p||0,isActive:P||!0,slug:f}});return n.status(201).json(new l(201,"Category created successfully",g))}),Cr=A.object({categoryId:A.string(),name_en:A.string().min(3,"Category name must be at least 3 characters long"),name_bn:A.string().nullable(),slug:A.string(),imageUrl:A.string().url("Invalid URL"),parentCategoryId:A.string().nullable(),sortOrder:A.number().nullable(),isActive:A.boolean().nullable()}),Me=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(403,"Unauthorized");let s=Cr.safeParse(r.body);if(!s.success)throw new e(400,s.error.message);let{categoryId:o,name_en:d,name_bn:u,imageUrl:c,parentCategoryId:p,sortOrder:P,isActive:f,slug:g}=s.data,w=await i.category.update({where:{id:o},data:{name_en:d,name_bn:u||"",imageUrl:c||"",parentCategoryId:p||null,sortOrder:P||0,isActive:f||!0,slug:g}});return n.status(200).json(new l(200,"Category updated successfully",w))}),Rr=A.object({categoryId:A.string()}),Le=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(403,"Unauthorized");let s=Rr.safeParse(r.body);if(!s.success)throw new e(400,s.error.message);let{categoryId:o}=s.data,d=await i.category.delete({where:{id:o}});if(d?.imageUrl){let u=d?.imageUrl.split("/uploads/").pop()||"";await I(u)}return n.status(200).json(new l(200,"Category deleted successfully",d))}),br=A.object({categoryIds:A.array(A.string())}),Ge=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(403,"Unauthorized");let s=br.safeParse(r.body);if(!s.success)throw new e(400,s.error.message);let{categoryIds:o}=s.data;for(let d of o){let u=await i.category.delete({where:{id:d}});if(u?.imageUrl){let c=u?.imageUrl.split("/uploads/").pop()||"";await I(c)}}return n.status(200).json(new l(200,"Category deleted successfully",o))}),Sr=A.object({categoryId:A.string()}),_e=m(async(r,n)=>{let{categoryId:t}=Sr.parse(r.body),a=await i.category.findUnique({where:{id:t}});return n.status(200).json(new l(200,"Category fetched successfully",a))}),$e=m(async(r,n)=>{let t=await i.category.findMany({where:{isActive:!0},include:{parentCategory:!0,childCategories:!0}});return n.status(200).json(new l(200,"Categories fetched successfully",t))});var v=Fr.Router();v.route("/create-category").post(y,Ne);v.route("/update-category").put(y,Me);v.route("/delete-category").delete(y,Le);v.route("/bulk-delete-categories").delete(y,Ge);v.route("/get-category").get(_e);v.route("/get-all-categories").get($e);var qe=v;import Dr from"express";import{z as x}from"zod";var vr=x.object({name_en:x.string().min(3,"Name must be at least 3 characters long"),name_bn:x.string(),description_en:x.string(),description_bn:x.string(),categoryId:x.string(),retailPrice:x.number(),wholesalePrice:x.number(),stock:x.number(),minWholesaleQty:x.number(),sku:x.string(),visibility:x.string(),images:x.array(x.string()),isActive:x.boolean(),isInhouse:x.boolean(),sellerId:x.string().nullable(),slug:x.string().optional()}),je=m(async(r,n)=>{let t=r.body,a=vr.safeParse(t);if(!a.success)throw new e(400,a.error.message);let{name_bn:s,name_en:o,description_bn:d,description_en:u,categoryId:c,retailPrice:p,wholesalePrice:P,stock:f,minWholesaleQty:g,sku:w,visibility:D,isActive:L,isInhouse:k,images:J}=a.data,H=await i.product.create({data:{name_en:o,name_bn:s,description_en:u,description_bn:d,categoryId:c||null,retailPrice:p,wholesalePrice:P,stock:f,minWholesaleQty:g,sku:w,visibility:D==="BOTH"?"BOTH":D==="RETAIL"?"RETAIL":"WHOLESALE",isActive:L,isInhouse:k}}),se=await i.productImage.createMany({data:J.map(Q=>({productId:H.id,url:Q}))});return n.status(201).json(new l(201,"Product created successfully",H))}),ze=m(async(r,n)=>{let t=await i.product.findMany({include:{images:!0,category:{select:{name_en:!0,name_bn:!0}}}});return n.status(200).json(new l(200,"Products fetched successfully",t))}),Ke=m(async(r,n)=>{let{productId:t}=r.body,a=await i.productImage.findMany({where:{productId:t},select:{url:!0}}),s=await i.product.delete({where:{id:t}});for(let o of a){let d=o.url.split("/uploads/").pop();await I(d)}return n.status(200).json(new l(200,"Product deleted successfully",s))}),He=m(async(r,n)=>{let{productId:t,updateData:a}=r.body;if(!await i.product.findUnique({where:{id:t}}))throw new e(404,"Product not found");let o=await i.productImage.findMany({where:{productId:t},select:{url:!0}});for(let P of o){let f=P.url;for(let g of a.images){if(f===g)continue;let w=g.split("/uploads/").pop();await I(w)}}await i.productImage.deleteMany({where:{productId:t}});let{images:d,categoryId:u,...c}=a,p=await i.product.update({where:{id:t},data:{...c,categoryId:u||null,images:{create:d.map(P=>({url:P}))}}});return n.status(200).json(new l(200,"Product updated successfully",p))});var _=Dr.Router();_.route("/create-product").post(y,async(r,n,t)=>{let a=r.user.id,s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},je);_.route("/delete-product").delete(y,async(r,n,t)=>{let a=r.user.id,s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},Ke);_.route("/update-product").put(y,async(r,n,t)=>{let a=r.user.id,s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()},He);_.route("/get-products").get(ze);var Ve=_;import kr from"express";var We=m(async(r,n)=>{let t=await i.banner.count(),a=await i.product.count(),s=await i.category.count(),o=await i.user.count({where:{role:"USER"}}),d=await i.user.count({where:{type:"RETAIL",role:"USER"}}),u=await i.user.count({where:{type:"WHOLESALE",role:"USER"}}),c=await i.order.count(),p=await i.order.findMany({orderBy:{createdAt:"desc"},take:10,include:{items:!0,user:{select:{id:!0,type:!0}}}}),P=await i.order.count({where:{status:"PENDING"}}),f=await i.order.aggregate({_sum:{totalAmount:!0}}),g=await i.order.count({where:{status:"COMPLETED"}}),w=await i.order.count({where:{status:"CANCELLED"}}),D=await i.order.count({where:{status:"RETURNED"}}),L=await i.order.count({where:{status:"REFUNDED"}}),k=await i.order.count({where:{status:"PENDING_REFUND"}}),J=await i.order.count({where:{status:"COMPLETED_REFUND"}}),H=await i.order.count({where:{status:"CANCELLED_REFUND"}}),se=await i.order.count({where:{status:"RETURNED_REFUND"}}),Q=await i.order.count({where:{status:"REFUNDED_REFUND"}}),Jt=await i.deliveryPersonnel.count();return n.status(200).json(new l(200,"Dashboard stats fetched successfully",{totalBanners:t,totalProducts:a,totalCategories:s,totalCustomers:o,totalRetailCustomers:d,totalWholesaleCustomers:u,totalOrders:c,recentOrders:p,totalSales:f,totalPendingOrders:P,totalCompletedOrders:g,totalCancelledOrders:w,totalReturnedOrders:D,totalRefundedOrders:L,totalPendingRefundOrders:k,totalCompletedRefundOrders:J,totalCancelledRefundOrders:H,totalReturnedRefundOrders:se,totalRefundedRefundOrders:Q,totalDeliveryPersonells:Jt}))});var Je=kr.Router();Je.route("/dashboard").get(y,async(r,n,t)=>{try{let a=r.user.id,s=await i.user.findUnique({where:{id:a}});if(!s)throw new e(404,"User not found");if(s.role!=="ADMIN")throw new e(403,"Unauthorized");t()}catch(a){n.status(500).json(new l(500,"Internal server error",a))}},We);var Qe=Je;import Br from"express";var Ye=m(async(r,n)=>{let{productId:t,quantity:a}=r.body,s=r.user.id;if(!s)throw new e(401,"User not found");let o=await i.user.findUnique({where:{id:s}}),d=await i.cart.findUnique({where:{userId:s}}),u=null;if(d?u=d:u=await i.cart.create({data:{userId:s}}),!u)throw new e(404,"Cart not found");if(await i.cartItem.findUnique({where:{cartId_productId:{cartId:u.id,productId:t}}}))return await i.cartItem.update({where:{cartId_productId:{cartId:u.id,productId:t}},data:{quantity:a}}),n.status(200).json(new l(200,"Product updated in cart"));let p=await i.product.findUnique({where:{id:t},include:{images:!0}});if(!p)throw new e(404,"Product not found");if(p.stock<a)throw new e(400,"Not enough stock");return await i.cartItem.create({data:{cartId:u.id,productId:t,quantity:a,buyerType:o?.type||"RETAIL",image:p.images[0]?.url||"",name:p.name_en,minWholesaleQty:p.minWholesaleQty,retailPrice:p.retailPrice||0,wholesalePrice:p.wholesalePrice||0}}),n.status(200).json(new l(200,"Product added to cart"))}),Xe=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(400,"Unauthorized access");let a=await i.cart.findUnique({where:{userId:t},select:{items:!0,id:!0}});n.status(200).json(new l(200,"Suceessfully find cart",a))}),Ze=m(async(r,n)=>{let{productId:t}=r.body,a=r.user.id;if(!t)throw new e(400,"Product id is required");if(!a)throw new e(400,"Unauthorized access");let s=await i.cart.findUnique({where:{userId:a},select:{items:!0,id:!0}});if(!s)throw new e(404,"Cart not found");let o=await i.cartItem.findUnique({where:{cartId_productId:{cartId:s.id,productId:t}}});if(!o)throw new e(404,"Cart item not found");await i.cartItem.delete({where:{cartId_productId:{cartId:s.id,productId:t}}}),n.status(200).json(new l(200,"Suceessfully removed cart item",o))}),et=m(async(r,n)=>{let{productId:t,quantity:a}=r.body,s=r.user.id;if(!t)throw new e(400,"Product id is required");if(!s)throw new e(400,"Unauthorized access");let o=await i.cart.findUnique({where:{userId:s},select:{items:!0,id:!0}});if(!o)throw new e(404,"Cart not found");let d=await i.cartItem.findUnique({where:{cartId_productId:{cartId:o.id,productId:t}}});if(!d)throw new e(404,"Cart item not found");return await i.cartItem.update({where:{cartId_productId:{cartId:o.id,productId:t}},data:{quantity:a}}),n.status(200).json(new l(200,"Suceessfully updated cart item quantity",d))}),tt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");let s=await i.cart.delete({where:{userId:a.id}});if(!s)throw new e(404,"Cart not found");return n.status(200).json(new l(200,"Cart is clear",{cart:s}))});var B=Br.Router();B.route("/").get(y,Xe);B.route("/add").post(y,Ye);B.route("/remove").post(y,Ze);B.route("/update").post(y,et);B.route("/clear").delete(y,tt);var rt=B;import Lr from"express";import{z as R}from"zod";var Nr=R.object({fullName:R.string().min(3,"Full name is required"),phone:R.string().min(10,"Phone is required"),address:R.string().min(5,"Address is required"),city:R.string().min(3,"City is required"),postalCode:R.string().min(4,"Postal code is required")}),Mr=R.array(R.object({productId:R.string().min(1,"Product ID is required")})),at=R.object({shippingAddress:Nr,orderItems:Mr}),nt=m(async(r,n)=>{let{shippingAddress:t,orderItems:a}=r.body,s=`ORD-${Date.now()}-${Math.floor(Math.random()*1e6)}`,o=r.user.id;if(console.log(o),!o)throw new e(401,"Unauthorized");if(!await i.user.findUnique({where:{id:o}}))throw new e(404,"User not found");let u=at.safeParse({shippingAddress:t,orderItems:a});if(!u.success)throw new e(400,u.error.message);let c=await i.cart.findUnique({where:{userId:o}});if(!c)throw new e(404,"Cart not found");let p=await i.cartItem.findMany({where:{cartId:c.id}}),P=p.reduce((g,w)=>w.buyerType==="RETAIL"?g+Number(w.retailPrice)*w.quantity:w.buyerType==="WHOLESALE"&&w.minWholesaleQty<=w.quantity?g+Number(w.wholesalePrice)*w.quantity:g+Number(w.retailPrice),0),f=await i.order.create({data:{userId:o,orderNumber:s,shippingAddress:{create:{fullName:t.fullName,address:t.address,city:t.city,phone:t.phone,postalCode:t.postalCode}},totalAmount:P,status:"PENDING",paymentStatus:"PENDING",items:{create:p.map(g=>({productId:g.productId,quantity:g.quantity,name:g.name,price:g.retailPrice}))}}});return n.status(200).json(new l(200,"Order created successfully",{order:f}))}),st=m(async(r,n)=>{let{shippingAddress:t,orderItems:a}=r.body,s=`ORD-${Date.now()}-${Math.floor(Math.random()*1e6)}`,o=r.user.id;if(!o)throw new e(401,"Unauthorized");if(!await i.user.findUnique({where:{id:o}}))throw new e(404,"User not found");let u=at.safeParse({shippingAddress:t,orderItems:a});if(!u.success)throw new e(400,u.error.message);let c=await i.cart.findUnique({where:{userId:o}});if(!c)throw new e(404,"Cart not found");let p=await i.cartItem.findMany({where:{cartId:c.id}}),P=p.reduce((g,w)=>w.buyerType==="RETAIL"?g+Number(w.retailPrice)*w.quantity:w.buyerType==="WHOLESALE"&&w.minWholesaleQty<=w.quantity?g+Number(w.wholesalePrice)*w.quantity:g,0);console.log(P);let f=await i.order.create({data:{userId:o,orderNumber:s,shippingAddress:{create:{fullName:t.fullName,address:t.address,city:t.city,phone:t.phone,postalCode:t.postalCode}},totalAmount:P,status:"PENDING",paymentStatus:"PENDING",items:{create:p.map(g=>({productId:g.productId,quantity:g.quantity,name:g.name,price:g.retailPrice}))}}});return n.status(200).json(new l(200,"Order created successfully",{order:f}))}),it=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized");if(!await i.user.findUnique({where:{id:t}}))throw new e(404,"User not found");let s=await i.order.findMany({where:{userId:t},include:{items:{include:{product:{include:{images:!0}}}},shippingAddress:!0},orderBy:{createdAt:"desc"}});return n.status(200).json(new l(200,"Orders found",{orders:s}))}),ot=m(async(r,n)=>{let t=r.user.id,a=r.query.status;if(!t)throw new e(401,"Unauthorized access");let s=await i.user.findUnique({where:{id:t}});if(!s)throw new e(401,"Unauthorized access");if(s.role!=="ADMIN")throw new e(401,"Unauthorized access");let o=await i.order.findMany({where:{status:a},include:{user:{select:{type:!0}}}});n.status(200).json(new l(200,"Successfully fetched order",{orders:o}))});var $=Lr.Router();$.route("/create-order").post(y,nt);$.route("/create-cod-order").post(y,st);$.route("/get-all-orders").get(y,ot);$.route("/get-orders").get(y,it);var dt=$;import _r from"express";import lt from"axios";var ut="https://pay.flexpaybd.com/api/payment",mt=async r=>{let n=JSON.stringify({success_url:r.success_url,cancel_url:r.cancel_url,metadata:r.meta_data,amount:r.amount}),t=await i.paymentGateway.findUnique({where:{name:"flexpay"},include:{config:!0}});if(!t)throw new e(400,"Invalid api key");let a=t?.config?.api_key;if(!a)throw new e(400,"Invalid api key");console.log(a);let s={method:"post",maxBodyLength:1/0,url:`${ut}/create`,headers:{"API-KEY":a||process.env.FLEXPAY_BRAND_KEY,"Content-Type":"application/json"},data:n};return(await lt(s)).data},yt=async r=>{let n=await i.paymentGateway.findUnique({where:{name:"flexpay"},include:{config:!0}});if(!n)throw new e(400,"Invalid api key");let t=n?.config?.api_key,a=JSON.stringify({transaction_id:r}),s={method:"post",maxBodyLength:1/0,url:`${ut}/verify`,headers:{"API-KEY":t||process.env.FLEXPAY_BRAND_KEY,"Content-Type":"application/json"},data:a};return(await lt(s)).data};import{z as te}from"zod";var Gr=te.object({name:te.string(),orderId:te.string()}),pt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");let s=Gr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{name:o,orderId:d}=s.data,u=await i.order.findUnique({where:{id:d,userId:a.id}});if(!u)throw new e(404,"Order is not placed");console.log(u.totalAmount);let c=parseInt(u.totalAmount.toString()),p=await mt({cus_name:o,cus_email:a.email,amount:c,success_url:process.env.FRONTEND_SUCCESS_URL,cancel_url:process.env.FRONTEND_CANCEL_URL,meta_data:{orderId:d}});if(!p.status)throw new e(500,p.message||"Payment gateway error!");return n.status(200).json(new l(200,"Payment initiated successfully",{paymentUrl:p.payment_url,orderId:d}))}),ct=m(async(r,n)=>{let{transactionId:t}=r.query;if(!t||typeof t!="string")return n.status(400).json({message:"Invalid transaction id"});let a=await yt(t);if(!a.status)throw new e(400,"Something went wrong");let s=a.metadata.orderId;if(!s)throw new e(400,"Something went wrong");let o=await i.order.update({where:{id:s},data:{paymentStatus:"PAID"}});if(!o)throw new e(400,"Something went wrong");let d=await i.cart.findUnique({where:{userId:o.userId}});return n.status(200).json(new l(200,"Payment made and order updated successfully",{verification:a,order:o}))});var re=_r.Router();re.route("/create").post(y,pt);re.route("/verify").post(y,ct);var gt=re;import zr from"express";import{z as T}from"zod";var $r=T.object({gateway_id:T.string(),name:T.string(),description:T.string(),icon:T.string(),is_enabled:T.boolean(),is_configured:T.boolean(),config:T.object({api_key:T.string()})}),Pt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=$r.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{gateway_id:o,name:d,description:u,icon:c,config:p,is_configured:P,is_enabled:f}=s.data,g=await i.paymentGateway.create({data:{gateway_id:o,name:d,description:u,icon:c,config:{create:{api_key:p.api_key}},is_configured:P,is_enabled:f}});if(!g)throw new e(500,"Internal server error creating payment gateway");return n.status(201).json(new l(200,"Created payment gateway successfully",{paymentGateway:{...g,config:{api_key:p.api_key}}}))}),qr=T.object({id:T.string(),gateway_id:T.string(),name:T.string(),description:T.string(),icon:T.string(),is_enabled:T.boolean(),is_configured:T.boolean(),config:T.object({api_key:T.string()})}),ft=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=qr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{id:o,config:d,...u}=s.data;if(!await i.paymentGateway.findUnique({where:{id:o}}))throw new e(404,"Payment gateway not found");let p=await i.paymentGateway.update({where:{id:o},data:{...u,config:{update:{api_key:d.api_key}}},include:{config:!0}});if(!p)throw new e(500,"Internal server error updating payment gateway");return n.status(200).json(new l(200,"Updated payment gateway successfully",{paymentGateway:p}))}),wt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=await i.paymentGateway.findMany({include:{config:!0}});return n.status(200).json(new l(200,"Fetched payment gateways",{paymentGateways:s}))}),At=m(async(r,n)=>{let t=await i.paymentGateway.findMany();return n.status(200).json(new l(200,"Fetched payment gateways",{paymentGateways:t}))}),jr=T.object({id:T.string()}),ht=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=jr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{id:o}=s.data,d=await i.paymentGateway.findUnique({where:{id:o}});if(!d)throw new e(404,"Payment gateway not found");let u=await i.paymentGateway.delete({where:{id:d.id}});if(!u)throw new e(500,"Internal server error deleting payment gateway");return n.status(200).json(new l(200,"Deleted payment gateway successfully",{paymentGateway:u}))});var N=zr.Router();N.route("/add-gateway").post(y,Pt);N.route("/update-gateway").put(y,ft);N.route("/delete-gateway").delete(y,ht);N.route("/").get(y,wt);N.route("/client").get(y,At);var Et=N;import Hr from"express";import{z as ae}from"zod";var Tt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=await i.user.findMany({where:{id:{not:t},role:{notIn:["ADMIN"]}},select:{id:!0,name:!0,email:!0,type:!0,role:!0,createdAt:!0,orders:{select:{orderNumber:!0,id:!0}}}});return n.status(200).json(new l(200,"Successfully fetched customers data",{customers:s}))}),Kr=ae.object({customerId:ae.string(),customerType:ae.string()}),xt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Kr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{customerId:o,customerType:d}=s.data;if(!await i.user.findUnique({where:{id:o,role:{not:"ADMIN"}}}))throw new e(404,"Customer is not found");if(!await i.user.update({where:{id:o},data:{type:d==="WHOLESALE"?"WHOLESALE":"RETAIL"}}))throw new e(500,"Internal server error");return n.status(200).json(new l(200,"Successfully updated the customers type",{customerId:o,customerType:d}))});var ne=Hr.Router();ne.route("/").get(y,Tt);ne.route("/update-type").post(y,xt);var Ut=ne;import Qr from"express";import{z as O}from"zod";var Vr=O.object({userId:O.string(),role:O.string(),department:O.string(),isActive:O.boolean().optional()}),It=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Vr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{userId:o,isActive:d,department:u,role:c}=s.data;if(!await i.user.findUnique({where:{id:o}}))throw new e(400,"Invalid user UUID");if(await i.employee.findUnique({where:{userId:o}}))throw new e(409,"Employee is already been exist");let f=await i.employee.create({data:{userId:o,role:c==="MANAGER"?"MANAGER":c==="SUPPORT"?"SUPPORT":c==="WAREHOUSE"?"WAREHOUSE":"CONTENT",department:u,isActive:d||!1}});if(!f)throw new e(500,"Internal server error creating employee");return n.status(201).json(new l(201,"Added employee successfully",{employee:f}))}),Ot=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=await i.employee.findMany();return n.status(200).json(new l(200,"Fetched employees data",{employees:s}))}),Wr=O.object({id:O.string(),userId:O.string(),role:O.string(),department:O.string(),isActive:O.boolean().optional()}),Ct=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Wr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{id:o,userId:d,isActive:u,department:c,role:p}=s.data;if(!await i.user.findUnique({where:{id:d}}))throw new e(400,"Invalid user UUID");if(!await i.employee.findUnique({where:{id:o}}))throw new e(404,"Employee not found");let g=await i.employee.update({where:{id:o},data:{userId:d,role:p==="MANAGER"?"MANAGER":p==="SUPPORT"?"SUPPORT":p==="WAREHOUSE"?"WAREHOUSE":"CONTENT",isActive:u||!1,department:c}});if(!g)throw new e(500,"Internal server error updating employee");return n.status(200).json(new l(200,"Updated employee successfully",{employee:g}))}),Jr=O.object({employeeId:O.string()}),Rt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Jr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{employeeId:o}=s.data;if(!await i.employee.findUnique({where:{id:o}}))throw new e(404,"Employee not found");let u=await i.employee.delete({where:{id:o}});if(!u)throw new e(500,"Internal server error deleting employee");return n.status(200).json(new l(200,"Deleted employee successfully",{employee:u}))});var q=Qr.Router();q.route("/").get(y,Ot);q.route("/add-employee").post(y,It);q.route("/update-employee").put(y,Ct);q.route("/delete-employee").delete(y,Rt);var bt=q;import ea from"express";import{z as C}from"zod";var Yr=C.object({name:C.string(),phoneNumber:C.string(),email:C.string(),isActive:C.boolean()}),St=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Yr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{name:o,email:d,phoneNumber:u,isActive:c}=s.data,p=await i.deliveryPersonnel.create({data:{name:o,email:d,phoneNumber:u,isActive:c}});if(!p)throw new e(500,"Internal server error creating delivery personnel");return n.status(201).json(new l(201,"Added delivery personnel successfully",{deliveryPersonnel:p}))}),Ft=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=await i.deliveryPersonnel.findMany();return n.status(200).json(new l(200,"Fetched delivery personnels",{deliveryPersonnels:s}))}),Xr=C.object({id:C.string(),name:C.string(),phoneNumber:C.string(),email:C.string(),isActive:C.boolean()}),vt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Xr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{id:o,name:d,email:u,phoneNumber:c,isActive:p}=s.data;if(!await i.deliveryPersonnel.findUnique({where:{id:o}}))throw new e(404,"Delivery personnel not found");let f=await i.deliveryPersonnel.update({where:{id:o},data:{name:d,email:u,phoneNumber:c,isActive:p}});if(!f)throw new e(500,"Internal server error updating delivery personnel");return n.status(200).json(new l(200,"Updated delivery personnel successfully",{deliveryPersonnel:f}))}),Zr=C.object({id:C.string()}),Dt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized Access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=Zr.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{id:o}=s.data;if(!await i.deliveryPersonnel.findUnique({where:{id:o}}))throw new e(404,"Delivery personnel not found");let u=await i.deliveryPersonnel.delete({where:{id:o}});if(!u)throw new e(500,"Internal server error deleting delivery personnel");return n.status(200).json(new l(200,"Deleted delivery personnel successfully",{deliveryPersonnel:u}))});var j=ea.Router();j.route("/personnel").get(y,Ft);j.route("/add-personnel").post(y,St);j.route("/update-personnel").put(y,vt);j.route("/delete-personnel").delete(y,Dt);var kt=j;import na from"express";import{z as M}from"zod";var ta=M.object({brandName:M.string()}),Bt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(401,"Unauthorized access");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=ta.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let o=await i.branding.findMany(),{brandName:d}=s.data;if(o.length){let c=o[0]?.id;if(!c)throw new e(500,"Internal server error no branding id found");if(!await i.branding.update({where:{id:c},data:{brandName:d}}))throw new e(500,"Internal server error updating braning");return n.status(200).json(new l(200,"Updated branding name successfully",{brandName:d}))}if(!await i.branding.create({data:{brandName:d}}))throw new e(500,"Internal server error creating branding");return n.status(201).json(new l(201,"Created branding name successfully",{brandName:d}))}),ra=M.object({brandLogoUrl:M.string()}),Nt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=ra.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{brandLogoUrl:o}=s.data,d=await i.brandLogo.findMany();if(d.length){let c=d[0]?.id;if(!c)throw new e(500,"Internal server error no brand logo id found");let p=await i.brandLogo.update({where:{id:c},data:{url:o}});if(!p)throw new e(500,"Internal server error updating brand logo");return n.status(200).json(new l(200,"Brand logo updated successfully",{brandLogoUrl:p.url}))}if(!await i.brandLogo.create({data:{url:o}}))throw new e(500,"Internel server error creating brand logo");return n.status(201).json(new l(201,"Created brand logo successfully",{brandLogoUrl:o}))}),aa=M.object({brandLogoUrl:M.string()}),Mt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=aa.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{brandLogoUrl:o}=s.data,d=await i.brandLogo.findMany(),u="",c="";if(d.length&&(u=d[0]?.url||"",c=d[0]?.id||""),!c)throw new e(404,"No such brand logo found");if(!u)throw new e(404,"No such brand logo found");if(u!==o)throw new e(400,"Brand logo does not matched");let p=o.split("/uploads/"),P=p[p.length-1];return I(P||""),await i.brandLogo.delete({where:{id:c}}),n.status(200).json(new l(200,"Deleted brand logo successfully",{brandLogoUrl:o}))}),Lt=m(async(r,n)=>{let t=await i.brandLogo.findMany(),a="";t.length&&(a=t[0]?.url||"");let s=await i.branding.findMany(),o="";return s.length&&(o=s[0]?.brandName||""),n.status(200).json(new l(200,"Fetched branding successfully",{brandLogoUrl:a,brandName:o}))});var z=na.Router();z.route("/").get(Lt);z.route("/update-branding").post(y,Bt);z.route("/update-branding/logo").post(y,Nt);z.route("/delete-branding/logo").delete(y,Mt);var Gt=z;import da from"express";import{z as U}from"zod";var sa=U.object({title:U.string(),imageUrl:U.string(),linkUrl:U.string().optional().nullable(),position:U.string(),sortOrder:U.number(),isActive:U.boolean()}),_t=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=sa.safeParse(r.body);if(console.log(r.body),!s.success)throw new e(400,"Invalid credentials");let{title:o,imageUrl:d,linkUrl:u,position:c,sortOrder:p,isActive:P}=s.data,f=await i.banner.create({data:{title:o,imageUrl:d,linkUrl:u||null,position:c,sortOrder:p,isActive:P}});if(!f)throw new e(500,"Internal server error creating banner");return n.status(201).json(new l(201,"Created banner successfully",{banner:f}))}),ia=U.object({bannerId:U.string(),title:U.string(),imageUrl:U.string(),linkUrl:U.string().optional().nullable(),position:U.string(),sortOrder:U.number(),isActive:U.boolean()}),$t=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=ia.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{bannerId:o,title:d,imageUrl:u,position:c,linkUrl:p,isActive:P,sortOrder:f}=s.data;if(!await i.banner.update({where:{id:o},data:{title:d,imageUrl:u,position:c,linkUrl:p||null,isActive:P,sortOrder:f}}))throw new e(500,"Internal server error updating banner");return n.status(200).json(new l(200,"Updated banner successfully"))}),oa=U.object({bannerId:U.string()}),qt=m(async(r,n)=>{let t=r.user.id;if(!t)throw new e(401,"Unauthorized access");let a=await i.user.findUnique({where:{id:t}});if(!a)throw new e(404,"User not found");if(a.role!=="ADMIN")throw new e(401,"Unauthorized access");let s=oa.safeParse(r.body);if(!s.success)throw new e(400,"Invalid credentials");let{bannerId:o}=s.data,d=await i.banner.findUnique({where:{id:o}});if(!d)throw new e(404,"Banner not found");let u=d.imageUrl.split("/uploads/"),c=u[u.length-1];I(c||"");let p=await i.banner.delete({where:{id:d.id}});if(!p)throw new e(500,"Internal server error deleting banner");return n.status(200).json(new l(200,"Deleted banner successfully",{banner:p}))}),jt=m(async(r,n)=>{let t=await i.banner.findMany();return n.status(200).json(new l(200,"Successfully fetched banners",{banners:t}))});var K=da.Router();K.route("/").get(jt);K.route("/create-banner").post(y,_t);K.route("/update-banner").put(y,$t);K.route("/delete-banner").delete(y,qt);var zt=K;var Kt=(r,n,t,a)=>{let s=500,o="Internal Server Error";r instanceof e&&(s=r.statusCode,o=r.message),console.error("\u{1F525} Error:",r),t.status(s).json({success:!1,message:o})};import ua from"cookie-parser";import Ht from"path";import{fileURLToPath as ma}from"url";var ya=ma(import.meta.url),pa=Ht.dirname(ya),h=W();h.use(la());h.use((r,n,t)=>{n.setHeader("Cross-Origin-Resource-Policy","cross-origin"),t()});h.use(W.json());h.use(ua());h.use(W.urlencoded({extended:!0}));h.use(W.static(Ht.join(pa,"../public")));h.get("/",(r,n)=>{n.send("Hello World!")});h.use("/api/auth",Ae);h.use("/api/upload",Se);h.use("/api/delete",Be);h.use("/api/category",qe);h.use("/api/product",Ve);h.use("/api/stats",Qe);h.use("/api/cart",rt);h.use("/api/order",dt);h.use("/api/payment",gt);h.use("/api/customer",Ut);h.use("/api/branding",Gt);h.use("/api/banner",zt);h.use("/api/payment-gateway",Et);h.use("/api/employee",bt);h.use("/api/delivery",kt);h.use(Kt);var Vt=h;import{createServer as ga}from"http";ca.config();var Pa=ga(Vt),Wt=process.env.PORT||5e3;Pa.listen(Wt,()=>{console.log(`Server is running on port ${Wt}`)});
//# sourceMappingURL=server.js.map