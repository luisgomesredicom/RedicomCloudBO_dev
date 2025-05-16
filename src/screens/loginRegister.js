import React, { useState, useContext, useEffect } from 'react'
import { StatusBar, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Modal, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper'
import { theme } from '../styles/styles'
import Button from '../components/buttons'
import {TextInput} from "../components/inputs";
import { LoadingFullscreen, Icon } from '../components/elements';
import { AuthContext, UserContext, formValidator, remoteAPI } from '../core/utils';
import Logo from '../images/logo.svg';
import LogoIcon from '../images/icon-gray.svg';

export function LoginRegisterScreen({ navigation }) {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const [pageStatus, setPageStatus] = useState(0);
    const userState = useContext(UserContext);
    const [remoteToken, setRemoteToken] = useState({ value: userState.domain || '', error: false, errorText: '' });
    const [username, setUsername] = useState({ value: userState.name || '', error: false, errorText: '' });
    const [password, setPassword] = useState({ value: '', error: false, errorText: '' });
    const {signIn} = useContext(AuthContext);
    const [showLoading, setShowLoading] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [dataUserLogin, setDataUserLogin] = useState({});
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setPageStatus(1);
    }, []);

    const onLoginPressed = () => {
        setDataUserLogin({});
        Keyboard.dismiss();

        const tokenError = formValidator({value: remoteToken.value, required: true, showtoast: true});
        const userError = formValidator({value: username.value, required: true, showtoast: true});
        const passError = formValidator({value: password.value, required: true, showtoast: true});

        if(tokenError.error) {setRemoteToken({ ...remoteToken, error: true, errorText: '' }); setShowLoading(0); return;}
        if(userError.error) {setUsername({ ...username, error: true, errorText: '' }); setShowLoading(0); return;}
        if(passError.error) {setPassword({ ...password, error: true, errorText: '' }); setShowLoading(0); return;}

        setShowLoading(1);

        (async () => {
            const data = await remoteAPI({
                request: 'login',
                method: 'POST',
                header: {
                    domain: remoteToken.value,
                    username: username.value,
                    password: password.value
                }
            });

            if(data == false) {
                setShowLoading(0);
                return false;
            }

            setDataUserLogin(data);
            setShowLoading(0);

            if(!userState.code || userState.code.split('****').length == 1)
                setModalVisible(true);
            else
                signIn({isSigin: true, token: data.response.token, domain: remoteToken.value, name: username.value, password: String(password.value)});
        })();
    }

    const cancelPinCode = () => {
        signIn({isSigin: true, token: dataUserLogin.response.token, domain: remoteToken.value, name: username.value, password: String(password.value), code: '****', biometric: String(false)});
    }

    const acceptPinCode = () => {
        signIn({token: dataUserLogin.response.token, domain: remoteToken.value, name: username.value, password: String(password.value), code: '', biometric: String(false)});  
    }

    function ModalInfoPin() {
        return (
        <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
                setModalVisible(!modalVisible);
                cancelPinCode();
            }}>
                <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                    <View style={theme.modalView}>
                        <View style={{marginBottom: 12}}><Icon code="820" size={42} /></View>
                        <Text style={[theme.listNavTitle, {textAlign: 'center',marginBottom: 10}]}>Definir código?</Text>
                        <Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>O código aumenta a segurança e facilita a autenticação na App.</Text>
                        <View style={{flexDirection: 'row',justifyContent: 'space-between',gap: 14,marginTop: 20}}>
                            <View style={{flexBasis: '50%'}}>
                                <Button mode="outlined" onPress={() => {
                                    setModalVisible(!modalVisible);
                                    cancelPinCode();
                                }}>Cancelar</Button>
                            </View>
                            <View style={{flexBasis: '50%'}}>
                                <Button mode="contained" onPress={() => {
                                    setModalVisible(!modalVisible);
                                    acceptPinCode();
                                }}>Definir código</Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        )
    }

    return (
        <SafeAreaView style={theme.safeAreaView}>
            <StatusBar barStyle='default'/>
            {
                pageStatus > 0 ? (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView style={{flexGrow: 1,width: '100%'}}>
                            <View style={{alignItems: 'center',justifyContent: 'flex-end',marginBottom: screenHeight * 0.07,marginTop: screenHeight * 0.08}}>
                                <Logo height={26} />
                            </View>

                            <View style={{flexGrow: 1}}>
                                <View style={{width: '100%',maxWidth: screenWidth * 0.8,alignItems: 'center',alignSelf: 'center'}}>
                                    <View style={theme.formWrapper}>
                                        <View style={theme.formField}>
                                            <View style={[theme.formLabelWrap, {marginBottom: 40}]}>
                                                <Text style={[theme.subtitle, {textAlign: 'center'}]}>Autenticação necessária</Text>
                                            </View>
                                            <View style={theme.formContent}>
                                                <View style={theme.formElement}>
                                                    <TextInput
                                                        label="Código de acesso"
                                                        returnKeyType="next"
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        autoComplete="off"
                                                        onChangeText={(text) => setRemoteToken({ value: text, error: false, errorText: '' })}
                                                        value={remoteToken.value}
                                                        error={remoteToken.error}
                                                        errorText={remoteToken.errorText}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View style={theme.formField}>
                                            <View style={theme.formContent}>
                                                <View style={theme.formElement}>
                                                    <TextInput
                                                        label="Utilizador"
                                                        returnKeyType="next"
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        autoComplete="off"
                                                        onChangeText={(text) => setUsername({ value: text, error: false, errorText: '' })}
                                                        value={username.value}
                                                        error={username.error}
                                                        errorText={username.errorText}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View style={theme.formField}>
                                            <TextInput
                                                label="Password"
                                                autoCapitalize="none"
                                                returnKeyType="done"
                                                onChangeText={(text) => setPassword({ value: text, error: false, errorText: '' })}
                                                secureTextEntry
                                                autoComplete="off"
                                                autoCorrect={false}
                                                textContentType="password"
                                                value={password.value}
                                                error={password.error}
                                                errorText={password.errorText}
                                            />
                                        </View>

                                        <View style={theme.formField}>
                                            <Button mode="contained" onPress={onLoginPressed} loading={showLoading} style={{alignSelf: 'stretch',marginTop: 7}}>
                                            {showLoading != 1 ? 'Entrar' : ''}
                                            </Button>
                                        </View>
                                    </View>
                                </View>

                                <View style={{marginTop: 'auto',paddingHorizontal: theme.containerPadding,paddingBottom: theme.containerPadding + Math.max(insets.bottom)}}>
                                    <View>
                                        <Text allowFontScaling={false} style={[theme.subtitle, {textAlign: 'center',marginBottom: 12}]}>Não consegue entrar?</Text>
                                        <Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>Por favor entre em contacto com o seu administrador de sistemas.</Text>
                                    </View>
                                    <View style={{alignItems: 'center',justifyContent: 'center',marginTop: screenHeight * 0.07}}>
                                        <LogoIcon width={32} height={32} />
                                    </View>
                                </View>

                                <View>
                                    <ModalInfoPin/>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                ) : <LoadingFullscreen />
            }
        </SafeAreaView>
    );
}