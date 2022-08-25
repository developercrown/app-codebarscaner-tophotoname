import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from "./Styles";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import useSound from "../hooks/useSound";
import AuthContext from "../context/AuthProvider";

const MenuOption = (props: any) => {
    const {icon, path, action, current} = props;
    const isActive = current.name === path

    return <TouchableOpacity style={[styles.navigatorIcon, (isActive && styles.navigatorIconActive)] } onPress={action}>
        <Ionicons name={icon} size={isActive ? 35 : 30} style={[ {color: isActive ? colors.dark.color : colors.dark.color}]} />
    </TouchableOpacity>
}

const Navigator = (props: any) => {
    const {navigation} = props;
    const sound = useSound(); 
    const [current, setCurrent] = useState<any>("");
    const [visible, setVisible] = useState<boolean>(true);
    const { auth } : any = useContext(AuthContext);

    const role = auth?.data?.role;

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
        {
            icon: "search",
            path: "Search",
            visibilityRules: ["admin", "viewer"]
        },
        {
            icon: "qr-code-outline",
            path: "ReviewInventory",
            visibilityRules:  ["admin", "support"]
        },
        {
            icon: "cog",
            path: "Configuration",
            visibilityRules:  ["admin", "support", "viewer"]
        },
        // { //TODO: Users Module
        //     icon: "body",
        //     path: "Users",
        //     visibilityRules:  ["admin"]
        // }
    ]

    const isAvailable = (item: any): boolean => {
        const data = item.visibilityRules;
        for(let i = 0; i < data.length; i++) {
            if(data[i] == role){
                return true
            }
        }
        return false
    }

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
                    if(isAvailable(item)){
                        return <MenuOption
                                action={()=>handleNavigate(item.path)}
                                current={current}
                                icon={item.icon}
                                key={key}
                                path={item.path}
                                />
                    }
                    return null
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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