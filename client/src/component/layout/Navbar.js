import React from 'react';
import { Link } from "react-router-dom";

function Navbar (props){
    function toDateInputValue() {
        const local = new Date();
        return local.toJSON().slice(0,10);
    };

    return (
        <nav className="navbar navbar-light bg-light justify-content-between">
            <Link className="navbar-brand" to="/">Twitter</Link>
        <div>
            <form className="form-inline my-2 my-lg-0 search_bar" onSubmit={props.handleSearch}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name="searchField"></input>
                <input className="form-control mr-sm-2" type="number" defaultValue="25" name="limitField" min="1" max="100"></input>
                <input type="date" name="dateField" defaultValue={toDateInputValue()}></input>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>

            {props.user &&
                <div>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/additem">Add Item</Link>
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={props.handleLogout}>Log out</button>
                </div>
            }
            {!props.user &&
                <div>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/signin">Sign in</Link>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/adduser">Sign up</Link>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/verify">Verify</Link>
                </div>
            }
        </nav>
    );
}

export default Navbar;