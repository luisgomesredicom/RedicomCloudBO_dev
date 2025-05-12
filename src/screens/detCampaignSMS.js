import React, {useState, useEffect} from 'react';
import { ScrollView, StatusBar, View, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import { LoadingFullscreen, HalfDonutChart, Icon, ProgressBar, CountDown } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import Button from '../components/buttons'
import { showToast, dateFormatter } from '../core/utils'

export function DetCampaignSMS() {
    const [pageIsReady, setPageIsReady] = useState(false);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const { date: startDate, time: startTime } = dateFormatter(campaign.startDate);
    const { date: finishedDate, time: finishedTime } = dateFormatter(campaign.finished);
    const navigation = useNavigation();

    const orderedOptions = [...campaign.options].sort((a, b) => {
        const isAContained = a.option == 1 || (a.option == 5 && campaign.status != 0);
        const isBContained = b.option == 1 || (b.option == 5 && campaign.status != 0);
        return isAContained - isBContained; //Colocar o botão principal no fim
    });

    const onSubmit = () => {
        showToast({text: 'Temporariamente indisponível'});
        //navigation.goBack();
    }

    useEffect(() => {
        setPageIsReady(true);
    }, []);

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
                {
                    pageIsReady ? (
                        <>
                            <View style={{backgroundColor: theme.colors.darktheme,position: 'absolute',top: 0,left: 0,width: '100%',height: 300,zIndex: 0}}></View>
                            
                            <ScrollView style={[theme.wrapperPage, {backgroundColor: 'transparent'}]} contentContainerStyle={[theme.wrapperContentStyle, {backgroundColor: 'white',paddingTop: 0, minHeight: '70%'}]}>
                                
                                <View style={[theme.containerDonutChart, {marginBottom: 30}]}>
                                    <HalfDonutChart percentage={campaign.stats.totalSentPercent} length={campaign.stats.totalSent} title="SMS" bgcolor={campaign.status != 9 ? 'success' : 'warning'}/>
                                </View>
                                
                                <View style={{marginBottom: 30}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,width: '100%'}}>
                                        <View style={{flexGrow: 1,width: 1,borderRadius: 6,borderWidth: 1,borderColor: theme.colors.lightgray,backgroundColor: theme.colors.successlight,paddingVertical: 3,paddingHorizontal: 6,minHeight: 61}}>
                                            <Text numberOfLines={4} ellipsizeMode='tail' style={[theme.small, {fontSize: 10,lineHeight: 13,color: '#000'}]}>{campaign.message}</Text>
                                        </View>
                                        <View style={{width: 220,flexShrink: 0,height: '100%'}}>
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Estado</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{campaign.flags[0].title}</Text></View>
                                            </View>
        
                                            <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Iniciado</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate}  <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text></View>
                                            </View>
        
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Finalizado</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{finishedDate}  <Text style={{color: theme.colors.darkgray}}>{finishedTime}</Text></Text></View>
                                            </View>
        
                                            {/*<View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Demo</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>0 000,00 <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text></View>
                                            </View>*/}
                                            
                                            <View style={{marginTop: 6}}>
                                                <ProgressBar percentage={campaign.stats.totalSentPercent}/>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={statistics.container}>
                                        {/*<View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>Demo</Text></View>
                                                <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>0</Text></View>
                                            </View>
                                            <View style={statistics.columnRight}>
                                                <View><Text style={[statistics.text2, {textAlign: 'center'}]}>0%</Text></View>
                                                <View style={statistics.value}><Text style={statistics.valueText}>0</Text></View>
                                            </View>
                                        </View>*/}
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>Destinatários</Text></View>
                                                <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>{campaign.stats.totalRecipients}</Text></View>
                                            </View>
                                        </View>
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>Enviados</Text></View>
                                            </View>
                                            <View style={statistics.columnRight}>
                                                <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalSentPercent}%</Text></View>
                                                <View style={statistics.value}><Text style={statistics.valueText}>{campaign.stats.totalSent}</Text></View>
                                            </View>
                                        </View>
                                        <View style={statistics.item}>
                                            <View>
                                                <View><Text style={statistics.text1}>SMS Gastas</Text></View>
                                                <View style={[statistics.columnRight, {marginLeft: 'auto'}]}>
                                                    <View style={[statistics.value, {backgroundColor: theme.colors.errorlight}]}><Text style={[statistics.valueText, {color: theme.colors.error}]}>{campaign.stats.totalSpent}</Text></View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                {
                                    campaign.status != 0 ? (
                                        <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8}}>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2,color: '#993399'}]}>0</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Emails enviados</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2,color: '#993399'}]}>10 000</Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Pendentes</Text>
                                            </View>
                                            <View>
                                                <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2,color: '#993399'}]}>0,00<Text style={theme.small}> %</Text></Text>
                                                <Text style={[theme.small, {textAlign: 'center'}]}>Taxa de rejeição</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,}}></View>
                                            <Text style={[theme.listNavSubtitle, {marginTop: theme.containerPadding,marginBottom: 20}]}>O envio começa...</Text>
                                            <View style={{marginHorizontal: 'auto'}}>
                                                <CountDown targetDate={campaign.startDate} onComplete={() => {
                                                    console.log('countdown completed');
                                                }}/>
                                            </View>
                                        </>
                                    )
                                }
                            </ScrollView>

                            <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom),flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}]}>
                            {orderedOptions.map((item, index) => {
                                let mode = 'outlined';

                                if(campaign.options.length == 1 ||
                                    item.option == 1 ||
                                    (item.option == 5 && campaign.status != 0)
                                ) {
                                    mode = 'contained';
                                }

                                return (
                                    <View key={index} style={{width: mode == 'contained' && campaign.options.length > 2 ? '100%' : '48%', marginTop: 2}}>
                                        <Button mode={mode} onPress={onSubmit}>{item.title}</Button>
                                    </View>
                                );
                            })}
                            </View>
                        </>
                    ) : <LoadingFullscreen />
                }
            </View>
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