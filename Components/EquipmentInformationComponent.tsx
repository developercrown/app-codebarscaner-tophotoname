import { BlurView } from "expo-blur"
import { ScrollView, StyleSheet, Text, TouchableOpacity ,View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import useSound from "../hooks/useSound";
import { useEffect } from "react";

const InfoRow = (props: any) => {
    const { value, label } = props
    const { textSm, textWhite, textBold } = GlobalStyles

    return <View style={{ flex: 1, flexDirection: 'column', marginBottom: 10 }}>
        <Text style={[textSm, textWhite, textBold]}>{label}: </Text>
        <Text style={[textSm, textWhite]}>{value}</Text>
    </View>
}

const EquipmentInformationComponent = (props: any) => {
    const {data, codebar, gotoInit, gotoContinue, gotoNext} = props
    const { alignCenter, textSm, textXl, textWhite, textBold } = GlobalStyles;
    const sound = useSound();

    const gotoNextView = () => {
        sound.touch()
        gotoNext()
    }
    
    const continueView = () => {
        sound.touch()
        gotoContinue()
    }

    const goBack = () => {
        // sound.cancel()
        gotoInit()
    }

    useEffect(() => {
        if(data){
            if(data.review_status){
                sound.reviewed();
            }
        }
    }, [data])

    return <>
        <BlurView intensity={10} style={headerStyles.container} tint="light">
            <Text style={headerStyles.title}>Información del equipo</Text>
        </BlurView>
        {
            data && <BlurView intensity={10} style={BodyStyles.container} tint="light">
                <View style={BodyStyles.informationContainer}>
                    <View style={[{alignItems: 'center', marginBottom: 18}]}>
                        <Text style={[textSm, textWhite, textBold]}>Código Solicitado: </Text>
                        <Text style={[textSm, textWhite, {color: 'yellow'}]}>{codebar}</Text>
                    </View>
                    <View style={[{alignItems: 'center', marginBottom: 18}]}>
                        {
                            data.review_status ? 
                                <Text style={[textXl, {color: 'yellow'}, textBold]}>REVISADO</Text>
                                :
                                <Text style={[textXl, {color: 'red'}, textBold]}>SIN REVISIÓN PREVIA</Text>
                            }
                        
                    </View>
                    <ScrollView style={{padding: 10}}>
                        <Text style={[textSm, textWhite, textBold, {marginBottom: 18, textAlign: 'center'}]}>Información del sistema</Text>
                        <InfoRow label="Código obtenido" value={data.codebar} />
                        <InfoRow label="Nombre del equipo" value={data.equipment_name} />
                        <InfoRow label="Marca" value={data.trademark} />
                        <InfoRow label="Modelo" value={data.model} />
                        <InfoRow label="Series registradas" value={data.series} />
                        <InfoRow label="Notas" value={data.notes ? data.notes : 'Sin Notas'} />
                        <InfoRow label="Departamento resguardante" value={data.safeguard_apartment} />
                        <InfoRow label="Responsable resguardante" value={data.safeguard_person} />
                        <InfoRow label="Ubicación actual" value={data.location ? data.location : 'No localizado'} />
                        <InfoRow label="Estado general del equipo" value={data.status} />
                        <InfoRow label="Fecha de registro" value={data.created_at ? data.created_at : 'Inicial'} />
                        <InfoRow label="Ultima actualización" value={data.updated_at ? data.updated_at : 'No actualizado recientemente'} />
                    </ScrollView>
                </View>
            </BlurView>
        }
        <View style={controlsStyles.container}>
            <View style={controlsStyles.containerControls}>
                {
                    data && <>
                        <TouchableOpacity
                            onPress={goBack}
                            style={[controlsStyles.buttonCycled, controlsStyles.buttonDanger]}>
                            <Ionicons name="close" size={40} style={{ color: 'white' }} />
                        </TouchableOpacity>
                        {
                            data.review_status ?
                            <TouchableOpacity
                                onPress={gotoNextView}
                                style={[controlsStyles.buttonCycled, {backgroundColor: 'orange'}]}>
                                <Ionicons name="checkmark-done-circle" size={40} style={{ color: 'black' }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={continueView}
                                style={[controlsStyles.buttonCycled, {backgroundColor: 'purple'}]}>
                                <Ionicons name="file-tray-full" size={40} style={{ color: 'white' }} />
                            </TouchableOpacity>
                        }
                    </>
                }
            </View>
        </View>
    </>
}


const GlobalStyles = StyleSheet.create({
    alignCenter: {
        textAlign: 'center'
    },
    textSm: {
        fontSize: 16
    },
    textMd: {
        fontSize: 20
    },
    textXl: {
        fontSize: 28
    },
    textWhite: {
        color: 'white'
    },
    textBold: {
        fontWeight: 'bold'
    },
});

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: 'rgba(187, 50, 203, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(71, 21, 159, .6)',
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    title: {
        color: '#eee',
        fontSize: 20,
        fontWeight: 'normal'
    }
});

const BodyStyles = StyleSheet.create({
    container: {
        flex: 14,
        backgroundColor: 'rgba(59, 0, 153, 0.2)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        borderColor: 'rgba(71, 21, 159, .6)',
        borderBottomColor: 'rgba(106, 50, 203, .6)',
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    informationContainer: {
        height: '100%',
        width: '100%',
        paddingBottom: 32,
        flexDirection: 'column'
    },
    legendContainer: {
        width: '93%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        bottom: 40
    },
    legend: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

const controlsStyles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: 'rgba(0, 0, 0, .4)'
    },
    containerCodebarInput: {

    },
    codebarInput: {
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        height: 60,
        margin: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#303042',
        shadowColor: 'black',
        padding: 10,
        textAlign: 'center'
    },
    containerControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: 48,
        padding: 0,
        margin: 8
    },
    buttonCycled: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 58,
        height: 58,
        padding: 0,
        margin: 8
    },
    buttonDark: {
        backgroundColor: 'rgba(17, 18, 25, 1)',
    },
    buttonDarkDisabled: {
        backgroundColor: 'rgba(17, 18, 25, .4)',
    },
    buttonDanger: {
        backgroundColor: 'rgba(143, 4, 1, 1)',
    },
    buttonDangerDisabled: {
        backgroundColor: 'rgba(143, 4, 1, .4)',
    },
    buttonPrimary: {
        backgroundColor: 'rgba(232, 0, 139, 1)'
    },
    buttonPrimaryDisabled: {
        backgroundColor: 'rgba(232, 0, 139, .2)'
    },
    buttonSecondary: {
        backgroundColor: 'rgba(56, 168, 197, 1)'
    },
    buttonSecondaryDisabled: {
        backgroundColor: 'rgba(46, 93, 105, .5)'
    },
    buttonSecondaryActive: {
        backgroundColor: 'rgba(73, 185, 214, 1)'
    },
    buttonIconWhite: {
        color: 'rgba(255, 255, 255, 1)'
    },
    buttonIconWhiteMutted: {
        color: 'rgba(255, 255, 255, .4)'
    },
    textButtonWhite: {
        color: '#eee'
    },
    textButtonMutted: {
        color: 'rgba(255, 255, 255, .5)'
    }
});

export {InfoRow}
export default EquipmentInformationComponent;