import { useEffect, useState } from "react";
import { BackHandler, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { BarCodeScanner } from "expo-barcode-scanner";
import ScreenView from '../../components/ScreenView';
import useSound from "../../hooks/useSound";
import { FormContainer, GradientButton, GradientContainer, Input } from "../../components/FormComponents";
import { colors, marginStyles, textStyles } from "../../components/Styles";
import { CameraLine } from "../../assets/images";
import InternalHeader from "../../components/InternalHeader";

const CodeReaderView = (props: any) => {
    const { navigation } = props;

    const [autoMode, setAutoMode] = useState<boolean>(false)
    const [soundsMode, setSoundsMode] = useState<boolean>(true)
    const [scanned, setScanned] = useState<any>(false);
    const [scannedCode, setScannedCode] = useState<string | undefined>('');
    const [hasPermission, setHasPermission] = useState<any>(null);
    const sound = useSound(); 

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const handleToggleAutoMode = () => {
        executeSound(sound.toggle);
        setAutoMode(!autoMode);
    }
    const handleToggleSoundsMode = () => {
        executeSound(sound.toggle);
        setSoundsMode(!soundsMode);
    }

    const executeSound = (fn: any) => {
        if(soundsMode && fn){
            fn()
        }
    }

    const handleBarCodeScanned = async (props: any) => {
        let { data } = props
        setScanned(true);
        setScannedCode(data);
        executeSound(sound.msn2);
        setTimeout(() => {
            if(autoMode){
                gotoSearchEquipment(data)
            }
        }, 250);
    };

    const resetCapture = () => {
        if(scannedCode && scannedCode !== ""){
            executeSound(sound.hello);
            setScannedCode('')
            setScanned(false)
            return
        }
        executeSound(sound.base);
    }

    const gotoSearchEquipment = async (data: any) => {
        const code = data ? data : scannedCode
        if(code && code !== ""){
            executeSound(sound.notification);

            const payload = {
                code,
                sourcePath: "CodebarReader"
            };

            navigation.navigate(
                "EquipmentInformation",
                payload
            );
            return
        }
        executeSound(sound.base);
    }

    const handleBack = () => {
        sound.back();
        navigation.goBack();
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });

        const backAction = () => {
            handleBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    })

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        return () => {};
    }, []);

    const scaleValue = .7;
    const translateValue = -28
    
    return <View style={[styles.container]}>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        <InternalHeader title="Revisión del Equipo" leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
        <ScreenView style={[styles.container]} styleContainer={{paddingVertical: 0}}>
            <View style={[styles.header, {width: windowWidth-30}]}>
                <Text style={[colors.white, textStyles.bold, textStyles.md]}>Captura de código</Text>
                <TouchableOpacity onPress={handleToggleAutoMode} style={[styles.headerButton, autoMode && styles.headerButtonActive]}>
                    {
                        autoMode ?
                            <Text style={
                                [
                                    textStyles.bold,
                                    textStyles.pico,
                                    colors.white
                                ]
                            }>AUTO</Text>
                        :
                            <Text style={
                                [
                                    textStyles.bold,
                                    textStyles.nano,
                                    colors.white
                                ]
                            }>NORMAL</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleSoundsMode} style={[styles.headerButton, !soundsMode && styles.headerButtonActive]}>
                    {
                        soundsMode ?
                            <Ionicons name="volume-high" size={26} color={colors.white.color}  />
                        :
                            <Ionicons name="volume-mute" size={26} color={colors.white.color} />
                    }
                </TouchableOpacity>
            </View>
            <View style={[styles.body, {width: windowWidth-30, height: (windowHeight - 300)}]}>
                
                <View style={[styles.bodyCameraDecorators]}>
                    <Image
                        source={CameraLine}
                        style={[
                            styles.bodyCameraDecoratorsLine,
                            {
                                top: 0,
                                left: 0,
                                transform: [
                                    {scale: scaleValue},
                                    {translateX: translateValue},
                                    {translateY: translateValue}
                                ]
                            }
                        ]}
                    />
                    <Image
                        source={CameraLine}
                        style={[
                            styles.bodyCameraDecoratorsLine,
                            {
                                top: 0,
                                right: 0,
                                transform: [
                                    { rotate: '90deg' },
                                    {scale: scaleValue},
                                    {translateX: translateValue},
                                    {translateY: translateValue}
                                ]
                            }
                        ]}
                    />
                    <Image
                        source={CameraLine}
                        style={[
                            styles.bodyCameraDecoratorsLine,
                            {
                                bottom: 0,
                                left: 0,
                                transform: [
                                    { rotate: '270deg' },
                                    {scale: scaleValue},
                                    {translateX: translateValue},
                                    {translateY: translateValue}
                                ]
                            }
                        ]}
                    />
                    <Image
                        source={CameraLine}
                        style={[
                            styles.bodyCameraDecoratorsLine,
                            {
                                bottom: 0,
                                right: 0,
                                transform: [
                                    { rotate: '180deg' },
                                    {scale: scaleValue},
                                    {translateX: translateValue},
                                    {translateY: translateValue}
                                ]
                            }
                        ]}
                    />
                </View>

                <View style={[styles.bodyCameraContainer]}>
                    { hasPermission ?
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={StyleSheet.absoluteFillObject}
                        />
                        :
                        hasPermission === false?
                        <View style={styles.bodyCameraContainerRequest}>
                            <Text style={[colors.white, textStyles.sm, textStyles.alignCenter]}>No hay permiso de uso de la camara</Text>
                        </View>
                        :
                        <View style={styles.bodyCameraContainerRequest}>
                            <Text style={[colors.white, textStyles.sm, textStyles.alignCenter]}>Solicitando permisos para la camara</Text>
                        </View>
                    }
                </View>

                <View style={[styles.bodyCameraContainerInput]}>
                    <FormContainer style={{marginTop: 0}}>
                        <Input
                            icon="qr-code"
                            onChange={setScannedCode}
                            onSubmit={gotoSearchEquipment}
                            placeholder="Ingresa el código del equipo"
                            style={{backgroundColor: 'white', elevation: 1}}
                            styleInput={{marginLeft: 0, textAlign: 'center'}}
                            type="text"
                            value={scannedCode}
                            />
                    </FormContainer>
                </View>

            </View>

            <GradientContainer
                colors={
                    [
                        'rgba(0, 0, 0, .85)',
                        'rgba(0, 0, 0, .85)',
                        'rgba(0, 0, 0, .85)'
                    ]
                }
                start={{ x: .3, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={
                    [
                        styles.controls,
                        {
                            width: windowWidth-30,
                            height: 70
                        }
                    ]
                }>
                <GradientButton
                    colors={
                        scannedCode ? [
                            '#8d0606',
                            '#c70000',
                            '#c70000',
                        ] :
                        [
                            'rgba(100, 100, 100, 1)',
                            'rgba(100, 100, 100, 1)'
                        ]
                    }
                    onTouch={resetCapture}
                    style={{elevation: 1, width: 60, borderRadius: 4, opacity: scannedCode ? 1 : .5}}>
                        <Ionicons name="trash" size={26} style={[colors.white]} />
                    </GradientButton>
                <GradientButton
                    colors={
                        scannedCode ? [
                            '#2a73d9',
                            '#4d88db',
                            '#4d88db'
                        ] :
                        [
                            'rgba(100, 100, 100, 1)',
                            'rgba(100, 100, 100, 1)'
                        ]
                    }
                    onTouch={gotoSearchEquipment}
                    style={{elevation: 1, width: 240, borderRadius: 4, flexDirection: 'row', opacity: scannedCode ? 1 : .5}}>
                        <Ionicons name="search" size={26} style={[colors.white]} />
                        <Text style={
                            [
                                colors.white,
                                textStyles.bold,
                                textStyles.lg,
                                marginStyles.rightMd
                            ]
                        }>Buscar</Text>
                        
                    </GradientButton>
            </GradientContainer>
        </ScreenView>
        {/* <Navigator navigation={navigation}/> */}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        // zIndex: 2
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginTop: 20,
        height: 80,
        borderRadius: 10
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, .1)',
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, .2)',
        marginTop: 20,
        borderRadius: 20,
        zindex: 10
    },
    bodyCameraContainer: {
        width: '90%',
        height: '85%'
    },
    bodyCameraContainerRequest: {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyCameraDecorators: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '95%',
        height: '95%'
    },
    bodyCameraDecoratorsLine: {
        position: 'absolute'
    },
    bodyCameraContainerInput: {
        position: 'absolute',
        width: '90%',
        bottom: 20    },
    controls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, .4)',
        borderRadius: 10
    }
});

export default CodeReaderView