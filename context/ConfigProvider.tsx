import React, { createContext, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';

const ConfigContext =  createContext({});

const serverURI = "https://api-inventario-minify.upn164.edu.mx/api/v1";

export const ConfigProvider = (props: any) => {
    const [ config, setConfig ] = useState({
        status: false,
        data: {}
    });
    const {instance} = useAxios(serverURI)

    const resetconfig = () => {
        setConfig({
            status: false,
            data: {}
        });
    }

    const requestConfig = () => {
        instance.get('app-config').then((response: any) => {
            const {data, status} = response;
            if(status === 200) {
                const cfg = {
                    status: true,
                    data
                };
                setConfig(cfg)
            }
        }).catch((error) => {
            setConfig({
                status: false,
                data: {}
            });        
        });
    }

    useEffect(() => {
        requestConfig()
    }, []);

    return <ConfigContext.Provider value={{config, setConfig, resetconfig}}>
        {props.children}
    </ConfigContext.Provider>
}

export default ConfigContext;