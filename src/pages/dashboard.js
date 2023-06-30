import React from "react";
import {useNavigate} from "react-router-dom";
import {UserAuth} from "../context/AuthContext";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';

const Dashboard = () => {
    const { logOut, user } = UserAuth();
    const [open, setOpen] = React.useState(false);

    const handleLogOut = async () => {
        try{
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

    return <div>
       {/* <h1>You Are Logged In, start playing the game!!</h1>
        {console.log(user,"user>>>>>>>")}
        <p>Welcome <b>{user?.displayName ? user.displayName : user?.uid}</b>, you have used <b>{user.email}</b> to create an account.</p>
        <p>Check console for all other details...</p>
        <button onClick={handleLogOut}>Logout</button>*/}
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
    </div>;
};

export default Dashboard;
