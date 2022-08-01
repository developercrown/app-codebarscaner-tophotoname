import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalStorage = () => {
    const set = async (key: string, value: any, hasJson: boolean = false) => {
        try {
            return await AsyncStorage.setItem(key, value)
        } catch (e) {        
            return false
        }
    }

    const getValue = async (key: string) => {
        try {
            return await AsyncStorage.getItem(key)
        } catch(e) {
            return null
        }
    };

    const get = (key: string) => {
        return new Promise((resolve, reject) => {
            getValue(key).then((value: any) => {
                if(value){
                    resolve(value)
                    return
                }
                resolve(null)
            }).catch((err: any) => {
                resolve(null)
            });
        })
    }

    return {get, set};
};

export default useLocalStorage;