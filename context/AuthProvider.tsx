import { useLocalStorage } from '../hooks';
import React, { createContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext =  createContext({});

export const AuthProvider = (props: any) => {
    const [ auth, setAuth ] = useState({});
    const navigate = useNavigate();
    const location: any = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [, updateValue] = useLocalStorage('token');

    const logoutAction = () => {
        setAuth({});
        updateValue("");
        navigate('/login', { state: { from: from }, replace: true });
    }

    return <AuthContext.Provider value={{auth, setAuth, logoutAction}}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;