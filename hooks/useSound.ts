import { Audio } from 'expo-av';

const useSound = () => {
    const unload = (sound: any, timeout: number = 1000) => {
        setTimeout(() => {
            if(sound){
                sound.stopAsync()
                sound.unloadAsync();
            }
        }, timeout);
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
    const deny = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/deny.mp3')
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
    const echo = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/echo.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const hello = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/hello.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const toggle = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/toggle.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const drop = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/drop.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const notification = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/notification.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const base = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/base.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const back = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/back.mp3')
        );
        await sound.playAsync();
        unload(sound);
    };
    const start = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/audio/welcome.mp3')
        );
        await sound.playAsync();
        unload(sound, 2000);
    };

    return {
        back,
        base,
        cancel,
        deny,
        drop,
        error,
        echo,
        hello,
        msn1,
        msn2,
        msn3,
        notification,
        reviewed,
        start,
        success,
        toggle,
        touch
    }
}

export default useSound;