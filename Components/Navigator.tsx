import { StyleSheet, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from "./Styles";
import { useEffect, useState } from "react";

const MenuOption = (props: any) => {
    const {icon, path, action, current} = props;
    const isActive = current.name === path

    return <TouchableOpacity style={[styles.navigatorIcon, (isActive && styles.navigatorIconActive)] } onPress={action}>
        <Ionicons name={icon} size={isActive ? 35 : 30} style={[ colors.steelblue, {opacity: isActive ? .3 : 1}]} />
    </TouchableOpacity>
}

const Navigator = (props: any) => {
    const {navigation} = props;
    const [current, setCurrent] = useState<any>("");

    const handleSearch = () => {
        navigation.navigate("Search")
    }
    
    const handleHome = () => {
        navigation.navigate("Home")
    }
    
    const handleInventoryChecking = () => {
        navigation.navigate("ReviewInventory")
    }
    
    const handleConfig = () => {
        navigation.navigate("Configuration")
    }

    const items = [
        {
            icon: "home",
            path: "Home",
            action: handleHome
        },
        {
            icon: "search",
            path: "Search",
            action: handleSearch
        },
        {
            icon: "qr-code-outline",
            path: "ReviewInventory",
            action: handleInventoryChecking
        },
        {
            icon: "cog",
            path: "Configuration",
            action: handleConfig
        }
    ]

    useEffect(() => {
        const props = navigation.getState()
        setCurrent(props.routes[props.index])
    }, [navigation])

    useEffect(() => {
    }, [current])

    return <View style={styles.navigator}>
    <View style={styles.navigatorContainer}>

        {
            items && items.map((item, key)=>{
                return <MenuOption
                            action={item.action}
                            current={current}
                            icon={item.icon}
                            key={key}
                            path={item.path}
                            />
            })
        }

    </View>
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
    },
    navigator: {
        width: '100%',
        height: 90,
        position: 'absolute',
        bottom: -10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    navigatorContainer: {
        backgroundColor: 'rgba(255, 255, 255, .4)',
        width: '100%',
        height: 70,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    navigatorIcon: {
        backgroundColor: 'rgba(255, 255, 255, .9)',
        width: 50,
        height: 50,
        padding: 0,
        borderRadius: 25,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        top: -1,
        position:'relative',
    },
    navigatorIconActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: 50,
        height: 50,
        padding: 0,
        borderRadius: 100,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        top: -1,
        position:'relative',
    }
});

export default Navigator;