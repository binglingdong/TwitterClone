import React from 'react';
import Item from './Item';

function SearchItem(props) {
    return ( 
            <div>
                <Item item={props.item}></Item>
            </div>

    );
}

export default SearchItem;