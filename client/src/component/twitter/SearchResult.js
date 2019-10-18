import React from 'react';

function SearchResult(props) {
    return ( 
            <div>
                <h1>Search Result</h1>
                {
                    props.searchResult.map(i => (
                        <div>
                            <p>{i.username}</p> 
                            <p>{i.content}</p>
                        </div>
                    ))
                }
            </div>

    );
}

export default SearchResult;