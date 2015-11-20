import React from 'react';
import { Link } from 'react-router';
import Announcements from '../announcements/index.jsx';
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
			<div>
				<Link className="linkBtn"to='dashboard'><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<div>
					<h2>Create a new classroom</h2>
					<form action="">
						<label htmlFor="template">Template</label>
						<select name="template" id="template">
							<option value="1">Template One</option>
							<option value="2">Template Two</option>
						</select>
						<label htmlFor="term">Term</label>
						<input id="term" type="text" placeholder="Enter Term"/>
						<label htmlFor="startdate">Start Date</label>
						<input id="startdate" type="text" placeholder="Enter Start Date"/>
						<a href="#">Create new instructor</a>
						<label htmlFor="enddate">End Date</label>
						<input type="text" id="enddate" placeholder="Enter End Date"/>
						<label htmlFor="instructor">Instructor</label>
						<select name="instructor" id="instructor">
							<option value="drew">Drew Minns</option>
							<option value="ryan">Ryan Christiani</option>
							<option value="kristen">Kristen Spencer</option>
						</select>
						<label htmlFor="desc">Classroom Description</label>
						<textarea name="desc" id="desc" cols="30" rows="10"></textarea>
						<button className="success">Create Classroom</button>
						<button className="error">Cancel</button>
					</form>
				</div>
				<h1>Your Classrooms</h1>
				<ul className="course-list">
					 {Object.keys(this.state.courses).map(this.renderCourses)}
				</ul>
				<Announcements />
			</div>
		)
	}
});