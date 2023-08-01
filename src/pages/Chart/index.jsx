import React, { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from "recharts";

import Typography from "@mui/material/Typography";
import classes from "./index.module.css";
import EntityDetailsModal from "../EntityDetailsModal";

const ChartComponent = ({ data, entityType }) => {
  // Get the top 3 entries
  const topEntries = data.slice(0, 3);

  // Prepare the data for the chart
  const chartData = topEntries.map((entry) => ({
    name: entry.name,
    efficiency: entry.efficiency,
    right_answers: entry.total_right_answers,
    wrong_answers: entry.total_wrong_answers,
  }));

  // State to manage the selected entity for the modal
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Click event handler for the chart bars
  const handleChartClick = (entry) => {
    console.log(entry.payload);
    setSelectedEntity(entry.activeLabel);
  };

  const handleCloseModal = () => {
    setSelectedEntity(null);
  };

  return (
    <div className={classes.chartContainer}>
      {data.length > 0 ? (
        <>
          <BarChart width={600} height={500} data={chartData} onClick={handleChartClick}>
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="efficiency" fill="#8884d8" >
              <LabelList dataKey="efficiency" position="insideTop" fill="#fff" />
            </Bar>
          </BarChart>
          <Typography variant="h6" align="center" className={classes.chartTitle}>
            Top 3 {topEntries[0].entity_type === "team" ? "Teams" : "Players"}
          </Typography>
          {selectedEntity && (
            <EntityDetailsModal entityName={selectedEntity} entityType={entityType} isOpen={Boolean(selectedEntity)} onClose={handleCloseModal} />
          )}
        </>
      ) : (
        <Typography variant="h6" align="center" className={classes.noDataText}>
          No Data Found
        </Typography>
      )}
    </div>
  );
};

export default ChartComponent;
