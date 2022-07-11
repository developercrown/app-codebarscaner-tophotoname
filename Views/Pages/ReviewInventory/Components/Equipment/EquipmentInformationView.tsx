import { useEffect, useState } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import EquipmentInformationComponent from './Components/EquipmentInformationComponent';
import EquipmentReviewComponent from './Components/EquipmentReviewComponent';
import useSound from '../../hooks/useSound';

const EquipmentInformationView = (props: any) => {
    const sound = useSound(); 
    const { codebar, fastMode, gotoInit, gotoNext, gotoCreate } = props;
    const [view, setView] = useState<number>(0);
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);

    const getInformation = async (code: any) => {
        setWait(true);
        const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/' + code;
        axios({
            method: 'get',
            url: uri,
        }).then(({status, data}) => {
            if(status === 200){
                setData(data.data);
                if(fastMode && data.data.review_status == false){
                    gotoContinue()
                }
            }
            // else {
            //     console.log(status, data);
                
            // }
            setWait(false);
        }).catch(err => {
            sound.error()
            Alert.alert('Atención!', 'No se encontro el equipo, ¿Desea registrarlo?', [
                {
                    text: 'OK', onPress: () => gotoCreate(codebar)
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        sound.touch()
                        gotoInit()
                    },
                    style: 'cancel',
                },
            ])
            
        });
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', ()=>true);
        getInformation(codebar)
        return () => backHandler.remove();
    }, []);

    const gotoContinue = () => {
        setView(1)
    }
    const gotoPhoto = () => {
        gotoNext(codebar)
    }

    return <View style={containerStyles.container}>
        {
            wait && <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: 0,
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            backgroundColor: 'rgba(0, 0, 0, .5)',
                            zIndex: 2
                        }}
                    >
                        <Text style={{ color: '#eee' }}>Cargando la información...</Text>
                    </View>
        }
        {
            view == 0 ? 
                <EquipmentInformationComponent codebar={codebar} data={data} gotoInit={gotoInit} gotoContinue={gotoContinue} gotoNext={gotoPhoto} fastMode={fastMode}/>
            :
                <EquipmentReviewComponent codebar={codebar} data={data} gotoInit={gotoInit} gotoContinue={gotoPhoto} fastMode={fastMode}/>
        }
    </View>
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

export default EquipmentInformationView;