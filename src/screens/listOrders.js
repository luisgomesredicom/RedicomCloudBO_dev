import React, {useState, useEffect, useReducer, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { remoteAPI, numberFormat } from '../core/utils';
import { LoadingFullscreen, Noresults } from '../components/elements';
import { SearchBar } from '../components/searchBar';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';

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

    function RemoteSVG(src) {
        if(src == '') return null;

        const [svgXmlData, setSvgXmlData] = useState(null);

        useEffect(() => {
            fetch(`https://www.redicom.pt/${src}`)
            .then((response) => response.text())
            .then((text) => {
                setSvgXmlData(text);
            })
            .catch((error) => {
                console.error('Erro ao carregar SVG', error);
            });
        }, []);

        if (!svgXmlData) {
            return null;
        }

        return (
            <View style={{width: 34,minHeight: 24}}>
                <SvgXml xml={svgXmlData} width="100%" />
            </View>
        );
        }

    const CardItem = ({index, item}) => {
        return (
            <>
                {index == 0 ? (
                    <View style={{paddingHorizontal: theme.containerPadding,marginTop: 28,marginBottom: 13}}><Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Encomendas</Text></View>
                ) : (
                    <View style={{height: 6,backgroundColor: theme.colors.background}}></View>
                )}
                
                <View style={[theme.cardItem, {flexDirection: 'column',flexGrow: 1,gap: 8}]}>
                    <View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 100, marginRight: 10}}>
                                <Text style={theme.small}>Cliente</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row',gap: 6,alignItems: 'center'}}>
                                <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>Marta</Text>
                                <Text style={theme.small} ellipsizeMode='tail'>Cliente novo</Text>
                                <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]}>Portugal</Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 100, marginRight: 10}}>
                                <Text style={theme.small}>No. Encomenda</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]}>PT2024MMQ81JA9</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',gap: 4}}>
                        <View style={{height: 80,flexShrink: 0,backgroundColor: 'whitesmoke'}}>
                            <Image source={{uri: 'https://picsum.photos/120/160'}} style={{resizeMode: 'contain',flex: 1,width: 60,height: 80}} />
                        </View>
                        <View style={{height: 80,flexShrink: 0,backgroundColor: 'whitesmoke'}}>
                            <Image source={{uri: 'https://picsum.photos/120/160'}} style={{resizeMode: 'contain',flex: 1,width: 60,height: 80}} />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',gap: 10, alignItems: 'center'}}>
                        {RemoteSVG('checkout/v1/images/blocopt13.svg')}
                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>89,91 <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text>
                    </View>
                </View>
            </>
        )
    }

    async function loadResults() {
        try {
            if(endList || nextPage == currentPage) return;
            currentPage = nextPage;

            if(nextPage != '') {
                setNextPageLoading(true);
            } else if(pageStatus == 1 && !refreshing) {
                setPageStatus(-1);
            }

            var requestHTTP = 'app/orders/search';

            /*var requestHTTP = `${nextPage == '' ? `catalog/products` : nextPage}`;
            if(searchValue != '') {
                requestHTTP = `catalog/products/search`;
            }*/

            var bodyHTTP = {
                trackingStatus: '80,103'
            }
            if(searchValue != '') {
                bodyHTTP.search = searchValue;
            }

            const data = await remoteAPI({
                request: requestHTTP,
                method: 'POST',//searchValue != '' ? 'POST' : 'GET',
                body: Object.keys(bodyHTTP).length > 0 ? bodyHTTP : null
            });

            const newItems = data.response.results;

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
