import React, {useState, useEffect, useCallback} from 'react';
import { ScrollView, StatusBar, View, Image, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, Switch } from 'react-native-paper';
import { remoteAPI } from '../core/utils';
import Button from '../components/buttons'
import { Icon, LoadingFullscreen } from '../components/elements';
import { Badge } from '../components/elements';
import { theme } from '../styles/styles'

export function DetProduct() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [pageIsReady, setPageIsReady] = useState(false);
    const [product, setProduct] = useState(route.params.product);
    const [dataMatiz, setDataMatiz] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const data = await remoteAPI({request: `catalog/products/skugroup/${product.skuGroup}`, method: 'GET'});
        setDataMatiz(data.response.results);
        setPageIsReady(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const SwitchGlobal = (item) => {
        const toggleSwitch = (...dataSwitch) => {
            dataSwitch = dataSwitch[0];
            const active = dataSwitch.active;
            remoteAPI({request: `catalog/products/`, method: 'PUT', body: {active: active ? 1 : 0, skuGroup: item.skuGroup}});
            
            const productUpdated = {...product, active: active};
            setProduct(productUpdated);
            route.params.update(productUpdated);

            /* Update Matiz */
            const updatedMatriz = dataMatiz.map((value) => {
                return { ...value, active: active };
            });
            setDataMatiz(updatedMatriz);
        };
        return (
            <Switch value={product.active == true || product.active == 1 ? true : false} onValueChange={(active) => toggleSwitch({active: active})} color={theme.colors.success} style={{ transform: [{ scaleX: .85 }, { scaleY: .85 }] }}/>
        );
    }

    const SwitchItem = (item) => {
        const toggleSwitch = (...dataSwitch) => {
            dataSwitch = dataSwitch[0];
            const active = dataSwitch.active;
            remoteAPI({request: `catalog/products/`, method: 'PUT', body: {active: active ? 1 : 0, sku: item.sku}});

            /* Update Matriz */
            const updatedList = dataMatiz.map((value) => {
                if (value.sku === dataSwitch.sku) {
                    return { ...value, active: active };
                }
                return value;
            });
            
            setDataMatiz(updatedList);

            /* Update Product */
            var totalInactive = 0;
            for (let i = 0; i < updatedList.length; i++) {
                if(updatedList[i].active != 1 && updatedList[i].active != true) {
                    totalInactive++;
                }
            }

            const productUpdated = {...product, active: (totalInactive == updatedList.length) ? false : true};
            setProduct(productUpdated);
            route.params.update(productUpdated);
        };

        return (
            <Switch value={item.active == true || item.active == 1 ? true : false} onValueChange={(active) => toggleSwitch({sku: item.sku, active: active})} color={theme.colors.success} style={{ transform: [{ scaleX: .85 }, { scaleY: .85 }] }}/>
        );
    }

    return (
        <SafeAreaView style={theme.safeAreaView} edges={['right','left']}>
            <StatusBar barStyle='default'/>
            <View style={[theme.wrapperPage]}>
            {
                pageIsReady ? (
                    <>
                        <ScrollView style={theme.wrapperPage} contentContainerStyle={[theme.wrapperContentStyle, {paddingTop: 30}]}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        >
                            <View style={{marginBottom: 30}}><Text style={[theme.listNavSubtitle, {fontWeight: 700}]}>Detalhe de Produto</Text></View>

                            <View style={{flexDirection: 'row',gap: 10,alignItems: 'center'}}>
                                <View style={{position: 'relative',width: 82,height: 120,flexShrink: 0}}>
                                    <View style={theme.productMaskImage}></View>
                                    <Image source={{uri: product.image.default}} style={{resizeMode: 'cover',flex: 1}} />

                                    {product.active == 1 && (
                                        <Badge type="dot" style={{position: 'absolute',top: 4,right: 4,zIndex: 1}} />
                                    )}
                                </View>

                                <View style={{flex: 1}}>
                                    <View style={{gap: 0,flex: 1}}>
                                        {(product.brand && product.brand.multiLanguageContent && product.brand.multiLanguageContent.pt.name != '') && (
                                            <Text style={[theme.small, {color: theme.colors.black}]}>
                                                {product.brand.multiLanguageContent.pt.name}
                                            </Text>
                                        )}

                                        <Text style={[theme.listNavSubtitle, {color: theme.colors.black, fontWeight: 700}]}>
                                            {product.multiLanguageContent.pt.nameListing}
                                        </Text>

                                        <View style={{gap: 1,marginTop: 15}}>
                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 74,marginRight: 10}}><Text style={[theme.small]}>Ref. Modelo</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{product.skuFamily}</Text></View>
                                            </View>

                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 74,marginRight: 10}}><Text style={[theme.small]}>Ref. Cor</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{product.skuGroup}</Text></View>
                                            </View>
                                            
                                            {(product.color && product.color.multiLanguageContent) && (
                                                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                    <View style={{width: 74,marginRight: 10}}><Text style={[theme.small]}>Cor</Text></View>
                                                    <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{product.color.multiLanguageContent.pt.name}</Text></View>
                                                </View>
                                            )}

                                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 74,marginRight: 10}}><Text style={[theme.small]}>Novidade</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{product.new == true ? 'Sim' : 'Não'}</Text></View>
                                            </View>

                                            {/*<View style={{flexDirection: 'row',alignItems: 'center'}}>
                                                <View style={{width: 74,marginRight: 10}}><Text style={[theme.small]}>Ativo</Text></View>
                                                <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{product.active == 1 ? 'Sim' : 'Não'}</Text></View>
                                            </View>*/}
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <SwitchGlobal active={product.active} skuGroup={product.skuGroup}/>
                                </View>
                            </View>

                            <View style={{height: 6,backgroundColor: theme.colors.background,marginTop: 30,marginHorizontal: theme.ncontainerPadding}}></View>
                            
                            <View style={{marginTop: theme.containerPadding,marginBottom: 24}}>
                                <Text style={[theme.listNavSubtitle, {fontWeight: 700}]}>Variantes</Text>
                            </View>

                            <View style={stylesTable.tableInfo_head}>
                                <View style={[stylesTable.tableInfo_head_td, {marginLeft: 0,width: '55%'}]}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]}>Produto</Text></View>
                                <View style={[stylesTable.tableInfo_head_td, {width: '12%',alignItems: 'center'}]}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]}>Preço</Text></View>
                                <View style={[stylesTable.tableInfo_head_td, {width: '12%',alignItems: 'center'}]}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]}>Stock</Text></View>
                                <View style={[stylesTable.tableInfo_head_td, {marginRight: 0,width: 60,alignItems: 'center'}]}><Text style={[theme.small, {fontWeight: 700,color: theme.colors.black}]}>Ativo</Text></View>
                            </View>
                            
                            {dataMatiz.map((item, index) => (
                                <View key={item.id}>
                                    <View style={stylesTable.tableInfo_body}>
                                        <View style={[stylesTable.tableInfo_body_td, {marginLeft: 0,width: '55%'}]}>
                                            <Text numberOfLines={3} ellipsizeMode='tail' style={[theme.small, {fontWeight: 700,color: theme.colors.black,marginBottom: 6}]}>{item.sku} </Text>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={[theme.small, {fontWeight: 700,color: theme.colors.black}]}><Text style={theme.small}>Tam.:</Text>  {item.size.multiLanguageContent.pt.name}</Text>
                                        </View>
                                        <View style={[stylesTable.tableInfo_body_td, {width: '12%',alignItems: 'center'}]}>
                                            {item.hasPrice=='true' ? (
                                                <Icon code="805" size={24} style={{color: theme.colors.success}} />
                                            ) : (
                                                <Icon code="807" size={28} style={{color: theme.colors.error}} />
                                            )}
                                        </View>
                                        <View style={[stylesTable.tableInfo_body_td, {width: '12%',alignItems: 'center'}]}>
                                            {item.hasInventory=='true' ? (
                                                <Icon code="805" size={24} style={{color: theme.colors.success}} />
                                            ) : (
                                                <Icon code="807" size={28} style={{color: theme.colors.error}} />
                                            )}
                                        </View>
                                        <View style={[stylesTable.tableInfo_body_td, {marginRight: 0,width: 60,alignItems: 'center'}]}>
                                            <SwitchItem active={item.active} sku={item.sku}/>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={[theme.wrapperPageFooter, {paddingBottom: theme.containerPadding + Math.max(insets.bottom)}]}>
                            <Button mode="contained" onPress={() => navigation.goBack()}>Gravar</Button>
                        </View>
                    </>
                ) : <LoadingFullscreen />
            }
            </View>
        </SafeAreaView>
    );
}

const stylesTable = StyleSheet.create({
    tableInfo_head: {
        flexDirection: 'row',
        flexGrow: 1
    },
    tableInfo_head_td: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: theme.colors.black,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexGrow: 1,
        marginHorizontal: 2
    },
    tableInfo_body: {
        flexDirection: 'row',
        flexGrow: 1
    },
    tableInfo_body_td: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: theme.colors.lines,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexGrow: 1,
        marginHorizontal: 2,
        justifyContent: 'center'
    }
});
