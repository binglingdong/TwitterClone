import React from 'react';
import { List, Avatar } from 'antd';

function UserList(props) {
    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={props.list}
                renderItem={username => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar icon="user" />}
                    title={<p>{username}</p>}
                    />
                </List.Item>
                )}
            />
        </div>
    );
}

export default UserList;