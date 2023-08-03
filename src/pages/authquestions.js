import React, {useEffect, useState} from 'react';
import { Grid, TextField, Button } from '@mui/material';
import Typography from "@mui/material/Typography";
import {UserAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";


const AuthQuestions = () => {
    const { googleSignIn, facebookSignIn, user } = UserAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        favoriteSports: '',
        favoriteFood: '',
    });

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
            const jsonFormat = JSON.stringify(formData, null, 2);
            console.log(jsonFormat);
            fetch('https://lq471m8q53.execute-api.us-east-1.amazonaws.com/dev/store_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Handle the response data
                    navigate('/login');
                    console.log('Response:', data);
                })
                .catch((error) => {
                    // Handle any errors that occurred during the request
                    console.error('Error:', error);
                });

        }
    };

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            uid: user?.uid,
        }));
        fetch('https://03gqvg5c3h.execute-api.us-east-1.amazonaws.com/dev/get_data_from_user_id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"uid" : user?.uid}),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data
                // if MAFA is present in DB
                if(data["body"]["favoriteSports"].toLowerCase()){
                    navigate('/askQuestion');
                }
                console.log('Response:', data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error('Error:', error);
            });
    }, []);

    const validateFormData = () => {
        const { firstName, favoriteSports, favoriteFood } = formData;
        return (
            firstName.trim().length > 3 &&
            favoriteSports.trim().length > 3 &&
            favoriteFood.trim().length > 3
        );
    };

    return (
        <div className="container1">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid container justifyContent="center">
                        <Typography variant="h5" align="center" fontWeight="bold">
                            2MFA Questions Setup
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="firstName"
                            label="What is your first name?"
                            fullWidth
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                        />
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
                        <TextField
                            name="favoriteFood"
                            label="What is your favorite food?"
                            fullWidth
                            required
                            value={formData.favoriteFood}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            Note: You have to answer these questions at the login time
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
    );
};

export default AuthQuestions;
