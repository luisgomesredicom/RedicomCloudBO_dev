import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Alert, Image, Dimensions, StyleSheet } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
//import { useActionSheet } from '@expo/react-native-action-sheet';
import { UserContext, AuthContext, remoteAPI } from '../core/utils';

//import { BoardingScreen } from '../screens/boarding'
//import { DemoScreen } from '../screens/demo'
import { LoginScreen } from '../screens/login'
import { LoginRegisterScreen } from '../screens/loginRegister'
import { LoginCodeScreen } from "../screens/loginCode";
import { SettingsScreen } from "../screens/settings";
import { SettingsCodeEditScreen } from "../screens/settingsCodeEdit";
import { SettingsCodeAddScreen } from "../screens/settingsCodeAdd";
import { PolicyScreen } from "../screens/policy";
import { DashboardScreen } from '../screens/dashboard'
import { DashboardDetails } from '../screens/dashboardDetails'
import { ListProducts } from "../screens/listProducts";
import { ListPromo } from '../screens/listPromo'
import { ListCampaign } from '../screens/listCampaign'
import { ListCampaignSMS } from '../screens/listCampaignSMS'
import { ListCampaignEmail } from "../screens/listCampaignEmail";
import { ListOrders } from '../screens/listOrders'

import { ListOrdersInfo } from "../screens/listOrdersInfo";
import { DetProduct } from '../screens/detProduct'
import { DetPromo } from '../screens/detPromo'
import { DetCampaign } from "../screens/detCampaign";
import { DetCampaignSMS } from "../screens/detCampaignSMS";
import { DetCampaignEmail } from "../screens/detCampaignEmail";
import { theme } from "../styles/styles";
import { Icon } from "../components/elements";

const HearderLeft = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{paddingHorizontal: theme.containerPadding,height: 50,justifyContent: 'center'}} onPress={() => navigation.goBack()}>
            <Icon code="810" size={28} style={{color: theme.colors.white}} />
        </TouchableOpacity>
    );
}

const HearderTitle = (props) => {
    return (
        <Text style={[theme.subtitle, {color: theme.colors.white,fontSize: 20}]} numberOfLines={1} ellipsizeMode='tail'>
            {props.title}
        </Text>
    );
}

