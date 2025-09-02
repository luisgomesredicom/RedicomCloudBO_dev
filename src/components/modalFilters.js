import React, {useState, createContext, useContext, useEffect} from 'react';
import { View, ScrollView, Pressable, TouchableOpacity, Modal, TouchableHighlight, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { theme } from '../styles/styles'
import { Text, Chip } from 'react-native-paper';
import { Icon } from "../components/elements";
import { Link } from '../components/buttons';
import Button from '../components/buttons'
import { center } from '@shopify/react-native-skia';

export const ModalFiltersState = {
    active: false,
    filters: [],
    filtersActive: []
}

export const ModalFiltersContext = createContext({
    state: ModalFiltersState,
    dispatch: () => null
})

export const ModalFiltersReducer = (state, action) => {
    switch (action.type) {
        case "toggleFilters":
            return {
                ...state,
                active: !state.active
            }
        case "setFilters":
            return {
                ...state,
                filters: action.filters || state.filters
            }
        case "setFiltersActive":
            return {
                ...state,
                filtersActive: action.filters
            }
        default:
            return state
    }
}

export const ModalFilters = (params) => {
    const [filterCatrgoryActiveIndex, sFilterCatrgoryActiveIndex] = useState(0);
    const [status, setStatus] = useState(0);
    const [data, dispatch] = useContext(ModalFiltersContext);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const insets = useSafeAreaInsets();

    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [showPickerDate, setShowPickerDate] = useState(false);

    useEffect(() => {
        setFilterStates([]);
        dispatch({ type: "setFiltersActive", filters: [] });
    }, []);

    useEffect(() => {
        if(data.filters.length > 0) {
            setStatus(1);
            //console.log('filterStates', filterStates)
            //console.log('data.filtersActive', data.filtersActive)

            const transformedFilters = {};
            let dateStart, dateEnd;

            for (const [key, value] of Object.entries(data.filtersActive)) {
                if (key.startsWith("dateStart")) {
                    dateStart = value;
                } else if (key.startsWith("dateEnd")) {
                    dateEnd = value;
                } else {
                    transformedFilters[key] = value;
                }
            }

            if (dateStart || dateEnd) {
                transformedFilters.date = `${dateStart ?? ''}|${dateEnd ?? ''}`;
            }

            //console.log('transformedFilters', transformedFilters);

            if(Object.keys(filterStates).length != Object.keys(transformedFilters).length) {
                setFilterStates(transformedFilters);
            }
        }
    }, [data]);

    const [filterStates, setFilterStates] = useState(() =>
        data.filters.reduce((acc, filter) => {
            const keyField = filter.type ?? filter.field;
            const optionKey = filter.type ? 'value' : 'id';

            return {
                ...acc,
                [keyField]: {
                    boolean: filter.boolean,
                    options: filter.options.reduce((optAcc, option) => ({
                        ...optAcc,
                        [option[optionKey]]: false,
                    }), {}),
                },
            };
        }, {})
    );

    const handleFilterToggle = (type, value) => {
        setFilterStates((prevState) => {
            var updatedType = type;
            var updatedValue = value;
            if(updatedType.startsWith('date')) {
                value = type;
                type = 'date';
            }
            
            const isBoolean = prevState[type]?.boolean === 'true';
            let updatedOptions = prevState[type]?.options ?? {};

            if (isBoolean) {
                // Desativar todos os filtros da mesma categoria
                updatedOptions = Object.keys(updatedOptions).reduce((options, option) => {
                    options[option] = false;
                    return options;
                }, {});
            }
        
            const updatedFilterState = {
                ...prevState,
                [type]: {
                    ...prevState[type],
                    options: {
                        ...updatedOptions,
                        [value]: type == 'date' ? updatedValue : !updatedOptions[value],
                    },
                },
            };

            //Remover a categoria se não existir nenhuma opção selecionada
            if (Object.values(updatedFilterState[type].options).every((selected) => !selected)) {
                const { [type]: deletedFilter, ...restFilters } = updatedFilterState;
                return restFilters;
            }
            
            //console.log(updatedFilterState);
            return updatedFilterState;
        });
    };

    const ShowResults = function() {
        var filters = {};
        Object.entries(filterStates).forEach(([key, value]) => {
            var options = [];
            Object.entries(value.options).forEach(([keyOption, valueOption]) => {
                if(valueOption) {
                    if(key != 'date') {
                        options.push(keyOption);
                    } else {
                        filters[keyOption] = valueOption;
                    }
                }
            });

            if(key != 'date')
                filters[key] = options.toString();
        });

        //console.log('setFiltersActive', filters);
        dispatch({ type: "setFiltersActive", filters: filters });
        CloseFilters();
    }

    const ClearFilters = function () {
        setFilterStates([]);
        setDateStart(null);
        setDateEnd(null);
        dispatch({ type: "setFiltersActive", filters: [] });
        CloseFilters();
    }

    const CloseFilters = function () {
        dispatch({ type: "toggleFilters" });
    }

    if(status == 0) return null;

    return (
        <Modal animationType="slide"
               transparent={true}
               visible={data.active}
               statusBarTranslucent
               presentationStyle="overFullScreen">

            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <SafeAreaView  style={[theme.safeAreaView, {
                                            flex: 1,
                                            backgroundColor: 'white', // aqui pode ser o teu tema
                                            borderTopLeftRadius: 16,
                                            borderTopRightRadius: 16,
                                            overflow: 'hidden',
                                            }]} edges={['right','left','bottom']}>
                        <StatusBar barStyle='light-content'/>
                        <View style={{backgroundColor: theme.colors.darktheme, paddingTop: Math.max(insets.top)}}> {/*paddingTop: Math.max(insets.top)*/}
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',height: 46}}>
                                <View style={{width: 80}}>
                                    <TouchableOpacity style={{paddingHorizontal: theme.containerPadding,height: 50,justifyContent: 'center'}} onPress={CloseFilters}>
                                        <Icon code="807" size={28} style={{color: theme.colors.white}} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[theme.subtitle, {color: theme.colors.white,fontSize: 20}]}>{params.title}</Text>

                                <View style={{width: 80}}>
                                    <View style={{marginLeft: 'auto',paddingRight: theme.containerPadding}}>
                                        <Link text="Limpar" onPress={ClearFilters}/>{/*ShowResults*/}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{flex: 1,display: 'flex',flexDirection: 'row'}}>
                            <View style={{width: 160,backgroundColor: 'white'}}>
                                <ScrollView>
                                    {
                                        data.filters.map((filter, index) => {
                                            const keyField = filter.field ?? filter.type;
                                            const options = filterStates?.[keyField]?.options ?? {};

                                            // Total de filtros ativos
                                            const activeCount = filter.type == 'date' ? (dateStart || dateEnd ? 1 : 0) : Object.values(options).filter(v => v == true).length;

                                            return (
                                                <TouchableOpacity
                                                    key={filter.field ?? filter.type}
                                                    activeOpacity={1}
                                                    onPress={() => { sFilterCatrgoryActiveIndex(index); }}
                                                    style={[stylesFilters.categoryButton, filterCatrgoryActiveIndex == index ? stylesFilters.categoryButtonActive : '']}
                                                >
                                                    <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between', alignItems: 'center'}}>
                                                        <Text style={[stylesFilters.categoryButtonText, filterCatrgoryActiveIndex == index ? stylesFilters.categoryButtonActiveText : '', {width: '75%', fontSize: 16}]}>
                                                            {filter.name}
                                                        </Text>
                                                        <Text style={[theme.paragraph, {color: theme.colors.darkgray, fontSize: 16}]}>
                                                            {activeCount > 0 ? activeCount : ''}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }

                                </ScrollView>
                            </View>
                            <View style={{flex: 1}}>
                                <ScrollView contentContainerStyle={{padding: theme.containerPadding}} style={{backgroundColor: theme.colors.background}}>
                                    <View style={{flexDirection: 'column',flexWrap: 'wrap',gap: 8}}>
                                        {data.filters[filterCatrgoryActiveIndex].options.map((option, index) => {
                                            const filter = data.filters[filterCatrgoryActiveIndex];
                                            const fieldSelected = filterStates?.[filter.field]?.options?.[option.id] === true;
                                            const typeSelected = filterStates?.[filter.type]?.options?.[option.value] === true;
                                            var isSelected = fieldSelected || typeSelected;

                                            if(data.filters[filterCatrgoryActiveIndex].type == 'date') {
                                                isSelected = false;

                                                if(index == 0) {
                                                    if(dateStart != null)
                                                        isSelected = true;
                                                } else {
                                                    if(dateEnd != null)
                                                        isSelected = true;
                                                }
                                            }
                                            
                                            return (
                                                <Chip
                                                    mode="flat"
                                                    key={option.id ?? option.value}
                                                    style={[
                                                        stylesFilters.optionButton,
                                                        {
                                                        backgroundColor: 'white',
                                                        borderColor: isSelected ? theme.colors.linklight : theme.colors.lines,
                                                        },
                                                    ]}
                                                    icon={() => {
                                                        if (isSelected)
                                                        return (
                                                            <View
                                                            style={{
                                                                width: 22,
                                                                height: 22,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: theme.colors.background,
                                                                borderRadius: 50,
                                                            }}
                                                            >
                                                            <Icon code="807" size={16} />
                                                            </View>
                                                        );
                                                        return null;
                                                    }}
                                                    textStyle={{
                                                        color: theme.colors.black,
                                                        allowFontScaling: false,
                                                        fontSize: 16,
                                                    }}
                                                    selected={isSelected}
                                                    onPress={() => {
                                                        const isDate = data.filters[filterCatrgoryActiveIndex].type === 'date';
                                                        const isStart = option.id === 'dateStart';

                                                        if (isDate) {
                                                            const dateSelected = isStart ? dateStart : dateEnd;
                                                            const currentDate = new Date();

                                                            if (Platform.OS === 'android') {
                                                                if (dateSelected) {
                                                                    // Limpar data se já estiver selecionada
                                                                    if (isStart) setDateStart(null);
                                                                    else setDateEnd(null);

                                                                    handleFilterToggle(option.id, '');
                                                                    return;
                                                                }

                                                                // Abrir o DatePicker se ainda não há data
                                                                DateTimePickerAndroid.open({
                                                                    value: currentDate,
                                                                    mode: 'date',
                                                                    is24Hour: true,
                                                                    onChange: (event, selectedDate) => {
                                                                    if (event.type === 'set' && selectedDate) {
                                                                        const newDate = new Date(selectedDate);
                                                                        const formattedDate = newDate.toISOString().split('T')[0];

                                                                        if (isStart) setDateStart(newDate);
                                                                        else setDateEnd(newDate);

                                                                        handleFilterToggle(option.id, formattedDate);
                                                                    }
                                                                    },
                                                                });

                                                                return;
                                                            }

                                                            // iOS
                                                            if (dateSelected) {
                                                                // Limpar data se há houver
                                                                if (isStart) setDateStart(null);
                                                                else setDateEnd(null);

                                                                handleFilterToggle(option.id, '');
                                                            } else {
                                                                if (isStart) setDateStart(currentDate);
                                                                else setDateEnd(currentDate);

                                                                const formattedDate = currentDate.toISOString().split('T')[0];
                                                                handleFilterToggle(option.id, formattedDate);
                                                            }

                                                            return;
                                                        }

                                                        // Outros tipos de filtro (não data)
                                                        handleFilterToggle(
                                                            data.filters[filterCatrgoryActiveIndex].field ||
                                                            data.filters[filterCatrgoryActiveIndex].type,
                                                            option.id ?? option.value
                                                        );
                                                    }}>
                                                    {(() => {
                                                        const isDate = data.filters[filterCatrgoryActiveIndex].type === 'date';
                                                        const isStart = option.id === 'dateStart';

                                                        if (isDate) {
                                                        const date = isStart ? dateStart : dateEnd;

                                                        return (
                                                            <>
                                                            {date ? date.toLocaleDateString('pt-PT') : option.name}
                                                            {Platform.OS === 'ios' && date && (
                                                                <View
                                                                style={{
                                                                    transform: [{ scale: 999 }, { translateX: 20 }],
                                                                    opacity: 0.1,
                                                                    position: 'absolute',
                                                                    zIndex: 1,
                                                                }}
                                                                >
                                                                <DateTimePicker
                                                                    value={date}
                                                                    mode="date"
                                                                    display="compact"
                                                                    locale="pt-PT"
                                                                    onChange={(event, selectedDate) => {
                                                                    if (selectedDate) {
                                                                        const newDate = new Date(selectedDate);
                                                                        const formattedDate = newDate.toISOString().split('T')[0];

                                                                        if (isStart) {
                                                                        setDateStart(newDate);
                                                                        } else {
                                                                        setDateEnd(newDate);
                                                                        }

                                                                        handleFilterToggle(option.id, formattedDate);
                                                                    }
                                                                    }}
                                                                />
                                                                </View>
                                                            )}
                                                            </>
                                                        );
                                                        }

                                                        return option.name;
                                                    })()}
                                                </Chip>

                                            )
                                        })}
                                    </View>

                                </ScrollView>
                            </View>
                        </View>
                    
                        <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 'auto',padding: theme.containerPadding,paddingBottom: Math.max(insets.bottom)}}>
                            <Button mode='contained' onPress={ShowResults}>Mostrar resultados</Button>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

const stylesFilters = StyleSheet.create({
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        minHeight: 42,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    categoryButtonActive: {
        backgroundColor: theme.colors.background,
        borderLeftColor: theme.colors.linklight
    },
    categoryButtonText: {
        ...theme.paragraph
    },
    categoryButtonActiveText: {
        
    },
    optionButton: {
        borderWidth: 1,
        borderColor: theme.colors.lines,
        width: '100%',
        minHeight: 40,
        justifyContent: 'center'
    },
    optionButtonText: {
        ...theme.paragraph
    }
});