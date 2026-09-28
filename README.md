1. Project Overview

Project: English With Tanya

Purpose: A modern English-learning website for Tanya Kumari where students can:

Learn about Tanya and her English coaching
View student reviews
Explore courses
Book a ₹99 trial class
Purchase the ₹599 English Grammar eBook
Submit booking information
Make online payments through Razorpay
Technology Stack

Frontend

React.js
Vite
JavaScript
CSS
React Router

Backend

Node.js
Express.js
MongoDB Atlas
Mongoose
CORS
dotenv

Payment

Razorpay
Razorpay Test Mode currently being used for testing
2. Project Folder Structure

Your project is currently structured like this:

EnglishWithTanya/
│
├── english-with-tanya/
│   ├── .env
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── EbookCheckout.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
└── server/
    ├── .env
    ├── models/
    │   ├── Booking.js
    │   └── EbookOrder.js
    ├── routes/
    │   ├── bookingRoutes.js
    │   ├── ebookOrderRoutes.js
    │   └── paymentRoutes.js
    ├── server.js
    ├── package.json
    └── node_modules/
3. Frontend Website

The website contains:

Navbar
English With Tanya logo
About
Reviews
Courses
FAQ
Book a Class
Hero Section

Main heading:

Speak English Confidently—Without Fear

Includes:

Tanya Kumari
English Communication Coach
ESL & TESOL Certified
LIVE ZOOM CLASSES
DAILY PRACTICE
PERSONAL FEEDBACK
₹99 Trial Class
180K+ learners
4. About Section

The website explains Tanya's English coaching journey and focuses on helping learners with:

Daily English conversations
Interviews
Professional communication
Confidence
Grammar
Speaking practice
5. Reviews Section

Student review screenshots/content are displayed as part of the website.

Images can be replaced through the project's public/images folder.

6. Courses Section

Current courses include:

Individual Sessions

One-to-one English coaching.

Group Classes

Interactive English learning in groups.

Complete Grammar Classes

Focused grammar learning.

Course buttons connect users to the booking section.

7. ₹99 Trial Class

The website includes a ₹99 trial class.

The booking form collects:

Name
Email
Phone
Course
Preferred Date
Preferred Time
Message

When the user clicks the trial CTA, the website takes them to the booking section.

8. Booking Backend

Created:

server/models/Booking.js

and:

server/routes/bookingRoutes.js

API:

POST http://localhost:5000/api/bookings

and:

GET http://localhost:5000/api/bookings

The booking system has statuses:

Pending
Confirmed
Completed
Cancelled

Booking data is stored in MongoDB Atlas.

You already tested this successfully.

9. eBook System

We created an eBook order system for:

English With Tanya eBook

Price:

₹599

Created:

server/models/EbookOrder.js

and:

server/routes/ebookOrderRoutes.js

API:

POST http://localhost:5000/api/ebook-orders

and:

GET http://localhost:5000/api/ebook-orders

You successfully tested this through Postman and confirmed that the order is saved in MongoDB.

10. eBook Checkout Page

We installed:

npm install react-router-dom

and created:

src/pages/EbookCheckout.jsx

The route is:

/ebook-checkout

So the full local URL is:

http://localhost:5173/ebook-checkout

The main website's eBook button now sends users to this checkout page.

11. React Router

Your main.jsx now contains routes similar to:

<Routes>
  <Route path="/" element={<App />} />
  <Route path="/ebook-checkout" element={<EbookCheckout />} />
</Routes>

So you have:

/

for the main website and:

/ebook-checkout

for eBook purchasing.

12. Razorpay Integration

This was the latest major feature we added.

You installed:

npm install razorpay

in the backend.

Created:

server/routes/paymentRoutes.js

The backend can now create Razorpay payment orders.

API:

POST http://localhost:5000/api/payments/create-order

The backend currently creates:

₹599

orders in production configuration.

For testing, you temporarily changed it to:

₹1

which equals:

100 paise
13. Razorpay Environment Variables

Backend:

server/.env

contains:

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

The secret must never be placed in the React frontend or GitHub.

Frontend:

english-with-tanya/.env

contains only:

VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx

The frontend uses the Key ID only.

14. Razorpay Test Mode

You initially had:

rzp_live_...

which is a Live Mode key.

We switched the testing setup to:

rzp_test_...

which is the appropriate key for Test Mode.

You also had an authentication error:

