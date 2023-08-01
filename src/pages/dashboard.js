import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {UserAuth} from "../context/AuthContext";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
const Dashboard = () => {
    const { logOut, user } = UserAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleLogOut = async () => {
        try{
            localStorage.clear();
            await logOut()
        }catch (err){
            console.log(err)
        }
    }


    const drawerWidth = 240;

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    const defaultTheme = createTheme();

    useEffect(() => {
        if(user == null || user == {} || user == undefined ){
            navigate('/');
        }
        const uid = user?.uid;
        fetch(`https://us-central1-serverless-sdp19.cloudfunctions.net/get_user_by_id?uid=${uid}`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('currentLoggedInUser',JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        console.log(user,"DASHBOARD")
    },[]);

    function handleTeamClick() {
        navigate("/createTeam")
    }

    function handleLobbyClick() {
        navigate("/game-lobby")
    }

    return <>
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography>
                        <IconButton color="inherit" >
                            <Badge color="secondary">
                                <AccountCircleIcon sx={{ mr: 2}} />
                            </Badge>
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Button sx={{ ml: 2}} variant="contained" onClick={handleLogOut}>Logout</Button>
                    </Toolbar>
                </AppBar>

            </Box>
        </ThemeProvider>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 30 }}>
            <Button variant="contained" style={{marginRight : "10px"}} onClick={handleTeamClick}>
                Create Team
            </Button>
            <Button variant="contained" onClick={handleLobbyClick}>
                Join Game Lobby
            </Button>
        </Box>

    </>;
};

export default Dashboard;
