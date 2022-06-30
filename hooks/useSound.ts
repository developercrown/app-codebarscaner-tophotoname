import { Audio } from 'expo-av';

const useSound = () => {
    const unload = (sound: any) => {
        setTimeout(() => {
            if(sound){
                sound.stopAsync()
                sound.unloadAsync();
            }
        }, 1000);
    }
    const cancel = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/cancel.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const error = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/error.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const msn1 = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/msn1.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const msn2 = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/msn2.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const msn3 = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/msn3.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const reviewed = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/reviewed.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const success = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/success.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const touch = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/touch.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const start = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/start.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };

    return {
        cancel,
        error,
        msn1,
        msn2,
        msn3,
        reviewed,
        start,
        success,
        touch
    }
}

export default useSound;