401 Authentication failed
BAD_REQUEST_ERROR

because the Razorpay credentials didn't match.

We corrected the credentials and successfully got Razorpay Checkout to open.

15. Razorpay Payment Flow

The current flow is:

Customer
   ↓
Ebook Checkout
   ↓
Enter Name / Email / Phone
   ↓
Click Continue to Payment
   ↓
Frontend calls backend
   ↓
Backend creates Razorpay Order
   ↓
Razorpay Checkout opens
   ↓
Customer completes payment
   ↓
Razorpay returns payment details
   ↓
Frontend sends details to backend
   ↓
Backend verifies Razorpay signature

The frontend uses:

https://checkout.razorpay.com/v1/checkout.js
16. Payment Signature Verification

We added:

server/routes/paymentRoutes.js

with:

POST /api/payments/verify-payment

The backend uses:

crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)

to verify:

razorpay_order_id
+
razorpay_payment_id

against:

razorpay_signature

This prevents the browser from simply claiming:

Payment successful

without the backend verifying it.

17. MongoDB Payment Fields

We updated:

server/models/EbookOrder.js

to store:

razorpayOrderId
razorpayPaymentId
razorpaySignature

along with:

paymentStatus

Possible payment statuses:

Pending
Paid
Failed

Order statuses:

Pending
Completed
Cancelled
18. Current Payment Test

You successfully reached the Razorpay Checkout window.

For testing, we temporarily changed:

₹599

to:

₹1

Backend:

amount: 100

Frontend display:

₹1

This lets you test the complete Razorpay flow without testing the ₹599 product price.

After testing, the amount should be changed back to:

₹599

or:

amount: 59900
19. Current Backend Status

Your backend is running successfully:

MongoDB connected successfully
Server running on http://localhost:5000

The backend currently supports:

/api/bookings
/api/ebook-orders
/api/payments/create-order
/api/payments/verify-payment
20. Current Frontend Payment Flow

Your EbookCheckout.jsx now:

Collects customer details.
Loads Razorpay Checkout.
Calls the backend.
Creates a Razorpay order.
Opens Razorpay Checkout.
Receives Razorpay payment information.
Sends the information to the backend.
Requests signature verification.
Displays payment success/failure.
21. What Is Still Left

There are a few important things still to complete before calling the payment system fully production-ready.

A. Connect successful payment to MongoDB

Currently the backend verifies the Razorpay signature, but we still need to connect that successful payment to the corresponding EbookOrder.

We want MongoDB to ultimately show:

Name
Email
Phone
Product
Amount
Payment Status: Paid
Razorpay Order ID
Razorpay Payment ID
Razorpay Signature
B. Save the customer's details with the Razorpay order

The current payment creation endpoint creates the Razorpay order, but we should connect it to the customer's eBook order record.

C. Change ₹1 back to ₹599

After testing:

₹1

should become:

₹599
D. eBook delivery

After successful payment, we still need to decide how Tanya will deliver the eBook.

Possible flow:

Payment successful
       ↓
MongoDB → Paid
       ↓
Email sent to customer
       ↓
eBook download/link
E. Production deployment

Eventually:

React/Vite
      ↓
Netlify
      ↓
Live Node/Express backend
      ↓
MongoDB Atlas
      ↓
Razorpay Live Mode

The backend will need to be deployed separately because Netlify is primarily hosting your frontend.

F. Switch Razorpay to Live Mode

Only after the entire test flow works:

rzp_test_...

will be replaced with the appropriate:

rzp_live_...

credentials.

The live secret must remain only on the backend.

22. Important Security Rules

Never upload this to GitHub:

RAZORPAY_KEY_SECRET
MONGODB_URI

Your .gitignore should include:

.env

The frontend can contain:

VITE_RAZORPAY_KEY_ID

but never:

VITE_RAZORPAY_KEY_SECRET

because Vite frontend variables are exposed to the browser.

23. Overall Project Architecture

Your final architecture is essentially:

                    ENGLISH WITH TANYA
                           │
                           ▼
                    React + Vite
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
        Main Website              eBook Checkout
             │                           │
             │                           ▼
             │                       Razorpay
             │                           │
             ▼                           ▼
        Booking API                Payment API
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    Node + Express
                           │
                           ▼
                     MongoDB Atlas

So at this point, you've gone from a frontend-only website to a proper full-stack website with database-backed bookings, eBook orders, and Razorpay payment processing. 🚀