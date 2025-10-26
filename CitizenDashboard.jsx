import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import MapPicker from "../components/MapPicker";

function CitizenDashboard() {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState(null);
  const [requests, setRequests] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "pickups"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wasteType || !quantity || !location) {
      alert("Please fill all fields and select a location!");
      return;
    }
    try {
      await addDoc(collection(db, "pickups"), {
        userId: user.uid,
        email: user.email,
        type: wasteType,
        quantity,
        location,
        status: "Pending",
        createdAt: new Date(),
      });
      setWasteType("");
      setQuantity("");
      alert("Pickup request submitted successfully!");
    } catch (err) {
      console.error("Error adding pickup:", err);
      alert("Error submitting pickup request.");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.logo}>♻️ Inorganic Waste</h2>
        <div>
          <span style={{ marginRight: "15px" }}>{user?.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.container}>
        <div style={styles.formCard}>
          <h3>Request Waste Pickup</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Waste Type (e.g., Plastic, Metal)"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Quantity (kg)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={styles.input}
            />
            <h4>Select Pickup Location:</h4>
            <MapPicker onSelect={setLocation} />
            <button type="submit" style={styles.submitBtn}>
              Submit Request
            </button>
          </form>
        </div>

        <div style={styles.requestsCard}>
          <h3>📦 My Pickup Requests</h3>
          {requests.length === 0 ? (
            <p>No pickup requests yet.</p>
          ) : (
            requests.map((r) => (
              <div key={r.id} style={styles.requestItem}>
                <p><b>Type:</b> {r.type}</p>
                <p><b>Quantity:</b> {r.quantity} kg</p>
                <p><b>Status:</b> {r.status}</p>
                <p>
                  <b>Location:</b> Lat: {r.location.lat}, Lng: {r.location.lng}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #076c65ff, #076c65ff)",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "#ffffffff", 
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  logo: {
    margin: 0,
    color: "#00424aff",
  },
  logoutBtn: {
    background: "#ec5a58ff",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    gap: "500px",
    padding: "25px",
    justifyContent: "space-around",
  },
  formCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "25px",
    borderRadius: "15px",
    width: "40%",
  },
  requestsCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "25px",
    borderRadius: "15px",
    width: "40%",
    overflowY: "auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "none",
    borderRadius: "8px",
    outline: "none",
    background: "rgba(0, 0, 0, 0.2)",
    color: "#fafafa",
  },
  submitBtn: {
    background: "linear-gradient(90deg, #b2ff59, #76ff03)",
    color: "#003300",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  requestItem: {
    background: "rgba(58, 19, 19, 0.2)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
};

export default CitizenDashboard;
