import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI } from '../core/utils';
import { LoadingFullscreen, Noresults, ListStatistics, FooterList, Icon, ProgressBar } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';

export function ListCampaignSMS() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [resultsLength, setResultsLength] = useState(null);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [tab, setTab] = useState(0);
    const [info, setInfo] = useState([]);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const CardItem = ({index, item, updateItem}) => {
        return (
            <>
                <View style={{height: 6,backgroundColor: theme.colors.background}}></View>

                {index == 0 && (
                    <View style={{height: theme.containerPadding}}></View>
                )}
                
                <TouchableOpacity key={item.index} onPress={() => {
                        navigation.navigate({
                            name: 'DetCampaignSMSScreen',
                            params: {
                                title: item.title,
                                item: item,
                                update: updateItem
                            }
                        })
                    }}
                >
                    <View style={[theme.cardItem, {flexDirection: 'row',alignItems: 'center'}]}>
                        <View style={{flexGrow: 1}}>
                            <View style={{marginBottom: 12}}><Text style={[theme.listNavSubtitle, {color: theme.colors.black}]}>{item.title}</Text></View>
                            <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,width: '100%'}}>
                                <View style={{flexGrow: 1,width: 1,borderRadius: 6,borderWidth: 1,borderColor: theme.colors.lightgray,backgroundColor: theme.colors.successlight,paddingVertical: 3,paddingHorizontal: 6,minHeight: 61}}>
                                    <Text numberOfLines={4} ellipsizeMode='tail' style={[theme.small, {fontSize: 10,lineHeight: 13,color: '#000'}]}>{item.message}</Text>
                                </View>
                                <View style={{width: 180,flexShrink: 0,height: '100%'}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Encomendas</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>14</Text></View>
                                    </View>

                                    <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Conversão</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>1%</Text></View>
                                    </View>

                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 80,marginRight: 10}}><Text style={[theme.small]}>Vendas</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>1 089,91 <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text></View>
                                    </View>
                                    
                                    <View style={{marginTop: 6}}>
                                        <ProgressBar percentage={80}/>
                                    </View>
                                </View>
                            </View>
                            <View style={statistics.container}>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Enviados</Text></View>
                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>10 000</Text></View>
                                    </View>
                                    <View style={statistics.columnRight}>
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>5%</Text></View>
                                        <View style={statistics.value}><Text style={statistics.valueText}>500</Text></View>
                                    </View>
                                </View>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Aberturas</Text></View>
                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>500</Text></View>
                                    </View>
                                    <View style={statistics.columnRight}>
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>10%</Text></View>
                                        <View style={statistics.value}><Text style={statistics.valueText}>50</Text></View>
                                    </View>
                                </View>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Clicks</Text></View>
                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>50</Text></View>
                                    </View>
                                    <View style={statistics.columnRight}>
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>10%</Text></View>
                                        <View style={[statistics.value, {backgroundColor: theme.colors.errorlight}]}><Text style={[statistics.valueText, {color: theme.colors.error}]}>5</Text></View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginLeft: 10,marginRight: -6}}>
                            <Icon name="right" size={22} style={{color: theme.colors.darkgray}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false

        const fetchData = async () => {
            try {
                const response = await remoteAPI({
                    request: `marketing/campaigns/sms/info`,
                    method: 'GET'
                });
                
                setInfo(response.response.info);
                loadResults();

            } catch (error) {
                loadResults();
                console.log(error);
            }
        };

        // Chame a função assíncrona fetchData para iniciar a operação fetch
        fetchData();
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

    async function loadResults() {
        try {
            if(endList || nextPage == currentPage) return;
            currentPage = nextPage;

            if(nextPage != '') {
                setNextPageLoading(true);
            } else if(pageStatus == 1 && !refreshing) {
                setPageStatus(-1);
            }

            var requestHTTP = `${nextPage == '' ? `marketing/campaigns/sms` : nextPage}`;

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
                <ListStatistics template="listCampaignSMS" value={2045} />
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
                                            ListFooterComponent={ <FooterList load={nextPageLoading} />}
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
    container: {flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 8},
    item: {flexDirection: 'row',gap: 10},
    columnRight: {width: 42},
    text1: [theme.small, {textAlign: 'right'}],
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}],
    value: {marginTop: 3,borderRadius: 2,backgroundColor: theme.colors.successlight,padding: 2,width: '100%'},
    valueText: [theme.small, {fontWeight: '500',color: theme.colors.success,textAlign: 'center'}],
    bottom: {marginTop: 5}
});
