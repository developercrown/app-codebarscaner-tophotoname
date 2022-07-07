import { StyleSheet } from "react-native";

const formStyles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 26
    },
    input: {
        color: '#333',
        backgroundColor: "transparent",
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginTop: 10,
        borderRadius: 0,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(100, 150, 255, .5)'
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
    }
});

export {
    formStyles,
    textStyles
}