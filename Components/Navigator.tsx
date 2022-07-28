import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from "./Styles";
import { useEffect, useLayoutEffect, useState } from "react";
import useSound from "../hooks/useSound";

const MenuOption = (props: any) => {
    const {icon, path, action, current} = props;
    const isActive = current.name === path

    return <TouchableOpacity style={[styles.navigatorIcon, (isActive && styles.navigatorIconActive)] } onPress={action}>
        <Ionicons name={icon} size={isActive ? 35 : 30} style={[ {color: isActive ? colors.white.color : colors.dark.color}]} />
    </TouchableOpacity>
}

const Navigator = (props: any) => {
    const {navigation} = props;
    const sound = useSound(); 
    const [current, setCurrent] = useState<any>("");
    const [visible, setVisible] = useState<boolean>(true);

    const handleNavigate = (target: string) => {
        sound.drop();
        navigation.navigate(target, {sourcePath: 'Home'})
    }

    useLayoutEffect(() =>{

        const listenerShow = Keyboard.addListener('keyboardDidShow', () => {
                setVisible(false)
        });
        const listenerHide = Keyboard.addListener('keyboardDidHide', () => {
            setTimeout(() => {
                setVisible(true)
            }, 50);
        })

        return () => {
            listenerShow.remove()
            listenerHide.remove()
        }
    }, []);

    const items = [
        
        // {
        //     icon: "search",
        //     path: "Search"
        // },
        {
            icon: "qr-code-outline",
            path: "ReviewInventory"
        },
        {
            icon: "home",
            path: "Home"
        },
        {
            icon: "cog",
            path: "Configuration"
        }
    ]

    useEffect(() => {
        const props = navigation.getState()
        setCurrent(props.routes[props.index])
    }, [navigation])

    useEffect(() => {
    }, [current])

    return visible ? <View style={styles.navigator}>
        <View style={styles.navigatorContainer}>
            {
                items && items.map((item: any, key)=>{
                    return <MenuOption
                                action={()=>handleNavigate(item.path)}
                                current={current}
                                icon={item.icon}
                                key={key}
                                path={item.path}
                                />
                })
            }
        </View>
    </View>
    :
    null
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
        flexDirection: 'column',
        zIndex: 1
    },
    navigatorContainer: {
        backgroundColor: 'rgba(255, 255, 255, .3)',
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
        backgroundColor: 'rgba(255, 255, 255, 0)',
        width: 50,
        height: 50,
        padding: 0,
        borderRadius: 100,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        top: -1,
        position:'relative',
    }
});

export default Navigator;