import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter} from "react-router-dom";
import axios from 'axios';
import Navbar from './component/layout/Navbar';
import LoginForm from './component/user/LoginForm';
import SignUpForm from './component/user/SignUpForm';
import Verify from './component/user/Verify';
import Home from './component/twitter/Home';
import AddItem from './component/twitter/AddItem';
import SearchResult from './component/search/SearchResult';
import Search from'./component/search/Search';
import Item from'./component/twitter/Item';
import Following from'./component/user/Following';
import Followers from'./component/user/Followers';
import { notification } from 'antd';
import UserProfile from './component/user/UserProfile';

function App(props) {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [item, setItem] = useState(null);
    const [userprofile, setUserProfile] = useState(null);

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
        props.history.push('/');
    }
    
    async function handleGetTwitter(event){
        event.preventDefault();
        const id = event.target.twitter_id.value;
        const res = await axios.get('/item/' + id);
        setItem(res.data.item);
        props.history.push('/item/' + id);
    }

    async function handleDeleteTwitter(event){
        event.preventDefault();
        const id = event.target.twitter_id.value;
        const res = await axios.delete('/item/' + id);
        //alert(res.data.status);
        const successArgs = {
            message: 'Tweet successfully deleted',
            description:
              'Id: ' + id,
            duration: 0,
        };
        const failArgs = {
            message: 'Failed to delete Tweet',
            description:
              'Id: ' + id,
            duration: 0,
        };
        if(res.data.status=="OK")
            notification.open(successArgs);
        else
            notification.open(failArgs);
        //setItem(res.data.item);
        props.history.push('/');
    }

    async function handleSearch(event) {
        event.preventDefault();
        let unixTime;
        if(event.target.dateField.value.length !== 0){
            unixTime = parseInt((new Date(event.target.dateField.value).getTime() / 1000).toFixed(0))+86399; //adding an extra day when passing the input from datepicker.
        }
        //At this point. If the request is sent from the front end, it will go through the checks above. 
        //If no time provided, leave it blank, if provided, use datepicker.value + one day to include today in the search result. 
        const res = await axios.post('/search', { 
            timestamp: unixTime,
            limit: parseInt(event.target.limitField.value),
            q: event.target.searchByString,
            username:event.target.searchByUsername,
            following: event.target.followingCheck.checked,
        });
        if(!res.data.error){
            setSearchResult(res.data.items);
            props.history.push('/searchresult');
        }
    }

    async function handleUserProfile(event) {
        event.preventDefault();
        const res = await axios.get('/user/'+event.target.targetuser, { 

        });
        if(!res.data.error){
            setUserProfile(res.data.user);
        }  
    }



    return (
        <div>
            <Navbar user = {user} handleLogout={handleLogout}/>
            <Switch>
                <Route exact path="/" render={() => (<Home/>)} />
                <Route exact path = "/search" render={() => (<Search handleSearch= {handleSearch} handleGetTwitter={handleGetTwitter}/>)} />
                <Route exact path="/searchresult" render={() => (<SearchResult searchResult={searchResult} />)} />
                <Route exact path="/item/:id" render={() => (<Item item={item} handleDeleteTwitter={handleDeleteTwitter}/>)} />
                <Route exact path="/user/:username" render={() => (<UserProfile item={item} handleUserProfile={handleUserProfile}/>)} />
                <Route path="/user/:username/following" render={() => (<Following />)} />
                <Route path="/user/:username/followers" render={() => (<Followers />)} />
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