import axios from 'axios';

const RequestHeaders: any = {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
}

const getHeaderInstance = () => {
    return (Object.assign(RequestHeaders,{}));
}

const useAxios = (server: string = '') => {
    const instance = axios.create({
        baseURL: server,
        headers: RequestHeaders
    });

    return {instance}
}

export default useAxios;