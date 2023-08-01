import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Table from "../Table";
import styles from "../Leaderboard/index.module.css";

const EntityDetailsModal = ({ entityType, entityName, onClose, isOpen }) => {
  const [entityData, setEntityData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (isOpen) {
      // Fetch detailed data for the specific entity using the entity name
      fetchEntityData();
    }
  }, [isOpen, entityName, timeFrame, category]);

  const columns = React.useMemo(
    () => [
      //   { Header: "Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      { Header: "Right Answer", accessor: "right_answers" },
      { Header: "Wrong Answer", accessor: "wrong_answers" },
      { Header: "Score", accessor: "score" },
    ],
    []
  );

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

  const fetchEntityData = async () => {
    try {
      const resp = await axios.post(
        "https://oqgwtsxibuxjiprfkahpn7dhpa0mzvig.lambda-url.us-east-1.on.aws/",
        {
          entity_type: entityType,
          name: entityName,
          time_frame: timeFrame === "all-time" ? null : timeFrame,
          category: category === "all" ? null : category,
        }
      );
      const fetchedData = resp.data;
      console.log(fetchedData);
      setEntityData(fetchedData);
    } catch (error) {
      console.error("Error fetching entity data:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          width: 400,
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {entityName}
        </Typography>
        <Box className={styles.filters}>
          <FormControl>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
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
              label="Time Frame"
            >
              {timeFrameOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Table columns={columns} data={entityData} />
      </Box>
    </Modal>
  );
};

export default EntityDetailsModal;
