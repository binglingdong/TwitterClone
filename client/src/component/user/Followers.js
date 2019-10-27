import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import UserList from './UserList';

function Followers(props) {
    const { username } = useParams();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/user/'+username+"/followers");
            if(!res.data.error){
                setFollowers(res.data.users);
            }  
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1>Followers</h1>
            <UserList list={followers}/>
        </div>
    );
}

export default Followers;