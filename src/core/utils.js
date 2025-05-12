import React, { createContext } from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { theme } from '../styles/styles'

const screenWidth = Dimensions.get('window').width;

//Used in Login
export const AuthContext = createContext();

//Used in User
export const UserContext = createContext();

//Validate form
export function formValidator(data){
    const fv = {
        email: function(value) {
            const re = /\S+@\S+\.\S+/
            if (!value) return {error: true, errorText: 'Introduza o e-mail.'}
            if (!re.test(value)) return {error: true, errorText: 'E-mail inválido.'}
            return {error: false}
        },
        required: function(value) {
            if (!value) return {error: true, errorText: 'Preenchimento obrigatório.'}
            return {error: false}
        }
    }

    var retorno = {error: false};
    
    if(!retorno.error && data.required) retorno = fv.required(data.value);
    else if(!retorno.error && data.required) retorno = fv.email(data.value);

    if(retorno.error && retorno.errorText != '' && data.showtoast) {
        showToast({text: retorno.errorText, duration: 2000});
    }
    
    return retorno;
}

//Remote HTTP
export async function remoteAPI (data){
    let userDomain = await SecureStore.getItemAsync('userDomain');
    let userToken = await SecureStore.getItemAsync('userToken');
    const http_resource = GlobalState.getValue({field: 'http_resource'});
    const http_folder = GlobalState.getValue({field: 'http_folder'});
    const http = `${http_resource}${http_folder}${data.request != '' ? `/${data.request}` : ''}`;
    const mostrarToast = typeof data.showToast != 'undefined' ? data.showToast : true;

    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'domain': userDomain
    }

    if(userToken != null && data.request && data.request != 'login') {
        headers['token'] = userToken;
    }

    if(data.header) {
        headers = {
            ...headers,
            ...data.header
        }
    }
    
    return fetch(http, {
        method: data.method || 'GET',
        headers: headers,
        body: data.body ? JSON.stringify(data.body) : null
    })
    .then(response => response.json())
    .then(resp => {
        if(resp.status === 'false') {
            if(mostrarToast)
                showToast({text: resp.response.error, duration: 2000});
            
            return false;
        }
        return resp;
    })
    .catch(error => {
      console.error(error);
    });
}

//Create global VAR's
export const GlobalState = async () => {
    var allStates = {
        appFirstLaunched: null,
        user: {
            boardingVersion: 0
        }
    }

    const _f = {
        getValue: function(data) {
            if(data.field == undefined) return null;
            
            if(data.getStorage) {
                return (async () => {
                    var retorno = '';

                    try {
                        const storageData = await AsyncStorage.getItem(data.field);
                        if(storageData !== null) {
                            retorno = storageData;
                        } else {
                            retorno = allStates[data.field] || null;
                        }

                    } catch(e) {
                        retorno = allStates[data.field] || null;
                    }

                    if(typeof retorno == 'string' && retorno.substring(0, 1) == '{')
                        retorno = JSON.parse(retorno);

                    return retorno;
                })();
            } else {
                return allStates[data.field] == undefined ? null : allStates[data.field];
            }
        },
        setValue: function(data){
            if(data.field == undefined || data.value == undefined) return null;
            
            //if(allStates[data.field] == undefined)
                allStates[data.field] = data.value;
            //else
                var finalData = Utils.extend(allStates[data.field], data.value);
            
            if(data.setStorage) {
                AsyncStorage.setItem(data.field, JSON.stringify(finalData));
            }
        }
    }

    GlobalState.getValue = _f.getValue;
    GlobalState.setValue = _f.setValue;
}

//Toast
export function showToast(data) {
    var toastVisible = GlobalState.getValue({field: 'toastVisible'});
    var popupDefaults = {
        text: 'Ocorreu um erro. Tente novamente.',
        duration: data.duration ? data.duration : 500,
        backgroundColor: theme.colors.error,
        containerStyle: {width: screenWidth - (theme.containerPadding * 2)},
        opacity: 1,
        shadow: false,
        position: -50,
        onShow: function(){
            GlobalState.setValue({field: 'toastVisible', value: true});
        },
        onHidden: function() {
            GlobalState.setValue({field: 'toastVisible', value: false});
        }
    };
    
    if(toastVisible) {
        //Toast.hide();
        return;
    }
    
    var popupData = Utils.extend(popupDefaults, data);
    Toast.show(popupDefaults.text, popupData);
}

var Utils = {};

//Extend object
Utils.extend = function(a, b) {
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

//Price format
export function priceFormat(number, decimals, decPoint, thousandsSep, prefix, sufix) {
    if(decimals == undefined) decimals = 2;
    if(decPoint == undefined) decPoint = ',';
    if(thousandsSep == undefined) thousandsSep = '.';
    if(prefix == undefined) prefix = '';
    if(sufix == undefined) sufix = ' EUR';

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
            .toFixed(prec)
    }

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    
    return prefix + s.join(dec) + sufix;
}

//Number format
export function numberFormat(number){
    if(number.toLocaleString('en-US').split(',').length > 1) {
        return number.toLocaleString('en-US').replace(/,/g, ' ')
    }

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function dateFormatter(dateTime) {
    if(!dateTime) return '';
  
    const [datePart, timePart] = dateTime.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    let d;
  
    if(timePart) {
      const [hour, minute] = timePart.split(':').map(Number);
      d = new Date(year, month - 1, day, hour, minute);
    } else {
      d = new Date(year, month - 1, day);
    }
  
    const monthsPT = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
    const hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${monthsPT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    
    return {
        date: formattedDate,
        time: hasTime ? `${hour}:${minute}H` : ''
    };
}  

export function textEntity(text) {
  const return_text = text.replace(/&euro;/g, '€');
  return return_text;
}

