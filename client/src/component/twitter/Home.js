import React from 'react';

function Home(props) {
    return (
        <div>
            <h1>Twitter home page</h1>
            <form onSubmit={props.handleGetTwitter}>
                <input name="twitter_id" placeholder="Twitter ID" />
                <button type="submit">Find</button>
            </form>
        </div>
    );
}

export default Home;