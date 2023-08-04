import React, { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from "recharts";

import Typography from "@mui/material/Typography";
import classes from "./index.module.css";
import EntityDetailsModal from "../EntityDetailsModal";

const ChartComponent = ({ data, entityType }) => {
  const topEntries = data.slice(0, 3);

  const chartData = topEntries.map((entry) => ({
    name: entry.name,
    efficiency: entry.efficiency,
    right_answers: entry.total_right_answers,
    wrong_answers: entry.total_wrong_answers,
    score: entry.total_score
  }));

  const [selectedEntity, setSelectedEntity] = useState(null);

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
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ payload, label, active }) => {
                if (active) {
                  const entry = payload[0].payload;
                  return (
                    <div className={classes.tooltip} style={{background: "white"}}>
                      <p style={{margin: "10px"}}>{`${label}`}</p>
                      <p style={{margin: "10px"}}>{`Efficiency: ${entry.efficiency}%`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="right_answers" stackId="a" fill="#82ca9d" />
            <Bar dataKey="wrong_answers" stackId="a" fill="#ff4444" />
            <LabelList dataKey="efficiency" position="top" fill="#000" />
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
