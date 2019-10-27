import React from 'react';

function toDateInputValue() {
    const local = new Date();
    return local.toJSON().slice(0,10);
};

function Search(props) {
    return ( 
        <div>
            <form className="form-inline my-2 my-lg-0 search_bar" onSubmit={props.handleSearch}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="searchField"></input>
                <input className="form-control mr-sm-2" type="number" defaultValue="25" name="limitField" min="1" max="100"></input>
                <input type="date" name="dateField" defaultValue={toDateInputValue()}></input>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>

    );
}

export default Search;