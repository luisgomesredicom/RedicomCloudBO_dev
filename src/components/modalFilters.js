import React, {useState, createContext, useContext, useEffect} from 'react';
import { View, ScrollView, Pressable, TouchableOpacity, Modal, TouchableHighlight, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
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

    useEffect(() => {
        setFilterStates([]);
        dispatch({ type: "setFiltersActive", filters: [] });
    }, []);

    useEffect(() => {
        if(data.filters.length > 0) {
            setStatus(1);
            if(Object.keys(filterStates).length != Object.keys(data.filtersActive).length) {
                setFilterStates(data.filtersActive);
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
                        [value]: !updatedOptions[value],
                    },
                },
            };

            //Remover a categoria se não existir nenhuma opção selecionada
            if (Object.values(updatedFilterState[type].options).every((selected) => !selected)) {
                const { [type]: deletedFilter, ...restFilters } = updatedFilterState;
                return restFilters;
            }
            
            return updatedFilterState;
        });
    };

    const ShowResults = function() {
        var filters = {};
        Object.entries(filterStates).forEach(([key, value]) => {
            var options = [];
            Object.entries(value.options).forEach(([keyOption, valueOption]) => {
                if(valueOption) options.push(keyOption);
            });

            filters[key] = options.toString();
        });
        
        dispatch({ type: "setFiltersActive", filters: filters });
        CloseFilters();
    }

    const ClearFilters = function () {
        setFilterStates([]);
        dispatch({ type: "setFiltersActive", filters: [] });
        CloseFilters();
    }

    const CloseFilters = function () {
        dispatch({ type: "toggleFilters" });
    }

    if(status == 0) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={data.active}>
            <SafeAreaView style={theme.safeAreaView} edges={['right','left','bottom']}>
                <StatusBar barStyle='light-content'/>
                <View style={{backgroundColor: theme.colors.darktheme,paddingTop: Math.max(insets.top)}}>
                    <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',height: 52}}>
                        <View style={{width: 80}}>
                            <TouchableOpacity style={{paddingHorizontal: theme.containerPadding,height: 50,justifyContent: 'center'}} onPress={CloseFilters}>
                                <Icon code="807" size={28} style={{color: theme.colors.white}} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[theme.subtitle, {color: theme.colors.white,fontSize: 18}]}>{params.title}</Text>

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
                                data.filters.map((filter, index) => (
                                    <TouchableOpacity
                                        key={filter.field ?? filter.type}
                                        activeOpacity={1}
                                        onPress={() => { sFilterCatrgoryActiveIndex(index); }}
                                        style={[stylesFilters.categoryButton, filterCatrgoryActiveIndex == index ? stylesFilters.categoryButtonActive : '']}>
                                        <Text style={[stylesFilters.categoryButtonText, filterCatrgoryActiveIndex == index ? stylesFilters.categoryButtonActiveText : '']}>{filter.name}</Text>
                                    </TouchableOpacity>
                                ))
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
                                        const name = option;
                                        option = {
                                            id: index,
                                            name: name
                                        }

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
                                        <Chip mode='flat'
                                            key={option.id ?? option.value}
                                            style={[
                                                stylesFilters.optionButton, {
                                                    backgroundColor: 'white',
                                                    borderColor: isSelected ? theme.colors.linklight : theme.colors.lines
                                                },
                                            ]}
                                            icon={() => {
                                                if(isSelected)
                                                    return (
                                                        <View style={{width: 22,height: 22,alignItems: 'center',justifyContent: 'center',backgroundColor: theme.colors.background,borderRadius: 50}}>
                                                            <Icon code="807" size={14} />
                                                        </View>
                                                    )
                                                else
                                                    return null;
                                            }}
                                            textStyle={[
                                                stylesFilters.optionButtonText,
                                                {
                                                    color: theme.colors.black,
                                                    allowFontScaling: false,
                                                },
                                            ]}                                              
                                            selected={isSelected}
                                            onPress={() => {
                                                if(data.filters[filterCatrgoryActiveIndex].type == 'date') {
                                                    
                                                    if(option.id == 0) {
                                                        if(dateStart == null)
                                                            setDateStart(new Date());
                                                        else
                                                            setDateStart(null);
                                                    } else {
                                                        if(dateEnd == null)
                                                            setDateEnd(new Date());
                                                        else
                                                            setDateEnd(null);
                                                    }

                                                    return;
                                                }
                                                
                                                handleFilterToggle(data.filters[filterCatrgoryActiveIndex].field || data.filters[filterCatrgoryActiveIndex].type, option.id ?? option.value);
                                            }}>
                                            {(() => {
                                                if(data.filters[filterCatrgoryActiveIndex].type == 'date') {
                                                    const date = option.id == 0 ? dateStart : dateEnd;
                                                    if(date != null) {
                                                        return (
                                                            <View style={{height: 22,alignItems: center,justifyContent: 'center'}}>
                                                                <Text>{date.toLocaleDateString('pt-PT')}</Text>
                                                                <View style={{ transform: [{ scale: 999 },{translateX: 20}],opacity: 0.1,position: 'absolute',zIndex: 1}}>
                                                                    <DateTimePicker
                                                                        value={date}
                                                                        mode="date"
                                                                        display='compact'
                                                                        locale="pt-PT"
                                                                        onChange={(event, selectedDate) => {
                                                                            var field = '';
                                                                            
                                                                            const adjustedDate = new Date(selectedDate);
                                                                            if(option.id === 0) {
                                                                                adjustedDate.setHours(0, 0, 0);
                                                                            } else {
                                                                                adjustedDate.setHours(23, 59, 59);
                                                                            }

                                                                            const formattedDate = adjustedDate.toISOString().replace('T', ' ').substring(0, 19);

                                                                            
                                                                            if(option.id == 0) {
                                                                                field = 'dateStart';
                                                                                setDateStart(selectedDate);
                                                                            } else {
                                                                                field = 'dateEnd';
                                                                                setDateEnd(selectedDate);
                                                                            }

                                                                            handleFilterToggle(field, formattedDate);
                                                                        }}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )
                                                    }
                                                }
                                                return (
                                                    option.name
                                                )
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
        </Modal>
    )
}

const stylesFilters = StyleSheet.create({
    categoryButton: {
        padding: 12,
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
        minHeight: 36,
        justifyContent: 'center'
    },
    optionButtonText: {
        ...theme.paragraph
    }
});