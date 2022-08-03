import axios from 'axios';

const RequestHeaders: any = {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
}



const useAxios = (server: string = '') => {
    const instance = axios.create({
        baseURL: server,
        headers: RequestHeaders
    });

    const getHeaderInstance = (extraHeaders: any = {}) => {
        return (Object.assign(RequestHeaders, {...extraHeaders}));
    }

    return {instance, getHeaderInstance}
}

export default useAxios;