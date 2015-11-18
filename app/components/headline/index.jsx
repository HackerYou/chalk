import React from 'react';
import { Router, Route, Link, Navigation, History } from 'react-router';

export default React.createClass({
	displayName: 'Header',
	render() {
		return (
			<header className="mainHeader">
				<img src="../images/logo-hackeryou.svg" alt="HackerYou Logo"></img>
				<h3>Hello, {this.props.user.first} {this.props.user.last}</h3>
				<a href="#"><p><i className="fa fa-sign-out"></i>Log out of {this.props.user.email}</p></a>
			</header>
		)
	}
});