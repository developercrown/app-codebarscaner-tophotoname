import { StyleSheet } from "react-native";
import Constants from 'expo-constants'

const colors = StyleSheet.create({
    white: {
        color: "#fff"
    },
    black: {
        color: 'rgba(0, 0, 0, 1)'
    },
    dark: {
        color: 'rgba(90, 90, 90, 1)'
    },
    silver: {
        color: '#c0c0c0'
    },
    gray: {
        color: '#808080'
    },
    maroon: {
        color: '#800000'
    },
    olive: {
        color: '#808000'
    },
    lime: {
        color: '#00ff00'
    },
    aqua: {
        color: '#00ffff'
    },
    teal: {
        color: '#008080'
    },
    navy: {
        color: '#000080'
    },
    fuchsia: {
        color: '#ff00ff'
    },
    purple: {
        color: '#800080'
    },
    indianred: {
        color: '#cd5c5c'
    },
    lightcoral: {
        color: '#f08080'
    },
    salmon: {
        color: '#fa8072'
    },
    darksalmon: {
        color: '#e9967a'
    },
    lightsalmon: {
        color: '#ffa07a'
    },
    crimson: {
        color: '#DC143C'
    },
    firebrick: {
        color: '#B22222'
    },
    red: {
        color: '#FF0000'
    },
    darkred: {
        color: '#8B0000'
    },
    coral: {
        color: '#FF7F50'
    },
    tomato: {
        color: '#FF6347'
    },
    orangered: {
        color: '#FF4500'
    },
    gold: {
        color: '#FFD700'
    },
    orange: {
        color: '#FFA500'
    },
    darkorange: {
        color: '#FF8C00'
    },
    lightyellow: {
        color: '#FFFFE0'
    },
    lemonchiffon: {
        color: '#FFFACD'
    },
    papayawhip: {
        color: '#FFEFD5'
    },
    moccasin: {
        color: '#FFE4B5'
    },
    peachpuff: {
        color: '#FFDAB9'
    },
    palegoldenrod: {
        color: '#EEE8AA'
    },
    khaki: {
        color: '#F0E68C'
    },
    darkkhaki: {
        color: '#BDB76B'
    },
    yellow: {
        color: '#FFFF00'
    },
    lawngreen: {
        color: '#7CFC00'
    },
    limegreen: {
        color: '#32CD32'
    },
    forestgreen: {
        color: '#228B22'
    },
    darkgreen: {
        color: '#006400'
    },
    springgreen: {
        color: '#00FF7F'
    },
    mediumspringgreen: {
        color: '#00FA9A'
    },
    palegreen: {
        color: '#98FB98'
    },
    seagreen: {
        color: '#2E8B57'
    },
    powderblue: {
        color: '#B0E0E6'
    },
    lightskyblue: {
        color: '#87CEFA'
    },
    skyblue: {
        color: '#87CEEB'
    },
    deepskyblue: {
        color: '#00BFFF'
    },
    dodgerblue: {
        color: '#1E90FF'
    },
    cornflowerblue: {
        color: '#6495ED'
    },
    steelblue: {
        color: '#4682B4'
    },
    royalblue: {
        color: '#4169E1'
    },
    mediumblue: {
        color: '#0000CD'
    },
    blue: {
        color: 'rgba(4, 100, 236, 1)'
    },
    snow: {
        color: '#FFFAFA'
    },
    honeydew: {
        color: '#F0FFF0'
    },
    azure: {
        color: '#F0FFFF'
    },
    ghostwhite: {
        color: '#F8F8FF'
    },
    whitesmoke: {
        color: '#F5F5F5'
    },
    mintcream: {
        color: '#F5FFFA'
    },
    ivory: {
        color: '#FFFFF0'
    },
    floralwhite: {
        color: '#FFFAF0'
    },
    antiquewhite: {
        color: '#FAEBD7'
    },
    blanchedalmond: {
        color: '#FFEBCD'
    },
    bisque: {
        color: '#FFE4C4'
    },
    wheat: {
        color: '#F5DEB3'
    },
    burlywood: {
        color: '#DEB887'
    },
    tan: {
        color: '#D2B48C'
    },
    rosybrown: {
        color: '#BC8F8F'
    },
    sandybrown: {
        color: '#F4A460'
    },
    chocolate: {
        color: '#D2691E'
    },
    saddlebrown: {
        color: '#8B4513'
    },
    sienna: {
        color: '#A0522D'
    },
    brown: {
        color: '#A52A2A'
    },
});

const gradients: any = {
    orange: {
        array: ['#f17410', '#fc9b06', '#ffb504'],
        start: { x: 0.3, y:  0 },
        end: { x: 0, y:  0.3 },
    },
    red: {
        array: ['#e3002b', '#f70059', '#f9015e'],
        start: { x: 0.3, y:  0 },
        end: { x: 0, y:  0.3 },
    },
    blue: {
        array: ['#030fa9', '#020b72', '#010c78'],
        start: { x: 0.3, y:  0 },
        end: { x: 0, y:  0.3 },
    }
}

