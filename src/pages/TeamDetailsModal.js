import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamMembersList: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
  },
}));

const TeamDetailsModal = ({ open, onClose, teamId }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [fetchedTeamDetails, setFetchedTeamDetails] = useState(null);

  useEffect(() => {
    // Fetch the team details here based on the provided teamId
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        const api_url = `https://us-central1-csci-5410-assignment2-391801.cloudfunctions.net/get_user_team?id=${localStorage.getItem("userId")}`;
        const response = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setFetchedTeamDetails(data.team);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team details:", error);
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Team Details</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <Typography variant="body1">Loading team details...</Typography>
        ) : fetchedTeamDetails ? (
          <>
            <Typography variant="h6">Team Name: {fetchedTeamDetails.teamname}</Typography>
            <List className={classes.teamMembersList}>
              {fetchedTeamDetails.teamMembers.map((member) => (
                <ListItem key={member}>
                  <ListItemText primary={`Member ID: ${member}`} />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body1">No team details found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary">
          Invite Other Members to Team
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamDetailsModal;
