import React from 'react';
import Dashboard from '../dashboard/index.jsx';
import { Link, History } from 'react-router';
import Footer from '../footer/index.jsx';
import auth from '../../services/authentication.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
  displayName: 'Login',
	mixins: [History],
	getInitialState() {
		return {
			error: '',
			lostPassword: false,
			passwordMessage: ''
		}
	},
	componentWillMount() {
		if(auth.authenticated() === 'true') {
			this.history.pushState(null,'/dashboard');
		}
	},
	login(e){
		e.preventDefault();
		auth.login(this.refs.email.value,this.refs.password.value).then((res) => {
			if(res.success) {
				this.history.pushState(null ,'/dashboard');
			}
		}, (err) => {
			this.setState({
				error: err.message
			});
		});
	},
	lostPassword() {
		this.setState({
			lostPassword: true
		});
	},
	sendResetEmail(e) {
		e.preventDefault();
		userData.lostPassword(this.refs.email.value).then(res => {
			if(res.status === 'success') {
				this.setState({
					passwordMessage: res.message
				});
			}
		});
	},
	render() {
		let form;
		if(this.state.lostPassword !== true) {
			form = (
				<div>
					<div className="fieldGroup">
						<label htmlFor="email" className="inline">email</label>
						<input type="text" ref="email" placeholder="Your Email"/>
					</div>
					<div className="fieldGroup--login">
						<label htmlFor="password" className="inline">password</label>
						<input type="password" ref="password" placeholder="Password"/>
					</div>
					<div className="fieldGroup">
						<input type="submit" className="button primary" value="Sign In" onClick={this.login} />
					</div>
					<p className="red">{this.state.error}</p>
					<p><a href="#" onClick={this.lostPassword}>Lost your password?</a></p>
				</div>
			);
		}
		else {
			form = (
				<div>
					<h3>Reset password</h3>
					{this.passwordMessage}
					<div className="fieldGroup">
						<label htmlFor="email" className="inline">email</label>
						<input type="text" ref="email" placeholder="Your Email"/>
					</div>
					<div className="fieldGroup">
						<input type="submit" className="button primary" value="Reset Password" onClick={this.sendResetEmail}/>
					</div>
				</div>
			)
		}
		return (
			<div className="card loginCard">
				<form >
					<img src="../images/logo-hackeryou.svg" className="loginLogo" alt="HackerYou Logo" />
					<h1>chalk</h1>
					{form}
				</form>
			</div>
		)
	}
});
