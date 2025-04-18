import React, {useState, useEffect} from 'react';
import { StatusBar, View, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { remoteAPI } from '../core/utils';
import { CardItem } from '../components/cards';
import { LoadingFullscreen, Noresults } from '../components/elements';
import { theme } from '../styles/styles'
import { ActivityIndicator, Text } from 'react-native-paper';
import Button from '../components/buttons';
import { Octicons } from '@expo/vector-icons';
import {TabsProvider, Tabs, TabScreen, useTabNavigation, useTabIndex} from '../components/paperTabs';

export function ListPromo() {
    /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
    const [pageStatus, setPageStatus] = useState(0);
    const [items, setItems] = useState([]);
    const [resultsLength, setResultsLength] = useState(null);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const [items_active, setItems_active] = useState([]);
    const [resultsLength_active, setResultsLength_active] = useState(null);
    const [nextPageLoading_active, setNextPageLoading_active] = useState(false);
    const insets = useSafeAreaInsets();

    function ChangeTab({...props}) {
        const goTo = useTabNavigation();
        return (
            <Button style={theme.noResultsButton} onPress={() => goTo(props.index)}>Ver todas</Button>
        );
    }

    const updateItem = (item) => {
        const updatedList = items.map((_item) => {
            if (_item.id === item.id) {
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems(updatedList);
    };

    const updateItem_active = (item) => {
        const updatedList = items_active.map((_item) => {
            if (_item.id === item.id) {
                console.log(item.endDate);
                return { ..._item, ...item };
            }
            return _item;
        });

        setItems_active(updatedList);
    };

    useEffect(() => {
        currentPage = null,
        nextPage    = '',
        endList     = false,
        currentPage_active = null,
        nextPage_active    = '',
        endList_active     = false

        loadResults();
    }, []);

    async function loadResults(targetTab) {
        try {
            let loadAllResults = !targetTab || targetTab == 1 ? true : false;
            let loadActiveResults = !targetTab || targetTab == 0 ? true : false;

            if(loadActiveResults) { //Active
                if(endList_active || nextPage_active == currentPage_active) return;
                currentPage_active = nextPage_active;

                if(nextPage_active != '') {
                    setNextPageLoading_active(true);
                } else if(pageStatus == 1) {
                    setPageStatus(-1);
                }
        
                var requestHTTP = `${nextPage == '' ? `marketing/promotions/active` : nextPage}`;

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
            }
      
            if(loadAllResults) { //ALL
                if(endList || nextPage == currentPage) return;
                currentPage = nextPage;

                if(nextPage != '') {
                    setNextPageLoading(true);
                } else if(pageStatus == 1) {
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
            }

        } catch (e) {
            console.warn(e);
        }
    }
  
    function FooterList({load}) {
        if(!load) return;
        return (
            <View style={{height: 80,paddingBottom: 15,justifyContent: 'center'}}>
                <ActivityIndicator size={32} color={theme.colors.darktheme} />
            </View>
        )
    }
  
	return (
		<SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
			<StatusBar barStyle='default'/>
			<View style={{flex: 1}}>
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
							<TabsProvider defaultIndex={0} onChangeIndex={(index) => {setTab(index)}}>
								<Tabs disableSwipe={true} style={theme.tabs} tabLabelStyle={theme.tabsLabel}>
                                    {items_active.length > 0 && (
                                        <TabScreen label="Promoções Ativas">
                                            <View style={theme.tabsContent}>
                                                <FlatList 
                                                    style={theme.cardList}
                                                    data={items_active}
                                                    keyExtractor={ item => item.id }
                                                    renderItem={ ({item, index}) => <CardItem template="promotions" index={index} item={item} updateItem={updateItem_active} total={resultsLength_active} tab={tab}/> }
                                                    onEndReached={() => {loadResults(0);}}
                                                    onEndReachedThreshold={ 0.15 }
                                                    ListFooterComponent={ <FooterList load={nextPageLoading_active} /> }
                                                />
                                            </View>
                                        </TabScreen>
                                    )}

									<TabScreen label="Todas">
										<View style={theme.tabsContent}>
											{items.length > 0 ? (
												<FlatList 
													style={theme.cardList}
													data={items}
													keyExtractor={ item => item.id }
													renderItem={ ({item, index}) => <CardItem template="promotions" index={index} item={item} updateItem={updateItem} total={resultsLength} tab={tab}/> }
													onEndReached={() => {loadResults(1);}}
													onEndReachedThreshold={ 0.15 }
													ListFooterComponent={ <FooterList load={nextPageLoading} /> }
												/>
											) : (
												<Noresults/>
											)}
										</View>
									</TabScreen>
								</Tabs>
							</TabsProvider>
							)
						}
						</>
					) : <LoadingFullscreen />
				}
				</View>
			</View>
		</SafeAreaView>
	);
}