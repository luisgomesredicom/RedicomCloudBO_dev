import React, {useState, useEffect, useReducer, useCallback} from 'react';
import { ScrollView, StatusBar, View, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { remoteAPI, numberFormat, dateFormatter } from '../core/utils';
import { Badge, CountryFlag, LoadingFullscreen, Noresults, Icon } from '../components/elements';
import { SearchBar } from '../components/searchBar';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';
import { Link } from '../components/buttons';
import { ModalFilters, ModalFiltersContext, ModalFiltersReducer, ModalFiltersState} from '../components/modalFilters'

export function ListOrders() {
    /* 0 => Iní­cio da página | -1 => Pedido á  API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const [trackingStatusActive, setTrackingStatus] = useState(false);

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

    function getPaymentImage(src) {
        if(src == '') return null;

        const image = `https://www.redicom.pt/checkout${src.split("/checkout")[1]}`;

        return (
            <View style={{width: 22,minHeight: 22}}>
                {/*<SvgXml xml={svgXmlData} width="100%" />*/}
                <Image source={{uri: image}} style={{resizeMode: 'contain',flex: 1,width: 22,height: 22}} />
            </View>
        );
    }

    function getShippingImage(src) {
        //if(src == '') return null;

        const image = `https://www.redicom.pt/checkout${src.split("/checkout")[1]}`;

        return (
            <View style={{width: 22,minHeight: 22}}>
                {/*<SvgXml xml={svgXmlData} width="100%" />*/}
                <Image source={{uri: image}} style={{resizeMode: 'contain',flex: 1,width: 22,height: 22}} />
            </View>
        );
    }

    function ProductImage({uri}) {
        const [aspectRatio, setAspectRatio] = useState(1);

        useEffect(() => {
            if (uri) {
                Image.getSize(
                    uri,
                    (width, height) => {
                        setAspectRatio(width / height);
                    },
                    (error) => {
                        console.warn("Erro ao carregar imagem:", error);
                    }
                );
            }
        }, [uri]);

        // Calcula 1/6 da largura do ecrã
        const screenWidth = Dimensions.get('window').width;
        const imageWidth = (screenWidth - (theme.containerPadding * 2) - 20) / 6;

        return (
            <>
                <View style={{ backgroundColor: 'whitesmoke', alignItems: 'center' }}>
                    <Image
                        source={{ uri }}
                        style={{
                            width: imageWidth,
                            aspectRatio,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
            </>
        );
    }

    const CardItem = ({index, item}) => {
        const { date: startDate, time: startTime } = dateFormatter(item.date);

        return (
            <>
                {index > 0 ? (() => {
                    <View style={{height: 0,backgroundColor: theme.colors.background}}></View>
                })() : (
                    <View style={statistics.separator} />
                )}
                
                <View style={[theme.cardItem, {flexDirection: 'column',flexGrow: 1,gap: 8}]}>
                    <View style={{gap: 2}}>
                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginBottom: 4}}>
                            <Text style={[theme.listNavSubtitle, {color: theme.colors.black, fontWeight: 700}]}>{item.orderRef}</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center',marginLeft: 'auto',gap: 10}}>
                                <CountryFlag code={item.countryCode} size={22} />
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',marginTop: 2, marginBottom: 2}}>
                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.customerName}</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center',gap: 10}}>
                                {item.customerSince == 'SEM_REGISTO' ? (
                                    <>
                                        <Text style={theme.small} ellipsizeMode='tail'>Sem registo</Text>
                                        <Icon code="901" size={20} style={{color: theme.colors.error}}/>
                                    </>
                                ) : item.customerSince == 'NOVO' ? (
                                    <>
                                        <Text style={theme.small} ellipsizeMode='tail'>Cliente novo</Text>
                                        <Icon code="900" size={18} style={{color: theme.colors.success}}/>
                                    </>
                                ) : (
                                    <Text style={theme.small} ellipsizeMode='tail'>{item.customerSince}</Text>
                                )}

                                {/*<Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate}  <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text>*/}
                            </View>
                        </View>
                    </View>
                    
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        <View style={{flexDirection: 'row',gap: 4}}>
                            {item.products.map((product, index) => (
                                <ProductImage key={index} uri={product.image} />
                            ))}
                        </View>
                    </ScrollView>

                    <View style={{flexDirection: 'row',gap: 10,alignItems: 'center',justifyContent: 'space-between', marginTop: 2}}>
                        <View style={{flexDirection: 'row',gap: 10,alignItems: 'center'}}>
                            {getPaymentImage(item.paymentImage)}
                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.totalAmount} <Text style={{color: theme.colors.darkgray}}>{item.currency}</Text></Text>
                        </View>
                        
                        <Text style={theme.small}>Qnt. <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]}>{item.qtd}</Text></Text>
                        
                        <View style={{flexDirection: 'row',gap: 4,alignItems: 'center'}}>
                            {trackingStatusActive == false && item.status.map((value, index) => {
                                return (
                                    <Badge text={value.name} style={{backgroundColor: value.color,color: theme.colors.white}}/>
                                )
                            })}

                            {getShippingImage(item.shippingImage)}
                        </View>
                    </View>
                </View>
            </>
        )        
    }

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
                request: `orders/filters`,
                method: 'GET'
            });

            if(data.status && data.response) {
                //console.log('filters');
                //console.log(JSON.stringify(data.response.filters));

                modalFiltersDispatch({type: "setFilters", filters: data.response.filters || []});
            }

        } catch (e) {
            console.warn(e);
        }
    }

    function getActiveFiltersCount() {
        var total = 0;

        Object.entries(modalFilters.filtersActive).forEach(([key, value]) => {
            if(key.startsWith("dateStart") || key.startsWith("dateEnd")) {
                if(value) total += 1;
            } else {
                if(typeof value == "string" && value != "") {
                    total += value.split(",").length;
                }
            }
        });

        return total;
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

            var requestHTTP = `${nextPage == '' ? `orders/search` : nextPage}`;
            var bodyHTTP = {
                search: searchValue
            }

            if(filtersApplied) {
                bodyHTTP = {
                    ...bodyHTTP,
                    ...modalFilters.filtersActive
                }
            }

            console.log(JSON.stringify(bodyHTTP))

            if(bodyHTTP.trackingStatus)
                setTrackingStatus(true);
            else
                setTrackingStatus(false);

            const data = await remoteAPI({
                request: requestHTTP,
                method: 'POST',
                body: Object.keys(bodyHTTP).length > 0 ? bodyHTTP : null
            });

            const newItems = data.response.results;
            //console.log(JSON.stringify(newItems));

            if(items.length == 0 && newItems.length > 0 && nextPage == '' && !filtersApplied) {
                loadFilters();
            }

            nextPage = data.response.nextPage.substring(1);
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

    const HeaderList = ({ style, totalFilters, modalFiltersDispatch }) => (
        <View 
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',                    
                    paddingHorizontal: theme.containerPadding,
                    paddingTop: 0
                },
                style
            ]}
        >
            <View>
                <Text style={[theme.listNavSubtitle, {color: theme.colors.darkgray, fontWeight: 700, fontSize: 16}]}>
                    Encomendas
                </Text>
            </View>
            <View>
                <Link 
                    text={totalFilters > 0 ? `Filtrar (${totalFilters})` : 'Filtrar'} 
                    onPress={() => modalFiltersDispatch({ type: "toggleFilters" })} 
                    />
            </View>
        </View>
    );
    
    const totalFilters = getActiveFiltersCount();

    const isEmpty = items.length === 0;
    const isLoading = pageStatus < 0;
    const hasStarted = pageStatus !== 0;

    return ( 
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>

            <ModalFiltersContext.Provider value={[ modalFilters, modalFiltersDispatch ]}>
                <ModalFilters title="Filtrar Encomendas" />
            </ModalFiltersContext.Provider>

            <View style={{flex: 1,backgroundColor: theme.colors.darktheme}}>
                <View style={{paddingHorizontal: 15,paddingVertical: 10,flexDirection: 'row',alignItems: 'center',gap: 8}}>
                    <View style={{flexGrow: 1}}>
                        <SearchBar onChangeText={onChangeSearch}></SearchBar>
                    </View>
                    <TouchableOpacity onPress={() => modalFiltersDispatch({ type: "toggleFilters" })} style={{width: 36,height: 36,alignItems: 'center',justifyContent: 'center',borderRadius: 7}}>
                        <Icon code='80f' size={28} color={theme.colors.white} />
                        {totalFilters > 0 && (
                            <View style={{width: 5,height: 5,backgroundColor: theme.colors.white,position: 'absolute',top: 3,right: 3,zIndex: 1,borderRadius: 10}}></View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[theme.wrapperPage]}>
                    {!hasStarted && <LoadingFullscreen />}

                    {hasStarted && (
                        <>
                            {isEmpty && !isLoading && (
                                <>
                                    {/*<HeaderList style={{ marginTop: 33 }} totalFilters={totalFilters} modalFiltersDispatch={modalFiltersDispatch} />*/}
                                    <Noresults />
                                </>
                            )}

                            {!isEmpty && !isLoading && (
                                <FlatList 
                                    /*ListHeaderComponent={
                                        <HeaderList
                                            style={{ gap: 10, marginBottom: 15, marginTop: 10 }}
                                            totalFilters={totalFilters}
                                            modalFiltersDispatch={modalFiltersDispatch}
                                        />
                                    }*/
                                    style={[theme.cardList, theme.wrapperContainerList]}
                                    contentContainerStyle={{paddingBottom: Math.max(insets.bottom)}}
                                    data={items}
                                    keyExtractor={ item => item.id }
                                    renderItem={ ({item, index}) => <CardItem index={index} item={item}/> }
                                    onEndReached={loadResults}
                                    onEndReachedThreshold={ 0.15 }
                                    ListFooterComponent={ <FooterList load={nextPageLoading} /> }
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                />
                            )}

                            {isLoading && (
                                <View style={{height: 80,paddingBottom: 15,justifyContent: 'center'}}>
                                    <ActivityIndicator size={32} color={theme.colors.darktheme} />
                                </View>
                            )}
                        </>
                    )}                
                </View>
            </View>
        </SafeAreaView>
    );
}

const statistics = StyleSheet.create({
    container: {flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 4},
    item: {flexDirection: 'row',gap: 10},
    columnRight: {width: 42},
    text1: [theme.small, {textAlign: 'right'}],
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}],
    value: {marginTop: 3,borderRadius: 2,backgroundColor: theme.colors.successlight,padding: 2,width: '100%'},
    valueText: [theme.small, {fontWeight: '500',color: theme.colors.success,textAlign: 'center'}],
    bottom: {marginTop: 5},
    separator: {marginBottom: -15}
});
