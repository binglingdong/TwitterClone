import React from 'react';
import Item from '../twitter/Item';

function SearchResult(props) {
    return ( 
            <div>
                <h1>Search Result</h1>
                {
                    props.searchResult.map((i, index) => (
                        <div>
                            <Item key={index} item={i}></Item>
                        </div>
                    ))
                }
            </div>

    );
}

export default SearchResult;