import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter} from "react-router-dom";
import axios from 'axios';
import Navbar from './component/layout/Navbar';
import LoginForm from './component/user/LoginForm';
import SignUpForm from './component/user/SignUpForm';
import Verify from './component/user/Verify';
import Home from './component/twitter/Home';
import AddItem from './component/twitter/AddItem';

function App(props) {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('/user');
            setUser(res.data.username);
        };
        fetchData();
    }, []);

    async function handleLogin(event) {
        event.preventDefault();
        const res = await axios.post('/login', { 
                username: event.target.username.value,
                password: event.target.password.value   
        });
        setUser(res.data.username);
        setErrorMessage(res.data.error);
        if(!res.data.error)
            props.history.push('/');
    }

    async function handleLogout(event) {
        await axios.post('/logout');
        setUser(null);
        props.history.push('/');
    }
    
    async function handleSignUp(event){
        event.preventDefault();
        await axios.post('/adduser', {
            username: event.target.username.value,
            password: event.target.password.value,
            email: event.target.email.value,
        });
        props.history.push('/verify');
    }

    async function handleVerifcation(event){
        event.preventDefault();
        await axios.post('/verify', {
            email: event.target.email.value,
            key: event.target.verifyCode.value,
        });
        props.history.push('/');
    }

    // add item function 
    async function handleAddItem(event){
        event.preventDefault();
        await axios.post('/additem', {
            username: user,
            content: event.target.content.value,
            childType: null// may need a function to check childtype
        });
        props.history.push('/');
    }
    
    return (
        <div>
            <Navbar user = {user} handleLogout={handleLogout}/>
            <Switch>
                <Route exact path="/" render={() => (<Home />)} />
                {!user && 
                    <React.Fragment>
                        <Route path="/verify" render={() => (<Verify handleVerifcation={handleVerifcation}/>)} />
                        <Route path="/adduser" render={() => (<SignUpForm handleSignUp={handleSignUp}/>)} />
                        <Route path="/signin" render={() => (<LoginForm handleLogin={handleLogin} errorMessage={errorMessage}/>)}/> 
                    </React.Fragment>
                }
                {user &&
                    <React.Fragment>
                            <Route path="/additem" render={() => (<AddItem handleAddItem={handleAddItem}/>)} />
                    </React.Fragment>
                }
                <Route render={() => <NotFound message={"Not avaialbe or you have to log " + (user ? "out" : "in")} />}/>
            </Switch>
        </div>
    )
}

function NotFound(props) {
    return (
        <h1>{props.message}</h1>
    )
}

export default withRouter(App);