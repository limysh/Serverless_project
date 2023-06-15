import React, {useEffect, useState} from 'react';
import GoogleButton  from 'react-google-button';
import { UserAuth } from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

const Login = () => {
    const { googleSignIn, facebookSignIn, user } = UserAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = UserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await signIn(email, password)
            navigate('/startGame')
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await facebookSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user != null) {
            navigate('/startGame');
        }
    }, [user]);

    return (
        <div>
            <div className='max-w-[700px] mx-auto my-16 p-4'>
                <div>
                    <h1 className='text-2xl font-bold py-2'>Sign in to your account</h1>
                    <p className='py-2'>
                        Don't have an account yet?{' '}
                        <Link to='/' className='underline'>
                            Sign up.
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col py-2'>
                        <label className='py-2 font-medium'>Email Address</label>
                        <input onChange={(e) => setEmail(e.target.value)} className='border p-3' type='email' />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label className='py-2 font-medium'>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} className='border p-3' type='password' />
                    </div>
                    <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white'>
                        Sign In
                    </button>
                </form>
            </div>
            <div className='max-w-[240px] m-auto py-4'>
                <GoogleButton onClick={handleGoogleSignIn} />
                {/*<FacebookLogin onClick={handleFacebookSignIn} />*/}
            </div>
        </div>
    );
};

export default Login;