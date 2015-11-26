import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';

export default React.createClass({
	displayName: 'Instructors',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			instructors: []
		}
	},
	componentWillMount(){
		let data = require('../sample-data.js');
		let instructor = (data.members).filter((val)=>{
			return val.instructor === true;
		});
		this.setState({
			instructors: instructor
		});
	},
	renderInstructors(key, index){
		return <li key={index}>
							<p><strong>{this.state.instructors[index].firstName + ' ' + this.state.instructors[index].lastName}</strong></p>
							<p>{this.state.instructors[index].email}</p>
							<p>{this.state.instructors[index].courses.length} Classrooms</p>
							<p>Remove User? <i className="chalk-remove"></i></p>
						</li>
	},
	render() {
		return (
			<div>
				<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<h1>Manage Instructors</h1>
				<form action="" className="card">
					<h2>Add a new Instructor</h2>
					<label htmlFor="name">Search by name</label>
					<input type="text"/>
					<button className="success">Save Instructors</button>
					<button className="primary">Create Classroom</button>
				</form>
				<ul className="card">
					{this.state.instructors.map(this.renderInstructors)}
				</ul>
			</div>
		)
	}
});