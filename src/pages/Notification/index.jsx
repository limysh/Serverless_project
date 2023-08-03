import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the external API
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const apiEndpoint = "https://hzyp7ajuq6m65xw5vcai6qxis40jyngr.lambda-url.us-east-1.on.aws/";
      const user_data = JSON.parse(localStorage.getItem('currentLoggedInUser'));
      console.log(user_data);
      const user_id = user_data["uid"];
      console.log(user_id);
      const id = "TeamW";
      
      const response = await axios.post(apiEndpoint, { id });

      // Assuming the response data is in the format { key: [notification1, notification2, ...] }
      console.log(response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
      <h1>Notifications</h1>
      {notifications.map((notification, index) => (
        <Card key={index} sx={{ marginBottom: 2, background: "gray", width: "500px" }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {notification}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationPage;
