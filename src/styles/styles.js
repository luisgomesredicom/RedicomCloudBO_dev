import { Platform } from 'react-native';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

/*
 * Colors 
*/
const colors = {
    dark: '#24303d',
    darktheme: '#24303D',
    brandtheme: '#4C88BE',
    theme: '#24303D',
    lighttheme: '#DFE6ED',
    black: '#333333',
    darkgray: '#70757F',
    gray: '#999999',
    lightgray: '#CCCCCC',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)',
    background: '#F5F5F5',
    lines: '#DDDDDD',
    link: '#E79601',
    linklight: '#FFA500',
    help: '#859EA7',
    helplight: '#E6E6E6',
    error: '#C45454',
    errorlight: '#FBCBC9',
    success: '#64BC65',
    successlight: '#EBF7EB',
    warning: '#ECB015',
    warninglight: '#FFFBE6',
    info: '#2F7BC7',
    infolight: '#E6F3FC',
    buttons: '#0073BB'
}

/*
 * Tipography
*/
const title = {fontWeight: 700,fontSize: 30,lineHeight: 42,color: colors.dark}
const secondaryTitle = {fontWeight: 700,fontSize: 24,lineHeight: 33,color: colors.dark}
const subtitle = {fontWeight: 700,fontSize: 20,lineHeight: 27,color: colors.dark}
const secondarySubtitle = {fontWeight: 700,fontSize: 18,lineHeight: 24,color: colors.dark}
const listNavTitle = {fontWeight: 700,fontSize: 16,lineHeight: 22,color: colors.darktheme}
const listNavSubtitle = {fontWeight: 600,fontSize: 15,lineHeight: 20,color: colors.darkgray}
const paragraph = {fontWeight: 400,fontSize: 15,lineHeight: 20,color: colors.black}
const small = {fontWeight: 400,fontSize: 13,lineHeight: 18,color: colors.darkgray}

