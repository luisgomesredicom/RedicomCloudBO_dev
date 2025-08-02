import React, { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Canvas, Path, Skia, Paint, SweepGradient, vec } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator, Text, Switch } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { UserContext, numberFormat, dateFormatter, showToast } from '../core/utils';
import { theme } from '../styles/styles'
import Button from './buttons';

const { screenWidth } = Dimensions.get('window');

export const LoadingFullscreen = () => {
  return (
    <View style={{flex: 1,justifyContent: 'center'}}>
        <ActivityIndicator animating={true} size={40} color={theme.colors.lightgray} />
    </View>
  )
}

export const LoadingRefreshFullscreen = () => {
    return (
        <View style={{...StyleSheet.absoluteFillObject,backgroundColor: 'rgba(0,0,0,0.3)',justifyContent: 'center',alignItems: 'center',zIndex: 1000}}>
            <ActivityIndicator animating={true} size={40} color={theme.colors.lightgray} />
        </View>
    );
}

export const Noresults = (props) => {
  return (
    <View style={theme.noResultsWrapper}>
      <View style={theme.noResultsIconWrapper}><Octicons name="alert" size={38} color={theme.colors.gray} /></View>
      <View><Text style={theme.noResultsDesc}>{(props.title && props.title !== '') ? props.title : 'Sem resultados a apresentar'}</Text></View>
      {(props.buttonTitle && props.buttonPress) && (
        <Button style={theme.noResultsButton} mode="text" onPress={props.buttonPress}>{props.buttonTitle}</Button>
      )}
    </View>
  );
};

export const KeyboardNumeric = (props) => {
  const styles = StyleSheet.create({
    Keyboard_row: {flexDirection: 'row',justifyContent: 'space-between',width: '100%',maxWidth: screenWidth <= 375 ? 280 : 320},
    Keyboard_item: {width: screenWidth <= 375 ? 70 : 84,height: screenWidth <= 375 ? 70 : 84,borderRadius: '100%',justifyContent: 'center',alignItems: 'center',marginVertical: 6,backgroundColor: theme.colors.background},
    Keyboard_text: {fontWeight: '400', fontSize: screenWidth <= 375 ? 28 : 34}
  });

  return (
    <View style={[{flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}, props.style ? props.style : {}]}>
        <View style={styles.Keyboard_row}>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(1)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>1</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(2)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>2</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(3)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>3</Text></TouchableHighlight>
        </View>
        <View style={styles.Keyboard_row}>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(4)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>4</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(5)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>5</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(6)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>6</Text></TouchableHighlight>
        </View>
        <View style={styles.Keyboard_row}>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(7)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>7</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(8)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>8</Text></TouchableHighlight>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(9)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>9</Text></TouchableHighlight>
        </View>
        <View style={styles.Keyboard_row}>
          <View style={[styles.Keyboard_item, {backgroundColor: 'transparent'}]}></View>
          <TouchableHighlight underlayColor="#DDDDDD" onPressIn={() => {props.onPress(0)}} style={styles.Keyboard_item}><Text style={styles.Keyboard_text}>0</Text></TouchableHighlight>
          <TouchableOpacity onPressIn={() => {props.onPress('clear')}} style={[styles.Keyboard_item, {backgroundColor: 'transparent'}]}>
            <Icon code='806' size={32} />
          </TouchableOpacity>
        </View>
      </View>
  )
}

