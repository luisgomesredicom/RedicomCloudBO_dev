import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../styles/styles'

export function TextInput({ ...props }) {
    let CSstyles = {}
    let textColor = ''
    if(props.disabled == true) {
        CSstyles = {backgroundColor: theme.colors.background}
        textColor = theme.colors.gray
    }

    const styles = StyleSheet.create({
        input: {backgroundColor: theme.colors.white,fontSize: 16,height: 45,lineHeight: 18},
        description: {fontSize: 13,color: theme.colors.black,paddingTop: 8},
        error: {fontSize: 13,color: theme.colors.error,paddingTop: 8}
    })

    return (
        <View style={{width: '100%'}}>
            <Input
                textColor={textColor}
                style={[styles.input, CSstyles]}
                activeOutlineColor={theme.colors.darkgray}
                underlineColor="transparent"
                mode="outlined"
                locale="pt-PT"
                right={props.rightIcon ? <Input.Icon icon={props.rightIcon} style={{marginTop: 8}} /> : undefined}
                {...props}
            />
            {props.description && !props.errorText ? (<Text style={styles.description}>{props.description}</Text>) : null}
            {props.errorText ? <Text style={styles.error}>{props.errorText}</Text> : null}
        </View>
    )
}

