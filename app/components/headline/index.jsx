import React from 'react';
import { Router, Route, Link, Navigation, History } from 'react-router';
import auth from '../../services/authentication.jsx';

export default React.createClass({
	displayName: 'Header',
	logOut() {
		auth.logOut();
		this.props.clearUser();
		this.props.history.pushState(null,'/');
	},
	render() {
		return (
			<header className="mainHeader">
				<div className="innerWrap card">
					<Link to="/dashboard" className="linkBtn topLogo"><img src="/images/logo-hackeryou.svg" alt="HackerYou Logo" /></Link>
					<h3>Hello, {this.props.user.firstName} {this.props.user.lastName}</h3>
					<p className="signOut"><a href="#" className="strong" onClick={this.logOut}><i className="chalk-log-out"></i>Log out of {this.props.user.email}</a></p>
				</div>
			</header>
		)
	}
});