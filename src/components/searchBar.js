import React, {useState} from 'react'
import { Searchbar } from 'react-native-paper'
import { theme } from '../styles/styles'
import { Icon } from './elements';

export const SearchBar = ({onChangeText}) => {
    const [searchQuery, setSearchQuery] = useState('');
    function onChangeSearch(query) {
        setSearchQuery(query);
        if(typeof onChangeText === 'function')
            onChangeText(query);
    }

    return (
        <Searchbar
            icon={() => (<Icon code="819" size={22} style={{color: theme.colors.black, marginLeft: -10, width: 22, height: 22}}/>)}
            placeholder="Pesquisa"
            placeholderTextColor={theme.colors.gray}
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{fontSize: 16, color: theme.colors.black, minHeight: 0, paddingTop: 0, paddingBottom: 0, height: 34, marginLeft: -8}}
            Type='view'
            style={{
                borderWidth: 0,
                backgroundColor: 'white',
                marginVertical: 0,
                paddingVertical: 0,
                paddingHorizontal: 0,
                borderRadius: 6,
                height: 36,
                minHeight: 36,
            }}
            allowFontScaling={false}
        />
    );
}