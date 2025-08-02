import React, {useState, useEffect, useCallback} from 'react';
import { ScrollView, StatusBar, View, StyleSheet, Modal, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Portal } from "react-native-paper";
import { LoadingFullscreen, HalfDonutChart, Icon, ProgressBar, CountDown, LoadingRefreshFullscreen, Badge } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import Button from '../components/buttons'
import { remoteAPI, dateFormatter } from '../core/utils'

export function DetCampaignSMS() {
    /*
    Estados das campanhas SMS (campaign.status)
        0  - Agendada
        1  - A enviar
        3  - Parada
        5  - Em preparação
        9  - Finalizada
        10 - Cancelada
    */
    const navigation = useNavigation();
    const [pageIsReady, setPageIsReady] = useState(false);
    const [pageStatus, setPageStatus] = useState(0);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const { date: startDate, time: startTime } = dateFormatter(campaign.startDate);
    const { date: finishedDate, time: finishedTime } = dateFormatter(campaign.finished);
    const [isRefreshLoading, setRefreshLoading] = useState(false);
    const [isModalConfirm, setModalConfirm] = useState(false);
    const [optionSubmit, setOptionSubmit] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const sendStatus = [
        {status: 0, icon: '001', color: 'warning'}, //Agendado
        {status: 1, icon: '003', color: 'success'}, //A Enviar
        {status: 3, icon: '005', color: 'gray'}, //Parada
        {status: 5, icon: '005', color: 'gray'}, //Em preparação
        {status: 9, icon: '004', color: 'success'}, //Finalizada
        {status: 10, icon: '002', color: 'gray'} //Cancelada
    ];
    const currentSendStatus = sendStatus.find(s => s.status == campaign.status);
    console.log('status', campaign.status);
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
                request: `marketing/campaigns/sms`,
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
            request: `marketing/campaigns/sms/${campaign.id}`,
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
                                    <HalfDonutChart percentage={39} value1title="SMS" value1value={'3 900'} bgcolor={campaign.flags[0].graphStyle}/>
                                </View>
                                
                                <View style={{marginBottom: 30}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,width: '100%'}}>
                                        <View style={{flexGrow: 1,width: 1,borderRadius: 6,borderWidth: 1,borderColor: theme.colors.lightgray,backgroundColor: theme.colors.successlight,paddingVertical: 3,paddingHorizontal: 6,minHeight: 61}}>
                                            <Text numberOfLines={4} ellipsizeMode='tail' style={[theme.small, {fontSize: 10,lineHeight: 13,color: '#000'}]}>{campaign.message}</Text>
                                        </View>
                                        <View style={{width: 220,flexShrink: 0,height: '100%'}}>
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Estado</Text></View>
                                                <View style={{flex: 1,flexDirection: 'row',alignItems: 'center'}}>
                                                    <Icon code={currentSendStatus.icon} size={13} style={{color: theme.colors[currentSendStatus.color],marginRight: 4}}/>
                                                    <Text style={[theme.small, {fontWeight: 500,color: theme.colors[currentSendStatus.color]}]} numberOfLines={1} ellipsizeMode='tail'>{campaign.flags[0].title}</Text>
                                                </View>
                                            </View>
        
                                            <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Iniciado</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate}  <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text></View>
                                            </View>
        
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Finalizado</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{finishedDate}  <Text style={{color: theme.colors.darkgray}}>{finishedTime}</Text></Text></View>
                                            </View>
                                            
                                            <View style={{marginTop: 6}}>
                                                <ProgressBar percentage={campaign.stats.totalSentPercent}/>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={statistics.container}>
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>Destinatários</Text></View>
                                                <Badge text={campaign.stats.totalRecipients} style={{backgroundColor: theme.colors.white,color: theme.colors.black,marginTop: 3,marginLeft: 'auto',paddingHorizontal: 0}}></Badge>
                                            </View>
                                        </View>
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>Enviados</Text></View>
                                            </View>
                                            <View style={statistics.columnRight}>
                                                <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalSentPercent}%</Text></View>
                                                <Badge text={campaign.stats.totalSent} style={{backgroundColor: theme.colors.successlight,color: theme.colors.success,marginTop: 3,width: '100%'}}></Badge>
                                            </View>
                                        </View>
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>SMS Gastas</Text></View>
                                                <View style={[statistics.columnRight, {marginLeft: 'auto'}]}>
                                                    <Badge text={campaign.stats.totalSpent} style={{backgroundColor: theme.colors.errorlight,color: theme.colors.error,marginTop: 3,width: '100%'}}></Badge>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                {
                                    campaign.status != 0 ? (
                                        <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8}}>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.totalSent}</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Emails enviados</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.totalPending}</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Pendentes</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{campaign.stats.bounceRate}<Text style={theme.small}> %</Text></Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Taxa de rejeição</Text>
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
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}]
});