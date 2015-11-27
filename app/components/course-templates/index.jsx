import React from 'react';
import { Link, History } from 'react-router';
import Template from '../template/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';

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
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Course Templates</h1>
				</div>
				<section className="full card detailsForm">
					<form action="">
						<h2>Create New Template</h2>
						<div className="fieldRow">
							<label htmlFor="enddate" className="inline largeLabel">Template Name</label>
							<input type="text" placeholder="Intro to HTML"/>
							<button className="success">Save Template</button>
							<button className="error">Cancel</button>
						</div>
					</form>
				</section>
				<div className="container">
					<section className="templateWrap">
						{Object.keys(this.state.courses).map(this.renderTemplates)}
					</section>
				</div>
			</div>
		)
	}
});