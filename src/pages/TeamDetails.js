import React, { useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  teamMembersList: {
    backgroundColor: theme.palette.background.paper,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: 400,
    padding: theme.spacing(2),
  },
  emailInput: {
    marginBottom: theme.spacing(2),
  },
}));

const TeamDetails = () => {
  const classes = useStyles();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Team data from localStorage
  const teamData = JSON.parse(localStorage.getItem("teamDetails"));

  const handleInviteClick = () => {
    setInviteModalOpen(true);
  };

  const handleInviteSubmit = () => {
    // Implement your invite logic here
    console.log("Inviting player with email:", inviteEmail);
    setInviteModalOpen(false);
  };

  const handleInviteModalClose = () => {
    setInviteModalOpen(false);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.header}>
        Team Details
      </Typography>
      {teamData ? (
        <div>
          <Typography variant="h6">Team Name: {teamData.teamname}</Typography>
          <Typography variant="subtitle1">Team Members:</Typography>
          <List className={classes.teamMembersList}>
            {teamData.teamMembers.map((memberId) => (
              <ListItem key={memberId}>
                <ListItemText primary={`Member ID: ${memberId}`} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleInviteClick}>
            Invite Other Players
          </Button>
        </div>
      ) : (
        <Typography variant="body1">No team details found.</Typography>
      )}

      {/* Invite Modal */}
      <Dialog
        open={inviteModalOpen}
        onClose={handleInviteModalClose}
        className={classes.modal}
      >
        <DialogTitle>Invite Team Player</DialogTitle>
        <DialogContent className={classes.modalContent}>
          <TextField
            label="Email ID"
            variant="outlined"
            className={classes.emailInput}
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInviteModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleInviteSubmit} color="primary">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamDetails;
