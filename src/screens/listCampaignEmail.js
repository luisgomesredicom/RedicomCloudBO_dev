import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI, numberFormat } from '../core/utils';
import { LoadingFullscreen, Noresults, ListStatistics, FooterList, Icon, ProgressBar } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';

export function ListCampaignEmail() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [resultsLength, setResultsLength] = useState(null);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [tab, setTab] = useState(0);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false

        loadResults();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        endList = false;
        currentPage = null;
        nextPage = '';
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

    const CardItem = ({index, item, updateItem}) => {
        return (
            <>
                <View style={{height: 6,backgroundColor: theme.colors.background}}></View>

                {index == 0 && (
                    <View style={{height: theme.containerPadding}}></View>
                )}
                
                <TouchableOpacity key={item.index} onPress={() => {
                        navigation.navigate({
                            name: 'DetCampaignEmailScreen',
                            params: {
                                title: item.title,
                                item: item,
                                update: updateItem
                            }
                        })
                    }}
                >
                    <View style={[theme.cardItem, {flexDirection: 'row',alignItems: 'stretch',flexGrow: 1,gap: 10}]}>
                        <View style={{width: 122,height: 122,flexShrink: 0}}>
                            <Image source={{uri: 'https://fakeimg.pl/220x220/'}} style={{resizeMode: 'cover',flex: 1,width: 122,height: 122}} />
                        </View>
                        <View style={{flexGrow: 1,paddingTop: 2}}>
                            <View style={{marginBottom: 6}}><Text style={[theme.listNavSubtitle, {color: theme.colors.black}]}>{item.title}</Text></View>
                            <View style={{flexDirection: 'row',gap: 10,maxWidth: '100%'}}>
                                <View style={{flexGrow: 1}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Encomendas</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(item.stats.totalOrders)}</Text></View>
                                    </View>

                                    <View style={{flexGrow: 1,flexDirection: 'row'}}>
                                        <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Conversão</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.stats.totalOrdersPercentage}%</Text></View>
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
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{item.stats.totalOpeningsPercentage}%</Text></View>
                                        <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(item.stats.totalOpenings)}</Text></View>
                                    </View>
                                </View>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Clicks</Text></View>
                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>(0 - falta)</Text></View>
                                    </View>
                                    <View style={statistics.columnRight}>
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{item.stats.totalClicksPercentage}%</Text></View>
                                        <View style={[statistics.value, {backgroundColor: theme.colors.errorlight}]}><Text style={[statistics.valueText, {color: theme.colors.error}]}>{numberFormat(item.stats.totalClicks)}</Text></View>
                                    </View>
                                </View>
                            </View>
                            <View style={{marginTop: 6}}>
                                <ProgressBar percentage={item.stats.totalSentPercentage}/>
                            </View>
                        </View>
                        <View style={{marginRight: -6,justifyContent: 'center'}}>
                            <Icon name="right" size={22} style={{color: theme.colors.darkgray}}/>
                        </View>
                    </View>
                </TouchableOpacity>
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

            var requestHTTP = `${nextPage == '' ? `marketing/campaigns/email` : nextPage}`;

            const data = await remoteAPI({
                request: requestHTTP,
                method: 'GET'
            });

            const newItems = data.response.results;

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
  
	return (
		<SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
			<StatusBar barStyle='default'/>
			<View style={[theme.wrapperPage]}>
                <ListStatistics template="listCampaignEmail" value={2425}/>

                {
                    pageStatus != 0 ? (
                        <>
                        {
                            pageStatus < 0 ? (
                                <View style={{height: 80,paddingBottom: 15,justifyContent: 'center'}}>
                                    <ActivityIndicator size={32} color={theme.colors.darktheme} />
                                </View>
                            ) : (
                                <View style={theme.tabsContent}>
                                    {items.length > 0 ? (
                                        <FlatList 
                                            style={[theme.cardList, {paddingBottom: Math.max(insets.bottom)}]}
                                            data={items}
                                            keyExtractor={ item => item.id }
                                            renderItem={ ({item, index}) => <CardItem index={index} item={item} updateItem={updateItem} tab={tab}/> }
                                            onEndReached={loadResults}
                                            onEndReachedThreshold={ 0.15 }
                                            ListFooterComponent={ <FooterList load={nextPageLoading} /> }
                                            refreshControl={
                                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                            }
                                        />
                                    ) : (
                                    <Noresults/>
                                    )}
                                </View>   
                            )
                        }
                        </>
                    ) : <LoadingFullscreen />
                }
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
