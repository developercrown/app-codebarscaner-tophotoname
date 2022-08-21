import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from './FormComponents';
import Constants from 'expo-constants';
import { colors, fontStyles, textStyles } from './Styles';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const InternalHeader = (props?: any) => {
    const { title, leftIcon, leftAction, light, rightIcon, rightAction, rightLongAction, style } = props;

    return <View style={[styles.container, style]}>
        {
            leftIcon ? <IconButton
                icon={leftIcon}
                color={light ? colors.dark.color : colors.white.color}
                size={32}
                onTouch={leftAction}
                style={{}}
            />
            :
            <View style={{width: 32}} />
        }
        <Text style={[
            light ? colors.dark : colors.white,
            // textStyles.bold,
            textStyles.md,
            fontStyles.nunitoSemiBold
        ]}>{title}</Text>
        {
            rightIcon ? <Pressable delayLongPress={4000} onLongPress={rightLongAction} onPress={rightAction}>
                <Ionicons name={rightIcon} size={32} style={{ color: light ? colors.dark.color : colors.white.color }} />
            </Pressable>
            :
            <View style={{width: 32}} />
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        height: Constants.statusBarHeight + 32,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        // elevation: 2
    }
})

export default InternalHeader;