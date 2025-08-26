import React, {useState, useEffect, useCallback, useMemo} from 'react';
import { ScrollView, StatusBar, View, Modal, RefreshControl, Platform, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Portal } from "react-native-paper";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LoadingFullscreen, LoadingRefreshFullscreen, Badge } from '../components/elements';
import {TextInput} from "../components/inputs";
import { theme } from '../styles/styles'
import { Text } from 'react-native-paper';
import Button from '../components/buttons'
import { remoteAPI, dateFormatter, splitDateTime, showToast, formValidator } from '../core/utils'

export function DetCampaign() {
    /*
    Estados das campanhas (campaign.status)
    */
    const navigation = useNavigation();
    const [pageIsReady, setPageIsReady] = useState(false);
    const [pageStatus, setPageStatus] = useState(0);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [campaign, setCampaign] = useState(route.params.item);
    const [isRefreshLoading, setRefreshLoading] = useState(false);
    const [isModalConfirm, setModalConfirm] = useState(false);
    const [optionSubmit, setOptionSubmit] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    const flags = useMemo(() => {
    return (campaign?.flags ?? [])
        .map(f => ({ title: (f?.title ?? '').trim() }))
        .filter(f => f.title.length > 0);
    }, [campaign]);

    const { date: campaignStartDate, time: campaignStartTime } = dateFormatter(campaign.startDate);
    const { date: campaignEndDate, time: campaignEndTime } = dateFormatter(campaign.endDate);
    
    const [showPickerStartDate, setShowPickerStartDate] = useState(true);
    const [showPickerStartTime, setShowPickerStartTime] = useState(true);
    const [showPickerEndDate, setShowPickerEndDate] = useState(true);
    const [showPickerEndTime, setShowPickerEndTime] = useState(true);

    const { date: startDateFormatter, time: startTimeFormatter } = splitDateTime(campaign.startDate);
    const { date: endDateFormatter, time: endTimeFormatter } = splitDateTime(campaign.endDate);
    
    const [startDay, startMonth, startYear] = startDateFormatter.split('/').map(Number);
    const [startDatePicker, setStartDatePicker] = useState(() => {
        const [hours, minutes] = startTimeFormatter.split(':').map(Number);
        return new Date(startYear, startMonth - 1, startDay, hours, minutes);
    });
    
    const [endDay, endMonth, endYear] = endDateFormatter.split('/').map(Number);
    const [endDatePicker, setEndDatePicker] = useState(() => {
        const [hours, minutes] = endTimeFormatter.split(':').map(Number);
        return new Date(endYear, endMonth - 1, endDay, hours, minutes);
    });
    
    const [startDate, setStartDate] = useState({ value: startDateFormatter, error: false, errorText: '' });
    const [startTime, setStartTime] = useState({ value: startTimeFormatter, error: false, errorText: '' });
    const [endDate, setEndDate] = useState({ value: endDateFormatter, error: false, errorText: '' });
    const [endTime, setEndTime] = useState({ value: endTimeFormatter, error: false, errorText: '' });

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

        var valid = true;
        const fields = [
            { state: startDate.value, setter: setStartDate },
            { state: startTime.value, setter: setStartTime },
            { state: endDate.value, setter: setEndDate },
            { state: endTime.value, setter: setEndTime }
        ];

        for (const { state, setter } of fields) {
            const error = formValidator(state);
            if (error.error) {
                valid = false;
                setter({ ...state, error: true, errorText: '' });
                break;
            }
        }

        if(!valid) {
            setRefreshLoading(false);
            return;
        }

        const [startDay, startMonth, startYear] = startDate.value.split('/');
        const [startHour, startMinute] = startTime.value.split(':');
        const [endDay, endMonth, endYear] = endDate.value.split('/');
        const [endHour, endMinute] = endTime.value.split(':');

        const startD = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
        const endD = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

        const newStartDate = `${startD.getFullYear()}-${String(startD.getMonth() + 1).padStart(2,'0')}-${String(startD.getDate()).padStart(2,'0')} ${String(startD.getHours()).padStart(2,'0')}:${String(startD.getMinutes()).padStart(2,'0')}:${String(startD.getSeconds()).padStart(2,'0')}`;
        const newEndDate = `${endD.getFullYear()}-${String(endD.getMonth() + 1).padStart(2,'0')}-${String(endD.getDate()).padStart(2,'0')} ${String(endD.getHours()).padStart(2,'0')}:${String(endD.getMinutes()).padStart(2,'0')}:${String(endD.getSeconds()).padStart(2,'0')}`;

        try {
            const data = await remoteAPI({
                request: `marketing/campaigns/`,
                method: 'PUT',
                body: {
                    id: campaign.id,
                    startDate: newStartDate,
                    endDate: newEndDate
                }
            });

            if (!data || data.status === 'false') {
                showToast({ text: 'Ocorreu um erro na submissão, por favor reveja o formulário.' });
                return;
            }
    
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
            request: `marketing/promotions/${campaign.id}`,
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

    const openAndroidDatePicker = (date, onChange) => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    onChange(selectedDate);
                }
            },
        });
    };

    const openAndroidTimePicker = (date, onChange) => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'time',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    onChange(selectedDate);
                }
            },
        });
    };
    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
                {
                    pageIsReady ? (
                        <>
                            <ScrollView style={theme.wrapperPage} contentContainerStyle={[theme.wrapperContentStyle, {paddingTop: 30}]}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            >

                                <View style={[{flexDirection: 'row',alignItems: 'center'}]}>
                                    <View style={{flexGrow: 1,width: 1, rowGap: 10}}>
                                        <View style={{marginBottom: 2}}>
                                            <View style={{flexDirection: 'row',alignItems: 'flex-start',gap: 6,marginBottom: 3}}>
                                                <Text style={[theme.listNavSubtitle, {position: 'relative', color: theme.colors.black, }]}>{campaign.title}</Text>
                                                <Badge type="dot" style={{backgroundColor: campaign.active == 1 ? theme.colors.success : theme.colors.error,marginTop: 4}} />
                                            </View>
            
                                            {campaign.description && (
                                                <Text style={[theme.small, {color: theme.colors.black, lineHeight: 12}]}>{campaign.description}</Text>
                                            )}
            
                                            {(campaign.multiLanguageContent && campaign.multiLanguageContent.pt.name) && (
                                                <Text style={[theme.paragraph, {lineHeight: 22}]}>{campaign.multiLanguageContent.pt.name}</Text>
                                            )}
                                        </View>
                                        <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',alignItems: 'center'}}>
                                            <View style={{gap: 3}}>
                                                {/*<View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                    <View style={{width: 70,marginRight: 10}}>
                                                        <Text style={[theme.small, {lineHeight: 14}]}>Ativo de:</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>{campaignStartDate} <Text style={{color: theme.colors.darkgray}}>{campaignStartTime}</Text></Text>
                                                    </View>
                                                </View>
            
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={{width: 70,marginRight: 10}}>
                                                        <Text style={[theme.small, {lineHeight: 14}]}>Até:</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>{campaignEndDate} <Text style={{color: theme.colors.darkgray}}>{campaignEndTime}</Text></Text>
                                                    </View>
                                                </View>*/}
                                                
                                                {campaign.applicableTo == 'allUsers' && 
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: 70,marginRight: 10}}>
                                                            <Text style={[theme.small, {lineHeight: 14}]}>Aplicável a:</Text>
                                                        </View>
                                                        <View style={{width: 150}}>
                                                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>Todos os utilizadores</Text>
                                                        </View>
                                                    </View>
                                                }
            
                                                {campaign.amountType == 'discount' && (
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: 70,marginRight: 10}}>
                                                            <Text style={[theme.small, {lineHeight: 14}]}>Desconto:</Text>
                                                        </View>
                                                        <View style={{width: 150}}>
                                                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>{campaign.amount}%</Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        {/*
                                        <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',alignItems: 'center'}}>
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View>
                                                    {flags.length > 0 ? (
                                                        <View style={{flexDirection: 'row',gap: 6}}>
                                                            {flags.map((flag, index) => (
                                                                <Badge text={flag.title} style={{paddingHorizontal: 6,color: theme.colors.info}} key={index} />
                                                            ))}
                                                        </View>
                                                    ) : null}
                                                </View>
                                            </View>
                                        </View>*/}
                                        
                                    </View>
                                </View>

                                <View style={{height: 6,backgroundColor: theme.colors.background,marginHorizontal: theme.ncontainerPadding,marginVertical: 30}}></View>
                                
                                <View style={theme.formWrapper}>
                                    <View style={theme.formField}>
                                        <View style={theme.formLabelWrap}>
                                            <Text style={[theme.formLabel, theme.listNavSubtitle]}>Ativo de</Text>
                                        </View>
                                        
                                        <View style={theme.formContent}>
                                            <View style={{width: '48%',position: 'relative',overflow: 'hidden'}}>
                                                <TextInput
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    autoComplete="off"
                                                    importantForAutofill="off"
                                                    onChangeText={(date) => setStartDate({ value: date, error: false, errorText: '' })}
                                                    value={startDate.value}
                                                    error={startDate.error}
                                                    errorText={startDate.errorText}
                                                    rightIcon="803"
                                                    disabled={campaign.editableStartDate == 0 ? true : false}
                                                />

                                                {campaign.editableStartDate != 0 && (
                                                    Platform.OS === 'ios' ? (
                                                        <View 
                                                            style={{
                                                                transform: [{ scale: 6.5 }, { translateY: -13 }, { translateX: 0}],
                                                                opacity: .1,
                                                                position: 'absolute',
                                                                zIndex: 1,
                                                            }}>
                                                            {showPickerStartDate && (
                                                                <DateTimePicker
                                                                    value={startDatePicker}
                                                                    mode="date"
                                                                    display="compact"
                                                                    locale="pt-PT"
                                                                    onChange={(event, selectedDate) => {
                                                                        if (selectedDate) {
                                                                            const year = selectedDate.getFullYear();
                                                                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                                            const day = String(selectedDate.getDate()).padStart(2, '0');
                                                                            const formattedDate = `${day}/${month}/${year}`;

                                                                            //console.log('selectedDate local:', selectedDate);
                                                                            //console.log('formattedDate local:', formattedDate);

                                                                            setStartDatePicker(selectedDate);
                                                                            setStartTime({ value: formattedDate, error: false, errorText: '' })
                                                                        }

                                                                        setShowPickerStartDate(false);
                                                                        setTimeout(() => setShowPickerStartDate(true), 1);
                                                                    }}
                                                                />

                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Pressable style={{position: 'absolute',top: 0,left: 0,width: '100%',height: '100%',zIndex: 1}} onPress={() => {
                                                            openAndroidDatePicker(startDatePicker, (selectedDate) => {
                                                                const year = selectedDate.getFullYear();
                                                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                                                const formattedDate = `${day}/${month}/${year}`;
                                                                setStartDatePicker(selectedDate);
                                                                setStartDate({ value: formattedDate, error: false, errorText: '' });
                                                            });
                                                        }}>
                                                        </Pressable>
                                                    )
                                                )}
                                            </View>

                                            <View style={{width: '48%',position: 'relative',overflow: 'hidden'}}>
                                                <TextInput
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    autoComplete="off"
                                                    importantForAutofill="off"
                                                    onChangeText={(time) => setStartTime({ value: time, error: false, errorText: '' })}
                                                    value={startTime.value}
                                                    error={startTime.error}
                                                    errorText={startTime.errorText}
                                                    rightIcon="81e"
                                                    disabled={campaign.editableStartDate == 0 ? true : false}
                                                />

                                                {campaign.editableStartDate != 0 && (
                                                    Platform.OS === 'ios' ? (
                                                        <View 
                                                            style={{
                                                                transform: [{ scale: 6.5 }, { translateY: -13 }, { translateX: 0}],
                                                                opacity: .1,
                                                                position: 'absolute',
                                                                zIndex: 1,
                                                            }}>
                                                            {showPickerStartTime && Platform.OS === 'ios' && (
                                                                <DateTimePicker
                                                                    value={startDatePicker}
                                                                    mode="time"
                                                                    is24Hour={true}
                                                                    onChange={(event, selectedDate) => {
                                                                        if (selectedDate) {
                                                                            const d = new Date(selectedDate);

                                                                            const hours = String(d.getHours()).padStart(2, "0");
                                                                            const minutes = String(d.getMinutes()).padStart(2, "0");
                                                                            const formattedTime = `${hours}:${minutes}`;

                                                                            setStartDatePicker(selectedDate);
                                                                            setEndTime({ value: formattedTime, error: false, errorText: '' })
                                                                        }

                                                                        //setShowPickerEndTime(false);
                                                                        //setTimeout(() => setShowPickerEndTime(true), 1);
                                                                    }}
                                                                />

                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Pressable style={{position: 'absolute',top: 0,left: 0,width: '100%',height: '100%',zIndex: 1}} onPress={() => {
                                                            openAndroidTimePicker(startDatePicker, (selectedDate) => {
                                                                const hours = String(selectedDate.getHours()).padStart(2, '0');
                                                                const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
                                                                const formattedTime = `${hours}:${minutes}`;
                                                                setStartDatePicker(selectedDate);
                                                                setStartTime({ value: formattedTime, error: false, errorText: '' });
                                                            });
                                                        }}>
                                                        </Pressable>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <View style={theme.formField}>
                                        <View style={theme.formLabelWrap}>
                                            <Text style={[theme.formLabel, theme.listNavSubtitle]}>Ativo até</Text>
                                        </View>
                                        <View style={theme.formContent}>
                                            <View style={{width: '48%',position: 'relative',overflow: 'hidden'}}>
                                                <TextInput
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    autoComplete="off"
                                                    importantForAutofill="off"
                                                    onChangeText={(date) => setEndDate({ value: date, error: false, errorText: '' })}
                                                    value={endDate.value}
                                                    error={endDate.error}
                                                    errorText={endDate.errorText}
                                                    rightIcon="803"
                                                    disabled={campaign.editableEndDate == 0 ? true : false}
                                                />

                                                {campaign.editableEndDate != 0 && (
                                                    Platform.OS === 'ios' ? (
                                                        <View 
                                                            style={{
                                                                transform: [{ scale: 6.5 }, { translateY: -13 }, { translateX: 0}],
                                                                opacity: .1,
                                                                position: 'absolute',
                                                                zIndex: 1,
                                                            }}>
                                                            {showPickerEndDate && (
                                                                <DateTimePicker
                                                                    value={endDatePicker}
                                                                    mode="date"
                                                                    display="compact"
                                                                    locale="pt-PT"
                                                                    onChange={(event, selectedDate) => {
                                                                        if (selectedDate) {
                                                                            const year = selectedDate.getFullYear();
                                                                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                                            const day = String(selectedDate.getDate()).padStart(2, '0');
                                                                            const formattedDate = `${day}/${month}/${year}`;

                                                                            //console.log('selectedDate local:', selectedDate);
                                                                            //console.log('formattedDate local:', formattedDate);

                                                                            setEndDatePicker(selectedDate);
                                                                            setEndDate({ value: formattedDate, error: false, errorText: '' })
                                                                        }

                                                                        setShowPickerEndDate(false);
                                                                        setTimeout(() => setShowPickerEndDate(true), 1);
                                                                    }}
                                                                />

                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Pressable style={{position: 'absolute',top: 0,left: 0,width: '100%',height: '100%',zIndex: 1}} onPress={() => {
                                                            openAndroidDatePicker(endDatePicker, (selectedDate) => {
                                                                const year = selectedDate.getFullYear();
                                                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                                                const formattedDate = `${day}/${month}/${year}`;
                                                                setEndDatePicker(selectedDate);
                                                                setEndDate({ value: formattedDate, error: false, errorText: '' });
                                                            });
                                                        }}>
                                                        </Pressable>
                                                    )
                                                )}
                                            </View>

                                            <View style={{width: '48%',position: 'relative',overflow: 'hidden'}}>
                                                <TextInput
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    autoComplete="off"
                                                    importantForAutofill="off"
                                                    onChangeText={(time) => setEndTime({ value: time, error: false, errorText: '' })}
                                                    value={endTime.value}
                                                    error={endTime.error}
                                                    errorText={endTime.errorText}
                                                    rightIcon="81e"
                                                    disabled={campaign.editableEndDate == 0 ? true : false}
                                                />

                                                {campaign.editableEndDate != 0 && (
                                                    Platform.OS === 'ios' ? (
                                                        <View 
                                                            style={{
                                                                transform: [{ scale: 6.5 }, { translateY: -13 }, { translateX: 0}],
                                                                opacity: .1,
                                                                position: 'absolute',
                                                                zIndex: 1,
                                                            }}>
                                                            {showPickerEndTime && (
                                                                <DateTimePicker
                                                                    value={endDatePicker}
                                                                    mode="time"
                                                                    display="compact"
                                                                    locale="pt-PT"
                                                                    onChange={(event, selectedDate) => {
                                                                        if (selectedDate) {
                                                                            const d = new Date(selectedDate);

                                                                            const hours = String(d.getHours()).padStart(2, "0");
                                                                            const minutes = String(d.getMinutes()).padStart(2, "0");
                                                                            const formattedTime = `${hours}:${minutes}`;

                                                                            setEndDatePicker(selectedDate);
                                                                            setEndTime({ value: formattedTime, error: false, errorText: '' })
                                                                        }

                                                                        //setShowPickerEndTime(false);
                                                                        //setTimeout(() => setShowPickerEndTime(true), 1);
                                                                    }}
                                                                />

                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Pressable style={{position: 'absolute',top: 0,left: 0,width: '100%',height: '100%',zIndex: 1}} onPress={() => {
                                                            openAndroidTimePicker(endDatePicker, (selectedDate) => {
                                                                const hours = String(selectedDate.getHours()).padStart(2, '0');
                                                                const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
                                                                const formattedTime = `${hours}:${minutes}`;
                                                                setEndDatePicker(selectedDate);
                                                                setEndTime({ value: formattedTime, error: false, errorText: '' });
                                                            });
                                                        }}>
                                                        </Pressable>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom),flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}]}>
                                <View style={{width: '48%', marginTop: 2}}>
                                    <Button mode='outlined' onPress={()=> {showToast({text: 'Temporariamente indisponível'});}}>Cancelar</Button>
                                </View>

                                <View style={{width: '48%', marginTop: 2}}>
                                    <Button mode='contained' onPress={onSubmit}>Gravar</Button>
                                </View>

                                {/*campaign.options.map((item, index) => {
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
                                })*/}
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