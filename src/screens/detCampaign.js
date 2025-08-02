import React, {useState, useEffect} from 'react';
import { ScrollView, StatusBar, View, TouchableOpacity} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import { Badge, LoadingFullscreen } from '../components/elements';
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';
import Button from '../components/buttons'
import { TextInput } from "../components/inputs";
import { DateInput, DatePicker } from "../components/modalDatePicker";
import { showToast, formValidator, remoteAPI } from '../core/utils'

const fromHoursList = [
    {label: '00:00', value: '00:00:00'},
    {label: '01:00', value: '01:00:00'},
    {label: '02:00', value: '02:00:00'},
    {label: '03:00', value: '03:00:00'},
    {label: '04:00', value: '04:00:00'},
    {label: '05:00', value: '05:00:00'},
    {label: '06:00', value: '06:00:00'},
    {label: '07:00', value: '07:00:00'},
    {label: '08:00', value: '08:00:00'},
    {label: '09:00', value: '09:00:00'},
    {label: '10:00', value: '10:00:00'},
    {label: '11:00', value: '11:00:00'},
    {label: '12:00', value: '12:00:00'},
    {label: '13:00', value: '13:00:00'},
    {label: '14:00', value: '14:00:00'},
    {label: '15:00', value: '15:00:00'},
    {label: '16:00', value: '16:00:00'},
    {label: '17:00', value: '17:00:00'},
    {label: '18:00', value: '18:00:00'},
    {label: '19:00', value: '19:00:00'},
    {label: '20:00', value: '20:00:00'},
    {label: '21:00', value: '21:00:00'},
    {label: '22:00', value: '22:00:00'},
    {label: '23:00', value: '23:00:00'}
]

const toHoursList = [
    {label: '00:59', value: '00:59:59'},
    {label: '01:59', value: '01:59:59'},
    {label: '02:59', value: '02:59:59'},
    {label: '03:59', value: '03:59:59'},
    {label: '04:59', value: '04:59:59'},
    {label: '05:59', value: '05:59:59'},
    {label: '06:59', value: '06:59:59'},
    {label: '07:59', value: '07:59:59'},
    {label: '08:59', value: '08:59:59'},
    {label: '09:59', value: '09:59:59'},
    {label: '10:59', value: '10:59:59'},
    {label: '11:59', value: '11:59:59'},
    {label: '12:59', value: '12:59:59'},
    {label: '13:59', value: '13:59:59'},
    {label: '14:59', value: '14:59:59'},
    {label: '15:59', value: '15:59:59'},
    {label: '16:59', value: '16:59:59'},
    {label: '17:59', value: '17:59:59'},
    {label: '18:59', value: '18:59:59'},
    {label: '19:59', value: '19:59:59'},
    {label: '20:59', value: '20:59:59'},
    {label: '21:59', value: '21:59:59'},
    {label: '22:59', value: '22:59:59'},
    {label: '23:59', value: '23:59:59'}
]

