import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, View, Image, Modal, Alert, Dimensions } from 'react-native';
import { Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings'
import { theme } from '../styles/styles'
import Button from '../components/buttons'
import { Icon, KeyboardNumeric, LoadingFullscreen } from '../components/elements';
import { AuthContext, UserContext, showToast } from '../core/utils';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';
import * as LocalAuthentication from 'expo-local-authentication';
import Logo from '../images/logo.svg';

export function LoginCodeScreen() {
    const insets = useSafeAreaInsets();
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const [pageStatus, setPageStatus] = useState(1);
    const {signIn} = useContext(AuthContext);
    const userState = useContext(UserContext);
    const [codeLength, setCodeLength] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [authenticationEnabled, setAuthenticationEnabled] = useState(false);
    const [authenticationType, setAuthenticationType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    async function verifyAvailableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setAuthenticationEnabled(compatible);
        if(!compatible) return;

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setAuthenticationType(types[0]);
        // 1 - Fingerprint
        // 2 - FaceID
        //console.log(types[0], types.map(type => LocalAuthentication.AuthenticationType[type]));

        setPageStatus(1);
    }

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
            if(pageStatus == 1) {
                code_1 = code_1 + code.toString();
            } else {
                code_2 = code_2 + code.toString();
            }

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

        showToast({text: 'Código definido com sucesso!', backgroundColor: theme.colors.success, duration: 1000});

        setTimeout(function(){
            if(!authenticationEnabled)
                cancelAuthentication();
            else
                setModalVisible(true);
        }, 1000);
    }

    function ModalLocalAuthentication() {
        return (
        <View style={{justifyContent: 'center',alignItems: 'center'}}>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
                setModalVisible(!modalVisible);
                cancelAuthentication();
            }}>
                <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                    <View style={theme.modalView}>
                        <View style={{marginBottom: 16,alignItems: 'center',width: 200}}>
                            {authenticationType == 1 ? (
                                <Icon name='touch-id' size={42} />
                            ) : (
                                <Icon name='face-id' size={42} />
                            )}
                        </View>
                        <View style={{marginBottom: 10}}><Text style={[theme.listNavTitle, {textAlign: 'center'}]}>{authenticationType == 1 ? 'Ativar login com Touch ID?' : 'Ativar login com Face ID?'}</Text></View>
                        <View><Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>O {authenticationType == 1 ? 'Touch ID' : 'Face ID'} aumenta a segurança e facilita a autenticação na App.</Text></View>
                        <View style={{flexDirection: 'row',justifyContent: 'space-between',gap: 14,marginTop: 20}}>
                            <View style={{flexBasis: '50%'}}>
                                <Button mode="outlined" onPress={() => {
                                    setModalVisible(!modalVisible);
                                    cancelAuthentication();
                                }}>Mais tarde</Button>
                            </View>
                            <View style={{flexBasis: '50%'}}>
                                <Button mode="contained" onPress={() => {
                                    setModalVisible(!modalVisible);
                                    acceptAuthentication();
                                }}>Ativar {authenticationType == 1 ? 'Touch ID' : 'Face ID'}</Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        )
    }

    useEffect(() => {
        code_1 = '',
        code_2 = '',
        frezeKeyboard = false
        verifyAvailableAuthentication();
    }, []);

    async function acceptAuthentication() {
        const isBiometric = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometric) {
            return Alert.alert(
                `O ${authenticationType == 1 ? `Touch ID` : `Face ID`} não está disponível`,
                `Tente configurar o ${authenticationType == 1 ? `Touch ID` : `Face ID`} mais tarde.`,
                [
                    { text: "Fechar", onPress: () => {cancelAuthentication();} }
                ]
            );
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: `Use o ${authenticationType == 1 ? `Touch ID` : `Face ID`} para autenticar`,
            fallbackLabel: `A autenticação foi cancelada`
        });

        if(auth.success) {
            signIn({isSigin: true, code: String(code_1), biometric: String(true)});
        } else {
            cancelAuthentication();
        }
    }

    const cancelAuthentication = () => {
        signIn({isSigin: true, code: String(code_1), biometric: String(false)});
    }

    const cancelCodeAuthentication = () => {
        signIn({isSigin: true, code: '****', biometric: String(false)});
    }

    return (
        <SafeAreaView style={theme.safeAreaView}>
            <StatusBar barStyle='default'/>
                {
                pageStatus > 0 ? (
                    <View style={[theme.wrapperPage, {paddingHorizontal: theme.containerPadding}]}>
                        <View style={{alignItems: 'center',justifyContent: 'flex-end',marginBottom: screenHeight * 0.07,marginTop: screenHeight * 0.08}}>
                            <Logo height={26} />
                        </View>

                        <View style={{flexGrow: 1}}>
                            <View style={{width: '100%',maxWidth: 316,alignItems: 'center',alignSelf: 'center',justifyContent: 'center',marginBottom: screenHeight * 0.045}}>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{marginBottom: 20}}>
                                        <Text style={[theme.subtitle, {textAlign: 'center'}]}>Olá, {userState.name}!</Text>
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

                            <KeyboardNumeric onPress={setKeyboardVal} style={{maxHeight: 376}}/>
                        </View>

                        <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 'auto',paddingBottom: Math.max(insets.bottom)}}>
                            <Button mode='outlined' onPress={() => {
                                Alert.alert(
                                    "Digitar mais tarde",
                                    "Pretende digitar a senha mais tarde?",
                                    [
                                        {text: "Cancelar",style: "cancel"},
                                        { text: "Sim", onPress: () => {cancelCodeAuthentication();} }
                                    ]
                                );
                            }}>Digitar mais tarde</Button>
                        </View>

                        <View><ModalLocalAuthentication /></View>
                    </View>
                ) : <LoadingFullscreen />
            }
        </SafeAreaView>
    );
}