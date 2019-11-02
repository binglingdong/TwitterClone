import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List } from 'antd';
import { useLocation } from "react-router-dom";

function Followers() {
    const location = useLocation();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(location.pathname + location.search);
            if(!res.data.error){
                setPosts(res.data.items);
            }  
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1>Posts</h1>
            <List
                itemLayout="horizontal"
                dataSource={posts}
                renderItem={post => (
                <List.Item>
                    {post}
                </List.Item>
                )}
            />
        </div>
    );
}

export default Followers;