export function DetCampaign() {
    const [pageIsReady, setPageIsReady] = useState(false);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const navigation = useNavigation();
    
    const [startDate, setStartDate] = useState({value: new Date(campaign.startDate),error: false,errorText: '',open: false});
    const [startDateDatePart, startDateTimePart] = campaign.startDate.split(' ');
    const [startDateHour, startDateMinute] = startDateTimePart.split(':');
    const startHourItem = fromHoursList.filter(item => item.label === startDateHour + ':' + startDateMinute);
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

    const [endDate, setEndDate] = useState({ value: new Date(campaign.endDate), error: false, errorText: '',open: false });
    const [endDateDatePart, endDateTimePart] = campaign.endDate.split(' ');
    const [endDateHour, endDateMinute] = endDateTimePart.split(':');
    const endHourItem = toHoursList.filter(item => item.label === endDateHour + ':' + endDateMinute);
    const [toHour, setToHour] = useState({value: endHourItem[0].value, required: true, showtoast: true});
    const setEndDateVisible = React.useCallback((open) => {
        setEndDate((params) => {
            return { ...params, open: open || false };
        });
    }, [setEndDate]);
    
    const setEndDateConfirm = React.useCallback((data) => {
        setEndDate((params) => {
            return { ...params, open: false, value: data.date };
        });
    }, [setEndDate]);

    const onSubmit = () => {
        const startDateError = formValidator({value: startDate.value, required: true, showtoast: true});
        const endDateError = formValidator({value: endDate.value, required: true, showtoast: true});
        const fromHourError = formValidator({value: fromHour.value, required: true, showtoast: true});
        const toHourError = formValidator({value: toHour.value, required: true, showtoast: true});

        if(startDateError.error) {setStartDate({ ...startDate, error: true, errorText: '' }); return;}
        if(endDateError.error) {setEndDate({ ...endDate, error: true, errorText: '' }); return;}
        if(fromHourError.error) {setFromHour({ ...fromHour, error: true, errorText: '' }); return;}
        if(toHourError.error) {setToHour({ ...toHour, error: true, errorText: '' }); return;}

        (async () => {
            const startDateValue = new Date(startDate.value).toISOString().split('T')[0] + ' ' + fromHour.value;
            const endDateValue = new Date(endDate.value).toISOString().split('T')[0] + ' ' + toHour.value;

            //console.log('startDate: ', startDateValue);
            //console.log('endDate: ', endDateValue);
            
            const data = await remoteAPI({
                request: `marketing/campaigns/`,
                method: 'PUT',
                body: {
                    id: campaign.id,
                    startDate: startDateValue,
                    endDate: endDateValue
                }
            });
            
            if(!data || data.status === 'false') {
                showToast({text: 'Ocorreu um erro na submissão, por favor reveja o formulário.'});
                return false;
            }
            
            const campaignUpdated = {...campaign, ...data.response};
            setCampaign(campaignUpdated);
            
            route.params.update(campaignUpdated);
            navigation.goBack();
        })();
    }

    useEffect(() => {
        setPageIsReady(true);
    }, []);

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={{flex: 1,backgroundColor: theme.colors.lighttheme}}>
                <View style={[theme.wrapperPage, {marginTop: theme.containerPadding}]}>
                    {
                        pageIsReady ? (
                            <>
                                <ScrollView style={theme.wrapperPage} contentContainerStyle={theme.wrapperContentStyle}>
                                    <View style={[theme.cardItem, {marginTop: 0,marginBottom: 0,borderWidth: 0,backgroundColor: theme.colors.background}]}>
                                        <View style={{flex: 1,gap: 5}}>
                                            {campaign.active == 1 && (
                                                <Badge type="dot" style={{position: 'absolute',top: -4,right: -4,zIndex: 1}} />
                                            )}
                                            
                                            <View>
                                                <Text style={[theme.secondarySubtitle, {paddingRight: 35}]}>{campaign.title}</Text>
                                                <Text style={theme.paragraph}>ID: {campaign.id}</Text>
                                            </View>

                                            <View style={{height: 2}}></View>

                                            {campaign.description && (
                                                <Text style={theme.paragraph}>{campaign.description}</Text>
                                            )}
                                        </View>

                                        <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,borderTopWidth: 1,borderColor: theme.colors.lines,paddingTop: 11,marginTop: 15}}>
                                            {campaign.flags.map((flag, index) => (
                                                flag.title && flag.title != '' && (
                                                    <Badge type="dot" text={flag.title} style={flag.style > 0 && flag.style < 5 ? theme[`stats_${flag.style}`] : {}} key={index} />
                                                )
                                            ))}
                                        </View>
                                    </View>

                                    <View style={{marginTop: 28,marginBottom: 28}}>
                                        <Text style={theme.subtitle}>Regras de Ativação</Text>
                                    </View>
                                    
                                    <View style={theme.formWrapper}>
                                        <View style={theme.formField}>
                                            <View style={theme.formLabelWrap}>
                                                <Text style={[theme.formLabel, theme.listNavTitle]}>Ativo de</Text>
                                            </View>
                                            <View style={theme.formContent}>
                                                <View style={{flexGrow: 1,flexBasis: 0,position: 'relative'}}>
                                                    <DateInput
                                                        value={startDate.value}
                                                        error={startDate.error}
                                                        errorText={startDate.errorText}
                                                        disabled={campaign.editableStartDate == 0}
                                                    />
                                                    {campaign.editableStartDate != 0 && (
                                                        <>
                                                            <DatePicker
                                                                visible={startDate.open}
                                                                onDismiss={setStartDateVisible}
                                                                onConfirm={setStartDateConfirm}
                                                                date={startDate.value}
                                                            />
                                                            <TouchableOpacity onPress={() => setStartDateVisible(true)} style={theme.buttonDateModal}></TouchableOpacity>
                                                        </>
                                                    )}
                                                </View>

                                                <View style={{flexGrow: 1,flexBasis: 0,position: 'relative'}}>
                                                    <TextInput
                                                        value=' '
                                                        rightIcon="calendar-clock"
                                                        disabled={campaign.editableStartDate == 0}
                                                    />
                                                    
                                                    <View style={theme.buttonTimeModal}>
                                                        <RNPickerSelect
                                                            onValueChange={(text) => setFromHour({ value: text, error: false, errorText: '' })}
                                                            items={fromHoursList}
                                                            value={fromHour.value}
                                                            error={fromHour.error}
                                                            errorText={fromHour.errorText}
                                                            style={campaign.editableStartDate == 0 ? theme.pickerSelectStylesDisabled : theme.pickerSelectStyles}
                                                            disabled={campaign.editableStartDate == 0 ? true : false}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={theme.formField}>
                                            <View style={theme.formLabelWrap}>
                                                <Text style={[theme.formLabel, theme.listNavTitle]}>Até</Text>
                                            </View>
                                            <View style={theme.formContent}>
                                                <View style={theme.formElement}>
                                                    <DateInput
                                                        value={endDate.value}
                                                        error={endDate.error}
                                                        errorText={endDate.errorText}
                                                        disabled={campaign.editableEndDate == 0}
                                                        inputMode="end"
                                                    />
                                                    {campaign.editableEndDate != 0 && (
                                                        <>
                                                            <DatePicker
                                                                visible={endDate.open}
                                                                onDismiss={setEndDateVisible}
                                                                onConfirm={setEndDateConfirm}
                                                                date={endDate.value}
                                                            />
                                                            <TouchableOpacity onPress={() => setEndDateVisible(true)} style={theme.buttonDateModal}></TouchableOpacity>
                                                        </>
                                                    )}
                                                </View>

                                                <View style={theme.formElement}>
                                                    <TextInput
                                                        value=' '
                                                        rightIcon="calendar-clock"
                                                        disabled={campaign.editableEndDate == 0}
                                                    />

                                                    <View style={theme.buttonTimeModal}>
                                                        <RNPickerSelect
                                                            onValueChange={(text) => setToHour({ value: text, error: false, errorText: '' })}
                                                            items={toHoursList}
                                                            value={toHour.value}
                                                            error={toHour.error}
                                                            errorText={toHour.errorText}
                                                            style={campaign.editableEndDate == 0 ? theme.pickerSelectStylesDisabled : theme.pickerSelectStyles}
                                                            disabled={campaign.editableEndDate == 0 ? true : false}
                                                            placeholder={{}}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={[theme.wrapperPageFooter, {paddingBottom: Math.max(insets.bottom)}]}>
                                    <Button mode="contained" onPress={onSubmit}>Gravar</Button>
                                </View>
                            </>
                        ) : <LoadingFullscreen />
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}