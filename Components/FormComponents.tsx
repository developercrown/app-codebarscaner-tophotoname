import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, formStyles, textStyles } from "./Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const FormContainer = (props: any) => {
    const {style, containerStyle} = props;
    return <KeyboardAvoidingView style={[{  }, containerStyle]} behavior={"padding"} enabled>
        <View style={[{ marginTop: 10 }, style]}>
            {props.children}
        </View>
    </KeyboardAvoidingView>
}

const Input = forwardRef((props: any, ref: any) => {
    const inputRef = useRef<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const {
            icon,
            label,
            keyboardType,
            onChange,
            onSubmit,
            placeholder,
            style,
            styleInput,
            type,
            value,
        } = props;

    const toggleVisible = () => {
        setVisible(!visible)
    }

    const handleFocus = () => inputRef.current.focus();
    const handleBlur = () => inputRef.current.blur();

    const handleSubmit = () => {
        if(onSubmit){
            onSubmit()
        }
    }

    useImperativeHandle(ref, () => ({
        focus: () => {
            handleFocus()
        },
        blur: () => {
            handleBlur()
        }
    }));

    return <View style={formStyles.inputContainer}>

        {
            !icon && <>
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
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit}
                    placeholder={placeholder}
                    ref={inputRef}
                    returnKeyType="done"
                    style={[formStyles.input, formStyles.inputBackground, styleInput]}
                    value={value}
                    />
            </>

        }


        {
            icon && <View style={
                [
                    formStyles.input,
                    formStyles.inputBackground,
                    {
                        flexDirection: 'row',
                        overflow: 'hidden',
                        marginVertical: 10
                    },
                    style
                ]
            }>
                <IconButton icon={icon} color={colors.dark.color} size={24}/>
                <TextInput
                    keyboardType={keyboardType}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit}
                    placeholder={placeholder}
                    ref={inputRef}
                    returnKeyType="done"
                    secureTextEntry={type === "password" && !visible}
                    style={[
                        {
                            marginLeft: 6,
                            width: type === "password" ? "82%" : "90%"
                        },
                        styleInput
                    ]}
                    value={value}
                    />
                {
                    type === "password" && <IconButton icon={visible ? "eye" : "eye-off"} color={colors.dark.color} size={24} onTouch={toggleVisible}/>
                }
            </View>
        }
    </View>
})

const Select = (props: any) => {
    const { items, label, onChange, style, styleLabel, styleContainer, value } = props
    return <View style={[{ padding: 10, marginTop: 4 }, styleContainer]}>
        <Text style={[{ color: '#111', fontWeight: 'bold', marginBottom: 10 }, styleLabel]}>{label}:</Text>
        <Picker
            style={
                [
                    {
                        backgroundColor: 'rgba(255, 255, 255, .8)',
                        color: '#333',
                        fontWeight: 'bold',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, .4)'
                    },
                    style
                ]
            }
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

const TextArea = forwardRef((props: any, ref: any) => {
    const { fontSize, onChange, value, label, onSubmit, placeholder, style, styleContainer } = props
    const inputRef = useRef<any>();

    const handleFocus = () => inputRef.current.focus();
    const handleBlur = () => inputRef.current.blur();

    const handleSubmit = () => {
        if(onSubmit){
            onSubmit()
        }
    }

    useImperativeHandle(ref, () => ({
        focus: () => {
            handleFocus()
        },
        blur: () => {
            handleBlur()
        }
    }));

    return <View style={[formStyles.inputContainer, styleContainer]}>
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
            style={[
                formStyles.inputTextArea,
                formStyles.inputBackground,
                {
                    fontSize: fontSize ? fontSize : 14
                },
                style
            ]}
            multiline={true}
            value={value}
            ref={inputRef}
            placeholder={placeholder}
            onChangeText={onChange}
            onSubmitEditing={handleSubmit}
        />
    </View>
});

const GradientButton = (props: any) => {
    const { borderRadius, colors, label, labelStyle, onTouch, width, height, x , y, style } = props;

    const handleTouch = () => {
        if (onTouch) {
            onTouch()
        }
    }

    return <TouchableOpacity onPress={handleTouch}>
        <LinearGradient
            colors={colors ? colors : ['#4064ae', '#545da9', '#7756a3']}
            style={[{ width: width ? width : 200, height: height ? height : 50, borderRadius: borderRadius ? borderRadius : 30, justifyContent: 'center', alignItems: 'center' }, style]}
            start={{ x: x ? x : 0.7, y: y ? y : 0 }}
        >
            {props.children ? props.children : (label ? <Text style={[textStyles.md, textStyles.bold, { color: 'white' }, labelStyle]}>{label}</Text> : '')}
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

export {
    FormContainer,
    GradientButton,
    GradientContainer,
    IconButton,
    Input,
    Select,
    TextArea
}