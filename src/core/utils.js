import React, { createContext } from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { theme } from '../styles/styles'

const screenWidth = Dimensions.get('window').width;

//Used in Login
export const AuthContext = createContext();

//Used in User
export const UserContext = createContext();

//Validate form
export function formValidator(data) {
    const value = data.value;
    let retorno = { error: false, errorText: '' };

    // 1. Validação de campo obrigatório
    if (data.required && !value) {
        retorno = { error: true, errorText: 'Preenchimento obrigatório.' };
    } 
    // 2. Validação de formato de e-mail (se houver valor ou se for obrigatório)
    else if (data.email && value) {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(value)) {
            retorno = { error: true, errorText: 'E-mail inválido.' };
        }
    }

    // Exibição de toast se configurado
    if (retorno.error && retorno.errorText !== '' && data.showtoast) {
        showToast({ text: retorno.errorText, duration: 2000 });
    }

    return retorno;
}

//Remote HTTP
export async function remoteAPI(data) {
    try {
        const userDomain = await SecureStore.getItemAsync('userDomain');
        const userToken = await SecureStore.getItemAsync('userToken');
        const http_resource = await GlobalState.getValue({ field: 'http_resource', getStorage: true });
        const http_folder = await GlobalState.getValue({ field: 'http_folder', getStorage: true });
        const url = `${http_resource}${http_folder}${data.request ? `/${data.request}` : ''}`;

        const mostrarToast = data.showToast !== undefined ? data.showToast : true;

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            domain: userDomain || '',
            ...(data.header || {})
        };

        // Enviar token apenas se não for login e existir token
        if (userToken && data.request && data.request !== 'login') {
            headers.token = userToken;
        }

        const axiosConfig = {
            method: data.method || 'GET',
            url,
            headers,
            timeout: 15000 // Timeout de 15 segundos para evitar esperas infinitas
        };

        if (data.body) {
            axiosConfig.data = data.body;
        }

        const response = await axios(axiosConfig);

        if (response.data.status === 'false' || response.data.status === false) {
            const errorMsg = response.data.response?.error || 'Ocorreu um erro no servidor.';
            if (mostrarToast) {
                showToast({ text: errorMsg, duration: 2000 });
            }
            return false;
        }

        return response.data;
    } catch (error) {
        // Tratamento centralizado de erros
        const isNetworkError = !error.response;
        
        if (data.showToast !== false) {
            const userMsg = isNetworkError 
                ? 'Sem ligação à internet.' 
                : 'Erro na comunicação com o servidor.';
            showToast({ text: userMsg, duration: 2000 });
        }
        return false;
    }
}

//Create global VAR's
export const GlobalState = {
    allStates: {
        appFirstLaunched: null,
        user: {
            boardingVersion: 0,
        },
    },

    async getValue({ field, getStorage = false }) {
        if(!field) return null;

        if(getStorage) {
            try {
                const storageData = await AsyncStorage.getItem(field);
                if(storageData != null) {
                    let retorno = storageData;
                    if(typeof retorno === 'string') {
                        try {
                            retorno = JSON.parse(retorno);
                        } catch {
                            // Manter como string
                        }
                    }
                    return retorno;
                }
            } catch (e) {
                // Erro no AsyncStorage
            }
        }

        return this.allStates[field] != undefined ? this.allStates[field] : null;
    },
    async setValue({ field, value, setStorage = false }) {
        if(!field || value == undefined) return null;

        const currentValue = this.allStates[field];
        if(typeof currentValue == 'object' && typeof value == 'object') {
            this.allStates[field] = Utils.extend(currentValue, value);
        } else {
            this.allStates[field] = value;
        }

        if(setStorage) {
            try {
                await AsyncStorage.setItem(field, JSON.stringify(this.allStates[field]));
            } catch (e) {
                console.error('Erro ao guardar no AsyncStorage:', e);
            }
        }
    },
};

//Toast
export async function showToast(data) {
    const popupDefaults = {
        text: 'Ocorreu um erro. Tente novamente.',
        duration: data.duration ? data.duration : 1000,
        backgroundColor: theme.colors.error,
        containerStyle: {width: screenWidth - (theme.containerPadding * 2)},
        opacity: 1,
        shadow: false,
        position: -50
    };
    
    const popupData = { ...popupDefaults, ...data };
    Toast.show(popupData.text, popupData);
}

var Utils = {};

//Extend object (Mantido para compatibilidade se usado noutros locais, mas preferir spread operator)
Utils.extend = function(a, b) {
    return { ...a, ...b };
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
export function numberFormat(number) {
    if (number === null || number === undefined) return '0';
    /*if(number.toLocaleString('en-US').split(',').length > 1) {
        return number.toLocaleString('en-US').replace(/,/g, ' ')
    }*/

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function dateFormatter(dateTime) {
    if(!dateTime || dateTime.split('0000-00').length > 1)
        return {date: '...', time: ''};
  
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

export function splitDateTime(dateTimeString) {
    if (!dateTimeString) return { date: '', time: '' };

    const [datePart, timePart] = dateTimeString.split(' ');

    // Garantir que temos sempre partes válidas
    if (!datePart || !timePart) return { date: '', time: '' };

    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    return {
        date: `${day}/${month}/${year}`,  // dd/mm/yyyy
        time: `${hour}:${minute}`         // hh:mm
    };
}

export function textEntity(text) {
  const return_text = text.replace(/&euro;/g, '€');
  return return_text;
}
