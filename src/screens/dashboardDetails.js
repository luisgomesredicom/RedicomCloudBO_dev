import React, {useState, useEffect, useCallback} from 'react';
import { StatusBar, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {TabsProvider, Tabs, TabScreen} from '../components/paperTabs';
import { Text, ActivityIndicator } from 'react-native-paper';
import { remoteAPI } from '../core/utils';
import { LoadingFullscreen, Noresults } from '../components/elements';
import { theme } from '../styles/styles'

export function DashboardDetails() {
    const [pageStatus, setPageStatus] = useState(0);
    const [dataDash, setDataDash] = useState(null);
    const [tab, setTab] = useState(0);
    const insets = useSafeAreaInsets();
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
    const infoUpdateHeight = 94;
    const [refreshing, setRefreshing] = useState(false);

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `Esta informação foi atualizada pela última vez às ${hours}:${minutes} do dia de ${day}/${month}/${year}. Arraste para baixo para atualizar.`;
    };

    const CardItem = ({index, item}) => {
        return (
            <>
                {index > 0 ? (
                    <View style={{height: 6,backgroundColor: theme.colors.background, marginBottom: 2}}></View>
                ) : ''}
                <View style={[theme.cardItem, {paddingBottom: 32}]}>
                    <View style={{marginBottom: 25}}><Text style={[theme.listNavSubtitle, {fontSize: 16}]}>{item.title}</Text></View>
                    <View style={{flexDirection: 'row',alignItems: 'stretch'}}>
                        {item.list.map((itemList) => (
                            <View style={{width: '33.33333%'}}>
                                <View style={{flexDirection: 'row',alignItems: 'baseline',justifyContent: 'center'}}><Text style={[theme.listNavTitle, {fontSize: 18}]}>{itemList.value}</Text>{itemList.subtitle != '' && (<Text style={{fontSize: 12}}> {itemList.subtitle}</Text>)}</View>
                                <Text style={[theme.small, {fontSize: 12,textAlign: 'center'}]}>{itemList.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </>
        )
    }

    const fetchData = async () => {
        try {
            const dataDash = await remoteAPI({
                request: `dashboard/details`,
                method: 'GET'
            });

            if(dataDash.response.today.length > 0)
                dataDash.response.today = dataDash.response.today.map(item => ({ ...item, id: generateId() }));

            if(dataDash.response.lastWeek.length > 0)
                dataDash.response.lastWeek = dataDash.response.lastWeek.map(item => ({ ...item, id: generateId() }));

            setDataDash(dataDash.response);
            setPageStatus(1);

        } catch (error) {;
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const HeaderList = ({ style }) => (
        <View style={{backgroundColor: theme.colors.background,paddingTop: 23,paddingBottom: 16,paddingHorizontal: 30,marginBottom: 17,zIndex: 50}}>
            <Text style={{textAlign: 'center',marginVertical: 0, fontSize: 16, lineHeight: 22}}>{formatDate(dataDash.lastUpdate)}</Text>
        </View>
    );
  
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
                                    
                                    <TabsProvider defaultIndex={0} onChangeIndex={(index) => {setTab(index)}}>
                                        <Tabs disableSwipe={true} style={theme.tabs} tabLabelStyle={theme.tabsLabel}>
                                            <TabScreen label="Hoje">
                                                <View style={theme.tabsContent}>
                                                    {dataDash.today.length > 0 ? (
                                                        <FlatList 
                                                            ListHeaderComponent={
                                                                <HeaderList/>
                                                            }
                                                            style={[theme.cardList, {paddingBottom: Math.max(insets.bottom)}]} 
                                                            data={dataDash.today}
                                                            keyExtractor={ item => item.id }
                                                            renderItem={ ({item, index}) => <CardItem index={index} item={item}/> }
                                                            refreshControl={
                                                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                                            }
                                                        />
                                                    ) : (
                                                        <Noresults/>
                                                    )}
                                                </View>
                                            </TabScreen>

                                            <TabScreen label="Últimos 7 dias">
                                                <View style={theme.tabsContent}>
                                                    {dataDash.lastWeek.length > 0 ? (
                                                        <FlatList 
                                                            ListHeaderComponent={
                                                                <HeaderList/>
                                                            }
                                                            style={[theme.cardList, {paddingBottom: Math.max(insets.bottom)}]}
                                                            data={dataDash.lastWeek}
                                                            keyExtractor={ item => item.id }
                                                            renderItem={ ({item, index}) => <CardItem index={index} item={item}/> }
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
