import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import UserList from './UserList';

function Following(props) {
    const { username } = useParams();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/user/'+username+"/following");
            if(!res.data.error){
                setFollowing(res.data.users);
            }  
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1>Following</h1>
            <UserList list={following}/>
        </div>
    );
}

export default Following;