import React from 'react';
import { Link , History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';

export default React.createClass({
	displayName: 'Members',
	mixins: [AuthMixin,History],
	getInitialState(){
		return {
			members: []
		}
	},
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			members: data.members
		});
	},
	renderMembers(key, index){
		return <li key={index}>
							<p><strong>{this.state.members[index].firstName + ' ' + this.state.members[index].lastName}</strong></p>
							<p>{this.state.members[index].email}</p>
							<p>{this.state.members[index].courses.length} Classrooms</p>
							<p>Remove User? <i className="chalk-remove"></i></p>
						</li>
	},
	render() {
		return (
			<div>
				<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<h1>Manage Members</h1>
				<form action="" className="card">
					<label htmlFor="search">Search by name or email</label>
					<input type="text" id="search"/>
				</form>
				<ul>
					{this.state.members.map(this.renderMembers)}
				</ul>
			</div>
			)
	}
});