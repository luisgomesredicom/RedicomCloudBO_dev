import React, {useState, useEffect} from 'react';
import { ScrollView, StatusBar, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import { Badge, LoadingFullscreen, HalfDonutChart, Icon, ProgressBar, CountDown } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import Button from '../components/buttons'
import { TextInput } from "../components/inputs";
import { DateInput, DatePicker } from "../components/modalDatePicker";
import { showToast, numberFormat, formValidator, remoteAPI } from '../core/utils'

const fromHoursList = [
    {label: '00:00:00', value: '00:00:00'},
    {label: '00:30:00', value: '00:30:00'},
    {label: '01:00:00', value: '01:00:00'},
    {label: '01:30:00', value: '01:30:00'},
    {label: '02:00:00', value: '02:00:00'},
    {label: '02:30:00', value: '02:30:00'},
    {label: '03:00:00', value: '03:00:00'},
    {label: '03:30:00', value: '03:30:00'},
    {label: '04:00:00', value: '04:00:00'},
    {label: '04:30:00', value: '04:30:00'},
    {label: '05:00:00', value: '05:00:00'},
    {label: '05:30:00', value: '05:30:00'},
    {label: '06:00:00', value: '06:00:00'},
    {label: '06:30:00', value: '06:30:00'},
    {label: '07:00:00', value: '07:00:00'},
    {label: '07:30:00', value: '07:30:00'},
    {label: '08:00:00', value: '08:00:00'},
    {label: '08:30:00', value: '08:30:00'},
    {label: '09:00:00', value: '09:00:00'},
    {label: '09:30:00', value: '09:30:00'},
    {label: '10:00:00', value: '10:00:00'},
    {label: '10:30:00', value: '10:30:00'},
    {label: '11:00:00', value: '11:00:00'},
    {label: '11:30:00', value: '11:30:00'},
    {label: '12:00:00', value: '12:00:00'},
    {label: '12:30:00', value: '12:30:00'},
    {label: '13:00:00', value: '13:00:00'},
    {label: '13:30:00', value: '13:30:00'},
    {label: '14:00:00', value: '14:00:00'},
    {label: '14:30:00', value: '14:30:00'},
    {label: '15:00:00', value: '15:00:00'},
    {label: '15:30:00', value: '15:30:00'},
    {label: '16:00:00', value: '16:00:00'},
    {label: '16:30:00', value: '16:30:00'},
    {label: '17:00:00', value: '17:00:00'},
    {label: '17:30:00', value: '17:30:00'},
    {label: '18:00:00', value: '18:00:00'},
    {label: '18:30:00', value: '18:30:00'},
    {label: '19:00:00', value: '19:00:00'},
    {label: '19:30:00', value: '19:30:00'},
    {label: '20:00:00', value: '20:00:00'},
    {label: '20:30:00', value: '20:30:00'},
    {label: '21:00:00', value: '21:00:00'},
    {label: '21:30:00', value: '21:30:00'},
    {label: '22:00:00', value: '22:00:00'},
    {label: '22:30:00', value: '22:30:00'},
    {label: '23:00:00', value: '23:00:00'},
    {label: '23:30:00', value: '23:30:00'}
]

export function DetCampaignEmail() {
    const [pageIsReady, setPageIsReady] = useState(false);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const navigation = useNavigation();
    
    const [startDate, setStartDate] = useState({value: new Date(campaign.startDate),error: false,errorText: '',open: false});
    const [startDateDatePart, startDateTimePart] = campaign.startDate.split(' ');
    //const [startDateHour, startDateMinute] = startDateTimePart.split(':');
    const startHourItem = fromHoursList.filter(item => item.label == startDateTimePart);
    const [fromHour, setFromHour] = useState({value: startHourItem[0].value, required: true, showtoast: true});
    const setStartDateVisible = React.useCallback((open) => {
        setStartDate((params) => {
            return { ...params, open: open || false };
        });
    }, [setStartDate]);
    
    const setStartDateConfirm = React.useCallback((data) => {
        setStartDate((params) => {
            return { ...params, open: false, value: data.date };
        });
    }, [setStartDate]);

    const onPressAction = (action) => {
        showToast({text: 'Temporariamente indisponível'});
        //navigation.goBack();
    }

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
                                    <HalfDonutChart percentage={campaign.stats.totalSentPercentage} length={numberFormat(campaign.stats.totalRecipients)} title="Emails" />
                                </View>
                                
                                <View style={{flexDirection: 'row',alignItems: 'stretch',gap: 10,marginBottom: 30}}>
                                    <View style={{width: 122,height: 122,flexShrink: 0}}>
                                        <Image source={{uri: 'https://fakeimg.pl/220x220/'}} style={{resizeMode: 'cover',flex: 1,width: 122,height: 122}} />
                                    </View>
                                    <View style={{flexGrow: 1,paddingTop: 2}}>
                                        <View style={{marginBottom: 6}}><Text style={[theme.listNavSubtitle, {color: theme.colors.black}]}>{campaign.title}</Text></View>
                                        <View style={{flexDirection: 'row',gap: 10,maxWidth: '100%'}}>
                                            <View style={{flexGrow: 1}}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Encomendas</Text></View>
                                                    <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(campaign.stats.totalOrders)}</Text></View>
                                                </View>

                                                <View style={{flexGrow: 1,flexDirection: 'row'}}>
                                                    <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Conversão</Text></View>
                                                    <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{campaign.stats.totalOrdersPercentage}%</Text></View>
                                                </View>
                                            </View>
                                            <View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>(0 - falta) <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text></View>
                                            </View>
                                        </View>
                                        <View style={statistics.container}>
                                            <View style={statistics.item}>
                                                <View>
                                                    <View><Text style={statistics.text1}>Aberturas</Text></View>
                                                    <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>(0 - falta)</Text></View>
                                                </View>
                                                <View style={statistics.columnRight}>
                                                    <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalOpeningsPercentage}%</Text></View>
                                                    <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(campaign.stats.totalOpenings)}</Text></View>
                                                </View>
                                            </View>
                                            <View style={statistics.item}>
                                                <View>
                                                    <View><Text style={statistics.text1}>Clicks</Text></View>
                                                    <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>(0 - falta)</Text></View>
                                                </View>
                                                <View style={statistics.columnRight}>
                                                    <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{campaign.stats.totalClicksPercentage}%</Text></View>
                                                    <View style={[statistics.value, {backgroundColor: theme.colors.errorlight}]}><Text style={[statistics.valueText, {color: theme.colors.error}]}>{numberFormat(campaign.stats.totalClicks)}</Text></View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8}}>
                                    <View style={{flexDirection: 'column'}}>
                                        <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{numberFormat(campaign.stats.totalSent)}</Text>
                                        <Text style={[theme.small, {textAlign: 'center'}]}>Emails enviados</Text>
                                    </View>
                                    <View>
                                        <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>{numberFormat(campaign.stats.totalRecipients - campaign.stats.totalSent)}</Text>
                                        <Text style={[theme.small, {textAlign: 'center'}]}>Pendentes</Text>
                                    </View>
                                    <View>
                                        <Text style={[theme.listNavTitle, {fontSize: 18,textAlign: 'center',marginBottom: 2}]}>(0 - falta)<Text style={theme.small}> %</Text></Text>
                                        <Text style={[theme.small, {textAlign: 'center'}]}>Taxa de rejeição</Text>
                                    </View>
                                </View>

                                {/*
                                <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,}}></View>

                                <Text style={[theme.listNavSubtitle, {marginTop: theme.containerPadding,marginBottom: 20}]}>O envio começa...</Text>

                                <View style={{marginHorizontal: 'auto'}}>
                                    <CountDown targetDate="2024-07-01T00:00:00" onComplete={() => {
                                        console.log('countdown completed');
                                    }}/>
                                </View>*/}
                            </ScrollView>

                            <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom)}]}>
                                <Button mode="contained" onPress={onSubmit}>Ativar</Button>
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