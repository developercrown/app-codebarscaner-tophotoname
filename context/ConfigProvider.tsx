import React, { createContext, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';

const ConfigContext =  createContext({});

export const ConfigProvider = (props: any) => {
    const [servers, setServers] = useState({
        app: null,
        auth: null
    })

    const [ config, setConfig ] = useState({
        status: false,
        data: {}
    });
    

    const resetconfig = () => {
        setConfig({
            status: false,
            data: {}
        });
    }

    const requestConfig = (servers: any) => {
        const {instance} = useAxios(servers.app)
        instance.get('app-config').then((response: any) => {
            const {data, status} = response;
            if(status === 200) {
                const cfg = {
                    status: true,
                    data,
                    servers
                };
                setConfig(cfg)
            }
        }).catch((error: any) => {
            const cfg = {
                status: false,
                data: {},
                servers
            };
            setConfig(cfg);
        });
    }

    return <ConfigContext.Provider value={{config, requestConfig, setConfig, resetconfig}}>
        {props.children}
    </ConfigContext.Provider>
}

export default ConfigContext;