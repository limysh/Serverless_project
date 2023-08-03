import { sendPasswordResetEmail } from "firebase/auth";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth} from "../firebase";
import {Button, Grid, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";

function ForgotPassword(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async(e)=>{
        e.preventDefault()
        sendPasswordResetEmail(auth,email).then(data=>{
            alert("Check your gmail")
            //redirect user after changing the password
            navigate('/login')
        }).catch(err=>{
            alert(err.code)
        })
    }
    return(
    <div className="container1">
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid container justifyContent="center">
                    <Typography variant="h5" align="center" fontWeight="bold">
                        Forgot Password
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Note: You will receive an email on your register email ID.
                    </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    </div>
    )
}
export default ForgotPassword;