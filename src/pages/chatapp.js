// Chat.js

import React, { useEffect, useState } from "react";
import { collection, serverTimestamp, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/chatapp.module.css"; // Import the CSS module

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messageRef = collection(db, "messages");

  useEffect(() => {
    const queryMessage = query(
      messageRef,
      where("room", "==", room),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    // Retrieve the user value from local storage
    const currentLoggedInUser = JSON.parse(localStorage.getItem("currentLoggedInUser"));
    const user = currentLoggedInUser.display_name;

    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user,
      room,
    });

    // Reset the newMessage state to clear the input field
    setNewMessage("");
  };

  return (
    <div className={styles["chat-app"]}>
      <div className={styles["message-list"]}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <p>
              <span style={{ marginLeft: "8px" }}>
                {message.createdAt?.toDate()?.toLocaleTimeString()}
              </span>
              {" " + message.user + " -->"}
              <strong>{message.text}</strong>
            </p>
          </div>
        ))}
      </div>

      <form className={styles["new-message-form"]} onSubmit={handleSubmit}>
        <input
          className={styles["new-message-input"]}
          placeholder="your message"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button className={styles.sendbutton}>Send</button>
      </form>
    </div>
  );
};
