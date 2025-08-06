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
            <View style={styles.separator} />

            <TouchableOpacity
                style={styles.itemContainer}
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
                        {item.active == 1 && (
                            <Badge type="dot" style={styles.badge} />
                        )}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 32,
        paddingHorizontal: theme.containerPadding,
        paddingTop: 8,
    },
    separator: {
        height: 0,
        backgroundColor: theme.colors.background,
        marginVertical: 10,
    },
    itemContainer: {
        marginHorizontal: theme.containerPadding,
    },
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
