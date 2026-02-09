# Menski - E-Commerce Platform
## Project Report

**Developed By:** [Your Name]  
**College:** [Your College Name]  
**Date:** 2026-02-09

---

## 1. Introduction

**Menski** is a modern, full-stack e-commerce application designed to provide a seamless shopping experience for men's fashion and lifestyle products. The platform allows users to browse products, manage their cart, place orders, and make secure payments via eSewa. It also includes a robust admin dashboard for managing products, orders, and users.

The project is built using the latest web technologies, including **Next.js 15**, **MongoDB**, **Tailwind CSS**, and **Cloudinary**, ensuring high performance, scalability, and a responsive user interface.

## 2. Objectives

The primary objectives of the **Menski** project are:

*   To build a fully functional e-commerce platform with a user-friendly interface.
*   To implement secure user authentication and authorization (Admin vs. User roles).
*   To provide efficient product management (CRUD operations) for administrators.
*   To facilitate secure online payments using the eSewa payment gateway.
*   To manage order processing and tracking effectively.
*   To utilize cloud storage (Cloudinary) for optimized image management.

## 3. Tech Stack

The project leverages a robust stack of modern technologies:

### Frontend
*   **Next.js 15 (App Router)**: For server-side rendering, routing, and efficient page loading.
*   **React 19**: For building interactive and reusable UI components.
*   **Tailwind CSS**: For rapid, utility-first styling and ensuring a responsive design.
*   **Shadcn/UI & Lucide React**: For pre-built, accessible UI components and icons.
*   **Sonner**: For user notifications (toasts).

### Backend
*   **Next.js Server Actions**: For handling server-side logic directly from UI components, eliminating the need for a separate API layer.
*   **Node.js**: As the runtime environment.
*   **Jose / JSON Web Token (JWT)**: For secure, stateless authentication.

### Database
*   **MongoDB**: A NoSQL database for flexible data storage.
*   **Mongoose**: An ODM (Object Data Modeling) library for strict schema validation and simplified database interactions.

### Third-Party Services
*   **Cloudinary**: For cloud-based image storage and optimization. It handles product image uploads, transformations, and delivery via CDN.
*   **eSewa**: Integrated as the primary payment gateway for secure online transactions in Nepal.

## 4. Key Features

### 4.1 User Module
*   **Authentication**: Users can sign up, log in, and manage their profiles securely.
*   **Product Browsing**: Users can browse products by category, brand, or search query.
*   **Product Details**: Detailed view of products with images, descriptions, prices, and stock status.
*   **Shopping Cart**: Users can add items to their cart, update quantities, and remove items. The cart persists across sessions using local storage.
*   **Checkout Process**: streamlined checkout with address validation and order summary.
*   **Order History**: Users can view their past orders and payment status in their profile.

### 4.2 Admin Module
*   **Dashboard**: Overview of key metrics (Total Sales, Total Orders, etc. - *if implemented*).
*   **Product Management**: Admins can add new products, upload images (to Cloudinary), update details (price, stock), and delete products.
*   **Order Management**: Admins can view all orders, update delivery status (Processing, Delivered), and verify payment details.
*   **User Management**: View registered users and their roles.

### 4.3 Payment Integration (eSewa)
The project integrates eSewa for real-time payments.
*   **Flow**:
    1.  User initiates payment at checkout.
    2.  System generates a unified secure signature using a secret key.
    3.  User is redirected to the eSewa secure payment page.
    4.  Upon success, eSewa redirects back to the application with a verification token.
    5.  Backend verifies the transaction signature and updates the order status to "Paid".

### 4.4 Cloudinary Integration
Images are handled efficiently using Cloudinary.
*   **Upload**: When an admin uploads a product image, it is sent directly to Cloudinary via server actions.
*   **Storage**: Cloudinary returns a secure URL and Public ID, which are stored in the MongoDB database.
*   **Optimization**: Images are served via Cloudinary's CDN, ensuring fast load times and automatic resizing/formatting.

## 5. System Architecture & Database Design

### 5.1 Architecture
The application follows a **Monolithic Architecture** with a clear separation of concerns using the **MVC (Model-View-Controller)** pattern adapted for Next.js:
*   **Models**: Mongoose schemas (`models/`) define the data structure.
*   **Views**: React components (`app/`, `components/`) handle the UI.
*   **Controllers (Actions)**: Server Actions (`actions/`) handle business logic and database interactions.

### 5.2 Database Schema (Key Models)

**User Model**
*   `name`, `email`, `password` (hashed), `role` (user/admin).

**Product Model**
*   `name`, `description`, `price`, `stock`, `images[]` (Cloudinary URLs), `category`, `brand`.

**Order Model**
*   `user`, `orderItems[]`, `shippingAddress`, `paymentMethod`, `paymentDetails` (transaction ID, status), `totalPrice`, `isPaid`, `isDelivered`.

## 6. Implementation Highlights

### 6.1 Cloudinary Configuration (`lib/cloudinary.ts`)
```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, folder: string) {
  // Logic to upload base64 image to Cloudinary folder
}
```

### 6.2 Authentication Middleware
Middleware intercepts requests to protected routes (like `/admin`), verifying the JWT token to ensure only authorized users can access sensitive areas.

## 7. Conclusion
The **Menski** project successfully demonstrates functioning e-commerce capabilities. By integrating modern tools like Next.js and Cloudinary, it achieves high performance and a professional user experience. The secure payment integration with eSewa makes it a practical solution for the local market.
