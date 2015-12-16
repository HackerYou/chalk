import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Instructors',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			instructors: []
		}
	},
	componentWillMount(){
		userData.getInstructors().then(res=>{
			this.setState({
				instructors: res.user
			});
		});
	},
	renderInstructors(key, index){
		return <li key={index}>
							<p><strong>{this.state.instructors[index].firstName + ' ' + this.state.instructors[index].lastName}</strong></p>
							<p>{this.state.instructors[index].email}</p>
							<p>{this.state.instructors[index].courses.length} Classrooms</p>
							<p>Remove User? <i className="chalk-remove red"></i></p>
						</li>
	},
	render() {
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
						<h1>Manage Instructors</h1>
					</header>
				</div>
				<section className="full card detailsForm">
					<form action="">
						<h2>Add a new instructor</h2>
						<div className="fieldRow">
							<label htmlFor="name">Search by name</label>
							<input type="text"/>
							<button className="success">Save Instructors</button>
							<button className="primary">Create Classroom</button>
						</div>
					</form>
				</section>
				<div className="container card instructorWrap">
					<ul className="instructorList">
						{this.state.instructors.map(this.renderInstructors)}
					</ul>
				</div>
			</div>
		)
	}
});