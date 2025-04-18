import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native-paper';
import { theme } from '../styles/styles'
import { Badge, Icon } from './elements';
import { Link } from './buttons';

export const ProductItem = ({index, item, updateItem, total, linkAction}) => {
    const navigation = useNavigation();
    
    return (
        <>
            {index == 0 && (
                <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',gap: 10,marginBottom: 28}}>
                    <View><Text style={[theme.listNavSubtitle, {color: theme.colors.darktheme}]}>Produtos</Text></View>
                    <View><Link text="Filtrar Produtos" onPress={() => linkAction({ type: "toggleFilters" })}/></View>
                </View>
            )}

            <TouchableOpacity
                key={item.index}
                style={{marginTop: 0,marginBottom: 20}}
                onPress={() => {
                    navigation.navigate({
                        name: 'DetProductsScreen',
                        params: {
                            title: item.multiLanguageContent.pt.nameListing,
                            product: item,
                            update: updateItem,
                        }
                    })
                }}
            >
                <View style={{flexDirection: 'row',gap: 14,alignItems: 'flex-start'}}>
                    <View style={{position: 'relative',width: 78,height: 104,flexShrink: 0}}>
                        <View style={theme.productMaskImage}></View>
                        <Image source={{uri: item.image.default}} style={{resizeMode: 'cover',flex: 1}} />

                        {item.active == 1 && (
                            <Badge type="label" style={{position: 'absolute',top: 4,right: 4,zIndex: 1}} />
                        )}
                    </View>
                    
                    <View style={{flex: 1}}>
                        <View style={{marginTop: 2,flex: 1,flexDirection: 'row',alignItems: 'center',position: 'relative'}}>
                            <View style={{gap: 3,flex: 1,minHeight: 100}}>
                                {item.brand && item.brand.multiLanguageContent.pt.name != '' && (
                                    <View style={{paddingRight: 36,marginBottom: -3}}>
                                        <Text style={[theme.small, {color: theme.colors.black}]}>
                                            {item.brand.multiLanguageContent.pt.name}
                                        </Text>
                                    </View>
                                )}

                                <View style={{paddingRight: 36}}>
                                    <Text style={[theme.listNavSubtitle, {color: theme.colors.black}]}>
                                        {item.multiLanguageContent.pt.nameListing}
                                    </Text>
                                </View>

                                <View style={{gap: 1,marginTop: 2}}>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 70,marginRight: 10}}><Text style={[theme.small]}>Ref. SKU</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.skuFamily}</Text></View>
                                    </View>

                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 70,marginRight: 10}}><Text style={[theme.small]}>Ref. Cor</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.skuGroup}</Text></View>
                                    </View>
                                    
                                    {(item.color && item.color.multiLanguageContent) && (
                                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                            <View style={{width: 70,marginRight: 10}}><Text style={[theme.small]}>Cor</Text></View>
                                            <View style={{flex: 1}}><Text style={[theme.small, {fontWeight: 500,color: theme.colors.black}]} numberOfLines={1} ellipsizeMode='tail'>{item.color.multiLanguageContent.pt.name}</Text></View>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={{marginLeft: 10,marginRight: -6}}>
                                <Icon name="right" size={22} style={{color: theme.colors.darkgray}}/>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )

    /*const SwitchTemplate = function(props) {
        const [isEnabled, setIsEnabled] = useState(props.active == 1 ? true : false);
        const toggleSwitch = () => setIsEnabled(!isEnabled);
    
        return (
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
            <View style={{paddingHorizontal: 4,width: 50}}>
            {isEnabled == true && <Text style={{color: theme.colors.success,fontWeight: '400'}}>Ativo</Text>}
            </View>
            <Switch value={isEnabled} onValueChange={toggleSwitch} color='#71cf6d' style={{ transform: [{ scaleX: .85 }, { scaleY: .85 }] }}/>
        </View>
        );
    }*/
}
