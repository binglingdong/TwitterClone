import React from 'react';
import Item from '../twitter/Item';

function SearchItem(props) {
    return ( 
            <div>
                <Item item={props.item}></Item>
            </div>

    );
}

export default SearchItem;