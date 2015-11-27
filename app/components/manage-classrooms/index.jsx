import React from 'react';
import { Link } from 'react-router';
import Course from '../course/index.jsx';

export default React.createClass({
	displayName: 'ManageClassrooms',
	getInitialState(){
		return {
			courses: {}
		}
	},
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			courses: data.user.courses
		});
	},
	renderCourses(key){
		return <Course key={key} index={key} details={this.state.courses[key]} />
	},
	render() {
		return (
			<div className="container">
				<header className="topContent">
					<Link className="linkBtn" to='/dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				</header>
				<div className="card setupCard">
					<h2>Create a new classroom</h2>
					<form action="">
						<div className="fieldRow">
							<label htmlFor="template" className="inline">Template</label>
							<select name="template" id="template">
								<option value="1">Template One</option>
								<option value="2">Template Two</option>
							</select>
						</div>
						<div className="fieldRow">
							<label htmlFor="term" className="inline">Term</label>
							<input id="term" type="text" placeholder="Enter Term"/>
						</div>
						<div className="fieldRow">
							<label htmlFor="startdate" className="inline">Start Date</label>
							<input id="startdate" type="text" placeholder="Enter Start Date"/>
							<label htmlFor="enddate" className="inline">End Date</label>
							<input type="text" id="enddate" placeholder="Enter End Date"/>
						</div>
						<div className="fieldRow">
							<label htmlFor="instructor" className="inline">Instructor</label>
							<select name="instructor" id="instructor">
								<option value="drew">Drew Minns</option>
								<option value="ryan">Ryan Christiani</option>
								<option value="kristen">Kristen Spencer</option>
							</select>
							<small><a href="#">Create new instructor</a></small>
						</div>
						<div className="fieldRow">
							<label htmlFor="desc">Classroom Description</label>
							<textarea name="desc" id="desc" cols="30" rows="10"></textarea>
						</div>
						<button className="success">Create Classroom</button>
						<button className="error">Cancel</button>
					</form>
				</div>
				<div className="content">
					<h1>Your Classrooms</h1>
					<section className="dashWrap">
						 {Object.keys(this.state.courses).map(this.renderCourses)}
					</section>
				</div>
			</div>
		)
	}
});