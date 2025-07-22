import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI, numberFormat, dateFormatter } from '../core/utils';
import { LoadingFullscreen, Noresults, ListStatistics, FooterList, Icon, ProgressBar } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator, Switch } from 'react-native-paper';
import {TabsProvider, Tabs, TabScreen, useTabNavigation, useTabIndex} from '../components/paperTabs';

export function ListCampaignEmail() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [items_active, setItems_active] = useState([]);
    const [resultsLength, setResultsLength] = useState(null);
    const [resultsLength_active, setResultsLength_active] = useState(null);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [nextPageLoading_active, setNextPageLoading_active] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing_active, setRefreshing_active] = useState(false);
    const [tab, setTab] = useState(0);
    const [info, setInfo] = useState([]);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false,
		currentPage_active = null,
		nextPage_active    = '',
		endList_active     = false

        const loadInfo = async () => {
            try {
                const response = await remoteAPI({
                    request: `marketing/campaigns/email/info`,
                    method: 'GET'
                });
                
                setInfo(response.response.info);
            } catch (error) {
                console.log(error);
            } finally {
                loadResults();
            }
        };
        
        loadInfo();
    }, []);

    useEffect(() => {
        if(refreshing) {
            loadResults(1);
        }
    }, [refreshing]);

    useEffect(() => {
        if(refreshing_active) {
            loadResults(0);
        }
    }, [refreshing_active]);

    const resetLists = () => {
        endList = false;
        currentPage = null;
        nextPage = '';
        
        endList_active = false;
        currentPage_active = null;
        nextPage_active = '';
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshing_active(true);
        resetLists();
    }, []);

    const onRefresh_active = useCallback(() => {
        setRefreshing(true);
        setRefreshing_active(true);
        resetLists();
    }, []);

    const updateItem = (item, all = true) => {
        if(all) {
            //setRefreshing(true);
            //setRefreshing_active(true);
            resetLists();
            return;
        }
        
        const updatedList = items.map((_item) => {
            if(_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems(updatedList);

        const updatedListActive = items_active.map((_item) => {
            if(_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems_active(updatedListActive);
    };

    const CardItem = ({index, item, updateItem, tab}) => {
        const { date: startDate, time: startTime } = dateFormatter(item.startDate);

        const SwitchItem = (...props) => {
            const toggleSwitch = async (...dataSwitch) => {
                dataSwitch = dataSwitch[0];
                
                const switchKey = item.options.find(opt => opt.buttonStyle == 'principal')?.option;
                
                const data = await remoteAPI({
                    request: `marketing/campaigns/email`,
                    method: 'PUT',
                    body: {
                        id: item.id,
                        option: switchKey
                    }
                });
                
                updateItem(data, false);

                if(!data || !data.response) return;

                const updatedItem = data.response;

                const updatedListActive = items_active.map((_item) =>
                    _item.id === item.id ? updatedItem : _item
                );

                setItems_active(updatedListActive);
            };

            return (
                <Switch value={item.active == 0 ? false : true} onValueChange={(status) => toggleSwitch({status: status})} color={theme.colors.success} style={{ transform: [{ scaleX: .85 }, { scaleY: .85 }] }}/>
            );
        }
        
        return (
            <>
                <View style={{height: 6,backgroundColor: theme.colors.background}}></View>

                {index == 0 && (
                    <View style={{height: theme.containerPadding,backgroundColor: theme.colors.white}}></View>
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
                        <View style={{width: 122,flexShrink: 0}}>
                            <View style={{height: 122,flexShrink: 0,backgroundColor: 'whitesmoke',marginBottom: 4}}>
                                <Image source={{uri: item.image.src}} style={{resizeMode: 'contain',flex: 1,width: 122,height: 122}} />
                            </View>

                            <View style={[statistics.container, {justifyContent: 'center'}]}>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={[statistics.text1, {textAlign: 'center'}]}>Destinatários</Text></View>
                                        <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'center'}]}>{numberFormat(item.stats.totalRecipients)}</Text></View>
                                        <View style={[statistics.value, {alignSelf: 'center',width: 'auto',minWidth: 70,paddingHorizontal: 15,backgroundColor: theme.colors.infolight}]}><Text style={[statistics.valueText, {color: theme.colors.info}]}>{item.stats.recipientsType}</Text></View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        <View style={{flexGrow: 1,width: 1}}>
                            <View style={{height: 122,justifyContent: 'space-between',paddingTop: 2,paddingBottom: 12,marginBottom: 4}}>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[theme.listNavSubtitle, {color: theme.colors.black,paddingRight: 30}]}>{item.title}</Text>
                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center',marginTop: 12}}>
                                    <View style={{width: 80, marginRight: 10}}>
                                        <Text style={theme.small}>Iniciado</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate} <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: 80, marginRight: 10}}>
                                        <Text style={theme.small}>Encomendas</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(item.stats.totalOrders)}</Text>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: 80, marginRight: 10}}>
                                        <Text style={theme.small}>Conversão</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.stats.totalConversionsPercent}%</Text>
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: 80, marginRight: 10}}>
                                        <Text style={theme.small}>Vendas</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{numberFormat(item.stats.totalOrdersValue)} <Text style={{color: theme.colors.darkgray}}>EUR</Text></Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <View style={statistics.container}>
                                    <View style={statistics.item}>
                                        <View>
                                            <View><Text style={statistics.text1}>Aberturas</Text></View>
                                            <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>{numberFormat(item.stats.totalSent)}</Text></View>
                                        </View>
                                        <View style={statistics.columnRight}>
                                            <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{item.stats.totalOpeningsPercent}%</Text></View>
                                            <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(item.stats.totalOpenings)}</Text></View>
                                        </View>
                                    </View>
                                    <View style={statistics.item}>
                                        <View>
                                            <View><Text style={statistics.text1}>Clicks</Text></View>
                                            <View style={statistics.bottom}><Text style={[statistics.text2, {textAlign: 'right'}]}>{numberFormat(item.stats.totalClicks)}</Text></View>
                                        </View>
                                        <View style={statistics.columnRight}>
                                            <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{item.stats.totalClicksPercent}%</Text></View>
                                            <View style={statistics.value}><Text style={statistics.valueText}>{numberFormat(item.stats.totalClicks)}</Text></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginTop: 6}}>
                                    <ProgressBar percentage={item.stats.totalSentPercent}/>
                                </View>
                            </View>
                        </View>
                        
                        <View style={{marginRight: -6,justifyContent: 'center'}}>
                            {tab == 0 && (
                                <View style={{position: 'absolute',top: -4,right: 22}}>
                                    <SwitchItem item={item} status={item.status}/>
                                </View>
                            )}
                            <Icon code="818" size={22} style={{color: theme.colors.darkgray}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    async function loadResults(targetTab) {
        try {
            let loadAllResults = !targetTab || targetTab == 1 ? true : false;
            let loadActiveResults = !targetTab || targetTab == 0 ? true : false;

            if(loadActiveResults) { //Active
                if(endList_active || nextPage_active == currentPage_active) return;
                currentPage_active = nextPage_active;

                if(nextPage_active != '') {
                    setNextPageLoading_active(true);
                } else if(pageStatus == 1 && !refreshing_active) {
                    setPageStatus(-1);
                }

                var requestHTTP = `${nextPage_active == '' ? `marketing/campaigns/email/active` : nextPage}`;

                const data = await remoteAPI({
                    request: requestHTTP,
                    method: 'GET'
                });

                const newItems = data.response.results;

                nextPage = data.response.nextPage.substring(1);
                setResultsLength_active(parseInt(data.response.total));
                setNextPageLoading_active(false);

                if(data.response.nextPage == '') {
                    endList_active = true;
                }

                if(currentPage_active != '') {
                    setItems_active([...items, ...newItems]);
                } else {
                    setItems_active(newItems);
                }

                setPageStatus(1);
                setRefreshing_active(false);

            }

            if(loadAllResults){ //ALL
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

            }

        } catch (e) {
            console.warn(e);
        }
    }
  
	return (
		<SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
			<StatusBar barStyle='default'/>
			<View style={[theme.wrapperPage]}>
                <ListStatistics template="listCampaignEmail" value={info.totalSentToday} datetime={info.date}/>

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
                                {
                                    items_active.length > 0 ? (
                                        <TabsProvider defaultIndex={0} onChangeIndex={(index) => {setTab(index)}}>
                                            <Tabs disableSwipe={true} style={theme.tabs} tabLabelStyle={theme.tabsLabel}>
                                                <TabScreen label="Por Enviar">
                                                    <View style={theme.tabsContent}>
                                                        <FlatList 
                                                            style={theme.cardList}
                                                            contentContainerStyle={{paddingBottom: Math.max(insets.bottom)}}
                                                            data={items_active}
                                                            keyExtractor={ item => item.id }
                                                            renderItem={ ({item, index}) => <CardItem index={index} item={item} updateItem={updateItem} tab={tab}/> }
                                                            onEndReached={() => {loadResults(0);}}
                                                            onEndReachedThreshold={ 0.15 }
                                                            ListFooterComponent={ <FooterList load={nextPageLoading_active} /> }
                                                            refreshControl={
                                                                <RefreshControl refreshing={refreshing_active} onRefresh={onRefresh_active} />
                                                            }
                                                        />
                                                    </View>
                                                </TabScreen>

                                                <TabScreen label="Histórico">
                                                    <View style={theme.tabsContent}>
                                                        {items.length > 0 ? (
                                                            <FlatList 
                                                                style={theme.cardList}
                                                                contentContainerStyle={{paddingBottom: Math.max(insets.bottom)}}
                                                                data={items}
                                                                keyExtractor={ item => item.id }
                                                                renderItem={ ({item, index}) => <CardItem index={index} item={item} updateItem={updateItem} tab={tab}/> }
                                                                onEndReached={() => {loadResults(1);}}
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
                                                </TabScreen>
                                            </Tabs>
                                        </TabsProvider>
                                    ) : (
                                        <View style={theme.tabsContent}>
                                            {items.length > 0 ? (
                                                <FlatList 
                                                    style={theme.cardList}
                                                    contentContainerStyle={{paddingBottom: Math.max(insets.bottom)}}
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