export const ListMenu = (props) => {
  const navigation = useNavigation();
  const userState = useContext(UserContext);
  
  const SwitchItem = (props) => {
    let active = false;
    if(props.switchCode == 'userCode') {
      active = userState.code && userState.code.substr(0, 4) != '****' ? true : false;
    } else if(props.switchCode == 'userBiometric') {
      active = userState.biometric === 'true' ? true : false;
    }
    
    const toggleSwitch = (data) => {
      if(props.onSwitch) {
        props.onSwitch(data);
      }
    };

    return (
        <Switch value={active} onValueChange={(active) => toggleSwitch({switchCode: props.switchCode, active: active})} color='#71cf6d' style={{ transform: [{ scaleX: .85 }, { scaleY: .85 }] }}/>
    );
  }

  const MenuItem = (props) => {
    const item = props.item;

    return (
      <View style={{flexDirection: 'row',alignItems: 'center'}}>
        {item.iconCode && (
          <View style={{width: 35,alignItems: 'center',marginRight: 6}}>
            <Icon code={item.iconCode} size={23} />
          </View>
        )}
        
        <Text style={[theme.paragraph, {flex: 1, flexWrap: 'wrap'}]}>{item.name}</Text>
        
        {item.badgeTotal && item.badgeTotal != '' && (
            <Text style={[theme.paragraph, {color: theme.colors.darkgray,fontSize: 14}]}>
                {item.badgeTotal}
            </Text>
        )}

        <View style={{marginLeft: 10}}>
          {item.hrefTemplate && (
            <Icon code="818" size={16} color={theme.colors.darkgray}/>
          )}

          {item.switch && (
            <SwitchItem onSwitch={props.onSwitch} switchCode={item.switch} />
          )}
        </View>
    </View>
    )
  }

  const styles = StyleSheet.create({
    menuItem: {
      height: 48,
      backgroundColor: theme.colors.white,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.containerPadding,
    }
  });
  
  return (
    <FlatList
        data={props.data} 
        /*ItemSeparatorComponent={() => {
          if(typeof props.separator != 'undefined')
            return (props.separator);

          return (
            <View style={{height: 4, width: '100%', backgroundColor: theme.colors.background}}/>
          )
        }}*/
        renderItem={({ item }) => {

          if(item.hrefTemplate)
            return (
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  if(item.hrefTemplate == 'ListPromoScreen' || item.hrefTemplate == 'ListCampaignScreen') {
                    showToast({text: 'PÃ¡gina em desenvolvimento'});
                  }
                  
                  navigation.navigate({name: item.hrefTemplate, params: {id: item.id, title: item.name}});
                }}
                >
                <MenuItem item={item}/>
              </TouchableOpacity>
            );
          
          else
            return (
              <View key={item.id} style={styles.menuItem}>
                <MenuItem onSwitch={props.onSwitch} item={item}/>
              </View>
            );
        }} 
        keyExtractor={item => item.id}
        scrollEnabled={false}
    />
  )
}

export const Badge = (props) => {
    let badgeText = props.text;

    let styleType = stylesBadge.tag;
    let styleTextType = stylesBadge.tagText;

    if (props.type == 'dot') {
        badgeText = '';
        styleType = stylesBadge.dot;
    }

    const customColor = props.style?.color;

    return (
        <View style={[styleType, props.style && props.style != '' ? props.style : {}]}>
            {badgeText != '' && (
                <Text style={[
                    styleTextType, 
                    customColor ? { color: customColor } : {}, 
                    props.styleText && props.styleText != '' ? props.styleText : {}
                ]}>
                    {badgeText}
                </Text>
            )}
        </View>
    );
};


export const Icon = ({code, size = 24, color = theme.colors.black, style}) => {
    if(!code) return null;

    const hex = code.replace(/^\\?e/i, ''); // remove "\e" ou "e"
    const unicode = String.fromCharCode(parseInt('E' + hex, 16)); // forÃ§a E800, E801, etc.

    return (
        <Text style={[{fontFamily: 'RedicomIcons', fontSize: size, color}, style]}>{unicode}</Text>
    );
};

export const ListStatistics = ({template, value, datetime}) => {
    const { date, time } = dateFormatter(datetime);

    switch (template) {
        case 'listCampaignSMS':
            descrition = 'SMS Enviados';
            break;
        case 'listCampaignEmail':
            descrition = 'Emails Enviados';
            break;
    }

    return (
        <View style={{minHeight: 124,backgroundColor: theme.colors.darktheme,padding: theme.containerPadding,justifyContent: 'center'}}>
            <View><Text style={[theme.small, {color: theme.colors.gray}]}>{date}</Text></View>
            <View style={{flexDirection: 'row',alignItems: 'baseline',gap: 6}}>
                <Text style={{fontSize: 48,color: theme.colors.white,fontWeight: '300'}}>{numberFormat(value)}</Text>
                <Text style={[theme.listNavSubtitle, {color: theme.colors.gray}]}>{descrition}</Text>
            </View>
        </View>
    );
};

export const FooterList = ({load}) => {
    if(!load) return;
    return (
        <View style={{height: 80,paddingBottom: 15,justifyContent: 'center'}}>
            <ActivityIndicator size={32} color={theme.colors.darktheme} />
        </View>
    )
}

export const ProgressBar = ({percentage}) => {
    if(!percentage)
        percentage = 0;

    return (
        <View style={{height: 6,borderRadius: 6,overflow: 'hidden',backgroundColor: theme.colors.lightgray}}>
            <View style={{width: percentage + '%',backgroundColor: theme.colors.success,height: '100%',borderRadius: 6}}></View>
        </View>
    )
}

