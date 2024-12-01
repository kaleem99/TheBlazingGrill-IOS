import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/config";
import { auth } from "../database/config";
import { IoArrowBackCircle } from "react-icons/io5";

const RewardsHistory = ({ setProfileSection }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "RewardsClaimed");
        const q = query(
          historyRef,
          where("user", "==", auth.currentUser.email)
        );
        const querySnapshot = await getDocs(q);

        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(historyData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching history:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading reward history...</p>;
  }

  if (error) {
    return <p style={styles.error}>Error: {error}</p>;
  }

  if (history.length === 0) {
    return <p style={styles.noHistory}>No reward history available.</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <IoArrowBackCircle
          style={styles.backIcon}
          onClick={() => setProfileSection("Rewards")}
        />
        <h2 style={styles.title}>Rewards History</h2>
      </div>
      <div style={styles.list}>
        {history.map((item) => (
          <div key={item.id} style={styles.item}>
            <img
              src={item.itemImage}
              alt={item.itemName}
              style={styles.image}
            />
            <div style={styles.details}>
              <h3 style={styles.itemName}>{item.itemName}</h3>
              <p style={styles.pointsSpent}>Points Spent: {item.pointsSpent}</p>
              <p style={styles.date}>
                Claimed At: {new Date(item.claimedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    margin: "auto",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  backIcon: {
    fontSize: "1.8rem",
    color: "#F0941E",
    cursor: "pointer",
    marginRight: "10px",
  },
  title: {
    fontSize: "1.5rem",
    textAlign: "center",
    color: "white",
    margin: "0",
    flex: 1,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    height: "78vh",
    overflow: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "5px",
    objectFit: "cover",
    marginRight: "15px",
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    color: "#333",
  },
  pointsSpent: {
    fontSize: "1rem",
    marginBottom: "5px",
    color: "#555",
  },
  date: {
    fontSize: "0.9rem",
    color: "#888",
  },
  loading: {
    textAlign: "center",
    color: "#888",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  noHistory: {
    textAlign: "center",
    color: "#555",
  },
};

export default RewardsHistory;
