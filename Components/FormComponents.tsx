import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { textStyles } from "./Styles";

const Input = (props: any) => {
    const { label, value, onChange } = props;

    return <View style={{ marginTop: 10 }}>
        <Text style={{ color: '#eee', fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
        <TextInput value={value} onChangeText={onChange} style={
            {
                color: '#eee',
                backgroundColor: "rgba(0,0,0,.5)",
                paddingVertical: 10,
                paddingHorizontal: 16,
                marginTop: 10,
                borderRadius: 4,
                fontSize: 16
            }
        } />
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
    return <View style={{ padding: 10, marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{label}:</Text>
        <TextInput
            style={[
                BodyStyles.input,
                {
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    color: '#eee',
                    height: 80,
                    padding: 10,
                    justifyContent: 'center',
                    textAlignVertical: 'top',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, .2)'
                }
            ]}
            multiline={true}
            value={value}
            placeholder={placeholder}
            onChangeText={onChange}
        />
    </View>
}

const GradientButton = (props: any) => {
    const {label, onTouch} = props;

    const handleTouch = () => {
        if(onTouch) {
            onTouch()
        }
    }

    return <TouchableOpacity onPress={handleTouch}>
        <LinearGradient
            colors={['#4064ae', '#545da9', '#7756a3']}
            style={{ width: 200, height: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
            start={{ x: 0.7, y: 0 }}
        >
            {props.children ? props.children : (label ? <Text style={[textStyles.md, textStyles.bold, {color: 'white'}]}>{label}</Text> : '')}
        </LinearGradient>
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
    GradientButton,
    Input,
    Select,
    TextArea
}