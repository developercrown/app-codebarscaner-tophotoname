import { Text, View } from 'react-native';

const WaitFullScreen = ({children, message, level}: any) => {
    return <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: `rgba(0, 0, 0, ${level ? level : .5})`,
            zIndex: 2
        }}
    >
        <Text style={{ color: '#eee' }}>{message}</Text>
        {children}
    </View>
}

export default WaitFullScreen;