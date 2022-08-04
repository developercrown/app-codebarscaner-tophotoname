import { BarCodeScanner } from "expo-barcode-scanner"
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, textStyles } from "./Styles";
import useSound from "../hooks/useSound";

const CodebarReader = (props: any) => {
    const {onGoBack, onCallback} = props
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [scanned, setScanned] = useState<any>(false);
    const [show, setShow] = useState<boolean>(false);
    const [code, setCode] = useState<any>()

    const handleBarCodeScanned = async (props: any) => {
        let { data } = props
        const sound = useSound();
        setScanned(true);
        sound.beep()
        setCode(data);
        setTimeout(() => {
            if(onCallback){
                onCallback(data)
            }
        }, 250);
    };

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        return () => {};
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 10);
    }, []);

    if (hasPermission === null) {
        return <View style={styles.container}/>;
    }

    if (hasPermission === false) {
        return <View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
            <Ionicons name="alert-circle" size={60} style={ [colors.white] } />
            <Text style={[colors.white]}>La app no tiene acceso a la camara autorizado.</Text>
        </View>;
    }

    return <View style={styles.container}>
        <View style={styles.container}>
            {
                show && <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}

                />
            }
            <View style={styles.controlsContainer}>
                <View
                    style={styles.controlsContainerTop}
                >
                    <TouchableOpacity
                onPress={onGoBack}
                style={[
                    
                ]}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name={"chevron-back"} size={32} style={{ color: 'white' }} />
                </View>
            </TouchableOpacity>
                </View>
                <View style={styles.controlsContainerBottom}>
                <Text style={[colors.white, textStyles.sm, textStyles.bold]}>{code ? code : 'Experando el código'}</Text>
            </View>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    controlsContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    controlsContainerTop: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        position: 'absolute',
        height: 100,
        width: '100%',
        top: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingLeft: 20,
        paddingBottom: 10,
        zIndex: 2
    },
    controlsContainerBottom: {
        backgroundColor: 'rgba(0, 0, 0, .8)',
        borderRadius: 100,
        position: 'absolute',
        width: '90%',
        height: 100,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 2
    },
})

export default CodebarReader;