import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tab,
  Tabs,
  Container,
} from "@mui/material";
import axios from "axios";
import Table from "../Table";
import styles from "./index.module.css";
import Chart from "../Chart";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(0);


  useEffect(() => {
    // Fetch leaderboard data based on the selected time frame
    fetchLeaderboardData();
  }, [timeFrame, activeTab, category]);

  const fetchLeaderboardData = async () => {
    const resp = await axios.post(
      "https://oqgwtsxibuxjiprfkahpn7dhpa0mzvig.lambda-url.us-east-1.on.aws/",
      {
        entity_type: activeTab === 0 ? "team" : "player",
        time_frame: timeFrame === "all-time" ? null : timeFrame,
        category: category === "all" ? null : category,
      }
    );
    const fetchedData = resp.data;
    setLeaderboardData(fetchedData);
  };


  // Define the columns for the leaderboard table
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      // { Header: "Category", accessor: "category" },
      { Header: "Right Answer", accessor: "total_right_answers" },
      { Header: "Wrong Answer", accessor: "total_wrong_answers" },
      { Header: "Score", accessor: "total_score" },
      
    ],
    []
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const timeFrameOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "all-time", label: "All Time" },
  ];

  const categoryOptions = [
    { value: "all", label: "ALL" },
    { value: "History", label: "History" },
    { value: "Sports", label: "Sports" },
    { value: "Geography", label: "Geography" },
    { value: "Science", label: "Science" },
  ];

  return (
    <Container className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom className={styles.heading}>
        Leaderboard
      </Typography>
      <Box className={styles.tabs}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Teams" />
          <Tab label="Individual Players" />
        </Tabs>
      </Box>
      <Box className={styles.filters}>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category">
            {categoryOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="time-frame-label">Time Frame</InputLabel>
          <Select
            labelId="time-frame-label"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            label="Time Frame">
            {timeFrameOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Table columns={columns} data={leaderboardData} />
      <Box className={styles.statistics}>
        <Typography variant="h5" align="center" gutterBottom>
          Statistics
        </Typography>
        {/* Add your graph component here */}
        <Chart data={leaderboardData} entityType={activeTab === 0 ? "team" : "player"} />
      </Box>
    </Container>
  );
};

export default LeaderboardPage;
