import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../chatapp-config";

export const Chat = (props) => {
    const {room}=props
  const [newMessage, setNewMessage] = useState("");

  const messageRef = collection(db, "messages");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;
    console.log(newMessage);

    // Retrieve the user value from local storage
    const currentLoggedInUser = localStorage.getItem("currentLoggedInUser");
    const user = currentLoggedInUser.getItem("display_name");

    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user,
      room
    });

    // Reset the newMessage state to clear the input field
    setNewMessage("");
  };

  return (
    <div className="chat-app">
      <form className="new-message-form" onSubmit={handleSubmit}>
        <input
          className="new-message-input"
          placeholder="your message"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button className="sendbutton">Send</button>
      </form>
    </div>
  );
};
