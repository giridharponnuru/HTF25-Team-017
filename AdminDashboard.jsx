import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pickups"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(data);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const pickupRef = doc(db, "pickups", id);
      await updateDoc(pickupRef, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>♻️ Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.container}>
        <h2>All Pickup Requests</h2>
        {requests.length === 0 ? (
          <p>No pickups yet.</p>
        ) : (
          <div style={styles.grid}>
            {requests.map((req) => (
              <div key={req.id} style={styles.card}>
                <h3>{req.type}</h3>
                <p>
                  <b>Quantity:</b> {req.quantity} kg
                </p>
                <p>
                  <b>User:</b> {req.userEmail}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        req.status === "Pending"
                          ? "orange"
                          : req.status === "Enroute"
                          ? "blue"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {req.status}
                  </span>
                </p>
                <p>
                  <b>Location:</b> {req.location?.lat}, {req.location?.lng}
                </p>

                <div style={styles.btnGroup}>
                  {["Pending", "Enroute", "Collected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(req.id, status)}
                      style={{
                        ...styles.statusBtn,
                        backgroundColor:
                          status === "Pending"
                            ? "#f57c00"
                            : status === "Enroute"
                            ? "#0277bd"
                            : "#2e597dff",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #80bdc7ff, #075965ff)",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
    padding: "100px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  logoutBtn: {
    backgroundColor: "#bc8989ff",
    border: "none",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  container: {
    background: "#fafafa",
    borderRadius: "16px",
    padding: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  btnGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
  },
  statusBtn: {
    flex: 1,
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};
