import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);

  // ================= BOOKING STATE =================

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  // ================= SCROLL =================

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ================= TRIAL BOOKING =================

  const bookTrial = () => {
    setBookingMessage("");
    setBookingError("");

    setBookingForm((previous) => ({
      ...previous,
      course: "₹99 Trial Class",
    }));

    scrollToSection("booking");
  };

  // ================= BOOKING FORM =================

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBookingForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setBookingMessage("");
    setBookingError("");
  };

  // ================= LOAD RAZORPAY =================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ================= TRIAL PAYMENT =================

  const handleTrialPayment = async () => {
    try {
      setBookingLoading(true);
      setBookingMessage("");
      setBookingError("");

      // Check Razorpay SDK
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay failed to load. Please check your internet connection."
        );
      }

      // Create Razorpay order
      const orderResponse = await fetch(
        "http://localhost:5000/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "trial",
            name: bookingForm.name,
            email: bookingForm.email,
            phone: bookingForm.phone,
            course: bookingForm.course,
            preferredDate: bookingForm.preferredDate,
            preferredTime: bookingForm.preferredTime,
            message: bookingForm.message,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Unable to create payment order."
        );
      }

      // Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: orderData.order.amount,

        currency: orderData.order.currency,

        name: "English With Tanya",

        description: "₹99 Trial English Class",

        order_id: orderData.order.id,

        prefill: {
          name: bookingForm.name,
          email: bookingForm.email,
          contact: bookingForm.phone,
        },

        notes: {
          course: bookingForm.course,
          preferredDate: bookingForm.preferredDate,
          preferredTime: bookingForm.preferredTime,
        },

        theme: {
          color: "#ff4d00",
        },

        handler: async function (response) {
          try {
            setBookingMessage("Verifying your payment...");
            setBookingError("");

            // Verify payment on backend
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payments/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            // Payment successful
            setBookingMessage(
              "Payment successful! Your ₹99 trial class is confirmed. Tanya will contact you soon."
            );

            setBookingError("");

            // Clear form
            setBookingForm({
              name: "",
              email: "",
              phone: "",
              course: "",
              preferredDate: "",
              preferredTime: "",
              message: "",
            });
          } catch (error) {
            console.error("Payment verification error:", error);

            setBookingMessage("");

            setBookingError(
              error.message ||
                "Payment was completed, but verification failed. Please contact Tanya."
            );
          } finally {
            setBookingLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setBookingLoading(false);

            setBookingError(
              "Payment window was closed. Your trial booking has not been confirmed."
            );
          },
        },
      };

      // Check public Razorpay key
      if (!options.key) {
        throw new Error(
          "Razorpay key is missing. Please add VITE_RAZORPAY_KEY_ID to the frontend .env file."
        );
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        setBookingLoading(false);

        setBookingError(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Trial payment error:", error);

      setBookingLoading(false);

      setBookingMessage("");

      setBookingError(
        error.message || "Something went wrong. Please try again."
      );
    }
  };

  // ================= BOOKING SUBMIT =================

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setBookingLoading(true);
    setBookingMessage("");
    setBookingError("");

    try {
      /*
      ================================================
      ₹99 TRIAL
      ================================================
      */

      if (bookingForm.course === "₹99 Trial Class") {
        await handleTrialPayment();
        return;
      }

      /*
      ================================================
      NORMAL COURSE BOOKING
      ================================================
      */

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(bookingForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      setBookingMessage(
        "Booking submitted successfully! Tanya will contact you soon."
      );

      setBookingError("");

      setBookingForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ================= FAQ DATA =================

  const faqs = [
    {
      question: "Who are these English classes for?",
      answer:
        "These classes are designed for adults and learners who want to improve spoken English, grammar, vocabulary, pronunciation and everyday communication.",
    },

    {
      question: "Are the classes live?",
      answer:
        "Yes. The classes are designed around live online sessions with practical speaking activities and personalised feedback.",
    },

    {
      question: "Can I book a trial class?",
      answer:
        "Yes. You can book a trial session for ₹99. Payment is processed securely through Razorpay.",
    },

    {
      question: "Will I receive practice material?",
      answer:
        "Students can receive structured practice materials such as PDFs, exercises and activities depending on the course.",
    },

    {
      question: "Do you offer individual classes?",
      answer:
        "Yes. Individual sessions are available for learners who want personalised attention based on their specific goals.",
    },
  ];

  // ================= COURSES =================

  const courses = [
    {
      number: "01",
      title: "Individual Sessions",
      description:
        "Personalised one-to-one English coaching designed around your speaking goals, confidence and daily communication needs.",
    },

    {
      number: "02",
      title: "Group Classes",
      description:
        "Interactive live classes where learners practise speaking, conversation, vocabulary and communication together.",
    },

    {
      number: "03",
      title: "Complete Grammar Classes",
      description:
        "Build a strong grammar foundation through simple explanations, practical examples and regular exercises.",
    },
  ];

  // ================= REVIEWS =================

  const reviews = [
    {
      name: "Student Review",
      text:
        "The classes helped me become much more confident while speaking English. The sessions are practical and easy to understand.",
    },

    {
      name: "Student Review",
      text:
        "I really enjoyed the speaking activities and personal feedback. I feel much more comfortable communicating in English now.",
    },

    {
      name: "Student Review",
      text:
        "The grammar explanations are simple and practical. The regular practice has helped me improve my communication.",
    },

    {
      name: "Student Review",
      text:
        "The classes are interactive and motivating. I especially liked the personalised feedback after every session.",
    },
  ];

  return (
    <div className="website">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div
          className="logo"
          onClick={() => scrollToSection("home")}
        >
          English <span>With Tanya</span>
        </div>

        <nav className="nav-links">

          <button onClick={() => scrollToSection("about")}>
            About
          </button>

          <button onClick={() => scrollToSection("reviews")}>
            Reviews
          </button>

          <button onClick={() => scrollToSection("courses")}>
            Courses
          </button>

          <button onClick={() => scrollToSection("faq")}>
            FAQ
          </button>

          <button
            className="navbar-button"
            onClick={() => scrollToSection("booking")}
          >
            Book a Class
          </button>

        </nav>

      </header>

      {/* ================= HERO ================= */}

      <section id="home" className="hero">

        <div className="hero-background"></div>

        <div className="hero-content">

          <p className="hero-small-text">
            LIVE ZOOM CLASSES &nbsp; | &nbsp; DAILY PRACTICE
            &nbsp; | &nbsp; PERSONAL FEEDBACK
          </p>

          <h1>
            Speak English
            <br />
            Confidently—Without Fear
          </h1>

          <div className="decorative-line">
            <span></span>
            ◆
            <span></span>
          </div>

          <h2>By Tanya Kumari</h2>

          <p className="hero-subtitle">
            English Communication Coach
            <br />
            ESL &amp; TESOL Certified
          </p>

          <button
            className="orange-button hero-button"
            onClick={bookTrial}
          >
            Book trial — ₹99
            <span>↗</span>
          </button>

          <p className="hero-proof">
            Helping 180K+ learners improve
            <br />
            their English across social media
          </p>

        </div>

        <div className="hero-image-area">

          <div className="image-placeholder hero-person">

            <div className="hero-person">

              <img
                src="/images/first.jpeg"
                alt="Tanya - English Communication Coach"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section id="about" className="about-section section">

        <div className="section-label">
          YOUR ENGLISH JOURNEY
        </div>

        <h2 className="large-heading">
          Transform your English,
          <br />
          Transform your Confidence
        </h2>

        <div className="about-grid">

          <div className="image-placeholder about-image">

            <div>

              <img
                src="/images/second.jpeg"
                alt="Tanya - English Communication Coach"
              />

            </div>

          </div>

          <div className="about-text">

            <p>
              At English with Tanya, the focus goes beyond
              grammar to real-life communication. The training
              is designed especially for adults who want to speak
              English confidently in daily conversations,
              interviews and professional environments.
            </p>

            <p>
              Sessions include sentence formation, practical
              grammar, vocabulary, idioms, pronunciation practice
              and daily conversation with personalised feedback.
            </p>

            <p>
              Interactive and fun speaking activities help
              learners overcome hesitation and develop natural
              speaking confidence. Students can also receive
              structured PDF materials for regular practice.
            </p>

            <button
              className="outline-button"
              onClick={() => scrollToSection("courses")}
            >
              VIEW COURSE DETAILS
            </button>

          </div>

        </div>

      </section>

      {/* ================= REVIEWS ================= */}

      <section id="reviews" className="reviews-section section">

        <div className="section-label center">
          REAL LEARNERS • REAL PROGRESS
        </div>

        <h2 className="large-heading center">
          What My Students Say
        </h2>

        <p className="section-description center">
          See what learners have to say about their English
          learning journey.
        </p>

        <div className="reviews-grid">

          {reviews.map((review, index) => (

            <div className="review-card" key={index}>

              <div className="stars">
                ★★★★★
              </div>

              <p>
                "{review.text}"
              </p>

              <div className="review-name">

                <div className="review-avatar">
                  {index + 1}
                </div>

                <strong>
                  {review.name}
                </strong>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= COURSES ================= */}

      <section id="courses" className="courses-section section">

        <div className="section-label center">
          LEARN • PRACTICE • SPEAK
        </div>

        <h2 className="large-heading center">
          Choose Your Learning Plan
        </h2>

        <p className="section-description center">
          Choose the learning format that matches your goals.
        </p>

        <div className="courses-grid">

          {courses.map((course) => (

            <div
              className="course-card"
              key={course.number}
            >

              <div className="course-number">
                {course.number}
              </div>

              <h3>
                {course.title}
              </h3>

              <p>
                {course.description}
              </p>

              <button
                onClick={() => {

                  setBookingForm((previous) => ({
                    ...previous,
                    course: course.title,
                  }));

                  scrollToSection("booking");

                }}
              >
                BOOK THIS COURSE
                <span>↗</span>
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* ================= BOOKING ================= */}

      <section
        id="booking"
        className="booking-section section"
      >

        <div className="section-label center">
          BOOK YOUR SESSION
        </div>

        <h2 className="large-heading center">
          Start Your English Journey
        </h2>

        <p className="section-description center">
          Fill in the form below and Tanya will get in touch with
          you regarding your English learning session.
        </p>

        <div className="booking-container">

          <form
            className="booking-form"
            onSubmit={handleBookingSubmit}
          >

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={bookingForm.name}
                  onChange={handleBookingChange}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={bookingForm.email}
                  onChange={handleBookingChange}
                  required
                />

              </div>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={bookingForm.phone}
                  onChange={handleBookingChange}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="course">
                  Select Course
                </label>

                <select
                  id="course"
                  name="course"
                  value={bookingForm.course}
                  onChange={handleBookingChange}
                  required
                >

                  <option value="">
                    Select a course
                  </option>

                  <option value="₹99 Trial Class">
                    ₹99 Trial Class
                  </option>

                  <option value="Individual Sessions">
                    Individual Sessions
                  </option>

                  <option value="Group Classes">
                    Group Classes
                  </option>

                  <option value="Complete Grammar Classes">
                    Complete Grammar Classes
                  </option>

                </select>

              </div>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="preferredDate">
                  Preferred Date
                </label>

                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={bookingForm.preferredDate}
                  onChange={handleBookingChange}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="preferredTime">
                  Preferred Time
                </label>

                <input
                  type="time"
                  id="preferredTime"
                  name="preferredTime"
                  value={bookingForm.preferredTime}
                  onChange={handleBookingChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell Tanya about your English learning goals..."
                value={bookingForm.message}
                onChange={handleBookingChange}
              ></textarea>

            </div>

            {bookingMessage && (

              <div className="booking-success">
                {bookingMessage}
              </div>

            )}

            {bookingError && (

              <div className="booking-error">
                {bookingError}
              </div>

            )}

            <button
              type="submit"
              className="orange-button booking-submit"
              disabled={bookingLoading}
            >

              {bookingLoading
                ? "PROCESSING..."
                : bookingForm.course === "₹99 Trial Class"
                ? "PAY ₹99 & BOOK TRIAL"
                : "SUBMIT BOOKING"}

              <span>↗</span>

            </button>

          </form>

        </div>

      </section>

      {/* ================= EBOOK ================= */}

      <section
        id="ebook"
        className="ebook-section section"
      >

        <div className="ebook-container">

          <div className="ebook-content">

            <div className="section-label">
              LEARN AT YOUR OWN PACE
            </div>

            <h2>
              Click this eBook
              <br />
              for just <strong>₹599</strong>
            </h2>

            <p>
              A practical English learning resource created to
              help you practise grammar, vocabulary, sentence
              formation and communication consistently.
            </p>

            <button
              className="orange-button ebook-button"
              onClick={() => navigate("/ebook-checkout")}
            >
              PURCHASE NOW
              <span>↗</span>
            </button>

            <button
              className="contact-small-button"
              onClick={() => scrollToSection("contact")}
            >
              Have a question? Contact Tanya
            </button>

          </div>

          <div className="book-area">

            <div className="book">

              <div className="book-top">
                ENGLISH WITH
              </div>

              <div className="book-title">
                TANYA
              </div>

              <div className="book-middle">
                Speak.
                <br />
                Practise.
                <br />
                Grow.
              </div>

              <div className="book-bottom">
                English Communication
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FAQ ================= */}

      <section id="faq" className="faq-section section">

        <div className="section-label center">
          NEED TO KNOW
        </div>

        <h2 className="large-heading center">
          Frequently Asked Questions
        </h2>

        <div className="faq-container">

          {faqs.map((faq, index) => (

            <div
              className={`faq-item ${
                openFaq === index ? "active" : ""
              }`}
              key={index}
            >

              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === index ? null : index
                  )
                }
              >

                <span>
                  {faq.question}
                </span>

                <span className="faq-icon">
                  {openFaq === index ? "−" : "+"}
                </span>

              </button>

              {openFaq === index && (

                <div className="faq-answer">
                  {faq.answer}
                </div>

              )}

            </div>

          ))}

        </div>

      </section>

      {/* ================= CONTACT CTA ================= */}

      <section className="contact-section">

        <div className="contact-content">

          <div className="section-label">
            READY TO START?
          </div>

          <h2>
            Start speaking English
            <br />
            with confidence.
          </h2>

          <p>
            Take the first step towards better communication
            and greater confidence.
          </p>

          <button
            className="orange-button"
            onClick={bookTrial}
          >
            BOOK YOUR TRIAL — ₹99
          </button>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer id="contact" className="footer">

        <div className="footer-grid">

          <div className="footer-about">

            <div className="footer-logo">
              English <span>With Tanya</span>
            </div>

            <p>
              Speak English confidently—without fear.
            </p>

            <p>
              Live classes • Daily practice • Personal feedback
            </p>

          </div>

          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <button onClick={() => scrollToSection("home")}>
              Home
            </button>

            <button onClick={() => scrollToSection("about")}>
              About
            </button>

            <button onClick={() => scrollToSection("reviews")}>
              Reviews
            </button>

            <button onClick={() => scrollToSection("courses")}>
              Courses
            </button>

            <button onClick={() => scrollToSection("faq")}>
              FAQ
            </button>

          </div>

          <div className="footer-column">

            <h3>
              Contact
            </h3>

            <a href="mailto:englishwithtanya1259@gmail.com">
              ✉ englishwithtanya1259@gmail.com
            </a>

            <a href="tel:+917992333537">
              ☎ +91 79923 33537
            </a>

            <a
              href="https://wa.me/917992333537"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>

          </div>

          <div className="footer-column">

            <h3>
              Follow
            </h3>

            <a
              href="https://www.instagram.com/englishwith__tanya/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://www.facebook.com/share/1DXXQmwKgy/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 English With Tanya. All rights reserved.
          </span>

          <span>
            English Communication Coaching
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;