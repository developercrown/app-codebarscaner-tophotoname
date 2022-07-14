import { Image, StyleSheet, Text, View } from "react-native"
import { alignStyles, colors, textStyles } from "../../components/Styles";
import { GradientContainer } from "../../components/FormComponents";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LogoText } from "../../assets/images";
import useHeaderbar from "../../hooks/useHeaderbar";
import { IconButton } from "../../components/FormComponents";
import ScreenView from '../../components/ScreenView';
import Navigator from "../../components/Navigator";

const HomeView = (props: any) => {
    const {navigation} = props;
    
    const handleLogout = () => {
        alert('logout action')
    }

    useHeaderbar({
        navigation,
        hideShadow: false,
        leftSection: <View style={[{justifyContent: 'center', alignItems: 'center', height: 40}]}>
            <Text style={[textStyles.bold, textStyles.md, colors.steelblue, {}]}>Bienvenido</Text>
        </View>,
        rightSection: <View style={[{justifyContent: 'flex-start', alignItems: 'flex-start', height: 60}]}>
            <IconButton icon="exit" color={colors.steelblue.color} size={26}  style={{marginTop: 10}} onTouch={handleLogout} />
        </View>,
        style: {
            backgroundColor: 'rgba(222, 237, 243, 1)',
        }
    });
    
    return <View style={{flex: 1}}>
        <ScreenView style={{backgroundColor: 'transparent'}} styleContainer={{paddingVertical: 0}}>

        <GradientContainer
                height={100}
                colors={['rgba(222, 237, 243, 1)', 'rgba(205, 235, 246, .6)', 'rgba(205, 235, 246, .2)']}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0, y: 0.8 }}
                locations={[0.5, 0.8]}
            >
                <View style={[alignStyles.centered]}>
                    <Ionicons name="person-circle" size={66} style={[colors.steelblue, {marginLeft: 4, opacity: .9}]} />
                </View>
                <Text style={[colors.steelblue, textStyles.bold, textStyles.lg, textStyles.alignCenter]}>Rene Corona Valdes</Text>
            </GradientContainer>
            <View style={styles.containerTop}>
                <Image source={LogoText} style={styles.logo} />
            </View>
        </ScreenView>
        <Navigator navigation={navigation}/>
    </View>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 20
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 40,
    },
    bodyContainer: {
        flex: 1
    }
});

export default HomeView