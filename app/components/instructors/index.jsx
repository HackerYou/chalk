import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import searchMixin from '../../services/mixins/searchMember.js';

export default React.createClass({
	displayName: 'Instructors',
	mixins: [AuthMixin, History, searchMixin],
	originalMembers: [],
	getInitialState(){
		return {
			members: []
		}
	},
	componentWillMount(){
		userData.getInstructors().then(res=>{

			this.originalMembers = res.user;
			this.setState({
				members: res.user
			});
		});
	},
    removeUser(event) {
        let userId = event.target.dataset.user;
        let deleteConfirm = confirm('Are you sure you want to delete this instructor?');
        if(deleteConfirm) {
	        userData.deleteUser(userId).then((res) => {
	            let removeIndex = (this.state.members).map((obj, index)=>{
	                //get index of the user ID
	                return obj._id;
	            }).indexOf(userId);

	            //remove user from state
	            this.state.members.splice(removeIndex, 1);

	            this.setState({
	                members: this.state.members
	            });
	        });
        }
    },
	renderInstructors(key, index){
		return <li key={index}>
					<p><strong>{this.state.members[index].firstName + ' ' + this.state.members[index].lastName}</strong></p>
					<p>{this.state.members[index].email}</p>
					<p>{this.state.members[index].courses.length} Classrooms</p>
					<p>Remove User? <i className="chalk-remove red" onClick={this.removeUser} data-user={this.state.members[index]._id}></i></p>
				</li>
	},
	render() {
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Manage Instructors</h1>
				</div>
				<section className="full card detailsForm">
					<form action="" onSubmit={this.searchMembers}>
						<h2>Add a new instructor</h2>
						<div className="fieldRow">
							<label htmlFor="name">Search by name</label>
							<input type="text" ref="searchQuery"/>
							<button className="primary">Search</button>
							{/*<button className="success">Save Instructors</button>*/}
							{/*<button className="primary">Create Classroom</button>*/}
						</div>
					</form>
				</section>
				<div className="container card instructorWrap">
					<ul className="instructorList">
						{this.state.members.map(this.renderInstructors)}
					</ul>
				</div>
			</div>
		)
	}
});