export const HalfDonutChart = (props) => {
    const percentage = props.percentage / 100;
    const padding = 0;
    const strokeWidth = 20;
    //const viewWidth = screenWidth - (2 * padding);
    const viewWidth = 220;
    const drawWidth = viewWidth - (strokeWidth * 2);

    const gradientColor = theme.colors[props.bgcolor];
    const lightgray = theme.colors.lightgray;

    const path = Skia.Path.Make();
    path.moveTo(0, viewWidth / 2);
    path.addArc({x: strokeWidth, y: strokeWidth, width: drawWidth, height: drawWidth}, 180, 180);

    return (
        <View style={{width: viewWidth,height: viewWidth / 2}}>
            <Canvas style={{width: viewWidth,height: viewWidth,marginTop: -10}}>
                <Path path={path} color="transparent">
                    <Paint style="stroke" strokeWidth={strokeWidth} strokeCap="round" color={lightgray} />
                </Path>
                <Path path={path} color="transparent" end={percentage}>
                    <Paint style="stroke" strokeWidth={strokeWidth} strokeCap="round">
                        <SweepGradient 
                            c={vec(viewWidth / 2, viewWidth / 2 + strokeWidth)}
                            colors={[gradientColor]}
                            start={180}
                            end={180 + (180 * percentage)}
                        />
                    </Paint>
                </Path>
            </Canvas>
            <View style={{position: 'absolute',bottom: 0,width: '100%',alignItems: 'center'}}>
                <Text style={{fontWeight: '700',fontSize: 28,color: theme.colors.white,marginBottom: 4}}>{percentage * 100}%</Text>
                <Text style={[theme.small, {fontSize: 12,color: theme.colors.gray}]}>{numberFormat(props.value1value)}{props.value1title && props.value1title != '' ? ' ' + props.value1title : ''}</Text>
                {props.value2value && (
                  <Text style={[theme.small, {fontSize: 12,color: theme.colors.gray,marginTop: -2}]}>{numberFormat(props.value2value)}{props.value2title && props.value2title != '' ? ' ' + props.value2title : ''}</Text>
                )}
            </View>
        </View>
    );
};

export const CountDown = ({ targetDate, onComplete }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const updatedTimeLeft = calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);

            if (Object.keys(updatedTimeLeft).length === 0) {
                onComplete();
                clearTimeout(timer);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end'
        },
        containerTime: {
            justifyContent: 'center',
            textAlign: 'center',
        },
        time: {
            fontFamily: 'SF Mono 500',
            fontSize: 48,
            color: theme.colors.black
        },
        timeDott: {
            fontWeight: 500,
            fontSize: 48,
            color: theme.colors.black,
            marginHorizontal: 5
        },
        desc: {
            ...theme.small,
            fontSize: 11,
            textAlign: 'center',
            marginTop: -4
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.containerTime}><Text style={styles.time}>{formatTime(timeLeft.days)}</Text><Text style={styles.desc}>Dias</Text></View>
            <View style={styles.containerTime}><Text style={styles.timeDott}>:</Text><Text style={styles.desc}>&nbsp;</Text></View>
            <View><Text style={styles.time}>{formatTime(timeLeft.hours)}</Text><Text style={styles.desc}>Horas</Text></View>
            <View style={styles.containerTime}><Text style={styles.timeDott}>:</Text><Text style={styles.desc}>&nbsp;</Text></View>
            <View><Text style={styles.time}>{formatTime(timeLeft.minutes)}</Text><Text style={styles.desc}>Minutos</Text></View>
            <View style={styles.containerTime}><Text style={styles.timeDott}>:</Text><Text style={styles.desc}>&nbsp;</Text></View>
            <View><Text style={styles.time}>{formatTime(timeLeft.seconds)}</Text><Text style={styles.desc}>Segundos</Text></View>
        </View>
    );
}

export const CountryFlag = ({ code, size = 80 }) => {
    const url = `https://flagcdn.com/h60/${code.toLowerCase()}.png`;

    return (
        <View
            style={{
                borderRadius: 4,
                overflow: 'hidden',
                width: size,
                height: size * 0.75
            }}
        >
            <Image
                source={{ uri: url }}
                style={{
                    width: size,
                    height: size * 0.75,
                }}
                resizeMode="cover"
            />
        </View>
    );
};

const stylesBadge = StyleSheet.create({
    dot: {alignSelf: 'flex-start',borderRadius: 100,backgroundColor: theme.colors.success,width: 10,height: 10,borderWidth: 2,borderColor: theme.colors.white},
    tag: {borderRadius: 2,paddingVertical: 3,paddingHorizontal: 6,backgroundColor: theme.colors.darktheme},
    tagText: [{fontWeight: '500',fontSize: 12,color: theme.colors.white,textAlign: 'center'}]
});