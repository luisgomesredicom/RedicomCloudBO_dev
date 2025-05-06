import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { showToast } from "../core/utils";
import { theme } from '../styles/styles'
import { Badge } from './elements';

export const CardItem = ({template, index, item, updateItem, total}) => {
    const navigation = useNavigation();
    var navigationTitle = `${item.title} #${item.id}`;
    
    switch (template) {
        case 'promotions':
            navigate_page = 'DetPromoScreen';
            navigationTitle = `Editar promoção`;
          break;
        case 'campaigns':
            navigate_page = 'DetCampaignScreen';
            navigationTitle = `Editar campanha`;
          break;
        /*case 'campaigns_sms':
            navigate_page = 'DetCampaignSMSScreen';
            navigationTitle = `Editar campanha SMS`;
            break;
        case 'campaigns_email':
            navigate_page = 'DetCampaignEmailScreen';
            navigationTitle = `Editar campanha email`;
            break;*/
        default:
            navigate_page = null;
    }

    const Footer = (...props) => {
        var badges = [];

        if(item.flags) {
            item.flags.forEach(function(flag) {
                if(flag.title && flag.title != '') {
                    badges.push({
                        styles: flag.style > 0 && flag.style < 5 ? theme[`stats_${flag.style}`] : {},
                        text: flag.title
                    });
                }
            });
        }

        return (
            <>
                {badges.length > 0 && (
                    <View style={{flexDirection: 'row',alignItems: 'center',gap: 10,borderTopWidth: 1,borderColor: theme.colors.lines,paddingTop: 11,marginTop: 15}}>
                        {
                            badges.map((badge, index) => (
                                <Badge type="number" text={badge.text} style={badge.styles} key={index}/>
                            ))
                        }
                    </View>
                )}
            </>
        )
    }
    
    return (
        <>
        <View style={{height: 6,backgroundColor: theme.colors.background}}></View>
        {(index == 0 && total != null) && (
            <View style={{height: theme.containerPadding}}></View>
        )}
        <TouchableOpacity key={item.index} onPress={() => {
            if(navigate_page == null) {
                showToast({text: 'Temporariamente indisponível'});
                return;
            }

            navigation.navigate({
                name: navigate_page,
                params: {
                    title: navigationTitle,
                    item: item,
                    update: updateItem
                }
            })
        }}
        >
            <View style={theme.cardItem}>
                <View style={{position: 'relative'}}>
                    {item.active == 1 && (
                        <Badge type="label" text="Ativo" style={{position: 'absolute',top: -4,right: -4,zIndex: 1}}/>
                    )}

                    <View style={{flexDirection: 'row',alignItems: 'flex-end',flex: 1}}>
                        <View style={{flex: 1,gap: 5}}>
                            <View style={{marginBottom: 4}}>
                                <View style={{marginBottom: 2}}>
                                    <Text style={[theme.secondarySubtitle, {lineHeight: 22, paddingRight: 35}]}>
                                        {item.title} {item.id && (<Text style={[theme.paragraph, {color: theme.colors.gray}]}>#{item.id}</Text>)}
                                    </Text>
                                </View>

                                {item.description && (
                                    <Text style={[theme.paragraph, {lineHeight: 22}]}>{item.description}</Text>
                                )}

                                {(item.multiLanguageContent && item.multiLanguageContent.pt.name) && (
                                    <Text style={[theme.paragraph, {lineHeight: 22}]}>{item.multiLanguageContent.pt.name}</Text>
                                )}
                            </View>

                            <View style={{gap: 8}}>
                                {(item.multiLanguageContent && item.multiLanguageContent.pt.descriptionRecipients) && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>Email: </Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.multiLanguageContent.pt.descriptionRecipients}</Text></View>
                                    </View>
                                )}

                                {(item.multiLanguageContent && item.multiLanguageContent.pt.description) && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>Assunto: </Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.multiLanguageContent.pt.description}</Text></View>
                                    </View>
                                )}

                                {item.sender && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>Remetente: </Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.sender}</Text></View>
                                    </View>
                                )}
                            
                                {item.startDate && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>{item.endDate ? 'Ativo de' : 'Data início'}:</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.startDate.substr(0, 16)}</Text></View>
                                    </View>
                                )}

                                {item.endDate && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>até:</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.endDate.substr(0, 16)}</Text></View>
                                    </View>
                                )}

                                {(item.stats && item.stats.totalRecipients) && (
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <View style={{width: 90,marginRight: 10}}><Text style={[theme.listNavSubtitle, {color: theme.colors.gray,lineHeight: 15}]}>Destinatários:</Text></View>
                                        <View style={{flex: 1}}><Text style={[theme.small, {lineHeight: 15}]} numberOfLines={1} ellipsizeMode='tail'>{item.stats.totalRecipients}</Text></View>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View>
                            <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.black} />
                        </View>
                    </View>
                </View>

                <Footer item={item}/>
            </View>
        </TouchableOpacity>
        </>
    )
}
