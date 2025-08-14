import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI, dateFormatter } from '../core/utils';
import { LoadingFullscreen, Noresults, FooterList, Icon, ProgressBar, Badge } from '../components/elements';
import { theme } from '../styles/styles'
import { Text, ActivityIndicator } from 'react-native-paper';
import {TabsProvider, Tabs, TabScreen} from '../components/paperTabs';

export function ListPromo() {
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

        loadResults();
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
        var flags = [];
        const { date: startDate, time: startTime } = dateFormatter(item.startDate);
        const { date: endDate, time: endTime } = dateFormatter(item.endDate);

        if(item.flags) {
            item.flags.forEach(function(flag) {
                if(flag.title && flag.title != '') {
                    flags.push({
                        title: flag.title
                    });
                }
            });
        }

        return (
            <>
                <View style={{height: 6,backgroundColor: theme.colors.background}}></View>

                {index == 0 ? (
                    <View style={{height: 19,backgroundColor: theme.colors.white}}></View>
                ) : (
                    <View style={{height: 2,backgroundColor: theme.colors.white}}></View>
                )}
                
                <TouchableOpacity key={item.index} onPress={() => {
                        navigation.navigate({
                            name: 'DetPromoScreen',
                            params: {
                                title: item.title,
                                item: item,
                                update: updateItem
                            }
                        })
                    }}
                >
                    <View style={[theme.cardItem, {flexDirection: 'row',alignItems: 'center', marginBottom: 3}]}>
                        <View style={{flexGrow: 1,width: 1, rowGap: 10}}>
                            <View style={{marginBottom: 2}}>
                                <View style={{flexDirection: 'row',alignItems: 'flex-start',gap: 6,marginBottom: 0}}>
                                    <Text style={[theme.listNavSubtitle, {position: 'relative', color: theme.colors.black, }]}>{item.title}</Text>
                                    {item.active == 1 && (
                                        <Badge type="dot" style={{marginRight: 'auto',marginTop: 4}}/>
                                    )}
                                </View>

                                {item.description && (
                                    <Text style={[theme.small, {color: theme.colors.black, lineHeight: 12}]}>{item.description}</Text>
                                )}

                                {(item.multiLanguageContent && item.multiLanguageContent.pt.name) && (
                                    <Text style={[theme.paragraph, {lineHeight: 22}]}>{item.multiLanguageContent.pt.name}</Text>
                                )}
                            </View>
                            <View style={{flexDirection: 'row',gap: 10,justifyContent: 'space-between',alignItems: 'center'}}>
                                <View style={{gap: 3}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 70,marginRight: 10}}>
                                            <Text style={[theme.small, {lineHeight: 14}]}>Ativo de:</Text>
                                        </View>
                                        <View style={{width: 150}}>
                                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>{startDate} <Text style={{color: theme.colors.darkgray}}>{startTime}</Text></Text>
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{width: 70,marginRight: 10}}>
                                            <Text style={[theme.small, {lineHeight: 14}]}>até:</Text>
                                        </View>
                                        <View style={{width: 150}}>
                                            <Text style={[theme.small, {fontWeight: 500, color: theme.colors.black, lineHeight: 14}]} numberOfLines={1} ellipsizeMode='tail'>{endDate} <Text style={{color: theme.colors.darkgray}}>{endTime}</Text></Text>
                                        </View>
                                    </View>
                                </View>
                                {flags.length > 0 ? (
                                    <View style={{flexDirection: 'row',gap: 6}}>
                                        {flags.map((flag, index) => (
                                            <Badge text={flag.title} style={{ marginLeft: 'auto', paddingHorizontal: 6 }} key={index} />
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        </View>
                        <View style={{marginLeft: 18,marginRight: -6}}>
                            <Icon code="818" size={24} style={{color: theme.colors.black}}/>
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

                var requestHTTP = `${nextPage_active == '' ? `marketing/promotions/active` : nextPage}`;

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

                var requestHTTP = `${nextPage == '' ? `marketing/promotions` : nextPage}`;

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
                                                <TabScreen label="Ativas">
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

                                                <TabScreen label="Todas">
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
