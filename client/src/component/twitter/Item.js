import React, {useState} from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';

function Item(props) {
    const [action, setAction] = useState(null);

    function like() {
        setAction("liked");
    };

    const actions = props.item ? [
        <span key="comment-basic-like">
            <Tooltip title="Like">
                <Icon
                type="like"
                theme={action === 'liked' ? 'filled' : 'outlined'}
                onClick={like}
                />
            </Tooltip>
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{props.item.property.likes}</span>
        </span>,
        <span key="comment-basic-reply-to">Reply to</span>,
    ] : null;

    return ( 
            <div>
                { !props.item &&
                    <h1>Item not found.</h1>
                }
                { props.item &&
                    <Comment
                        actions={actions}
                        author={<a>{props.item.username}</a>}
                        avatar={
                        <Avatar
                            icon="user"
                            alt={props.item.username}
                        />
                        }
                        content={
                        <p>
                            {props.item.content}
                        </p>
                        }
                        datetime={
                            <React.Fragment>
                                <Tooltip title={props.item.timestamp}>
                                    <span>{props.item.timestamp}</span>
                                </Tooltip>
                                <Tooltip title={props.item.id}>
                                    <span> ID: {props.item.id}</span>
                                </Tooltip>
                            </React.Fragment>
                        }
                    />
                }
            </div>

    );
}

export default Item;