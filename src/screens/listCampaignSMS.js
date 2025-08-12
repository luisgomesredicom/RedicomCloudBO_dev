import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI, dateFormatter } from '../core/utils';
import { LoadingFullscreen, Noresults, ListStatistics, FooterList, Icon, ProgressBar, Badge } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator, Switch } from 'react-native-paper';
import {TabsProvider, Tabs, TabScreen} from '../components/paperTabs';

export function ListCampaignSMS() {
    /* 0 => Iní­cio da página | -1 => Pedido á  API | 1 => Tudo carregado */
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
                    request: `marketing/campaigns/sms/info`,
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
        }

        const updatedList = items.map((_item) => {
            if (_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems(updatedList);

        const updatedListActive = items_active.map((_item) => {
            if (_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems_active(updatedListActive);
    };

    const CardItem = ({index, item, updateItem}) => {
        const { date: startDate, time: startTime } = dateFormatter(item.startDate);
        const { date: finishedDate, time: finishedTime } = dateFormatter(item.finished);
        const sendStatus = [
            {status: 0, icon: '001', color: 'warning'}, //Agendado
            {status: 1, icon: '003', color: 'success'}, //A Enviar
            {status: 3, icon: '005', color: 'gray'}, //Parada
            {status: 5, icon: '005', color: 'gray'}, //Em preparaÃ§Ã£o
            {status: 9, icon: '004', color: 'success'}, //Finalizada
            {status: 10, icon: '002', color: 'gray'} //Cancelada
        ];
        const currentSendStatus = sendStatus.find(s => s.status == item.status);

        const SwitchItem = (...props) => {
            const toggleSwitch = async (...dataSwitch) => {
                dataSwitch = dataSwitch[0];
                
                const switchKey = item.options.find(opt => opt.buttonStyle == 'principal')?.option;
                
                const data = await remoteAPI({
                    request: `marketing/campaigns/sms`,
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
                    <View style={{height: theme.containerPadding,marginTop: 6,backgroundColor: theme.colors.white}}></View>
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
                        <View style={{flexGrow: 1,width: 1}}>
                            <View style={{marginBottom: 14}}><Text style={[theme.listNavSubtitle, {color: theme.colors.black, fontWeight: 700, textTransform: 'capitalize'}]}>{item.title}</Text></View>
                            <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,width: '100%'}}>
                                <View style={{flexGrow: 1,width: '45%',borderRadius: 6,borderWidth: 1,borderColor: theme.colors.lightgray,backgroundColor: theme.colors.successlight,paddingVertical: 6,paddingHorizontal: 6,minHeight: 72}}>
                                    <Text numberOfLines={4} ellipsizeMode='tail' style={[theme.small, {fontSize: 10,lineHeight: 13,color: '#000'}]}>{item.message}</Text>
                                </View>
                                <View style={{width: '50%',flexShrink: 0,height: '100%'}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center', marginTop: 4}}>
                                        <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Estado</Text></View>
                                        <View style={{flex: 1,flexDirection: 'row',alignItems: 'center'}}>
                                            <Icon code={currentSendStatus.icon} size={15} style={{color: theme.colors[currentSendStatus.color],marginRight: 4}}/>
                                            <Text style={[theme.small, {fontWeight: 500,color: theme.colors[currentSendStatus.color]}]} numberOfLines={1} ellipsizeMode='tail'>{item.flags[0].title}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row',alignItems: 'center', marginTop: 1}}>
                                        <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Iniciado</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{startDate}  <Text>{startTime}</Text></Text></View>
                                    </View>

                                    <View style={{flexDirection: 'row',alignItems: 'center', marginTop: 1}}>
                                        <View style={{width: 62,marginRight: 10}}><Text style={[theme.small]}>Finalizado</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{finishedDate}  <Text>{finishedTime}</Text></Text></View>
                                    </View>
                                    
                                    <View style={{marginTop: 8}}>
                                        <ProgressBar percentage={item.stats.totalSentPercent}/>
                                    </View>
                                </View>
                            </View>
                            <View style={statistics.container}>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Destinatários</Text></View>
                                        <Badge text={item.stats.totalRecipients} style={{backgroundColor: theme.colors.white,color: theme.colors.black,marginTop: 3,marginLeft: 'auto',paddingHorizontal: 0}}></Badge>
                                    </View>
                                </View>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>Enviados</Text></View>
                                    </View>
                                    <View style={statistics.columnRight}>
                                        <View><Text style={[statistics.text2, {textAlign: 'center'}]}>{item.stats.totalSentPercent}%</Text></View>
                                        <Badge text={item.stats.totalSent} style={{backgroundColor: theme.colors.successlight,color: theme.colors.success,marginTop: 3,width: '100%'}}></Badge>
                                    </View>
                                </View>
                                <View style={statistics.item}>
                                    <View>
                                        <View><Text style={statistics.text1}>SMS Gastas</Text></View>
                                        <View style={[statistics.columnRight, {marginLeft: 'auto'}]}>
                                            <Badge text={item.stats.totalSpent} style={{backgroundColor: theme.colors.errorlight,color: theme.colors.error,marginTop: 3,width: '100%'}}></Badge>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginLeft: 10,marginRight: -6}}>
                            <Icon code="818" size={24} style={{color: theme.colors.dark}}/>
                        </View>

                        {tab == 0 && (
                            <View style={{position: 'absolute',top: 10,right: 37}}>
                                <SwitchItem item={item} status={item.status}/>
                            </View>
                        )}
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

                var requestHTTP = `${nextPage_active == '' ? `marketing/campaigns/sms/active` : nextPage}`;

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

            }

        } catch (e) {
            console.warn(e);
        }
    }
  
    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
                <ListStatistics template="listCampaignSMS" value={info.totalSentToday} datetime={info.date}/>

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
    container: {flexDirection: 'row',gap: 10,justifyContent: 'space-between',marginTop: 10},
    item: {flexDirection: 'row',gap: 10},
    columnRight: {width: 42},
    text1: [theme.small, {textAlign: 'right'}],
    text2: [theme.small, {fontWeight: '500',color: theme.colors.black}]
});
