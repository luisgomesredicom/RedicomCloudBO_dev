import React, {useState, useEffect, useCallback} from 'react';
import { ScrollView, StatusBar, View , StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import { Badge, LoadingFullscreen, HalfDonutChart } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, Switch } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';
import Button from '../components/buttons'
import { TextInput } from "../components/inputs";
import { DateInput, DatePicker } from "../components/modalDatePicker";
import { showToast, formValidator, remoteAPI } from '../core/utils'

const generateHoursList = (endMinute = '00', endSecond = '00') =>
    Array.from({ length: 24 }, (_, h) => {
    const hour = String(h).padStart(2, '0');
    return {
        label: `${hour}:${endMinute}`,
        value: `${hour}:${endMinute}:${endSecond}`,
    };
});

const fromHoursList = generateHoursList('00', '00');
const toHoursList = generateHoursList('59', '59');

const useDateTimeField = (initialDate, hoursList) => {
  const [dateState, setDateState] = useState({
    value: new Date(initialDate),
    error: false,
    errorText: '',
    open: false,
  });

  const [_, timePart] = initialDate.split(' ');
  const [hour, minute] = timePart.split(':');
  const hourItem = hoursList.find(item => item.label === `${hour}:${minute}`);

  const [hourState, setHourState] = useState({
    value: hourItem?.value || '',
    required: true,
    showtoast: true,
  });

  const setVisible = useCallback(open => {
    setDateState(prev => ({ ...prev, open: open || false }));
  }, []);

  const setConfirm = useCallback(data => {
    setDateState(prev => ({ ...prev, open: false, value: data.date }));
  }, []);

  return { dateState, setDateState, hourState, setHourState, setVisible, setConfirm };
};

const DateTimeField = ({ label, editable, dateField, hourField, hoursList }) => (
    <View style={theme.formField}>
        <View style={theme.formLabelWrap}>
            <Text style={[theme.formLabel, theme.listNavTitle]}>{label}</Text>
        </View>
        <View style={theme.formContent}>
            
            <View style={{ flexGrow: 1, flexBasis: 0, position: 'relative' }}>
            <DateInput
                value={dateField.dateState.value}
                error={dateField.dateState.error}
                errorText={dateField.dateState.errorText}
                disabled={!editable}
            />
            {editable && (
                <>
                <DatePicker
                    visible={dateField.dateState.open}
                    onDismiss={dateField.setVisible}
                    onConfirm={dateField.setConfirm}
                    date={dateField.dateState.value}
                />
                <TouchableOpacity onPress={() => dateField.setVisible(true)} style={theme.buttonDateModal} />
                </>
            )}
            </View>

            <View style={{ flexGrow: 1, flexBasis: 0, position: 'relative' }}>
                <TextInput value=" " rightIcon="calendar-clock" disabled={!editable} />
                <View style={theme.buttonTimeModal}>
                    <RNPickerSelect
                    onValueChange={text => hourField.setHourState({ value: text, error: false, errorText: '' })}
                    items={hoursList}
                    value={hourField.hourState.value}
                    style={editable ? theme.pickerSelectStyles : theme.pickerSelectStylesDisabled}
                    disabled={!editable}
                    placeholder={{}}
                    />
                </View>
            </View>
        </View>
    </View>
);

