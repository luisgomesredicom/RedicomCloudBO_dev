import React, {useState, useEffect, useReducer, useCallback} from 'react';
import { ScrollView, StatusBar, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { remoteAPI } from '../core/utils';
import { ProductItem } from '../components/productItem';
import { Badge, LoadingFullscreen, Noresults } from '../components/elements';
import { SearchBar } from '../components/searchBar';
import { theme } from '../styles/styles'
import { ActivityIndicator } from 'react-native-paper';
import { ModalFilters, ModalFiltersContext, ModalFiltersReducer, ModalFiltersState} from '../components/modalFilters'

export function ListProducts() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [resultsLength, setResultsLength] = useState(null);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false,
        searchValue = '',
        searchSubmited = false,
        filtersApplied = null;

        loadResults();
    }, []);

    const updateItem = (item) => {
        const updatedList = items.map((_item) => {
            if (_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems(updatedList);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        endList = false;
        currentPage = null;
        nextPage = '';
        loadResults();
    }, []);

    /* Search */
    const onChangeSearch = (term) => {
        endList = false;
        currentPage = null;
        nextPage = '';
        searchValue = term;

        if(searchValue.length > 0 && searchValue.length < 3) {
            searchSubmited = false;
            setPageStatus(-1);
            return;
        }

        if(searchValue.length > 2) {
            searchSubmited = true;
        } else {
            searchSubmited = false;
        }

        loadResults();
    }
    /* Search */

    /* Filters */
    const [modalFilters, modalFiltersDispatch] = useReducer(ModalFiltersReducer, ModalFiltersState);
    const [filtersLength, setFiltersLength] = useState(0);

    useEffect(() => {
        if(filtersApplied != null || (filtersApplied == null && Object.keys(modalFilters.filtersActive).length > 0)) {
            endList = false;
            currentPage = null;
            nextPage = '';

            if(Object.keys(modalFilters.filtersActive).length > 0) {
                filtersApplied = true;
            } else {
                filtersApplied = false;
            }

            loadResults();
        }
    }, [modalFilters.filtersActive]);

    async function loadFilters() {
        try {
            const data = await remoteAPI({
                request: `catalog/products/filters`,
                method: 'GET'
            });

            if(data.status && data.response) {
                modalFiltersDispatch({type: "setFilters", filters: data.response.filters || []});
            }

        } catch (e) {
            console.warn(e);
        }
    }
    /* Filters */

    async function loadResults() {
        try {
            if(endList || nextPage == currentPage) return;
            currentPage = nextPage;

            if(nextPage != '') {
                setNextPageLoading(true);
            } else if(pageStatus == 1 && !refreshing) {
                setPageStatus(-1);
            }

            var requestHTTP = `${nextPage == '' ? `catalog/products` : nextPage}`;
            if(searchValue != '' || filtersApplied) {
                requestHTTP = `catalog/products/search`;
            }

            var bodyHTTP = {}
            if(searchValue != '') {
                bodyHTTP.search = searchValue;
            }

            if(filtersApplied) {
                bodyHTTP = {
                    ...bodyHTTP,
                    ...modalFilters.filtersActive
                }
                setFiltersLength(1);
            } else {
                setFiltersLength(0);
            }

            const data = await remoteAPI({
                request: requestHTTP,
                method: searchValue != '' || filtersApplied ? 'POST' : 'GET',
                body: Object.keys(bodyHTTP).length > 0 ? bodyHTTP : null
            });

            const newItems = data.response.results;

            if(items.length == 0 && newItems.length > 0 && nextPage == '' && !filtersApplied) {
                loadFilters();
            }

            nextPage = data.response.nextPage.substring(1);
            setResultsLength(parseInt(data.response.total));
            setNextPageLoading(false);
            
            if(data.response.nextPage == '') {
                endList = true;
            }

            if(currentPage != '') {
                setItems([...items, ...newItems]);
            } else {
                setItems(newItems);
            }

            setPageStatus(1);
            setRefreshing(false);
        } catch (e) {
            console.warn(e);
        }
    }

    function FooterList({load}) {
        if(!load) return;
        return (
            <View style={{height: 80,paddingBottom: 15,justifyContent: 'center', marginBottom: Math.max(insets.bottom)}}>
                <ActivityIndicator size={32} color={theme.colors.darktheme} />
            </View>
        )
    }

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>

            <ModalFiltersContext.Provider value={[ modalFilters, modalFiltersDispatch ]}>
                <ModalFilters />
            </ModalFiltersContext.Provider>

            <View style={{flex: 1,backgroundColor: theme.colors.darktheme}}>
                <View style={{paddingHorizontal: 15,paddingVertical: 10,paddingTop: 0}}>
                    <SearchBar onChangeText={onChangeSearch}/>
                </View>

                <View style={[theme.wrapperPage]}>
                {
                    pageStatus != 0 && items.length == 0 ? (
                        <Noresults />
                    ) : (
                        <>
                        {
                            pageStatus != 0 ? (
                                <View style={[theme.wrapperContentStyle, {paddingTop: 0, paddingRight: 0}]}>
                                    {
                                    pageStatus < 0 ? (
                                        <View style={{height: 80,paddingBottom: 15,justifyContent: 'center'}}>
                                            <ActivityIndicator size={32} color={theme.colors.darktheme} />
                                        </View>
                                    ) : (
                                        <>
                                        {items.length == 0 ? (
                                            <Noresults />
                                        ) : (
                                            <FlatList
                                                data={items}
                                                keyExtractor={ item => item.id }
                                                renderItem={ ({item, index}) => <View style={{paddingRight: theme.containerPadding}}><ProductItem index={index} item={item} updateItem={updateItem} total={resultsLength} linkAction={modalFiltersDispatch}/></View> }
                                                onEndReached={loadResults}
                                                onEndReachedThreshold={ 0.15 }
                                                ListFooterComponent={ <FooterList load={nextPageLoading} /> }
                                                style={[theme.wrapperContainerList, {paddingBottom: Math.max(insets.bottom)}]}
                                                refreshControl={
                                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                                }
                                            />
                                        )}
                                        </>
                                    )}
                                </View>
                            ) : (
                                <LoadingFullscreen />
                            )
                        }
                        </>
                    )
                }
                </View>
            </View>
        </SafeAreaView>
    );
}