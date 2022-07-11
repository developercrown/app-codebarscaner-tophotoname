import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { formStyles, textStyles } from "./Styles";
import Ionicons from '@expo/vector-icons/Ionicons';

// const Input = (props: any) => {
//     const { label, value, onChange } = props;

//     return <View style={{ marginTop: 10 }}>
//         <Text style={{ color: '#eee', fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
//         <TextInput value={value} onChangeText={onChange} style={
//             {
//                 color: '#eee',
//                 backgroundColor: "rgba(0,0,0,.5)",
//                 paddingVertical: 10,
//                 paddingHorizontal: 16,
//                 marginTop: 10,
//                 borderRadius: 4,
//                 fontSize: 16
//             }
//         } />
//     </View>
// }

const FormContainer = (props: any) => {
    return <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} enabled><View style={{ flex: 1, marginTop: 10 }}>
            {props.children}
        </View>
    </KeyboardAvoidingView>
}

const Input = (props: any) => {
    const { label, value, onChange } = props;
    return <View style={formStyles.inputContainer}>
        <Text style={[
            textStyles.alignLeft,
            textStyles.colorDark,
            textStyles.xs,
            textStyles.bold,
            {
                marginTop: 10
            }
        ]}>{label}:</Text>
        <TextInput value={value} onChangeText={onChange} style={formStyles.input} />
    </View>
}

const Select = (props: any) => {
    const { items, label, onChange, value } = props
    return <View style={{ padding: 10, marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{label}:</Text>
        <Picker
            style={{
                backgroundColor: 'rgba(3, 102, 181, .5)',
                color: '#eee',
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, .4)'
            }}
            selectedValue={value}
            onValueChange={(itemValue) =>
                onChange(itemValue)
            }>
            {
                items.map((e: any, key: number) => <Picker.Item key={key} label={e} value={e} />)
            }
        </Picker>
    </View>
}

const TextArea = (props: any) => {
    const { onChange, value, label, placeholder } = props
    return <View style={formStyles.inputContainer}>
        <Text style={[
            textStyles.alignLeft,
            textStyles.colorDark,
            textStyles.xs,
            textStyles.bold,
            {
                marginTop: 10
            }
        ]}>{label}:</Text>
        <TextInput
            style={formStyles.inputTextArea}
            multiline={true}
            value={value}
            placeholder={placeholder}
            onChangeText={onChange}
        />
    </View>
}

const GradientButton = (props: any) => {
    const { borderRadius, colors, label, onTouch, width, height, x , y } = props;

    const handleTouch = () => {
        if (onTouch) {
            onTouch()
        }
    }

    return <TouchableOpacity onPress={handleTouch}>
        <LinearGradient
            colors={colors ? colors : ['#4064ae', '#545da9', '#7756a3']}
            style={{ width: width ? width : 200, height: height ? height : 50, borderRadius: borderRadius ? borderRadius : 30, justifyContent: 'center', alignItems: 'center' }}
            start={{ x: x ? x : 0.7, y: y ? y : 0 }}
        >
            {props.children ? props.children : (label ? <Text style={[textStyles.md, textStyles.bold, { color: 'white' }]}>{label}</Text> : '')}
        </LinearGradient>
    </TouchableOpacity>
}

const GradientContainer = (props: any) => {
    const { style, colors, width, height, start , end } = props;
    return <LinearGradient
            colors={colors ? colors : ['#4064ae', '#545da9', '#7756a3']}
            style={[{ width: width ? width : '100%', height: height ? height : 50 }, style]}
            start={start}
            end={end}
        >
            {props.children}
        </LinearGradient>
}

const IconButton = (props: any) => {
    const { icon, color, size, onTouch, style } = props;

    const handleTouch = () => {
        if (onTouch) {
            onTouch()
        }
    }

    return <TouchableOpacity onPress={handleTouch} style={[{
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }, style]}>
        <Ionicons name={icon} size={size ? size : 32} style={{ color: color ? color : '#333' }} />
    </TouchableOpacity>
}



const BodyStyles = StyleSheet.create({
    input: {
        width: '100%',
        height: 44,
        backgroundColor: '#f1f3f6',
        borderRadius: 6,
        paddingHorizontal: 10
    }
});

export {
    FormContainer,
    GradientButton,
    GradientContainer,
    IconButton,
    Input,
    Select,
    TextArea
}