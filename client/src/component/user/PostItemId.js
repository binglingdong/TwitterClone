import React, { useState } from 'react';

function PostItemId(props) {

    return (
        <React.Fragment>
            {props.post}
            { props.canDelete &&
                <button className="btn btn-outline-dark text-uppercase mt-4" onClick={() => props.handleDeleteTwitter(props.post)}>Delete</button>
            }
        </React.Fragment>
    );
}

export default PostItemId;