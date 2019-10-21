import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

function Item(props) {
    const { id } = useParams();
    const [ item, setItem] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/item/' + id);
            setItem(res.data.item);
        };
        fetchData();
    }, []);

    return ( 
            <div>
                <h1>This item</h1>
                <div>
                    { item &&
                        <React.Fragment>
                            <p>{item.username}</p> 
                            <p>{item.content}</p> 
                        </React.Fragment>
                    }
                </div>
            </div>

    );
}

export default Item;