export function DetPromo() {
    const [pageIsReady, setPageIsReady] = useState(false);
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [promotion, setPromotion] = useState(route.params.item);
    
    const start = useDateTimeField(promotion.startDate, fromHoursList);
    const end = useDateTimeField(promotion.endDate, toHoursList);
    const [amount, setAmount] = useState({ value: promotion.amount, error: false, errorText: '' });

    const onSubmit = async () => {
        const fields = [
            { state: start.dateState, setter: start.setDateState },
            { state: end.dateState, setter: end.setDateState },
            { state: start.hourState, setter: start.setHourState },
            { state: end.hourState, setter: end.setHourState },
            { state: amount, setter: setAmount },
        ];

        for (const { state, setter } of fields) {
            const error = formValidator(state);
            if (error.error) {
                setter({ ...state, error: true, errorText: '' });
                return;
            }
        }

        const startDateValue = new Date(start.dateState.value).toISOString().split('T')[0] + ' ' + start.hourState.value;
        const endDateValue = new Date(end.dateState.value).toISOString().split('T')[0] + ' ' + end.hourState.value;

        const data = await remoteAPI({
            request: `marketing/promotions/`,
            method: 'PUT',
            body: {
            id: promotion.id,
            startDate: startDateValue,
            endDate: endDateValue,
            amount: amount.value,
            }
        });

        if (!data || data.status === 'false') {
            showToast({ text: 'Ocorreu um erro na submissÃ£o, por favor reveja o formulÃ¡rio.' });
            return;
        }

        const promotionUpdated = { ...promotion, ...data.response };
        setPromotion(promotionUpdated);
        navigation.goBack();
        route.params.update(promotionUpdated);
    };

    useEffect(() => {
        setPageIsReady(true);
    }, []);

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={{flex: 1,backgroundColor: theme.colors.lighttheme}}>
                <View style={[theme.wrapperPage]}>
                    {
                        pageIsReady ? (
                            <>
                                <ScrollView style={theme.wrapperPage}>
                                    <View style={[theme.containerDonutChart, {marginBottom: 30}]}>
                                        <HalfDonutChart 
                                            percentage='' 
                                            value1title="Promoção de lista de preços" 
                                            value1value='' 
                                            value2title="Lista PVP" 
                                            value2value=''
                                            bgcolor={promotion.flags[0].graphStyle}
                                        />
                                    </View>

                                    <View style={[theme.cardItem, {paddingBottom: 32}]}>
                                        <View style={{flexDirection: 'row',alignItems: 'stretch'}}>
                                            <View style={{width: '33.33333%'}}>
                                                <View style={{flexDirection: 'row',alignItems: 'baseline',justifyContent: 'center'}}><Text style={[theme.listNavTitle, {fontSize: 18}]}>10 000</Text></View>
                                                <Text style={[theme.small, {fontSize: 12,textAlign: 'center'}]}>Produtos</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{height: 6,backgroundColor: theme.colors.background, marginBottom: 2}}></View>
                                    
                                    {/* {<View style={[theme.cardItem, {marginTop: 0,marginBottom: 0,borderWidth: 0,backgroundColor: theme.colors.background}]}>
                                        <View style={{flex: 1,gap: 5}}>
                                            {promotion.active == 1 && (
                                                <Badge type="dot" style={{position: 'absolute',top: -4,right: -4,zIndex: 1}} />
                                            )}
                                            
                                            <View>
                                                <Text style={[theme.secondarySubtitle, {paddingRight: 35}]}>{promotion.title}</Text>
                                                <Text style={theme.paragraph}>ID: {promotion.id}</Text>
                                            </View>

                                            <View style={{height: 2}}></View>

                                            {promotion.description && (
                                                <Text style={theme.paragraph}>{promotion.description}</Text>
                                            )}
                                        </View>

                                        <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,borderTopWidth: 1,borderColor: theme.colors.lines,paddingTop: 11,marginTop: 15}}>
                                            <View><Text style={theme.paragraph}>Tipo de redução ao preço:</Text></View>
                                            <Badge text={promotion.multiLanguageContent.pt.type} />
                                        </View>
                                    </View>

                                    <View style={{marginTop: 28,marginBottom: 28}}>
                                        <Text style={theme.subtitle}>Regras de Ativação</Text>
                                    </View>} */}
                                    
                                    <View style={theme.wrapperContentStyle}>
                                        <View style={theme.formWrapper}>
                                            <DateTimeField
                                                label="Ativo de"
                                                editable={promotion.editableStartDate != 0}
                                                dateField={start}
                                                hourField={start}
                                                hoursList={fromHoursList}
                                            />
                                            <DateTimeField
                                                label="Até"
                                                editable={promotion.editableEndDate != 0}
                                                dateField={end}
                                                hourField={end}
                                                hoursList={toHoursList}
                                            />

                                            <View style={theme.formField}>
                                                <View style={theme.formLabelWrap}>
                                                    <Text style={[theme.formLabel, theme.listNavTitle]}>Desconto ao catálogo (%)</Text>
                                                </View>
                                                <View style={theme.formContent}>
                                                    <TextInput
                                                        returnKeyType="done"
                                                        onChangeText={(text) => setAmount({ value: text, error: false, errorText: '' })}
                                                        value={amount.value}
                                                        error={amount.error}
                                                        errorText={amount.errorText}
                                                        rightIcon="percent"
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View style={theme.wrapperSecondaryButtons}>
                                            <Button mode="outlined" onPress={()=> {showToast({text: 'Temporariamente indisponí­vel'});}}>Cancelar promoção</Button>
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