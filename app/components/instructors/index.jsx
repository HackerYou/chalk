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
    removeUser(event) {
        let userId = event.target.dataset.user;
        userData.deleteUser(userId).then((res) => {
            let removeIndex = (this.state.instructors).map((obj, index)=>{
                //get index of the user ID
                return obj._id;
            }).indexOf(userId);

            //remove user from state
            this.state.instructors.splice(removeIndex, 1);

            this.setState({
                members: this.state.instructors
            });
        });
    },
	renderInstructors(key, index){
		return <li key={index}>
					<p><strong>{this.state.instructors[index].firstName + ' ' + this.state.instructors[index].lastName}</strong></p>
					<p>{this.state.instructors[index].email}</p>
					<p>{this.state.instructors[index].courses.length} Classrooms</p>
					<p>Remove User? <i className="chalk-remove red" onClick={this.removeUser} data-user={this.state.instructors[index]._id}></i></p>
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