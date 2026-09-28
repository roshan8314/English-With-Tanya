import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ebook-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order submission failed.");
      }

      setMessage(
        "Order details submitted successfully! Tanya will contact you soon."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("eBook order error:", error);

      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
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
            <div className="checkout-badge">ENGLISH WITH TANYA</div>

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
                {loading ? "SUBMITTING..." : "CONTINUE TO PAYMENT →"}
              </button>
            </form>

            <p className="checkout-note">
              Secure order processing • Your information is kept private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EbookCheckout;