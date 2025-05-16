import React, {useContext, useState, useEffect} from 'react';
import { ScrollView, StatusBar, View, Modal, StyleSheet} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';
import { Octicons } from '@expo/vector-icons';
import { Icon, ListMenu, LoadingFullscreen } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import { UserContext, AuthContext } from '../core/utils';
import Button from '../components/buttons'

export function SettingsScreen() {
    const userState = useContext(UserContext);
    const insets = useSafeAreaInsets();
    const [pageIsReady, setPageIsReady] = useState(false);
    const [authenticationType, setAuthenticationType] = useState(null);
    const [modalDefinePinVisible, setModalDefinePinVisible] = useState(false);
    const [modalEnablePinVisible, setModalEnablePinVisible] = useState(false);
    const [authenticationEnabled, setAuthenticationEnabled] = useState(false);
    const navigation = useNavigation();
    const {signIn} = useContext(AuthContext);
    const {signOut} = useContext(AuthContext);
    const appVersion = require('../../package.json').version;
    const [menuSettings, setMenuSettings] = useState([]);

    const menuItemCode        = {id: 1, name: 'Entrar com código', switch: 'userCode'};
    const menuItemCodeUpdate  = {id: 2, name: 'Alterar código', hrefTemplate: 'SettingsCodeEditScreen'};
    const menuItemBiometric   = {id: 4, name: `Entrar com o ${authenticationType == 1 ? 'Touch ID' : 'Face ID'}`, switch: 'userBiometric'}

    function ModalDefinePin() {
        return (
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                <Modal animationType="fade" transparent={true} visible={modalDefinePinVisible} onRequestClose={() => {
                setModalDefinePinVisible(!modalDefinePinVisible);
                }}>
                    <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                        <View style={theme.modalView}>
                            <View style={{marginBottom: 16,alignItems: 'center',width: 200}}>
                                <Icon code='820' size={42} />
                            </View>
                            <View style={{marginBottom: 10}}><Text style={[theme.listNavTitle, {textAlign: 'center'}]}>Não tem código definido.{"\n"}Definir definir agora?</Text></View>
                            <View><Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>Para ativar o {authenticationType == 1 ? 'Touch ID' : 'Face ID'} necessita de ter um código definido.</Text></View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between',gap: 14,marginTop: 20}}>
                                <View style={{flexBasis: '50%'}}>
                                    <Button mode="outlined" onPress={() => {
                                        setModalDefinePinVisible(!modalDefinePinVisible);
                                    }}>Cancelar</Button>
                                </View>
                                <View style={{flexBasis: '50%'}}>
                                    <Button mode="contained" onPress={() => {
                                        setModalDefinePinVisible(!modalDefinePinVisible);
                                        navigation.navigate({name: 'SettingsCodeAddScreen', params: {action: auxcodeAddAction, title: 'Definir código'}});
                                        }}>Definir código</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    function ModalEnablePin() {
        return (
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                <Modal animationType="fade" transparent={true} visible={modalEnablePinVisible} onRequestClose={() => {
                setModalEnablePinVisible(!modalEnablePinVisible);
                }}>
                    <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                        <View style={theme.modalView}>
                            <View style={{marginBottom: 16,alignItems: 'center',width: 200}}>
                                <Icon code='820' size={42} />
                            </View>
                            <View style={{marginBottom: 10}}><Text style={[theme.listNavTitle, {textAlign: 'center'}]}>É necessário ativar o código.{"\n"}Deseja ativar agora?</Text></View>
                            <View><Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>Para ativar o {authenticationType == 1 ? 'Touch ID' : 'Face ID'} necessita de ativar código.</Text></View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between',gap: 14,marginTop: 20}}>
                                <View style={{flexBasis: '50%'}}>
                                    <Button mode="outlined" onPress={() => {
                                        setModalEnablePinVisible(!modalEnablePinVisible);
                                        }}>Cancelar</Button>
                                </View>
                                <View style={{flexBasis: '50%'}}>
                                    <Button mode="contained" onPress={() => {
                                        if(userState.code == '****')
                                            navigation.navigate({name: 'SettingsCodeAddScreen', params: {action: auxcodeAddAction, title: 'Definir código'}});
                                        else if(userState.code.substr(0, 4) == '****')
                                            signIn({code: userState.code.replace('****', '')});

                                        acceptAuthentication();
                                        setModalEnablePinVisible(!modalEnablePinVisible);
                                    }}>Ativar</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    const switchChanged = (data) => {
        if(data.switchCode == 'userCode') {
            auxcodeAddAction = 'code';

            if(userState.code == '****') {
                setModalDefinePinVisible(true);
            } else {
                if(!data.active)
                    signIn({code: '****' + userState.code, biometric: String(false)});
                else
                    signIn({code: userState.code.replace('****', '')});
            }
        } else if(data.switchCode == 'userBiometric') {
            auxcodeAddAction = 'biometric';

            if(!data.active) {
                signIn({biometric: String(data.active)});
            } else {
                if(userState.code == '****')
                    setModalDefinePinVisible(true);
                else if(userState.code.substr(0, 4) == '****')
                    setModalEnablePinVisible(true);
                else
                    acceptAuthentication();
            }
        }
    }

    async function verifyAvailableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setAuthenticationEnabled(compatible);

        if(compatible) {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            setAuthenticationType(types[0]);
            updateSettingsMenu({biometric: compatible});
            return;
        }

        updateSettingsMenu();
    }

    async function acceptAuthentication() {
        const isBiometric = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometric) {
            return Alert.alert(
                `O ${authenticationType == 1 ? `Touch ID` : `Face ID`} não está disponível`,
                `Tente configurar o ${authenticationType == 1 ? `Touch ID` : `Face ID`} mais tarde.`,
                [
                    { text: "Fechar" }
                ]
            );
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: `Use o ${authenticationType == 1 ? `Touch ID` : `Face ID`} para autenticar`,
            fallbackLabel: `A autenticação foi cancelada`
        });

        if(auth.success)
            signIn({biometric: String(true)});
    }
  
    useEffect(() => {
        auxcodeAddAction = null;

        const fetchData = async () => {
            await verifyAvailableAuthentication();
            setPageIsReady(true);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if(authenticationType != null)
            updateSettingsMenu();

    }, [userState.code, userState.biometric]);

    function updateSettingsMenu(data) {
        const biometricCompatible = data && data.biometric || authenticationEnabled;

        let updatedMenuSettings = [menuItemCode];

        if(userState.code && userState.code.substr(0, 4) != '****')
            updatedMenuSettings = [...updatedMenuSettings, menuItemCodeUpdate];

        if(biometricCompatible == true)
            updatedMenuSettings = [...updatedMenuSettings, menuItemBiometric];

        setMenuSettings(updatedMenuSettings);
    }
  
    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
                {
                    pageIsReady ? (
                        <>
                            <View style={{backgroundColor: theme.colors.darktheme,position: 'absolute',top: 0,left: 0,width: '100%',height: 300,zIndex: 0}}></View>

                            <ScrollView style={[theme.wrapperPage, {backgroundColor: 'transparent'}]} contentContainerStyle={[{backgroundColor: 'white',paddingTop: 0}]}>
                                <View style={{backgroundColor: theme.colors.darktheme,alignItems: 'center',justifyContent: 'center',paddingBottom: 35}}>
                                    <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                                        <LinearGradient colors={['#5e9bd1', '#0575bb']} style={{width: 90,height: 90,justifyContent: 'center',alignItems: 'center',borderRadius: 100,}}>
                                            <Text style={{fontSize: 42,color: '#fff',fontWeight: '500',textTransform: 'uppercase'}}>{userState.name.substr(0, 1)}</Text>
                                        </LinearGradient>
                                    </View>

                                    <Text style={[theme.subtitle, {color: theme.colors.white,marginTop: 15}]}>{userState.name}</Text>
                                    <Text style={[theme.small, {marginTop: 2}]}>{userState.domain}.redicom.cloud</Text>
                                </View>

                                <View style={{marginTop: 22,marginBottom: 20,paddingHorizontal: theme.containerPadding}}>
                                    <Text style={theme.listNavSubtitle}>Configurações</Text>
                                </View>

                                <ListMenu data={menuSettings} separator={null} onSwitch={(data) => {switchChanged(data)}} />

                                <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,marginTop: 30,marginBottom: 15}} />

                                <View style={{marginBottom: 20,paddingHorizontal: theme.containerPadding}}>
                                    <Text style={theme.listNavSubtitle}>Termos legais</Text>
                                </View>

                                <ListMenu data={[{id: 11, name: 'Privacidade e Cookies', hrefTemplate: 'PolicyScreen'}]} separator={null} />

                                <ModalDefinePin/>
                                {authenticationEnabled && (
                                    <ModalEnablePin/>
                                )}
                            </ScrollView>

                            <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom)}]}>
                                <Text style={[theme.paragraph, {fontSize: 12,marginBottom: 10,color: theme.colors.gray,textAlign: 'center'}]}>Versão {appVersion}</Text>
                                <Button mode="contained" onPress={() => {signOut();}}>Terminar Sessão</Button>
                            </View>
                        </>
                    ) : <LoadingFullscreen />
                }
            </View>
        </SafeAreaView>
        );
    }
