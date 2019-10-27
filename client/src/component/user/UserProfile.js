import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

function UserProfile(props) {
    const { username } = useParams();
    const [userprofile, setUserProfile] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/user/'+username);
            if(!res.data.error){
                setUserProfile(res.data.user);
            }  
        };
        fetchData();
    });

    return (
        <div>
            { userprofile && 
            <React.Fragment>
            <p>{userprofile.username}</p>
            <p> Email : {userprofile.email}</p>
            <p> Following : {userprofile.following}</p>
            <p> Follower : {userprofile.followers}</p>

            </React.Fragment>
            }
        </div>
    );
}



export default UserProfile;