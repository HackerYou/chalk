import React from 'react';
import { Link } from 'react-router';
import Course from '../course/index.jsx';

export default React.createClass({
	displayName: 'Dashboard',
	getInitialState(){
		return{
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
				<h3>What would you like to do?</h3>
				<div className='buttons'>
					<Link className="linkBtn" to='manage-classrooms'><button className="primary">Manage Classrooms</button></Link>
					<Link className="linkBtn" to='topics'><button className="primary">Manage Topics</button></Link>
					<Link className="linkBtn" to='#'><button className="primary">Course Templates</button></Link>
					<Link className="linkBtn" to='instructors'><button className="primary">Manage Instructors</button></Link>
				</div>	
				<h1>Your Classrooms</h1>
				<ul className="course-list">
					 {Object.keys(this.state.courses).map(this.renderCourses)}
				</ul>
			</div>
		)
	}
});