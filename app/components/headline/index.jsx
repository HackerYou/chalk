import React from 'react';
import { Router, Route, Link, Navigation, History } from 'react-router';
import auth from '../../services/authentication.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Header',
	logOut() {
		auth.logOut();
		this.props.clearUser();
		this.props.history.pushState(null,'/');
	},
	render() {
		let user = userData.getStoredUser();
		let userInfo;
		if (Object.keys(user).length === 0) {
			userInfo = <h3>Loading</h3>;
		} else {
			userInfo = <div className="userInfo"><h3>Hello, {user.firstName} {user.lastName}</h3><p className="signOut"><a href="#" className="strong" onClick={this.logOut}><i className="chalk-log-out"></i>Log out of {user.email}</a></p></div>;
		}
		return (
			<header className="mainHeader">
				<div className="innerWrap card">
					<Link to="/dashboard" className="linkBtn topLogo"><img src="/images/logo-hackeryou.svg" alt="HackerYou Logo" /></Link>
					{userInfo}
				</div>
			</header>
		)
	}
});
