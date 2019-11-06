import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';

function AddItem() {
    let history = useHistory();

    async function handleAddItem(event){
        event.preventDefault();
        const res = await axios.post('/additem', {
            content: event.target.content.value,
            childType: null// may need a function to check childtype
        });
        notification['success']({
            message: 'Tweet successfully added',
            description:
              'Id: ' + res.data.id,
            duration: 0,
        });
        history.push('/');
    }

    return ( 
            <div>
                <form className="form-signin" onSubmit={handleAddItem}>
                        <div className="form-group row">
                            <label htmlFor="content" className="col-sm-3 col-form-label">Hello</label>
                            <div className="col-sm-7">
                                <textarea rows="4" cols="50" name="content"> </textarea>
                            </div>
                        </div>
                        <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Tweet</button>
                </form>
            </div>

    );
}

export default AddItem;