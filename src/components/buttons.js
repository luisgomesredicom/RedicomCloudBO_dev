import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button as PaperButton, Text } from 'react-native-paper'
import { theme } from '../styles/styles'

export default function Button({ mode, style, ...props }) {
    if(mode == undefined) mode = 'text';

    const styles = StyleSheet.create({
        button: {
            width: '100%',
            borderRadius: 7,
            borderWidth: (mode == 'contained') ? 0 : 1
        },
        text: {
            fontWeight: 500,
            fontSize: props.loading == 1 ? 25 : 18,
            marginVertical: 10,
            marginHorizontal: 15,
            padding: 0,
            paddingTop: 5,
            paddingBottom: 5,
            minHeight: 30,
            verticalAlign: 'middle',
        },
    });
    
    return (
        <PaperButton
            style={[
                styles.button,
                mode === 'outlined' && { backgroundColor: theme.colors.lightgray, borderColor: theme.colors.lightgray},
                mode === 'contained' && { backgroundColor: theme.colors.buttons, borderColor: theme.colors.buttons},
                mode === 'text' && { borderRadius: 0,paddingVertical: 0,paddingHorizontal: 0,width: 'auto'},
                style,
            ]}
            labelStyle={styles.text}
            mode={mode}
            textColor={mode === 'outlined' && theme.colors.black || mode === 'contained' && theme.colors.white}
            buttonColor={mode === 'outlined' && theme.colors.white || mode === 'contained' && theme.colors.theme}
            allowFontScaling={false}
            {...props}
        />
    )
}


export function Link({style, styletext, text, ...props}) {
    const styles = StyleSheet.create({
        button: {
        },
        text: {
            fontWeight: 600,
            fontSize: 15,
            color: theme.colors.link
        },
    });
    
    return (
        <TouchableOpacity style={[styles.button, style, {padding: 8,margin: -8}]} {...props}>
            <Text style={[styles.text, styletext]}>{text}</Text>
        </TouchableOpacity>
    )
}