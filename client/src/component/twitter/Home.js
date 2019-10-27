import React from 'react';
import axios from 'axios';
import { notification } from 'antd';

function Home(props) {

    async function handleFollow(event) {
        event.preventDefault();
        const id = event.target.username.value;
        const res = await axios.post('/follow', {
            username: id,
            follow: false
        });
        //alert(res.data.status);
        if(!res.data.error) {
            notification['success']({
                message: 'Successfully followed',
                description:
                'Id: ' + id,
                duration: 0,
            });
       }
       else{
            notification['error']({
                message: 'Failed to follow',
                description:
                'Id: ' + id,
                duration: 0,
            });
       }
    }

    return (
        <div>
            <h1>Twitter home page</h1>
            <form onSubmit={handleFollow}>
                    <input name="username" placeholder="Username" />
                    <button type="submit">Unfollow</button>
                </form>
        </div>
    );
}

export default Home; 