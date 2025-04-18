import React, {useState, useEffect} from 'react';
import { SafeAreaView, StatusBar, View, FlatList } from 'react-native';
import { remoteAPI } from '../core/utils';
import { CardItem } from '../components/cards';
import { LoadingFullscreen, Noresults } from '../components/elements';
import { theme } from '../styles/styles'
import { ActivityIndicator } from 'react-native-paper';
import {TabsProvider, Tabs, TabScreen} from '../components/paperTabs';

export function ListOrdersInfo() {
  /* 0 => Início da página | -1 => Pedido à API | 1 => Tudo carregado */
  const [pageStatus, setPageStatus] = useState(0);
  const [items, setItems] = useState([]);
  const [resultsLength, setResultsLength] = useState(null);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const updateItem = (item) => {
    const updatedList = items.map((_item) => {
      if (_item.id === item.id) {
        return { ..._item, ...item };
      }
      return _item;
    });
    
    setItems(updatedList);
  };

  useEffect(() => {
    currentPage = null,
    nextPage    = '',
    endList     = false

    loadResults();
  }, []);

  async function loadResults() {
    try {
      if(endList || nextPage == currentPage) return;
      currentPage = nextPage;

      if(nextPage != '') {
        setNextPageLoading(true);
      } else if(pageStatus == 1) {
        setPageStatus(-1);
      }
      
      /*var requestHTTP = `${nextPage == '' ? `marketing/campaigns` : nextPage}`;
      
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
      }*/

      setPageStatus(1);

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
    <SafeAreaView style={theme.safeAreaView}>
        <StatusBar barStyle='default'/>

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
                      {items.length > 0 ? (
                        <FlatList 
                            style={theme.cardList}
                            data={items}
                            keyExtractor={ item => item.id }
                            renderItem={ ({item, index}) => <CardItem template="campaigns" index={index} item={item} updateItem={updateItem} total={resultsLength} tab={tab}/> }
                            onEndReached={loadResults}
                            onEndReachedThreshold={ 0.15 }
                            ListFooterComponent={ <FooterList load={nextPageLoading} /> }
                        />
                      ) : (
                        <Noresults title="Temporariamente indisponível"/>
                      )}
                    </>
                )}
                
              </>
            ) : <LoadingFullscreen />
          }
      </SafeAreaView>
  );
}