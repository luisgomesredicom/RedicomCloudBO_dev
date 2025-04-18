import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { DatePickerInput, DatePickerModal, pt, registerTranslation } from 'react-native-paper-dates';
import { Octicons } from '@expo/vector-icons';
import { theme } from '../styles/styles'

registerTranslation('pt-PT', pt);

export function DateInput({ ...props }) {
  let CSstyles = {}
  let textColor = ''
  if(props.disabled == true) {
    CSstyles = {backgroundColor: theme.colors.background}
    textColor = theme.colors.gray
  }

  return (
    <View style={[styles.container, {marginBottom: 0}]}>
      <DatePickerInput
        textColor={textColor}
        style={[styles.input, CSstyles]}
        activeOutlineColor={theme.colors.darkgray}
        mode="outlined"
        locale="pt-PT"
        autoCapitalize="none"
        returnKeyType="next"
        label={props.label}
        value={props.value}
        inputMode={props.inputMode ? props.inputMode : 'start'}
        onChange={props.onChange ? props.onChange : undefined}
        /*iconStyle={{marginTop: 8}}*/
        withDateFormatInLabel={false}
        {...props}
      />
      {props.description && !props.errorText ? (
        <Text style={styles.description}>{props.description}</Text>
      ) : null}
      {props.errorText ? <Text style={styles.error}>{props.errorText}</Text> : null}
    </View>
  )
}

export function DatePicker({ ...props }) {
  return (
    <View style={[styles.container, {marginBottom: 0}]}>
      <DatePickerModal
        locale="pt-PT"
        mode={props.mode ? props.mode : 'single'}
        startYear={2023}
        closeIcon={() => (
          <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor: 'transparent',width: '100%',height: '100%'}}>
            <Octicons name="x" size={26} color="black" />
          </View>
        )}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  input: {
    backgroundColor: theme.colors.white,
    fontSize: 15,
    height: 45,
    lineHeight: 18
  },
  description: {
    fontSize: 13,
    color: theme.colors.black,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})
