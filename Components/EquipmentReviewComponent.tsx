import { BlurView } from "expo-blur"
import { StyleSheet, Text, TouchableOpacity ,View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { InfoRow } from "./EquipmentInformationComponent";

const EquipmentReviewComponent = (props: any) => {
    const {data} = props
    const { alignCenter, textSm, textMd, textWhite, textBold } = GlobalStyles

    let description = [data.equipment_name, data.trademark, data.model].join(" - ");
    let safeguard = [data.safeguard_apartment, data.safeguard_person].join(", ");
    console.log(description, safeguard);
    return <>
        {
            data && <BlurView intensity={10} style={BodyStyles.container} tint="light">
                <View style={{ marginTop: 10, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                    {/* <Text style={[textSm, textWhite, textBold, {textAlign: 'center'}]}>Revisión del equipo</Text> */}
                </View>
                <View style={BodyStyles.informationContainer}>
                    <View style={{padding: 10}}>  {/*TODO: create card unique for text content */}
                        {/* <InfoRow label="Código" value={data.codebar} /> */}
                        {/* <InfoRow label="Descripción" value={description} />
                        <InfoRow label="Series registradas" value={data.series} />
                        <InfoRow label="Información Resguardo actual" value={safeguard} /> */}
                    </View>
                </View>
            </BlurView>
        }
    </>;
}

/**
 * 
 *  { <InfoRow label="Notas" value={data.notes ? data.notes : 'Sin Notas'} /> TODO: set textarea}
                        { <InfoRow label="Ubicación actual" value={data.location ? data.location : 'No localizado'} /> TODO: to make selector}
                        { <InfoRow label="Estado general del equipo" value={data.status} />  TODO: to make selector}
                        { <InfoRow label="Estado de revisión" value={data.review_status ? 'Revisado' : 'Sin Revisión'} />  TODO: to set true in backend}
    
 * 
 */

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
        flexDirection: 'column'
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

export default EquipmentReviewComponent;