import React, {useState} from 'react';
import { Comment, Icon, Tooltip, Avatar, List, Typography } from 'antd';
import {Link} from 'react-router-dom';

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
            { props.item &&
                <Comment
                    actions={actions}
                    author={<Link to={"/user/"+props.item.username}>{props.item.username}</Link>}
                    avatar={
                    <Avatar
                        icon="user"
                        alt={props.item.username}
                    />
                    }
                    content={
                        <React.Fragment>
                            <p>
                                {props.item.content}
                            </p>
                            { !(props.item.media.length === 0) &&
                                <List
                                    bordered
                                    dataSource={props.item.media}
                                    renderItem={item => (
                                        <List.Item>
                                            <Typography.Text mark>[MEDIA]</Typography.Text>
                                            <Link to={"/media/" + item}>{item}</Link>
                                        </List.Item>
                                    )}
                                />
                            }
                        </React.Fragment>
                    }
                    datetime={
                        <React.Fragment>
                            <Tooltip title={props.item.timestamp}>
                                <span>{props.item.timestamp}</span>
                            </Tooltip>
                        </React.Fragment>
                    }
                />
            }
        </div>
    );
}

export default Item;