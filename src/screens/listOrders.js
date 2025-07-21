import React, {useState, useEffect, useReducer, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { remoteAPI, numberFormat, dateFormatter } from '../core/utils';
import { Badge, CountryFlag, LoadingFullscreen, Noresults } from '../components/elements';
import { SearchBar } from '../components/searchBar';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';
import { Icon } from '../components/elements';
import { Link } from '../components/buttons';
import { ModalFilters, ModalFiltersContext, ModalFiltersReducer, ModalFiltersState} from '../components/modalFilters'

export function ListOrders() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false,
        searchValue = '',
        searchSubmited = false,

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

        const paymentImage = `https://www.redicom.pt/checkout${src.split("/checkout")[1]}`;

        return (
            <View style={{width: 34,minHeight: 24}}>
                {/*<SvgXml xml={svgXmlData} width="100%" />*/}
                <Image source={{uri: paymentImage}} style={{resizeMode: 'contain',flex: 1,width: 34,height: 24}} />
            </View>
        );
    }

    function getShippingImage(src) {
        //if(src == '') return null;

        const paymentImage = `https://www.redicom.pt/checkout/v1/images/shipping_type_7.jpg`;

        return (
            <View style={{width: 34,minHeight: 24}}>
                {/*<SvgXml xml={svgXmlData} width="100%" />*/}
                <Image source={{uri: paymentImage}} style={{resizeMode: 'contain',flex: 1,width: 34,height: 24}} />
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
                {index == 0 ? (
                    <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',gap: 10,marginTop: 28,marginBottom: 28,paddingHorizontal: theme.containerPadding}}>
                        <View><Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Encomendas</Text></View>
                        <View><Link text="Filtrar" onPress={() => modalFiltersDispatch({ type: "toggleFilters" })}/></View>
                    </View>
                ) : (
                    <View style={{height: 6,backgroundColor: theme.colors.background}}></View>
                )}
                
                <View style={[theme.cardItem, {flexDirection: 'column',flexGrow: 1,gap: 8}]}>
                    <View style={{gap: 2}}>
                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'}}>
                            <Text style={theme.small}>No. Enc. <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]}>{item.orderRef}</Text></Text>
                            <View style={{flexDirection: 'row',alignItems: 'center',marginLeft: 'auto',gap: 10}}>
                                {/*<Icon code="808" size={18} style={{color: theme.colors.success}}/>*/}
                                <Text style={theme.small} ellipsizeMode='tail'>{item.customerSince}</Text>
                                <CountryFlag code="pt" size={20} />
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'}}>
                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.customerName}</Text>
                            <View>
                                <Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate}  <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',gap: 4}}>
                        {item.products.map((product, index) => (
                            <ProductImage key={index} uri={product.image} />
                        ))}
                    </View>

                    <View style={{flexDirection: 'row',gap: 10,alignItems: 'center',justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row',gap: 10,alignItems: 'center'}}>
                            {getPaymentImage(item.paymentImage)}
                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.totalAmount} <Text style={{color: theme.colors.darkgray}}>{item.currency}</Text></Text>
                        </View>
                        
                        <Text style={theme.small}>Qnt. <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]}>2</Text></Text>
                        
                        {getShippingImage()}

                        <Badge type="tag" text="Em Pagamento" style={theme.stats_4}/>
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

            /*if(Object.keys(modalFilters.filtersActive).length > 0) {
                filtersApplied = true;
            } else {
                filtersApplied = false;
            }*/

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

            var requestHTTP = `${nextPage == '' ? `orders/search` : nextPage}`;
            if(searchValue != '' || filtersApplied) {
                requestHTTP = `catalog/products/search`;
            }
            
            var bodyHTTP = {
                trackingStatus: '80,103'
            }
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

            //console.log(bodyHTTP)

            const data = await remoteAPI({
                request: requestHTTP,
                method: 'POST',
                body: Object.keys(bodyHTTP).length > 0 ? bodyHTTP : null
            });

            const newItems = data.response.results;

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

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>

            <ModalFiltersContext.Provider value={[ modalFilters, modalFiltersDispatch ]}>
                <ModalFilters title="Filtrar Encomendas" />
            </ModalFiltersContext.Provider>

            <View style={{flex: 1,backgroundColor: theme.colors.darktheme}}>
                <View style={{paddingHorizontal: 15,paddingVertical: 10}}>
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
                                <>
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
                                                style={theme.cardList}
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
                                        </>
                                    )}
                                </>
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

const statistics = StyleSheet.create({
    container: {flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 4},
    item: {flexDirection: 'row',gap: 10},
    columnRight: {width: 42},
    text1: [theme.small, {textAlign: 'right'}],
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}],
    value: {marginTop: 3,borderRadius: 2,backgroundColor: theme.colors.successlight,padding: 2,width: '100%'},
    valueText: [theme.small, {fontWeight: '500',color: theme.colors.success,textAlign: 'center'}],
    bottom: {marginTop: 5}
});
