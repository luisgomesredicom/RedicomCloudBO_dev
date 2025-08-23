import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { theme } from '../styles/styles';
import { Badge, Icon } from './elements';
import { Link } from './buttons';

export const ProductItem = ({ index, item, updateItem, linkAction, totalFilters }) => {
    const navigation = useNavigation();

    const renderLabel = (label, value) => (
        value && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 74, marginRight: 10 }}>
                    <Text style={theme.small}>{label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text 
                        style={[theme.small, {color: theme.colors.black }]} 
                        numberOfLines={1} 
                        ellipsizeMode='tail'
                    >
                        {value}
                    </Text>
                </View>
            </View>
        )
    );

    return (
        <>
            {index > 0 && (
                <View style={{height: 6,backgroundColor: theme.colors.background}}></View>
            )}

            <TouchableOpacity
                style={theme.cardItem}
                onPress={() => navigation.navigate('DetProductsScreen', {
                    title: item.multiLanguageContent?.pt?.nameListing,
                    product: item,
                    update: updateItem,
                })}
            >
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                    
                    <View style={styles.imageWrapper}>
                        <View style={theme.productMaskImage}></View>
                        <Image 
                            source={{ uri: item.image.default }} 
                            style={{ resizeMode: 'cover', flex: 1 }} 
                        />
                        <Badge type="dot" style={[styles.badge, {backgroundColor: item.active == 1 ? theme.colors.success : theme.colors.error}]} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={styles.infoWrapper}>
                            <View style={{ gap: 0, flex: 1, minHeight: 86 }}>
                                {item.brand?.multiLanguageContent?.pt?.name && (
                                    <View style={{ paddingRight: 36 }}>
                                        <Text style={[theme.small, { color: theme.colors.black }]}>
                                            {item.brand?.multiLanguageContent?.pt?.name}
                                        </Text>
                                    </View>
                                )}

                                <View style={{ paddingRight: 36, paddingBottom: 7 }}>
                                    <Text style={[theme.listNavSubtitle, { fontWeight: '700', color: theme.colors.black }]}>
                                        {item.multiLanguageContent?.pt?.nameListing}
                                    </Text>
                                </View>

                                <View style={{ gap: 0, marginTop: 2 }}>
                                    {renderLabel('Ref. Modelo', item.skuFamily)}
                                    {renderLabel('Ref. Cor', item.skuGroup)}
                                    {renderLabel('Cor', item.color?.multiLanguageContent?.pt?.name)}
                                </View>
                            </View>

                            <Icon code="818" size={22} style={{ color: theme.colors.black, marginLeft: 10, marginRight: -6 }} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};

const styles = {
    imageWrapper: {
        position: 'relative',
        width: 64,
        height: 88,
        flexShrink: 0,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 1,
    },
    infoWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
};
