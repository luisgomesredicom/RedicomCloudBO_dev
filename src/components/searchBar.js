import React, {useState} from 'react'
import { Searchbar } from 'react-native-paper'
import { Octicons } from '@expo/vector-icons';
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
            icon={() => (<Icon name="search" size={24} style={{color: theme.colors.darkgray}}/>)}
            placeholder="Pesquisar"
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{fontSize: 16,color: theme.colors.black,minHeight: 0}}
            Type='view'
            style={{
                borderWidth: 0,
                backgroundColor: 'white',
                marginVertical: 0,
                paddingVertical: 0,
                borderRadius: 6,
                height: 42,
                minHeight: 42,
            }}
        />
    );
}