import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalStorage = () => {
    const set = async (key: string, data: any, hasJson: boolean = false) => {
        try {
            let value = data
            if(hasJson) {
                value = JSON.stringify(data)
            }
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

    const get = (key: string, hasJson: boolean = false) => {
        return new Promise((resolve, reject) => {
            getValue(key).then((value: any) => {
                if(value){
                    if(hasJson){
                        value = JSON.parse(value)
                    }
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