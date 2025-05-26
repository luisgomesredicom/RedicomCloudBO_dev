import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import { Text, View, LogBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';
import { Routes } from "./src/routes";
import { GlobalState, AuthContext, UserContext } from './src/core/utils';
import { theme } from './src/styles/styles';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {  
    const [appIsReady, setAppIsReady] = useState(null);
    
    useEffect(() => {
        async function prepare() {
            try {
                //Global VARS
                await GlobalState.setValue({ field: 'http_resource', value: 'https://appservices.redicom.ws', setStorage: true });
                await GlobalState.setValue({ field: 'http_folder', value: '/app', setStorage: true });
                
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync({
                    'RedicomUI': require('./assets/fonts/RedicomUI-SemiBold.ttf'),
                    'RedicomIcons': require('./assets/fonticon/redicom_app_bo.ttf'),
                    'SF Mono 500': require('./assets/fonts/SFMonoMedium.ttf')
                });

                // Removel all storage
                //await AsyncStorage.clear();
                /*await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('userCode');
                await SecureStore.deleteItemAsync('userBiometric');
                await SecureStore.deleteItemAsync('userDomain');
                await SecureStore.deleteItemAsync('userName');
                await SecureStore.deleteItemAsync('userPassword');*/
                
                // Restore token stored in `SecureStore`
                let userToken = await SecureStore.getItemAsync('userToken');
                let userCode = await SecureStore.getItemAsync('userCode');
                let userBiometric = await SecureStore.getItemAsync('userBiometric');
                let userDomain = await SecureStore.getItemAsync('userDomain');
                let userName = await SecureStore.getItemAsync('userName');
                let userPassword = await SecureStore.getItemAsync('userPassword');
                //let userBoardingVersion = await SecureStore.getItemAsync('userBoardingVersion');

                if(userCode == '') {
                    SecureStore.deleteItemAsync('userPassword');
                    SecureStore.deleteItemAsync('userToken');
                    userToken = null;
                    userPassword = null;
                }

                dispatch({
                    type: 'RESTORE_TOKEN',
                    token: userToken,
                    code: userCode,
                    biometric: userBiometric,
                    isSigin: false,
                    domain: userDomain,
                    name: userName,
                    password: userPassword,
                    //boardingVersion: userBoardingVersion
                });

            } catch (e) {
                //console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        
        prepare();

    }, []);

    const [userState, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        lastUpdate: 'restoreToken',
                        token: action.token,
                        code: action.code,
                        biometric: action.biometric,
                        domain: action.domain,
                        name: action.name,
                        password: action.password,
                        isSigin: action.isSigin,
                        //boardingVersion: action.boardingVersion,
                    };
                case 'SIGN_IN':
                    let userData = {...prevState, lastUpdate: 'signIn'}

                    if(typeof action.isSigin !== 'undefined') userData.isSigin = action.isSigin;
                    if(typeof action.token !== 'undefined') userData.token = action.token;
                    if(typeof action.code !== 'undefined')  userData.code  = action.code;
                    if(typeof action.biometric !== 'undefined') userData.biometric = action.biometric;
                    if(typeof action.domain !== 'undefined')    userData.domain = action.domain;
                    if(typeof action.name !== 'undefined')  userData.name = action.name;
                    if(typeof action.password !== 'undefined')  userData.password = action.password;
                    //if(typeof action.boardingVersion)  userData.boardingVersion = action.boardingVersion;

                    if(userData.token == '' || userData.domain == '' || userData.name == '' || userData.password == '') {
                        userData.isSigin = false;
                    }
                    
                    return userData;

                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        token: null,
                        code: null,
                        biometric: null,
                        password: null,
                        isSigin: false,
                        lastUpdate: 'signOut'
                    };
                case 'RESET_USER':
                    return {
                        ...prevState,
                        token: null,
                        code: null,
                        biometric: null,
                        password: null,
                        isSigin: false,
                        lastUpdate: 'resetUser',
                        //boardingVersion: null,
                    };
                case 'DESTROY_USER':
                    return {
                        ...prevState,
                        token: null,
                        code: null,
                        biometric: null,
                        domain: null,
                        name: null,
                        password: null,
                        isSigin: false,
                        lastUpdate: 'destroyUser',
                        //boardingVersion: null,
                    };
            }
        },
        {
            token: null,
            code: null,
            biometric: null,
            domain: null,
            name: null,
            password: null,
            isSigin: false,
            //boardingVersion: null,
        }
    );
    
    const authContext = useMemo(() => ({
        signIn: async (data) => {
            let userData = {type: 'SIGN_IN'};

            if(typeof data.token !== 'undefined') {
                userData.token = data.token;
                await SecureStore.setItemAsync('userToken', data.token);
            }

            if(typeof data.code !== 'undefined') {
                userData.code = data.code;
                await SecureStore.setItemAsync('userCode', data.code);
            }

            if(typeof data.biometric !== 'undefined') {
                userData.biometric = data.biometric;
                await SecureStore.setItemAsync('userBiometric', data.biometric);
            }

            if(typeof data.domain !== 'undefined') {
                userData.domain = data.domain;
                await SecureStore.setItemAsync('userDomain', data.domain);
            }

            if(typeof data.name !== 'undefined') {
                userData.name = data.name;
                await SecureStore.setItemAsync('userName', data.name);
            }

            if(typeof data.password !== 'undefined') {
                userData.password = data.password;
                await SecureStore.setItemAsync('userPassword', data.password);
            }

            if(typeof data.isSigin !== 'undefined') {
                userData.isSigin = data.isSigin;
            }
            
            dispatch(userData);
        },
        signOut: async () => {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userCode');
            await SecureStore.deleteItemAsync('userBiometric');
            await SecureStore.deleteItemAsync('userPassword');
            dispatch({type: 'SIGN_OUT'});
        },
        resetUser: async () => {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userCode');
            await SecureStore.deleteItemAsync('userBiometric');
            await SecureStore.deleteItemAsync('userPassword');
            dispatch({type: 'RESET_USER'});
        },
        destroyUser: async () => {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userCode');
            await SecureStore.deleteItemAsync('userBiometric');
            await SecureStore.deleteItemAsync('userDomain');
            await SecureStore.deleteItemAsync('userName');
            await SecureStore.deleteItemAsync('userPassword');
            dispatch({type: 'DESTROY_USER'});
        }
    }), []);

    if (!appIsReady) return null;
    
    return (
        <AuthContext.Provider value={authContext}>
            <UserContext.Provider value={userState}>
            <ActionSheetProvider>
                <RootSiblingParent>
                <PaperProvider theme={theme}>
                    <View style={{ flex: 1 }}>
                        <Routes/>
                    </View>
                </PaperProvider>
                </RootSiblingParent>
            </ActionSheetProvider>
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}