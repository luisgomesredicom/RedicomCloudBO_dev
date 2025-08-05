import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import { ScrollView, View, Pressable, TouchableOpacity, StatusBar, StyleSheet, RefreshControl, Animated, Easing } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'
import { remoteAPI, AuthContext, textEntity } from '../core/utils';
import { Portal, Text } from 'react-native-paper'
import { ListMenu, LoadingFullscreen, Icon, LoadingRefreshFullscreen, LoadingRefresh } from '../components/elements';
import { theme } from '../styles/styles'
import { Link } from '../components/buttons';

export function DashboardScreen() {
    const navigation = useNavigation();
    const {signOut} = useContext(AuthContext);
    const [pageIsReady, setPageIsReady] = useState(null);
    const [dataDash, setDataDash] = useState(null);
    const [visible, setVisible] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isRefreshLoading, setRefreshLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const rotationLoopRef = useRef(null);

    const fetchData = async () => {
        try {
            const dataDash = await remoteAPI({request: 'dashboard', method: 'GET'});
            
            if(dataDash == false) {
                signOut();
                return false;
            }
            
            dataDash.response.stats.graphDays.totalValues = 0;
            dataDash.response.stats.graphDays.list.map((item) => (
                dataDash.response.stats.graphDays.totalValues += parseInt(item.value)
            ));

            setDataDash(dataDash.response);
            
            setPageIsReady(true);
        } catch (e) {
            console.warn(e);
            signOut();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const onPressRefresh = useCallback(async () => {
        if(isRefreshLoading) return;
        setRefreshLoading(true);

        startRotation();
        await fetchData();
        stopRotation();
        setTimeout(() => {
            setRefreshLoading(false);
        }, 600);
    }, []);

    const rotateAnim = useRef(new Animated.Value(0)).current;

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const startRotation = () => {
        const spin = () => {
            rotateAnim.setValue(0);
            rotationLoopRef.current = Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            });
        
            rotationLoopRef.current.start(({ finished }) => {
                if(finished && isRefreshLoading) {
                    spin();
                }
            });
        };
        spin();
    };

    const stopRotation = () => {
        rotateAnim.stopAnimation((currentValue) => {
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: (1 - currentValue) * 800,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                rotateAnim.setValue(0);
            });
        });
    };

    const renderGraphInformation = (item, index) => {
        if (item.status == '') {
            return  (
                <View key={index} style={{gap: 2,justifyContent: 'space-between'}}>
                    <Text style={[theme.listNavTitle, {color: theme.colors.dark, fontSize: 18}]}>{item.value} <Text style={theme.small}>{item.subtitle}</Text></Text>
                    <Text style={theme.small}>{item.title}</Text>
                </View>
            )
        } else {
            return (
                <View key={index} style={{gap: 2}}>
                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                        <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={[theme.subtitle, {color: theme.colors.dark}]}>{item.value} <Text style={theme.small}>{item.subtitle}</Text></Text>
                        </View>
                        <View style={{marginLeft: 2,marginTop: 7}}>
                            {item.status == 'down' ? (
                                <Icon code="80a" size={11} />
                            ) : (
                                <Icon code="822" size={11} />
                            )}
                        </View>
                    </View>
                    <Text style={[theme.small, {color: theme.colors.gray}]}>{item.title}</Text>
                </View>
            )
        }
    }

    const RenderGraph = () => {
        const styles = StyleSheet.create({
            column: {
                minWidth: '11.8%'
            },
            bar: {
                height: 120
            },
            value: {
                backgroundColor: theme.colors.brandtheme,
                marginTop: 'auto',
                borderRadius: 3
            },
            text: {
                ...theme.small,
                textAlign: 'center',
                fontSize: 11
            },
        });

        const maxValue = Math.max(...dataDash.stats.graphDays.list.map(item => parseInt(item.value)));

        return (
            <View style={{flexDirection: 'row',gap: 8,justifyContent: 'center',marginTop: 30}}>
                {dataDash.stats.graphDays.list.map((item, index) => {
                    const value = parseInt(item.value);
                    const percentage = (value / maxValue) * 100;
                    
                    return (
                    <View style={styles.column}>
                        <View style={styles.bar}>
                            <View style={[styles.value, {height: percentage + '%', opacity: item.belowAverage ? 0.5 : 1}]}></View>
                        </View>
                        <View><Text style={styles.text}>{item.title}</Text></View>
                    </View>);
                })}
            </View>
        );
    }

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='light-content'/>
            {
                pageIsReady ? (
                    <>
                    <View style={{flex: 1,backgroundColor: theme.colors.theme,paddingTop: Math.max(insets.top)}}>
                        <View style={{flexDirection: 'row',height: 56,backgroundColor: theme.colors.theme,alignItems: 'center',paddingHorizontal: theme.containerPadding}}>
                            <View style={{flexGrow: 1}}>
                                <Text style={[theme.subtitle, {color: theme.colors.white}]}>{dataDash.informations.title}</Text>
                            </View>
                            
                            {dataDash.stats.graphDays.totalValues > 0 && Boolean(dataDash.informations.currency?.trim()) && (
                                <TouchableOpacity style={{ padding: 20, marginRight: -20 }} onPress={() => {
                                    navigation.navigate({
                                        name: 'DashboardDetails',
                                        params: {
                                            title: 'Detalhes'
                                        }
                                    })
                                }}>
                                    <View style={{borderRadius: 3,borderWidth: 1,borderColor: 'white',width: 24,height: 24,alignItems: 'center',justifyContent: 'center'}}>
                                        <Text style={{fontSize: 18,color: 'white',fontFamily: 'System'}}>
                                            { textEntity(dataDash.informations.currency.trim()) }
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={[theme.wrapperPage]}>
                            <ScrollView style={[theme.wrapperContainerPage, {paddingBottom: 50}]} contentContainerStyle={theme.wrapperContentStyle}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                            }>
                                <View style={{display: 'flex',alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between',gap: 10,marginBottom: 15}} /*onPress={() => {setVisible(true)}}*/>
                                    <View><Text style={[theme.listNavSubtitle]}>{dataDash.stats.informations.title}</Text></View>
                                    {dataDash.stats.graphDays.totalValues > 0 && (
                                        <View>
                                            <Link text="Detalhes" onPress={() => {
                                                navigation.navigate({
                                                    name: 'DashboardDetails',
                                                    params: {
                                                        title: 'Detalhes'
                                                    }
                                                })
                                            }}/>
                                        </View>
                                    )}
                                </View>
                                
                                <View style={{minHeight: 210}}>
                                    {dataDash.stats.graphDays.totalValues > 0 ? (
                                        <>
                                            <View style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between'}}>
                                                {dataDash.stats.informations.list.map((item, index) => (
                                                    renderGraphInformation(item, index)
                                                ))}
                                            </View>
                                            
                                            <RenderGraph />
                                        </>
                                    ) : (
                                        <View style={{alignItems: 'center',justifyContent: 'center',gap: 20,flexGrow: 1,paddingTop: 15}}>
                                            <View>
                                                <Icon code="837" size={48} />
                                            </View>
                                            <View>
                                                <Text style={theme.small}>NÃ£o temos resultados para lhe mostrar</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,marginTop: 30,marginBottom: 15}} />

                                <View style={{marginBottom: 20}}><Text style={[theme.listNavSubtitle]}>Menu Principal</Text></View>

                                <View style={{marginHorizontal: theme.ncontainerPadding}}>
                                    <ListMenu data={dataDash.menu} />
                                </View>
                            </ScrollView>
                        </View>
                        
                        <View style={[styles.footerContainer, {paddingBottom: Math.max(insets.bottom)}]}>
                            <TouchableOpacity style={styles.footerColumn}>
                                <Icon code="82a" size={24} color={theme.colors.linklight} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerColumn} onPress={() => {
                                navigation.navigate({
                                    name: 'ListProductsScreen',
                                    params: {
                                        title: 'Produtos'
                                    }
                                })
                            }}>
                                <Icon code="819" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={[styles.footerColumn, {width: 58,flexShrink: 0}]}>
                                <Pressable 
                                    onPress={onPressRefresh}
                                    disabled={refreshing}
                                    style={({ pressed }) => [
                                        {alignItems: 'center',justifyContent: 'center',borderRadius: 150,width: 58,height: 58,position: 'absolute',top: -28},
                                        {backgroundColor: pressed ? '#fdb126' : theme.colors.linklight },
                                    ]}
                                >
                                    <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                                        <Icon code="815" size={24} color="white" />
                                    </Animated.View>
                                </Pressable>
                            </View>
                            <TouchableOpacity style={styles.footerColumn}  onPress={() => {
                                navigation.navigate({
                                    name: 'ListProductsScreen',
                                    params: {
                                        title: 'Produtos'
                                    }
                                })
                            }}>
                                <Icon code="828" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerColumn}  onPress={() => {
                                navigation.navigate({
                                    name: 'SettingsScreen',
                                    params: {
                                        title: 'DefiniÃ§Ãµes'
                                    }
                                })
                            }}>
                                <Icon code="824" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    </>
                ) : <LoadingFullscreen />
            }
            {isRefreshLoading && (
                <Portal><LoadingRefreshFullscreen /></Portal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#4B5D6E',
        padding: 10
    },
    footerColumn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10
    }
});