const background = StyleSheet.create({
    white: {
        backgroundColor: "#ffffff"
    },
    silver: {
        backgroundColor: '#c0c0c0'
    },
    gray: {
        backgroundColor: '#808080'
    },
    maroon: {
        backgroundColor: '#800000'
    },
    olive: {
        backgroundColor: '#808000'
    },
    lime: {
        backgroundColor: '#00ff00'
    },
    aqua: {
        backgroundColor: '#00ffff'
    },
    teal: {
        backgroundColor: '#008080'
    },
    navy: {
        backgroundColor: '#000080'
    },
    blue: {
        backgroundColor: 'rgba(4, 100, 236, 1)'
    },
    fuchsia: {
        backgroundColor: '#ff00ff'
    },
    purple: {
        backgroundColor: '#800080'
    },
    indianred: {
        backgroundColor: '#cd5c5c'
    },
    lightcoral: {
        backgroundColor: '#f08080'
    },
    salmon: {
        backgroundColor: '#fa8072'
    },
    darksalmon: {
        backgroundColor: '#e9967a'
    },
    lightsalmon: {
        backgroundColor: '#ffa07a'
    },
    crimson: {
        backgroundColor: '#DC143C'
    },
    firebrick: {
        backgroundColor: '#B22222'
    },
    red: {
        backgroundColor: '#FF0000'
    },
    darkred: {
        backgroundColor: '#8B0000'
    },
    coral: {
        backgroundColor: '#FF7F50'
    },
    tomato: {
        backgroundColor: '#FF6347'
    },
    orangered: {
        backgroundColor: '#FF4500'
    },
    gold: {
        backgroundColor: '#FFD700'
    },
    orange: {
        backgroundColor: '#FFA500'
    },
    darkorange: {
        backgroundColor: '#FF8C00'
    },
    lightyellow: {
        backgroundColor: '#FFFFE0'
    },
    lemonchiffon: {
        backgroundColor: '#FFFACD'
    },
    papayawhip: {
        backgroundColor: '#FFEFD5'
    },
    moccasin: {
        backgroundColor: '#FFE4B5'
    },
    peachpuff: {
        backgroundColor: '#FFDAB9'
    },
    palegoldenrod: {
        backgroundColor: '#EEE8AA'
    },
    khaki: {
        backgroundColor: '#F0E68C'
    },
    darkkhaki: {
        backgroundColor: '#BDB76B'
    },
    yellow: {
        backgroundColor: '#FFFF00'
    },
    lawngreen: {
        backgroundColor: '#7CFC00'
    },
    limegreen: {
        backgroundColor: '#32CD32'
    },
    forestgreen: {
        backgroundColor: '#228B22'
    },
    darkgreen: {
        backgroundColor: '#006400'
    },
    springgreen: {
        backgroundColor: '#00FF7F'
    },
    mediumspringgreen: {
        backgroundColor: '#00FA9A'
    },
    palegreen: {
        backgroundColor: '#98FB98'
    },
    seagreen: {
        backgroundColor: '#2E8B57'
    },
    powderblue: {
        backgroundColor: '#B0E0E6'
    },
    lightskyblue: {
        backgroundColor: '#87CEFA'
    },
    skyblue: {
        backgroundColor: '#87CEEB'
    },
    deepskyblue: {
        backgroundColor: '#00BFFF'
    },
    dodgerblue: {
        backgroundColor: '#1E90FF'
    },
    cornflowerblue: {
        backgroundColor: '#6495ED'
    },
    steelblue: {
        backgroundColor: '#4682B4'
    },
    royalblue: {
        backgroundColor: '#4169E1'
    },
    mediumblue: {
        backgroundColor: '#0000CD'
    },
    snow: {
        backgroundColor: '#FFFAFA'
    },
    honeydew: {
        backgroundColor: '#F0FFF0'
    },
    azure: {
        backgroundColor: '#F0FFFF'
    },
    ghostwhite: {
        backgroundColor: '#F8F8FF'
    },
    whitesmoke: {
        backgroundColor: '#F5F5F5'
    },
    mintcream: {
        backgroundColor: '#F5FFFA'
    },
    ivory: {
        backgroundColor: '#FFFFF0'
    },
    floralwhite: {
        backgroundColor: '#FFFAF0'
    },
    antiquewhite: {
        backgroundColor: '#FAEBD7'
    },
    blanchedalmond: {
        backgroundColor: '#FFEBCD'
    },
    bisque: {
        backgroundColor: '#FFE4C4'
    },
    wheat: {
        backgroundColor: '#F5DEB3'
    },
    burlywood: {
        backgroundColor: '#DEB887'
    },
    tan: {
        backgroundColor: '#D2B48C'
    },
    rosybrown: {
        backgroundColor: '#BC8F8F'
    },
    sandybrown: {
        backgroundColor: '#F4A460'
    },
    chocolate: {
        backgroundColor: '#D2691E'
    },
    saddlebrown: {
        backgroundColor: '#8B4513'
    },
    sienna: {
        backgroundColor: '#A0522D'
    },
    brown: {
        backgroundColor: '#A52A2A'
    },
});

