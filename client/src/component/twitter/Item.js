import React, {useState} from 'react';
import { Comment, Icon, Tooltip, Avatar, List, Typography } from 'antd';
import {Link} from 'react-router-dom';
import AddItem from './AddItem';

function Item(props) {
    const [action, setAction] = useState(null);
    const [reply, setReply] = useState(false);
    const [childType, setChildType] = useState(null);

    function like() {
        setAction("liked");
    };

    function toggleReply(open, type) {
        setReply(open);
        setChildType(type);
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
        <span key="comment-basic-reply-to" onClick={() => toggleReply(true, 'retweet')}>Retweet({props.item.retweeted})</span>,
        <span key="comment-basic-reply-to" onClick={() => toggleReply(true, 'reply')}>Reply to</span>,
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
                            { props.item.parent && 
                                <Typography.Text strong>
                                    {props.item.childType} of <Link to={'/item/' + props.item.parent}>{props.item.parent}</Link>
                                </Typography.Text> 
                            }
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
            { reply && 
                <React.Fragment>
                    <AddItem parent={props.item.id} childType={childType}/> 
                    <button className="btn btn-outline-dark text-uppercase mt-4" onClick={() => toggleReply(false, null)}>Cancel</button>
                </React.Fragment>
            }
        </div>
    );
}

export default Item;