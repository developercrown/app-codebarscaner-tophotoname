import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

const CreateEquipmentView = (props: any) => {
    const { codebar, gotoInit} = props;
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        
    }, []);

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
                        <Text style={{ color: '#eee' }}>Un momento por favor...</Text>
                    </View>
        }
        <View style={[containerStyles.content]}>
            <Text style={{color: 'white'}}>{codebar}</Text>
        </View>
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
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'blue',
    },
});

export default CreateEquipmentView;