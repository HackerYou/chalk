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
			passwordMessage: '',
			resetEmail: ''
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
				this.props.updateUserState().then(() => {
					this.history.pushState(null ,'/dashboard');
				});
			}
		}, (err) => {
			this.setState({
				error: err.message
			});
		});
	},
	lostPasswordToggle() {
		let val = this.state.lostPassword ? false : true;
		this.setState({ lostPassword: val });
	},
	sendResetEmail(e) {
		e.preventDefault();
		userData.lostPassword(this.refs.email.value).then(res => {
			if(res.status === 'success') {
				this.setState({
					passwordMessage: res.message,
					lostPassword: false
				});
			}
		});
	},
	resetEmailChange(e) {
		this.setState({
			resetEmail: e.target.value
		});
	},
	render() {
		let form;
		let error = (<p className="red">{this.state.error}</p>)
		if(this.state.lostPassword !== true) {
			form = (
				<div>
					<p>{this.state.passwordMessage}</p>
					<div className="fieldGroup">
						<label htmlFor="email" className="inline">email</label>
						<input type="text" ref="email" placeholder="Your Email"/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="password" className="inline">password</label>
						<input type="password" ref="password" placeholder="Password"/>
					</div>
					<div className="fieldGroup">
						<input type="submit" className="button primary" value="sign in" onClick={this.login} />
					</div>
					<div className="fieldGroup">
						{this.state.error ? error : null}
						<p><a href="#" onClick={this.lostPasswordToggle}>lost your password?</a></p>
					</div>
				</div>
			);
		}
		else {
			form = (
				<div>
					<h3>reset your password</h3>
					{this.passwordMessage}
					<div className="fieldGroup">
						<label htmlFor="email" className="inline">email</label>
						<input type="text" ref="email" placeholder="Your Email" value={this.state.resetEmail} onChange={this.resetEmailChange}/>
					</div>
					<div className="fieldGroup">
						<input type="submit" className="button primary" value="reset password" onClick={this.sendResetEmail}/>
					</div>
					<div className="fieldGroup">
						<p><a href="#" onClick={this.lostPasswordToggle}>Back to login</a></p>
					</div>
				</div>
			)
		}
		return (
			<div className="card loginCard">
				<form >
					<img src="../images/logo-hackeryou.svg" className="loginLogo" alt="HackerYou Logo" />
					<h1>readme</h1>
					{form}
				</form>
			</div>
		)
	}
});
