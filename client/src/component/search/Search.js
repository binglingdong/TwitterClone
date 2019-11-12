import React from 'react';
import { useHistory } from 'react-router-dom';

function Search(props) {
    let history = useHistory();

    async function handleGetTwitter(event){
        event.preventDefault();
        history.push('/item/' + event.target.twitter_id.value);
    }

    async function handleGetUser(event){
        event.preventDefault();
        history.push('/user/' + event.target.user_id.value);
    }

    async function handleGetMedia(event){
        event.preventDefault();
        history.push('/media/' + event.target.media_id.value);
    }

    function toDateInputValue() {
        const local = new Date();
        return local.toJSON().slice(0,10);
    };

    return ( 
        <div>
            <form onSubmit={handleGetTwitter}>
                <input name="twitter_id" placeholder="Twitter ID" />
                <button type="submit">Find</button>
            </form>
        <br />
        <form onSubmit={handleGetUser}>
                        <input name="user_id" placeholder="User ID" />
                        <button type="submit">Find</button>
                    </form>
        <br />
        <form onSubmit={handleGetMedia}>
                        <input name="media_id" placeholder="Media ID" />
                        <button type="submit">Find</button>
                    </form>
        <br />
            <form className="Search" onSubmit={props.handleSearch}>
                <input placeholder="Search Contains" name="searchByString"></input>
                <input placeholder="Search Username" name="searchByUsername"></input>
                
                <input type="number" defaultValue="25" name="limitField" min="1" max="100"></input>
                <input type="date" name="dateField" defaultValue={toDateInputValue()}></input>
                <input type="checkbox" name = "followingCheck" value = "Following"/>Following
                <br />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>

    );
}

export default Search;