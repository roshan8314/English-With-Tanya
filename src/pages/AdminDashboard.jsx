
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "https://english-with-tanya-backend.onrender.com";

function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [ebookOrders, setEbookOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin", { replace: true });
        return;
      }

      try {
        // Fetch dashboard summary
        const response = await fetch(
          `${API_URL}/api/admin/dashboard/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load dashboard."
          );
        }

        setSummary(data.summary);
        setBookings(data.recentBookings || []);
        setEbookOrders(data.recentEbookOrders || []);

        // Fetch all student booking records
        const studentsResponse = await fetch(
          `${API_URL}/api/admin/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentsData = await studentsResponse.json();

        if (
          studentsResponse.status === 401 ||
          studentsResponse.status === 403
        ) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
          return;
        }

        if (!studentsResponse.ok || !studentsData.success) {
          throw new Error(
            studentsData.message ||
              "Unable to load student records."
          );
        }

        setStudents(studentsData.students || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="admin-state">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-state">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: summary?.totalBookings ?? 0,
    },
    {
      label: "Total Students",
      value: summary?.totalStudents ?? 0,
    },
    {
      label: "Pending Bookings",
      value: summary?.pendingBookings ?? 0,
    },
    {
      label: "Confirmed Bookings",
      value: summary?.confirmedBookings ?? 0,
    },
    {
      label: "Completed Bookings",
      value: summary?.completedBookings ?? 0,
    },
    {
      label: "eBook Orders",
      value: summary?.totalEbookOrders ?? 0,
    },
    {
      label: "Paid Bookings",
      value: summary?.paidBookings ?? 0,
    },
    {
      label: "Paid eBook Orders",
      value: summary?.paidEbookOrders ?? 0,
    },
  ];

  return (
    <main className="admin-dashboard">
      {/* Dashboard header */}
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">
            ENGLISH WITH TANYA
          </p>

          <h1>Admin Dashboard</h1>

          <p className="admin-muted">
            Manage your students, bookings and payments.
          </p>
        </div>

        <button
          className="admin-logout"
          onClick={logout}
        >
          Log Out
        </button>
      </header>

      {/* Revenue cards */}
      <section className="admin-revenue-grid">
        <article className="admin-revenue-card">
          <p>Total Recorded Revenue</p>
          <h2>{formatCurrency(summary?.totalRevenue)}</h2>
        </article>

        <article className="admin-revenue-card">
          <p>Booking Revenue</p>
          <h2>{formatCurrency(summary?.bookingRevenue)}</h2>
        </article>

        <article className="admin-revenue-card">
          <p>eBook Revenue</p>
          <h2>{formatCurrency(summary?.ebookRevenue)}</h2>
        </article>
      </section>

      {/* Statistics */}
      <section className="admin-stats-grid">
        {stats.map((stat) => (
          <article
            className="admin-stat-card"
            key={stat.label}
          >
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      {/* All students and booking records */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>All Students & Bookings</h2>
            <p className="admin-muted">
              All student booking records and payment details.
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="admin-empty">
            No student records found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Preferred Class</th>
                  <th>Booking Status</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{student.name || "—"}</td>
                    <td>{student.email || "—"}</td>
                    <td>{student.phone || "—"}</td>
                    <td>{student.course || "—"}</td>

                    <td>
                      {student.preferredDate || "—"}
                      <br />
                      {student.preferredTime || ""}
                    </td>

                    <td>
                      <span className="admin-status">
                        {student.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <span className="admin-status">
                        {student.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td>
                      {formatCurrency(student.paymentAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Recent Bookings</h2>
            <p className="admin-muted">
              The five latest booking records.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <p className="admin-empty">
            No bookings found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id || index}>
                    <td>{booking.name || "—"}</td>
                    <td>{booking.email || "—"}</td>
                    <td>{booking.course || "—"}</td>
                    <td>{formatDate(booking.createdAt)}</td>

                    <td>
                      <span className="admin-status">
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {booking.paymentStatus || "Unrecorded"}
                      {booking.paymentAmount
                        ? ` · ${formatCurrency(
                            booking.paymentAmount
                          )}`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent eBook orders */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Recent eBook Orders</h2>
            <p className="admin-muted">
              The five latest eBook order records.
            </p>
          </div>
        </div>

        {ebookOrders.length === 0 ? (
          <p className="admin-empty">
            No eBook orders found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {ebookOrders.map((order, index) => (
                  <tr key={order._id || index}>
                    <td>{order.name || "—"}</td>
                    <td>{order.email || "—"}</td>
                    <td>{formatDate(order.createdAt)}</td>

                    <td>
                      <span className="admin-status">
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td>{formatCurrency(order.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="admin-disclaimer">
        Revenue figures reflect the amounts recorded in your
        database; verify them against confirmed payment records
        before using them for accounting.
      </p>
    </main>
  );
}

export default AdminDashboard;
