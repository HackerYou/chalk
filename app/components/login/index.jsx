import React from 'react';
import Dashboard from '../dashboard/index.jsx';
import {  Link, History } from 'react-router';
import Footer from '../footer/index.jsx';
// let History = ReactRouter.History;

export default React.createClass({
	displayName: 'Login',
	mixins: [History],
	login(e){
		e.preventDefault;
		this.history.pushState(null ,'/dashboard');
	},
	render() {
		return (
			<div>
				<form onSubmit={this.login}>
					<img src="../images/logo-hackeryou.svg" alt="HackerYou Logo"></img>
					<h1>Chalk</h1>
					<label htmlFor="email">email</label>
					<input type="text" ref="email" placeholder="Your Email"/>
					<label htmlFor="password">password</label>
					<input type="password" ref="password" placeholder="Password"/>
					<button className="primary">Sign In</button>
					<a href="#">Lost your password?</a>
				</form>
			</div>
		)
	}
});