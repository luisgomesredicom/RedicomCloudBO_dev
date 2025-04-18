import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, StatusBar, View, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper'
import { theme } from '../styles/styles'
import Button from '../components/buttons'
import { KeyboardNumeric, LoadingFullscreen } from '../components/elements';
import { AuthContext, showToast } from '../core/utils';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';

export function SettingsCodeAddScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const action = route.params?.action;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const insets = useSafeAreaInsets();
    const {signIn} = useContext(AuthContext);
    const [pageStatus, setPageStatus] = useState(0);
    const [codeLength, setCodeLength] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [authenticationType, setAuthenticationType] = useState(null);

    const setKeyboardVal = (code) => {
        if(code != 'clear' && codeLength >= 4 || frezeKeyboard == true)
            return false;

        if(code == 'clear' && codeLength <= 0) {
            if(pageStatus == 1) {
                return false;
            } else {
                code_1 = '';
                code_2 = '';
                setCodeLength(0);
                setPageStatus(1);
                return false;
            }
        }

        frezeKeyboard = true;

        if(code != 'clear') {
            setCodeLength(codeLength + 1);
            
            if(pageStatus == 1)
                code_1 = code_1 + code.toString();
            else
                code_2 = code_2 + code.toString();

            if((codeLength + 1) == 4) {
                if(pageStatus == 1) {
                    setTimeout(function() {
                        setCodeLength(0);
                        setPageStatus(2);
                        frezeKeyboard = false;
                    }, 100);
                } else {
                    submit();
                }
            } else {
                frezeKeyboard = false;
            }
        } else {
            setCodeLength(codeLength - 1);

            if(pageStatus == 1)
                code_1 = code_1.slice(0, -1);
            else
                code_2 = code_2.slice(0, -1);

            frezeKeyboard = false;
        }
    }

    function submit() {
        if(code_1 != code_2) {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )

            code_2 = '';
            setTimeout(function() {
                setCodeLength(0);
                setShouldAnimate(true);

                setTimeout(function(){
                    frezeKeyboard = false;
                }, 1000);
            }, 100);
            
            return false;
        }

        signIn({code: String(code_1)});

        if(action == 'biometric')
            acceptAuthentication();
        else
            codeAddedSuccess();
    }

    function codeAddedSuccess() {
        navigation.goBack();
        showToast({text: 'Código definido com sucesso', backgroundColor: theme.colors.success, duration: 2000});
    }

    async function verifyAvailableAuthentication() {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setAuthenticationType(types[0]);
    }

    async function acceptAuthentication() {
        const isBiometric = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometric) {
            return Alert.alert(
                `O ${authenticationType == 1 ? `Touch ID` : `Face ID`} não está disponível`,
                `Tente configurar o ${authenticationType == 1 ? `Touch ID` : `Face ID`} mais tarde.`,
                [{ text: "Fechar", onPress: () => {codeAddedSuccess();} }]
            );
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: `Use o ${authenticationType == 1 ? `Touch ID` : `Face ID`} para autenticar`,
            fallbackLabel: `A autenticação foi cancelada`
        });

        if(auth.success) {
            signIn({biometric: String(true)});
            codeAddedSuccess();
        }
    }

    useEffect(() => {
        code_1 = '';
        code_2 = '';
        frezeKeyboard = false;

        const fetchData = async () => {
            if(action == 'biometric')
                await verifyAvailableAuthentication();

            setPageStatus(1);
        };

        fetchData();
    }, []);

  return (
    <SafeAreaView style={theme.safeAreaView}>
        <StatusBar barStyle='default'/>
        {
            pageStatus > 0 ? (
                <View style={[theme.wrapperPage, {paddingHorizontal: theme.containerPadding}]}>
                    <View style={{flexGrow: 1, paddingTop: screenHeight * 0.08}}>
                        <View style={{width: '100%',maxWidth: 316,alignItems: 'center',alignSelf: 'center',justifyContent: 'center',marginBottom: screenHeight * 0.045}}>
                            <View style={{justifyContent: 'center'}}>
                                <View style={{marginBottom: 20}}>
                                    <Text style={[theme.subtitle, {textAlign: 'center',fontSize: 16}]}>{pageStatus == 1 ? 'Digite o código' : 'Digite novamente'}</Text>
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

                                {/*<View style={{marginTop: 20}}>
                                    <Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.gray}]}></Text>
                                </View>*/}
                            </View>
                        </View>

                        <KeyboardNumeric onPress={setKeyboardVal} style={{maxHeight: 376}}/>
                    </View>

                    <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 'auto',paddingBottom: Math.max(insets.bottom)}}>
                        <Button mode='outlined' onPress={() => {navigation.goBack()}}>Digitar mais tarde</Button>
                    </View>

                </View>
            ) : <LoadingFullscreen />
        }
    </SafeAreaView>
  );
}