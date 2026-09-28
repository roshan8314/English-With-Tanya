import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function EbookCheckout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Load Razorpay Checkout
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // 1. Load Razorpay Checkout
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection."
        );
      }

      // 2. Create Razorpay order from backend
      const orderResponse = await fetch(
        "http://localhost:5000/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Unable to create payment order."
        );
      }

      const razorpayOrder = orderData.order;

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "English With Tanya",

        description: "English With Tanya eBook",

        order_id: razorpayOrder.id,

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        theme: {
          color: "#ff4d00",
        },

        handler: async function (response) {
          try {
            // 4. Send payment details to backend for verification
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

            setMessage(
              "Payment successful! Your eBook order has been confirmed."
            );

            setForm({
              name: "",
              email: "",
              phone: "",
            });
          } catch (verificationError) {
            console.error(
              "Payment verification error:",
              verificationError
            );

            setError(
              verificationError.message ||
                "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment was cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="ebook-checkout-page">
      <div className="checkout-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Website
        </button>

        <div className="checkout-grid">
          <div className="checkout-product">
            <div className="checkout-badge">
              ENGLISH WITH TANYA
            </div>

            <h1>
              English Grammar
              <br />
              <span>Made Easy</span>
            </h1>

            <p className="checkout-description">
              Improve your English grammar with a simple and
              practical eBook designed for learners who want to
              speak and write English with confidence.
            </p>

            <div className="checkout-price">
              <span>₹599</span>
            </div>

            <div className="checkout-features">
              <div>✓ Easy-to-understand grammar lessons</div>
              <div>✓ Practical examples</div>
              <div>✓ Beginner-friendly explanations</div>
              <div>✓ Learn at your own pace</div>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-header">
              <span>01</span>
              <h2>Your Details</h2>
            </div>

            <p className="checkout-subtitle">
              Enter your details to continue with your eBook order.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-summary">
                <div>
                  <span>Product</span>
                  <strong>English With Tanya eBook</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>₹599</strong>
                </div>
              </div>

              {message && (
                <div className="checkout-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="checkout-submit"
                disabled={loading}
              >
                {loading
                  ? "OPENING PAYMENT..."
                  : "CONTINUE TO PAYMENT →"}
              </button>
            </form>

            <p className="checkout-note">
              Secure payment processing • Your information is kept private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EbookCheckout;