English With Tanya — Project Summary

English With Tanya is a modern, responsive English-learning website designed to promote Tanya's online English communication classes, showcase student results, sell her eBook, and allow visitors to book classes.

🛠️ Technology Stack
Frontend: React.js
Build Tool: Vite
Language: JavaScript
Styling: CSS
Responsive: Desktop, tablet & mobile
Backend: Not added yet
Payment: Not connected yet
📄 Website Structure

The website will have the following sections:

Navbar
English With Tanya logo
About
Reviews
Courses
FAQ
Book a Class
Hero Section
Main heading: “Speak English Confidently—Without Fear”
Tanya's introduction
ESL/TESOL information
₹99 trial-class CTA
Tanya's photograph
About / English Journey
Introduction to Tanya
Explanation of her teaching approach
English speaking, grammar, vocabulary and confidence-building
Tanya's photograph
Student Reviews
Customer testimonials
Review cards
Actual customer screenshot section
⭐ ratings
Courses
Individual Sessions
Group Classes
Complete Grammar Classes
Course descriptions
Booking buttons
₹599 eBook
eBook promotional section
eBook cover
₹599 price
Purchase Now button
Later this will connect to a payment system.
FAQ
Frequently asked questions
Expand/collapse answers using + / −
Booking CTA
“Start speaking English with confidence”
₹99 trial booking button
Footer
About Tanya
Quick links
Email
Phone
WhatsApp
Instagram/Facebook
Copyright
📁 Current Project Structure
english-with-tanya/
│
├── public/
│   └── images/
│       ├── tanya-hero.jpg
│       ├── tanya-about.jpg
│       └── reviews/
│           ├── review1.jpg
│           ├── review2.jpg
│           └── ...
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
└── package-lock.json
🔄 Current Status

The frontend structure is already designed. The main remaining work is:

Current Frontend
      ↓
Add Tanya's real photos
      ↓
Add actual customer review screenshots
      ↓
Match Canva design more precisely
      ↓
Add real contact information
      ↓
Connect WhatsApp
      ↓
₹99 class booking/payment
      ↓
₹599 eBook payment
      ↓
Backend/database if required
      ↓
Deploy
      ↓
LIVE WEBSITE

Important: The current version uses image placeholders. Your real images can be placed inside public/images/, and the JSX can reference them using paths such as:

<img
  src="/images/tanya-hero.jpg"
  alt="Tanya"
/>

So the project is currently a React/Vite frontend website, and the next major step is replacing the placeholders with the actual Canva photos/review screenshots and then connecting the booking and payment functionality.