const formStyles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 26
    },
    input: {
        color: '#333',
        backgroundColor: "white",
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginTop: 10,
        borderRadius: 100,
        height: 42,
        fontSize: 14,
        width: '100%'
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(100, 150, 255, .5)'
    },
    inputTextArea: {
        color: '#333',
        backgroundColor: "transparent",
        padding: 8,
        minHeight: 100,
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        textAlignVertical: 'top',
        borderWidth: 1,
        fontSize: 14,
        lineHeight: 26,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        elevation: 0
    },
    inputBackground: {
        backgroundColor: "rgba(255, 255, 255, 1)",
    }
});

const textStyles = StyleSheet.create({
    alignCenter: {
        textAlign: 'center'
    },
    alignLeft: {
        textAlign: 'left'
    },
    alignRight: {
        textAlign: 'right'
    },
    colorDark: {
        color: '#333',
    },
    micro: {
        fontSize: 8
    },
    nano: {
        fontSize: 10
    },
    pico: {
        fontSize: 12
    },
    xs: {
        fontSize: 14
    },
    sm: {
        fontSize: 16
    },
    md: {
        fontSize: 22
    },
    lg: {
        fontSize: 26
    },
    xl: {
        fontSize: 28
    },
    xxl: {
        fontSize: 32
    },
    bold: {
        fontWeight: 'bold'
    },
    shadowLight: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 8
    },
    shadowLightStrong: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 8
    }
});

const fontStyles = StyleSheet.create({
    robotoThin: {
        fontFamily: 'Roboto_100Thin'
    },
    robotoLight: {
        fontFamily: 'Roboto_300Light'
    },
    roboto: {
        fontFamily: 'Roboto_400Regular'
    },
    robotoMedium: {
        fontFamily: 'Roboto_500Medium'
    },
    robotoBold: {
        fontFamily: 'Roboto_700Bold'
    },
    robotoBlack: {
        fontFamily: 'Roboto_900Black'
    },

    nunitoExtraLight: {
        fontFamily: 'Nunito_200ExtraLight'
    },
    nunitoExtraLightItalic: {
        fontFamily: 'Nunito_200ExtraLight_Italic'
    },
    nunitoLight: {
        fontFamily: 'Nunito_300Light'
    },
    nunitoLightItalic: {
        fontFamily: 'Nunito_300Light_Italic'
    },
    nunito: {
        fontFamily: 'Nunito_400Regular'
    },
    nunitoRegularItalic: {
        fontFamily: 'Nunito_400Regular_Italic'
    },
    nunitoSemiBold: {
        fontFamily: 'Nunito_600SemiBold'
    },
    nunitoSemiBoldItalic: {
        fontFamily: 'Nunito_600SemiBold_Italic'
    },
    nunitoBold: {
        fontFamily: 'Nunito_700Bold'
    },
    nunitoBoldItalic: {
        fontFamily: 'Nunito_700Bold_Italic'
    },
    nunitoExtraBold: {
        fontFamily: 'Nunito_800ExtraBold'
    },
    nunitoExtraBoldItalic: {
        fontFamily: 'Nunito_800ExtraBold_Italic'
    },
    nunitoBlack: {
        fontFamily: 'Nunito_900Black'
    },
    nunitoBlackItalic: {
        fontFamily: 'Nunito_900Black_Italic'
    },
});

const alignStyles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const positionStyles = StyleSheet.create({
    absoluteTopRight: {
        position: 'absolute',
        top: 14,
        right: 14,
        marginTop: Constants.statusBarHeight
    },
    absoluteTopLeft: {
        position: 'absolute',
        top: 14,
        left: 14,
        marginTop: Constants.statusBarHeight
    }
});

const marginStyles = StyleSheet.create({
    top1: { marginTop: 1 },
    top2: { marginTop: 2 },
    top3: { marginTop: 3 },
    top4: { marginTop: 4 },
    topSm: { marginTop: 6 },
    topMd: { marginTop: 10 },
    topLg: { marginTop: 16 },
    topXl: { marginTop: 20 },
    left1: { marginLeft: 1 },
    left3: { marginLeft: 3 },
    left2: { marginLeft: 2 },
    left4: { marginLeft: 4 },
    leftSm: { marginLeft: 6 },
    leftMd: { marginLeft: 10 },
    leftLg: { marginLeft: 16 },
    leftXl: { marginLeft: 20 },
    bottom1: { marginBottom: 1 },
    bottom2: { marginBottom: 2 },
    bottom3: { marginBottom: 3 },
    bottom4: { marginBottom: 4 },
    bottomSm: { marginBottom: 6 },
    bottomMd: { marginBottom: 10 },
    bottomLg: { marginBottom: 16 },
    bottomXl: { marginBottom: 20 },
    right1: { marginRight: 1 },
    right2: { marginRight: 2 },
    right3: { marginRight: 3 },
    right4: { marginRight: 4 },
    rightSm: { marginRight: 6 },
    rightMd: { marginRight: 10 },
    rightLg: { marginRight: 16 },
    rightXl: { marginRight: 20 },
});

export {
    alignStyles,
    background,
    colors,
    fontStyles,
    formStyles,
    gradients,
    marginStyles,
    positionStyles,
    textStyles
}