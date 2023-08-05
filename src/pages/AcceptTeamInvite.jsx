import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AcceptTeamInvite = () => {
  let location = useLocation();

  const navigate = useNavigate();

  // Create a new URLSearchParams instance
  let params = new URLSearchParams(location.search);

  const userDetails = localStorage.getItem("currentLoggedInUser");
  const userData = JSON.parse(userDetails);
  const userId = userData?.uid;

  // Use the get method to get the values
  let teamId = params.get("teamId");
  console.log(
    "🚀 ~ file: AcceptTeamInvite.jsx:14 ~ AcceptTeamInvite ~ teamId:",
    teamId
  );
  let email = params.get("email");
  console.log(
    "🚀 ~ file: AcceptTeamInvite.jsx:16 ~ AcceptTeamInvite ~ email:",
    email
  );

  const [once, setOnce] = useState(false);

  const handleAddToTeam = async () => {
    try {
      const res = await axios.post(
        `https://us-central1-csci-5410-assignment2-391801.cloudfunctions.net/add_to_team`,
        {
          userId: userId,
          username: email,
          teamId: teamId,
        }
      );

      if (res.status < 400) {
        const createTeamRes = res.data;
        toast.success(createTeamRes?.message);
        navigate("/game-lobby");
      } else {
        console.error("An error occurred.");
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  };

  useEffect(() => {
    console.log("useEffect called");
    if (teamId && email && userId && !once) {
      handleAddToTeam();
      setOnce(true);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>Adding to team...</div>
    </div>
  );
};

export default AcceptTeamInvite;
