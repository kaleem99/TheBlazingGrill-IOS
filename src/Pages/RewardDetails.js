import React from "react";
import emailjs from "emailjs-com";
import { auth } from "../database/config";
import { doc, runTransaction, collection, addDoc } from "firebase/firestore";
import { db } from "../database/config";

const RewardDetails = ({ item, onClaim, onClose }) => {
  const claimRewards = async () => {
    if (!item || !item.points) {
      console.error("No item or item points to deduct.");
      return;
    }

    const rewardsRef = doc(db, "Rewards", auth.currentUser.email);
    const historyRef = collection(db, "RewardsClaimed"); // Reference to RewardsClaimed collection

    try {
      // Send the email
      const response = await emailjs.send(
        "service_zjr9ht8", // Replace with your actual service ID
        "template_ovy7frn", // Replace with your actual template ID
        {
          name: auth.currentUser.displayName, // Replace with the recipient's name
          item_image: item.fileURL, // Replace with the actual image URL
          item_name: item.name, // Replace with the item's name
          email: "TheBlazingGrillFood@gmail.com", // Replace with your business email
          phone: auth.currentUser.phoneNumber, // Replace with the phone number
          expiry_date: new Date().toLocaleDateString(), // Today's date in a readable format
          from_name: "The Blazing Grill", // Replace with your sender name
          reply_to: "noreply", // Replace with the reply-to email
          to_email: [auth.currentUser.email, "Yushaawally@gmail.com"], // Replace with the recipient email
        },
        "0-uD_Hfp8_pN7YASA"
      );

      console.log("Email sent successfully!", response.status, response.text);

      // Deduct points and update the database
      await runTransaction(db, async (transaction) => {
        const rewardsSnap = await transaction.get(rewardsRef);

        if (!rewardsSnap.exists()) {
          throw new Error("User rewards document does not exist.");
        }

        const currentPoints = rewardsSnap.data().points || 0;

        if (currentPoints < item.points) {
          throw new Error("Not enough points to claim this reward.");
        }

        // Deduct points
        const updatedPoints = currentPoints - item.points;
        const updatedReviewPoints = rewardsSnap.data().reviewPoints || 0;
        transaction.update(rewardsRef, {
          points: updatedPoints,
          reviewPoints: updatedReviewPoints - item.points,
        });

        console.log(
          `Points deducted successfully! Remaining points: ${updatedPoints}`
        );
      });

      // Add the claimed item to RewardsClaimed history
      await addDoc(historyRef, {
        user: auth.currentUser.email,
        itemName: item.name,
        itemImage: item.fileURL,
        pointsSpent: item.points,
        claimedAt: new Date().toISOString(), // Timestamp for when the reward was claimed
      });

      console.log("Reward added to history successfully.");
      alert("Item has been claimed successfully! Please check your email.");
      onClose();
    } catch (error) {
      console.error("Failed to claim reward:", error.message);
    }
  };

  return (
    <div style={detailStyles.container}>
      <button style={detailStyles.closeButton} onClick={onClose}>
        Close
      </button>
      <img src={item.fileURL} alt={item.name} style={detailStyles.image} />
      <h2 style={detailStyles.title}>{item.name}</h2>
      <p style={detailStyles.points}>Points: {item.points}</p>
      <button style={detailStyles.claimButton} onClick={() => claimRewards()}>
        Claim Reward
      </button>
    </div>
  );
};
const detailStyles = {
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    zIndex: 1000,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    position: "absolute",
    top: "10px",
    right: "15px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  },
  title: {
    margin: "15px 0",
    fontSize: "1.5rem",
    color: "#333",
  },
  points: {
    marginBottom: "20px",
    fontSize: "1rem",
    color: "#555",
  },
  claimButton: {
    padding: "10px 20px",
    backgroundColor: "#F0941E",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default RewardDetails;
