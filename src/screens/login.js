import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, View, Image, Alert, Dimensions } from 'react-native';
import { Text } from 'react-native-paper'
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '../styles/styles'
import Button from '../components/buttons'
import { KeyboardNumeric, LoadingFullscreen, Icon } from '../components/elements';
import { AuthContext, UserContext, remoteAPI, showToast } from '../core/utils';
import Logo from '../images/logo.svg';

export function LoginScreen() {
    const { screenWidth } = Dimensions.get('window');
    const [pageStatus, setPageStatus] = useState(0);
    const userState = useContext(UserContext);
    const {signIn} = useContext(AuthContext);
    const {resetUser} = useContext(AuthContext);
    const {destroyUser} = useContext(AuthContext);
    const [authenticationEnabled, setAuthenticationEnabled] = useState(false);
    const [codeLength, setCodeLength] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [authenticationType, setAuthenticationType] = useState(null);

    async function verifyAvailableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setAuthenticationEnabled(compatible);
        if(!compatible) return;

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setAuthenticationType(types[0]);
        // 1 - Fingerprint
        // 2 - FaceID
        //console.log(types[0], types.map(type => LocalAuthentication.AuthenticationType[type]));

        if(types[0] && userState.lastUpdate == 'restoreToken') {
            await acceptAuthentication();
        }
    }

    const setKeyboardVal = (code) => {
        if(code != 'clear' && codeLength >= 4 || code == 'clear' && codeLength <= 0 || frezeKeyboard == true)
            return false;

        if(code == 'clear') {
            setCodeLength(codeLength - 1);
            code_1 = code_1.slice(0, -1);
            return;
        }

        setCodeLength(codeLength + 1);
        code_1 = code_1 + code.toString();

        if((codeLength + 1) == 4) {
            frezeKeyboard = true;
            submit();
        }
    }

    function submit() {
        if(code_1 != userState.code) {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )

            code_1 = '';
            setTimeout(function() {
                setCodeLength(0);
                setShouldAnimate(true);

                setTimeout(function(){
                    frezeKeyboard = false;
                }, 1000);
            }, 100);

            return false;
        }

        (async () => {
            const data = await remoteAPI({
                request: 'login',
                method: 'POST',
                header: {
                    domain: userState.domain,
                    username: userState.name,
                    password: userState.password
                },
                showToast: false
            });

            if(data == false) {
                showToast({text: 'Não foi possível realizar a autenticação. Tente novamente.', duration: 2000});
                resetUser();
                return false;
            }

            signIn({isSigin: true});
        })();
    }

    useEffect(() => {
        code_1 = '',
        frezeKeyboard = false
        setPageStatus(1);

        if(userState.biometric === 'true')
            verifyAvailableAuthentication();
    }, []);

    async function acceptAuthentication() {
        const isBiometric = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometric) {
            return Alert.alert(
                `O ${authenticationType == 1 ? `Touch ID` : `Face ID`} não está disponível`,
                `Tente configurar o ${authenticationType == 1 ? `Touch ID` : `Face ID`} mais tarde.`,
                [{ text: "Fechar" }]
            );
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: `Use o ${authenticationType == 1 ? `Touch ID` : `Face ID`} para autenticar`,
            fallbackLabel: `A autenticação foi cancelada`
        });

        if(auth.success) {
            signIn({isSigin: true});
        } else {
            //console.log('Authentication failed');
            return false;
        }
    }

    return (
        <SafeAreaView style={theme.safeAreaView}>
            <StatusBar barStyle='default'/>
                {
                pageStatus > 0 ? (
                    <ScrollView style={theme.wrapperPage} contentContainerStyle={[theme.wrapperContentStyle, {flex: 1}]}>
                        <View style={{alignItems: 'center',justifyContent: 'flex-end',marginBottom: screenWidth <= 375 ? 15 : '5%',marginTop: screenWidth <= 375 ? 40 : '15%'}}>
                            <Logo height={26} />
                        </View>

                        <View style={{flexGrow: 1, paddingTop: screenWidth <= 375 ? 15 : '10%',marginBottom: screenWidth <= 375 ? 10 : 0}}>
                            <View style={{justifyContent: 'center'}}>
                                <View style={{marginBottom: 17}}>
                                    <Text style={[theme.secondaryTitle, {textAlign: 'center'}]}>Olá, {userState.name}!</Text>
                                </View>

                                <Animatable.View
                                    animation={shouldAnimate ? 'shake' : undefined}
                                    duration={1000}
                                    iterationCount={1}
                                    onAnimationEnd={() => setShouldAnimate(false)}
                                >
                                    <View style={{flexDirection: 'row',gap: 28,justifyContent: 'center',alignItems: 'center'}}>
                                        <View style={[theme.bulletPassword, codeLength > 0 ? { backgroundColor: theme.colors.black } : {}]}></View>
                                        <View style={[theme.bulletPassword, codeLength > 1 ? { backgroundColor: theme.colors.black } : {}]}></View>
                                        <View style={[theme.bulletPassword, codeLength > 2 ? { backgroundColor: theme.colors.black } : {}]}></View>
                                        <View style={[theme.bulletPassword, codeLength > 3 ? { backgroundColor: theme.colors.black } : {}]}></View>
                                    </View>
                                </Animatable.View>

                                <View style={{marginTop: 20}}>
                                    <Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.gray}]}>{pageStatus == 1 ? 'Digite o código' : 'Digite novamente'}</Text>
                                </View>
                            </View>
                        </View>

                        <KeyboardNumeric style={{marginTop: 'auto'}} onPress={setKeyboardVal}/>

                        <View style={{justifyContent: 'center',alignItems: 'center',marginTop: screenWidth <= 375 ? 20 : 40,marginBottom: 20}}>
                            <Button mode='outlined' onPress={() => {destroyUser();}}>Entrar com uma conta diferente</Button>
                        </View>

                    </ScrollView>
                ) : <LoadingFullscreen />
            }
        </SafeAreaView>
    );
}