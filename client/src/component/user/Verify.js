import React from 'react';

function Verify(props) {
    return (
        <div>
        <h5 className="card-title text-color-1 pb-4 font-weight-bold">Verify</h5>
                <form className="form-signin" onSubmit={props.handleVerifcation}>
                    <div className="form-group row">
                            <label htmlFor="email" className="col-sm-3 col-form-label">Email:</label>
                            <div className="col-sm-7">
                                <input type="text" name="email" className="form-control" placeholder="Enter your email" required autoFocus />
                            </div>
                    </div>
                    <div className="form-group row">
                            <label htmlFor="verifyCode" className="col-sm-3 col-form-label">verify Code:</label>
                            <div className="col-sm-7">
                                <input type="text" name="verifyCode" className="form-control" placeholder="Enter your verifaction" required autoFocus />
                            </div>
                    </div>
                <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Verify;