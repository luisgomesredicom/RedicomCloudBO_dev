import React, {useState, useEffect, useCallback} from 'react';
import { ScrollView, StatusBar, View, StyleSheet, Modal, RefreshControl, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Portal } from "react-native-paper";
import { LoadingFullscreen, HalfDonutChart, Icon, CountDown, LoadingRefreshFullscreen } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import Button from '../components/buttons'
import { remoteAPI, numberFormat, dateFormatter } from '../core/utils'

export function DetCampaignEmail() {
    /*
    Estados das campanhas Email (campaign.status)
    */
    const navigation = useNavigation();
    const [pageIsReady, setPageIsReady] = useState(false);
    const [pageStatus, setPageStatus] = useState(0);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const { date: startDate, time: startTime } = dateFormatter(campaign.startDate);
    const [isRefreshLoading, setRefreshLoading] = useState(false);
    const [isModalConfirm, setModalConfirm] = useState(false);
    const [optionSubmit, setOptionSubmit] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setPageIsReady(true);
    }, []);

    useEffect(() => {
        if(optionSubmit) {
            if(String(optionSubmit.confirmPopup).trim() === 'true') {
                setModalConfirm(true);
                return;
            }
            
            onSubmit();
        }
    }, [optionSubmit]);

    const onSubmit = async () => {
        setRefreshLoading(true);

        try {
            const data = await remoteAPI({
                request: `marketing/campaigns/email`,
                method: 'PUT',
                body: {
                    id: campaign.id,
                    option: optionSubmit.option
                }
            });
    
            updateCampaign(data);

        } catch (error) {
            console.error('Erro ao chamar a API:', error);
        } finally {
            setTimeout(() => {
                setRefreshLoading(false);
                setOptionSubmit(null);
            }, 500);
        }
    }

    const updateCampaign = (data) => {
        if(data && JSON.stringify(data.response)) {
            setCampaign(data.response);
            route.params.update(data.response);
        }
    }

    const refreshCampaign = async () => {
        const data = await remoteAPI({
            request: `marketing/campaigns/email/${campaign.id}`,
            method: 'GET'
        });

        updateCampaign(data);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshCampaign();
        setRefreshing(false);
    }, []);

    const ModalConfirm = () => {
        return (
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                <Modal animationType="fade" transparent={true} visible={isModalConfirm} onRequestClose={() => {
                    setModalConfirm(!isModalConfirm);
                    setOptionSubmit(null);
                }}>
                    <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                        <View style={theme.modalView}>
                            {/*<View style={{marginBottom: 12}}><Icon code="820" size={42} /></View>*/}
                            <Text style={[theme.listNavTitle, {textAlign: 'center',marginBottom: 10}]}>Deseja continuar?</Text>
                            <Text style={[theme.paragraph, {textAlign: 'center',color: theme.colors.darkgray}]}>{optionSubmit ? optionSubmit.confirmPopupText : ''}</Text>
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',gap: 14,marginTop: 20}}>
                                <View style={{width: '50%'}}>
                                    <Button mode="outlined" onPress={() => {
                                        setModalConfirm(!isModalConfirm);
                                        setOptionSubmit(null);
                                    }}>Cancelar</Button>
                                </View>
                                <View style={{width: '50%'}}>
                                    <Button mode="contained" onPress={() => {
                                        setModalConfirm(!isModalConfirm);
                                        onSubmit();
                                    }}>Continuar</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
                {
                    pageIsReady ? (
                        <>
                            <View style={{backgroundColor: theme.colors.darktheme,position: 'absolute',top: 0,left: 0,width: '100%',height: 300,zIndex: 0}}></View>
                            
                            <ScrollView style={[theme.wrapperPage, {backgroundColor: 'transparent'}]} contentContainerStyle={[theme.wrapperContentStyle, {backgroundColor: 'white',paddingTop: 0, minHeight: '70%'}]}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.white]} tintColor={theme.colors.white}/>
                            }
                            >
                                <View style={[theme.containerDonutChart, {marginBottom: 30}]}>
                                    <HalfDonutChart 
                                        percentage={campaign.stats.totalSentPercent} 
                                        value1title="Emails" 
                                        value1value={campaign.stats.totalSent} 
                                        value2title="Pendentes" 
                                        value2value={campaign.stats.totalPending} 
                                        bgcolor={campaign.flags[0].graphStyle}
                                    />
                                </View>
                                
                                <View style={{flexDirection: 'row',alignItems: 'stretch',gap: 10,marginBottom: 30}}>
                                    <View style={{width: 122,flexShrink: 0}}>
                                        <View style={{height: 122,flexShrink: 0,backgroundColor: 'whitesmoke'}}>
                                            <Image source={{uri: campaign.image.src}} style={{resizeMode: 'contain',flex: 1,width: 122,height: 122}} />
                                        </View>
            
                                        <View style={[statistics.container, {justifyContent: 'center'}]}>
                                            <View style={statistics.item}>
                                                <View>
                                                    <View>
                                                        <Text style={[statistics.text1, {textAlign: 'center'}]}>Destinatários</Text>
                                                        </View>
                                                    <View style={statistics.bottom}>
                                                        <Text style={[statistics.text2, {textAlign: 'center'}]}>{numberFormat(campaign.stats.totalRecipients)}</Text>
                                                    </View>
                                                    <View style={[statistics.value, {alignSelf: 'center',width: 'auto',minWidth: 70,paddingHorizontal: 15,backgroundColor: theme.colors.infolight}]}>
                                                        <Text style={[statistics.valueText, {color: theme.colors.info}]}>{campaign.stats.recipientsType}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <View style={{flexGrow: 1}}>
                                        <View style={{height: 122,justifyContent: 'space-between',paddingTop: 2,paddingBottom: 12}}>
                                            <View>
                                                <Text style={[theme.listNavSubtitle, {color: theme.colors.black}]}>{campaign.title}</Text>
                                            </View>
            
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View style={{width: 80, marginRight: 10}}>
                                                    <Text style={theme.small}>Iniciado</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate} <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text>
                                                </View>
                                            </View>
            
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{width: 80, marginRight: 10}}>
                                                    <Text style={theme.small}>Encomendas</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(campaign.stats.totalOrders)}</Text>
                                                </View>
                                            </View>
            
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{width: 80, marginRight: 10}}>
                                                    <Text style={theme.small}>Conversão</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{campaign.stats.totalConversionsPercent}%</Text>
                                                </View>
                                            </View>
            
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{width: 80, marginRight: 10}}>
                                                    <Text style={theme.small}>Vendas</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(campaign.stats.totalOrdersValue)} <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={[statistics.container, {maxWidth: 250}]}>
                                                <View style={statistics.item}>
                                                    <View>
                                                        <View><Text style={statistics.text1}>Aberturas</Text></View>
                                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>{numberFormat(campaign.stats.totalSent)}</Text></View>
                                                    </View>
                                                    <View style={statistics.columnRight}>
                                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalOpeningsPercent}%</Text></View>
                                                        <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(campaign.stats.totalOpenings)}</Text></View>
                                                    </View>
                                                </View>
                                                <View style={statistics.item}>
                                                    <View>
                                                        <View><Text style={statistics.text1}>Clicks</Text></View>
                                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>{numberFormat(campaign.stats.totalClicks)}</Text></View>
                                                    </View>
                                                    <View style={statistics.columnRight}>
                                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalClicksPercent}%</Text></View>
                                                        <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(campaign.stats.totalClicks)}</Text></View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                {
                                    campaign.status != 0 ? (
                                        <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8}}>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.bounceRate}</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Taxa de rejeição</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.complaintRate}</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Taxa de reclamação</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.unsubscribes}</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Remoções</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,}}></View>
                                            <Text style={[theme.listNavSubtitle, {marginTop: theme.containerPadding,marginBottom: 20}]}>O envio começa...</Text>
                                            <View style={{marginHorizontal: 'auto'}}>
                                                <CountDown targetDate={campaign.startDate} onComplete={() => {
                                                    refreshCampaign();
                                                }}/>
                                            </View>
                                        </>
                                    )
                                }
                            </ScrollView>

                            <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom),flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}]}>
                            {campaign.options.map((item, index) => {
                                const mode = item.buttonStyle == 'principal' ? 'contained' : 'outlined';
                                var width = '48%';

                                if(campaign.options.length == 1 || campaign.options.length > 2 && mode == 'contained') {
                                    width = '100%';
                                }

                                return (
                                    <View key={index} style={{width: width, marginTop: 2}}>
                                        <Button mode={mode} onPress={() => setOptionSubmit(item)}>{item.title}</Button>
                                    </View>
                                );
                            })}
                            </View>
                        </>
                    ) : <LoadingFullscreen />
                }
            </View>
            
            <View><ModalConfirm /></View>

            {isRefreshLoading && (
                <Portal><LoadingRefreshFullscreen /></Portal>
            )}
        </SafeAreaView>
    );
}

const statistics = StyleSheet.create({
    container: {flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8},
    item: {flexDirection: 'row',gap: 10},
    columnRight: {width: 42},
    text1: [theme.small, {textAlign: 'right'}],
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}],
    value: {marginTop: 3,borderRadius: 2,backgroundColor: theme.colors.successlight,padding: 2,width: '100%'},
    valueText: [theme.small, {fontWeight: '500',color: theme.colors.success,textAlign: 'center'}],
    bottom: {marginTop: 5}
});

const styles = StyleSheet.create({
    saleBox: {
        flexGrow: 1,
        borderWidth: 1,
        borderColor: theme.colors.lines,
        paddingHorizontal: 9,
        borderRadius: 4,
        minHeight: 50
    },
    saleTitle: {},
    saleCurrency: {},
    saleDesc: {
        color: theme.colors.gray,
        marginTop: -2
    }
});