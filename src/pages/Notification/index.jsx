import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    // Fetch notifications from the external API
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const apiEndpoint = "https://hzyp7ajuq6m65xw5vcai6qxis40jyngr.lambda-url.us-east-1.on.aws/";
      const id = "TeamB";
      
      const response = await axios.post(apiEndpoint, { id });

      // Assuming the response data is in the format { key: [notification1, notification2, ...] }
      console.log(response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {Object.keys(notifications).map((key) => (
        <Card key={key} sx={{ marginBottom: 10 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {key}
            </Typography>
            <ul>
              {notifications[key].map((notification, index) => (
                <li key={index}>
                  <Typography variant="body1" gutterBottom>
                    {notification}
                  </Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationPage;
