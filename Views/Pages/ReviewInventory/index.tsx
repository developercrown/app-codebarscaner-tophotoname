import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ScreenView from '../../../Components/ScreenView';
import Navigator from "../../../Components/Navigator";
import { useEffect, useState } from "react";
import CaptureCodebarView from "./Components/CaptureCodebarView";
import { Dimensions } from 'react-native';
import Constants from 'expo-constants'
import { colors, textStyles } from "../../../Components/Styles";
import useSound from "../../../hooks/useSound";
import Ionicons from '@expo/vector-icons/Ionicons';

const ReviewInventoryView = (props: any) => {
    const [fastMode, setFastMode] = useState<boolean>(false)
    const [soundsMode, setSoundsMode] = useState<boolean>(true)
    const sound = useSound(); 

    const {navigation} = props;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const handleToggleFastMode = () => {
        sound.touch();
        setFastMode(!fastMode);
    }
    const handleToggleSoundsMode = () => {
        sound.touch();
        setSoundsMode(!soundsMode);
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    })
    
    return <View style={[styles.container]}>
        <ScreenView style={[styles.container, ]} styleContainer={{paddingVertical: 0}}>
            <View style={[styles.header, {width: windowWidth-30}]}>
                <Text style={[colors.white, textStyles.bold, textStyles.md]}>Captura de código</Text>
                <TouchableOpacity onPress={handleToggleFastMode} style={[styles.headerButton, !fastMode && styles.headerButtonActive]}>
                    {
                        fastMode ? 
                            <Ionicons name="bicycle" size={26} color={colors.yellow.color}  />
                        :
                            <Ionicons name="bicycle" size={26} color={colors.white.color} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleSoundsMode} style={[styles.headerButton, !soundsMode && styles.headerButtonActive]}>
                    {
                        soundsMode ? 
                            <Ionicons name="musical-note" size={26} color={colors.yellow.color}  />
                        :
                            <Ionicons name="musical-note" size={26} color={colors.white.color} />
                    }
                </TouchableOpacity>
            </View>
            <View style={[styles.body, {width: windowWidth-30, height: (windowHeight - 300)}]}>
                <Text>Body</Text>
            </View>

            <View style={[styles.controls, {width: windowWidth-30, height: (60)}]}>
                <Text>Controls</Text>
            </View>
            {/* <CaptureCodebarView /> */}
        </ScreenView>
        <Navigator navigation={navigation}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.blue.color,
        marginTop: Constants.statusBarHeight+20,
        height: 80,
        borderRadius: 10
    },
    headerButton: {
        backgroundColor: 'rgba(3, 82, 192, 1)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtonActive: {
        backgroundColor: 'rgba(3, 82, 192, .5)',
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, .4)',
        marginTop: 20,
        borderRadius: 10
    },
    controls: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, .4)',
        borderRadius: 10
    }
});

export default ReviewInventoryView