export function MainStackRoutes() {
    const [pageIsReady, setPageIsReady] = useState(null);
    const {signIn} = useContext(AuthContext);
    const {signOut} = useContext(AuthContext);
    const userState = useContext(UserContext);
    const MainStack = createStackNavigator();
    const { width } = Dimensions.get('window');

    const styles = StyleSheet.create({
        header: {
            backgroundColor: theme.colors.darktheme,
            height: width <= 375 ? 92 : 76
        } 
    });

    useEffect(() => {
        async function prepare() {
            if(userState.isSigin) {
                if(!await remoteAPI({request: 'dashboard/menu', method: 'GET'})) {
                    //Session is not available
                    signOut();
                    return false;
                }
            }

            setPageIsReady(true);
        }
        
        prepare();
    }, []);

    if(!pageIsReady) return null;
    
    return (
        <MainStack.Navigator screenOptions={{
            headerShown: true,
            headerShadowVisible: false
        }}>
            {!userState.isSigin ? (
                <MainStack.Group>
                    {(!userState.domain || !userState.name || !userState.password || !userState.token || (userState.code == null || userState.code.substr(0, 4) == '****')) ? (
                        <MainStack.Screen
                            name="LoginRegisterScreen"
                            component={LoginRegisterScreen}
                            options={{
                                title: 'Login',
                                headerShown: false,
                                //animation: 'none'
                                animationTypeForReplace: userState.isSigin ? 'push' : 'pop',
                            }}
                        />
                    ) : (
                        <>
                            {userState.code == '' ? (
                                <MainStack.Screen
                                    name="LoginCodeScreen"
                                    component={LoginCodeScreen}
                                    options={{
                                        headredicomerLeft: () => {
                                            return (
                                                <TouchableOpacity
                                                    style={{padding: 15, marginVertical: -20}}
                                                    onPress={() => {
                                                        Alert.alert(
                                                            "Digitar mais tarde",
                                                            "Pretende digitar a senha mais tarde?",
                                                            [
                                                            {
                                                                text: "Cancelar",
                                                                style: "cancel"
                                                            },
                                                            { text: "Sim", onPress: () => {
                                                                signIn({code: '****'});
                                                            } }
                                                            ]
                                                        );
                                                    }}>
                                                    <Octicons name="x" size={26} color="black"/>
                                                </TouchableOpacity>
                                            )
                                        },
                                        headerShown: false,
                                    }}
                                />
                            ) : (
                                <MainStack.Screen
                                    name="LoginScreen"
                                    component={LoginScreen}
                                    options={{
                                        title: 'Login',
                                        headerShown: false,
                                        //animation: 'none'
                                        animationTypeForReplace: userState.isSigin ? 'push' : 'pop',
                                    }}
                                />
                            )}
                        </>
                    )}
                </MainStack.Group>
            ) : (
                <>
                    <MainStack.Group>
                        <MainStack.Screen
                            name="DashboardScreen"
                            component={DashboardScreen}
                            options={{
                                headerShown: false,
                                /*title: null,
                                headerStyle: {
                                    backgroundColor: theme.colors.dark
                                },
                                headerLeft: () => {
                                    return (
                                        <View style={{justifyContent: 'center', justifyContent: 'flex-end',flexGrow: 1, paddingHorizontal: theme.containerPadding}}>
                                            <Image resizeMode='contain' source={require('../images/logo_light.png')} style={{width: 286}} />
                                        </View>
                                    )
                                },
                                headerRight: () => {
                                    const navigation = useNavigation();*/
                                    /*const {showActionSheetWithOptions} = useActionSheet();
                                    const {signOut} = useContext(AuthContext);
                                    
                                    const Logout = function(){
                                        const options = ['Terminar sessão', 'Cancelar'];
                                        const destructiveButtonIndex = 0;
                                        const cancelButtonIndex = 1;

                                        showActionSheetWithOptions({
                                            options,
                                            cancelButtonIndex,
                                            destructiveButtonIndex,
                                            title: 'Tem a certeza de que queres terminar a sessão?'
                                        }, (selectedIndex) => {
                                        switch (selectedIndex) {
                                            case destructiveButtonIndex:
                                                signOut();
                                            break;
                                            case cancelButtonIndex:
                                                // Canceled
                                        }});
                                    }*/

                                    /*return (
                                        <View style={{flexGrow: 1,alignItems: 'center',justifyContent: 'flex-end',marginRight: 6,marginBottom: 2}}>
                                            <TouchableOpacity style={{padding: 9}} onPress={() => {
                                                navigation.navigate({name: 'SettingsScreen', params: {title: 'Definições'}});
                                            }}>
                                                <Octicons name="gear" size={24} color='white' />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }*/
                            }}
                        />

                        <MainStack.Screen
                            name="DashboardDetails"
                            component={DashboardDetails}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListOrdersInfoScreen"
                            component={ListOrdersInfo}
                            options={({route, navigation}) => ({
                                headerLeft: () => <HearderLeft />,
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListProductsScreen"
                            component={ListProducts}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title,
                                headerTitleAlign: 'center'
                            })}
                        />

                        <MainStack.Screen
                            name="ListOrdersScreen"
                            component={ListOrders}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListPromoScreen"
                            component={ListPromo}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListCampaignScreen"
                            component={ListCampaign}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListCampaignSMSScreen"
                            component={ListCampaignSMS}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="ListCampaignEmailScreen"
                            component={ListCampaignEmail}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="DetProductsScreen"
                            component={DetProduct}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="DetPromoScreen"
                            component={DetPromo}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="DetCampaignScreen"
                            component={DetCampaign}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="DetCampaignSMSScreen"
                            component={DetCampaignSMS}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />

                        <MainStack.Screen
                            name="DetCampaignEmailScreen"
                            component={DetCampaignEmail}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />
                    </MainStack.Group>

                    <MainStack.Group>
                        <MainStack.Screen
                            name="SettingsScreen"
                            component={SettingsScreen}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft/>,
                                title: null
                            })}
                        />
                    {/*</MainStack.Group>
                    <MainStack.Group screenOptions={{ presentation: 'card' }}>*/}
                        <MainStack.Screen
                            name="SettingsCodeEditScreen"
                            component={SettingsCodeEditScreen}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />
                        <MainStack.Screen
                            name="SettingsCodeAddScreen"
                            component={SettingsCodeAddScreen}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title,
                                action: route.params.action || null
                            })}
                        />
                        <MainStack.Screen
                            name="PolicyScreen"
                            component={PolicyScreen}
                            options={({route, navigation}) => ({
                                headerStyle: styles.header,
                                headerLeft: () => <HearderLeft />,
                                headerTitle: () => (
                                    <HearderTitle title={route.params.title} />
                                ),
                                title: route.params.title
                            })}
                        />
                    </MainStack.Group>
                </>
            )}
        </MainStack.Navigator>
    )
}
