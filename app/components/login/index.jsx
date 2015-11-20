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
			<div className="card loginCard">
				<form onSubmit={this.login}>
					<img src="../images/logo-hackeryou.svg" className="loginLogo" alt="HackerYou Logo" />
					<h1>chalk</h1>
					<div className="fieldGroup">
						<label htmlFor="email" className="inline">email</label>
						<input type="text" ref="email" placeholder="Your Email"/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="password" className="inline">password</label>
						<input type="password" ref="password" placeholder="Password"/>
					</div>
					<div className="fieldGroup">
						<input type="submit" className="button primary" value="Sign In" />
					</div>
					<p><a href="#">Lost your password?</a></p>
				</form>
			</div>
		)
	}
});