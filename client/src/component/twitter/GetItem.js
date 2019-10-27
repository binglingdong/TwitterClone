import React from 'react';
import Item from './Item';

function GetItem(props) {
    return ( 
            <div>
                <Item item={props.item}></Item>
            </div>

    );
}

export default GetItem;