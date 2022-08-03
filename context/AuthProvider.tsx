
import React, { createContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext =  createContext({});

export const AuthProvider = (props: any) => {
    const [ auth, setAuth ] = useState({});

    return <AuthContext.Provider value={{auth, setAuth}}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;