import React from 'react';

function AddItem(props) {
    // check childtype?

    return ( 
            <div>
                <form className="form-signin" onSubmit={props.handleAddItem}>
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