/*
 * Container
*/
const safeAreaView = {flex: 1,backgroundColor: 'white'}
const wrapperPage = {flex: 1,backgroundColor: 'white'}
const wrapperContainerPage = {paddingTop: 8}
const wrapperContainerList = {paddingTop: 23}
const containerPadding = 15
const ncontainerPadding = -15
const wrapperContentStyle = {padding: containerPadding,paddingBottom: 0}
const wrapperPageFooter = {
    paddingHorizontal: containerPadding,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: 'white'
}

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        ...colors,
        primary: colors.theme,
        onPrimary: colors.white,
        primaryContainer: colors.theme,
        onPrimaryContainer: colors.white,
        secondary: colors.dark,
        onSecondary: colors.white,
        secondaryContainer: colors.dark,
        onSecondaryContainer: colors.white,
        tertiary: colors.darkgray,
        onTertiary: colors.white,
        tertiaryContainer: colors.darkgray,
        onTertiaryContainer: colors.white,
        error: colors.error,
        onError: colors.white,
        errorContainer: colors.error,
        onErrorContainer: colors.white,
        background: colors.background,
        onBackground: colors.lines,
        surface: colors.white,
        onSurface: colors.black,
        surfaceVariant: colors.lightgray,
        onSurfaceVariant: colors.gray,
        outline: colors.gray,
        outlineVariant: colors.lines,
        shadow: colors.black,
        scrim: colors.black,
        inverseSurface: colors.darkgray,
        inverseOnSurface: colors.white,
        inversePrimary: colors.theme,
        surfaceDisabled: colors.gray,
        onSurfaceDisabled: colors.gray,
        backdrop: colors.background,
        elevation: {
            ...DefaultTheme.colors.elevation,
            level1: colors.background,
            level2: colors.background,
            level3: colors.background,
            level4: colors.background,
            level5: colors.background
        }
    },

    /*
     * Tipography
    */
    title: title,
    secondaryTitle: secondaryTitle,
    subtitle: subtitle,
    secondarySubtitle: secondarySubtitle,
    listNavTitle: listNavTitle,
    listNavSubtitle: listNavSubtitle,
    paragraph: paragraph,
    small: small,
    
    /*
     * Container
    */
    safeAreaView: safeAreaView,
    wrapperPage: wrapperPage,
    wrapperContainerPage: wrapperContainerPage,
    wrapperContainerList: wrapperContainerList,
    containerPadding: containerPadding,
    ncontainerPadding: ncontainerPadding,
    wrapperContentStyle: wrapperContentStyle,
    wrapperPageFooter: wrapperPageFooter,
    
    /*
     * Cards
    */
    cardList: {},
    cardItem: {
        backgroundColor: colors.white,
        padding: containerPadding
    },

    /*
     * Product
    */
    productMaskImage: {width: '100%',height: '100%',position: 'absolute',top: 0,left: 0,zIndex: 1,backgroundColor: 'rgba(0,0,0,0.03)'},

    /*
     * Form & form elements
    */
    formWrapper: {gap: 22,width: '100%'},
    formField: {},
    formFieldFooter: {marginTop: 15},
    formLabelWrap: {marginBottom: 8},
    formLabel: {...listNavSubtitle, fontWeight: '500'},
    formContent: {gap: 15,flexDirection: 'row'},
    formElement: {flexGrow: 1,flexBasis: 0,position: 'relative'},
    bulletPassword: {width: 14,height: 14,borderRadius: '100%',backgroundColor: 'white',borderWidth: 1,borderColor: colors.black},
    wrapperSecondaryButtons: {marginTop: 30,gap: 10},
    
    //Select Picker
    pickerSelectStyles: {
        inputIOS: {fontSize: 16,paddingVertical: 12,paddingHorizontal: 14,color: colors.black,backgroundColor: 'transparent',width: '100%'},
        inputAndroid: {fontSize: 16,paddingVertical: 12,paddingHorizontal: 14,color: colors.black,backgroundColor: 'transparent',width: '100%'},
    },
    pickerSelectStylesDisabled: {
        inputIOS: {fontSize: 16,paddingVertical: 12,paddingHorizontal: 14,color: colors.gray,backgroundColor: 'transparent',width: '100%'},
        inputAndroid: {fontSize: 15,paddingVertical: 12,paddingHorizontal: 14,color: colors.gray,backgroundColor: 'transparent',width: '100%'},
    },
    
    //Button Date & Time Picker
    buttonDateModal: {opacity: 1,position: 'absolute',backgroundColor: 'transparent',top: 0,left: 0,zIndex: 10,width: '100%',height: '100%'},
    buttonTimeModal: {position: 'absolute',zIndex: 10,backgroundColor: 'transparent',width: '100%',left: 2,bottom: 2},
   
    /*
     * Labels, Tags & Numbers
    */
    //labelItem: {borderRadius: 8,paddingVertical: 7,paddingHorizontal: 10,backgroundColor: colors.success,alignSelf: 'flex-start'},
    labelItem: {alignSelf: 'flex-start',borderRadius: 100,backgroundColor: colors.success,width: 10,height: 10,borderWidth: 2,borderColor: 'white'},
    labelItemText: {...paragraph,textAlign: 'center',color: colors.white,fontWeight: '700',fontSize: 10,lineHeight: 12},
    numberItem: {/*borderRadius: 50,paddingVertical: 6,paddingHorizontal: 10,backgroundColor: colors.theme,alignSelf: 'flex-start'*/},
    numberItemText: {...paragraph,fontSize: 14/*,textAlign: 'center',color: colors.white,fontWeight: '400',fontSize: 12,lineHeight: 14*/},
    tagItem: {borderRadius: 4,paddingVertical: 4,paddingHorizontal: 4,backgroundColor: colors.error,alignSelf: 'flex-start'},
    tagItemText: {...paragraph,textAlign: 'center',color: colors.white,fontWeight: '400',fontSize: 10,lineHeight: 12},
    stats_1: {backgroundColor: colors.theme,borderColor: colors.theme},
    stats_2: {backgroundColor: colors.error,borderColor: colors.error},
    stats_3: {backgroundColor: colors.success,borderColor: colors.success},
    stats_4: {backgroundColor: colors.warning,borderColor: colors.warning},
    
    /*
     * Modal
    */
    modalView: {
        margin: 50,
        backgroundColor: 'white',
        borderRadius: 22,
        padding: 14,
        paddingTop: 20,
        alignItems: 'center',
        shadowColor: '#24303D',
        shadowOffset: {width: 0,height: 0},
        shadowOpacity: 0.16,
        shadowRadius: 4,
        elevation: 1,
    },
    
    /*
     * Tabs
    */
   tabs: {
        borderBottomWidth: 0,
        borderColor: colors.darktheme
    },
    tabsLabel: {fontWeight: '700',fontSize: 15,color: colors.darkgray},
    tabsContent: {flex: 1},

    /*
     * Others
    */
    //No results info
    noResultsWrapper: {flex: 1,alignItems: 'center',justifyContent: 'center',padding: 15,paddingBottom: '40%' },
    noResultsIconWrapper: {marginBottom: 20},
    noResultsDesc: [paragraph, { textAlign: 'center', color: colors.gray, fontWeight: '300', fontSize: 16 }],
    noResultsButton: {marginTop: 5},
    containerDonutChart: {backgroundColor: colors.darktheme,height: 172,alignItems: 'center',justifyContent: 'center',marginHorizontal: ncontainerPadding,padding: containerPadding}
}