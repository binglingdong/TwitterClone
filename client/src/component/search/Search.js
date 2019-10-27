import React from 'react';

function toDateInputValue() {
    const local = new Date();
    return local.toJSON().slice(0,10);
};

function Search(props) {
    return ( 
        <div>
            <form onSubmit={props.handleGetTwitter}>
                <input name="twitter_id" placeholder="Twitter ID" />
                <button type="submit">Find</button>
            </form>
<br />
            <form className="Search" onSubmit={props.handleSearch}>
                <input className="mr-sm-2" type="search" placeholder="Search Contains" name="searchByString"></input>
                <input className="mr-sm-2" type="search" placeholder="Search Username" name="searchByUsername"></input>
                
                <input className="mr-sm-2" type="number" defaultValue="25" name="limitField" min="1" max="100"></input>
                <input type="date" name="dateField" defaultValue={toDateInputValue()}></input>
                <input type="checkbox" name = "followingCheck" value = "Following"/>Following
                <br />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>

    );
}

export default Search;