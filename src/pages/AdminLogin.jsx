
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css";

const API_URL = "https://english-with-tanya-backend.onrender.com";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return a token. Check the login API response."
        );
      }

      // Store the token for dashboard requests
      sessionStorage.setItem("adminToken", token);

      // Open the admin dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">ENGLISH WITH TANYA</div>

        <div className="admin-login-icon">✦</div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to manage bookings, students and payments.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Admin Email</label>

          <input
            id="admin-email"
            type="email"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>

          <input
            id="admin-password"
            type="password"
            placeholder="Enter your admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized administrators only
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;

