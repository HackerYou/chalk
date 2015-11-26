import React from 'react';
import { Link, History } from 'react-router';
import Template from '../template/index.jsx';
import AuthMixin from '../../sercives/authMixin.jsx';

export default React.createClass({
	displayName: 'CourseTemplates',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			courses: {}
		}
	},
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			courses: data.user.courses
		});
	},
	renderTemplates(key){
		return <Template key={key} index={key} details={this.state.courses[key]} />
	},
	render() {
		return (
			<div>
				<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<h1>Course Templates</h1>
				<form action="" className="card">
					<h2>Create New Template</h2>
					<h3>Template Name</h3>
					<input type="text" placeholder="Intro to HTML"/>
					<button className="success">Save Template</button>
					<button className="error">Cancel</button>
				</form>
				<ul className="templates">
					{Object.keys(this.state.courses).map(this.renderTemplates)}
				</ul>
			</div>
		)
	}
});