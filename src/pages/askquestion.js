import React, {useEffect, useState} from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Typography from "@mui/material/Typography";
import {UserAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const AskQuestion = () => {
    const { googleSignIn, facebookSignIn, user } = UserAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        favoriteSports: '',
    });
    const [userId, setUserId] = useState('');
    const notify = () => toast("MFA answer is wrong");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async  (event) => {
        event.preventDefault();
        if (validateFormData()) {
            try {
                const jsonFormat = JSON.stringify(formData, null, 2);
                console.log(jsonFormat);
                const response = await fetch('https://03gqvg5c3h.execute-api.us-east-1.amazonaws.com/dev/get_data_from_user_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                  const {body} = await response.json();
                console.log('response', body);
                // Check MFA answer and match it with user's answer
                if(body?.favoriteSports.toLowerCase() !== formData.favoriteSports.toLowerCase()) {
                    toast('Wrong MFA Answer');
                }else{
                    //if MFA answer is correct then redirect to dashboard
                    navigate('/dashboard');
                }
            }
            catch (e) {
                notify();
            }

        }
    };

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            uid: user?.uid,
        }));
    }, []);

    const validateFormData = () => {
        const {favoriteSports} = formData;
        return (
            favoriteSports.trim().length > 3
        );
    };

    return (
        <div className="container1">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container justifyContent="center">
                        <Typography variant="h5" align="center" fontWeight="bold">
                            2MFA Question Ask
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="favoriteSports"
                            label="What is your favorite sports?"
                            fullWidth
                            required
                            value={formData.favoriteSports}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            Note: Enter your MFA setup answer.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container justifyContent="center">
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <ToastContainer />
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default AskQuestion;
