import React from 'react';
// import Dashboard from '../dashboard/index.jsx';
import { Router, Route, Link, Navigation } from 'react-router';
import Footer from '../footer/index.jsx';

export default React.createClass({
	render() {
		return (
			<div>
				<form>
					<img src="../images/logo-hackeryou.svg" alt="HackerYou Logo"></img>
					<h1>Chalk</h1>
					<label for="email">email</label>
					<input type="text" ref="email" placeholder="Your Email"/>
					<label for="password">password</label>
					<input type="password" ref="password" placeholder="Password"/>
					<button className="primary">Sign In</button>
					<a href="#">Lost your password?</a>
				</form>
			</div>
		)
	}
});