import React from 'react';
import { Link , History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Members',
	mixins: [AuthMixin,History],
	getInitialState(){
		return {
			members: []
		}
	},
	componentWillMount(){
		userData.getUsers().then(res=>{
			this.setState({
				members: res.user
			})
		});
	},
	renderMembers(key, index){
		return <li key={index}>
							<p><strong>{this.state.members[index].firstName + ' ' + this.state.members[index].lastName}</strong></p>
							<p>{this.state.members[index].email}</p>
							<p>{this.state.members[index].courses.length} Classrooms</p>

							<div className="inputBlock">
								<div className=" fieldRow">
									<label htmlFor={this.state.members[index]._id}>Instructor?</label>
									<input onChange={this.setInstructor} type="checkbox" checked={this.state.members[index].instructor}id={this.state.members[index]._id} data-index={index}/>
								</div>
								<div className="fieldRow">
									<label htmlFor={this.state.members[index]._id+'0'}>Admin?</label>
									<input onChange={this.setAdmin} type="checkbox" checked={this.state.members[index].admin}id={this.state.members[index]._id+'0'} data-index={index}/>
								</div>
							</div>
							<p>Remove User? <i className="chalk-remove red" onClick={this.deleteUser} data-user={this.state.members[index]._id}></i></p>

						</li>
	},
	setInstructor(e){
		let index = e.target.dataset.index;
		let model = this.state.members[index];
		e.target.checked ? model.instructor = true : model.instructor = false;
		userData.updateUser(model).then(res=>{
			// console.log(res.user)
			let newArray = this.state.members;
			newArray[index] = res.user;
			this.setState({
				members: newArray
			})
		});
	},
	setAdmin(e){
		let index = e.target.dataset.index;
		let model = this.state.members[index];
		console.log(index, model)
		e.target.checked ? model.admin = true : model.admin = false;
		userData.updateUser(model).then(res=>{
			// console.log(res.user)
			let newArray = this.state.members;
			newArray[index] = res.user;
			this.setState({
				members: newArray
			})
		});
	},
	deleteUser(e){
		e.preventDefault();
		let id = e.target.dataset.user;
		userData.deleteUser(id).then(res=>{
			let removeIndex = (this.state.members).map((obj, index)=>{
				//get index of the user ID
				return obj._id;
			}).indexOf(id);

			//remove user from state
			this.state.members.splice(removeIndex, 1);

			this.setState({
				members: this.state.members
			});
		});
	},
	addUser(e){
		e.preventDefault();
		let userEmail = this.refs.users.value;
		userData.addUser(userEmail).then(res=>{
			(res.students).map((index)=>{
				userData.getUser(index).then(res=>{
					this.setState({members: this.state.members.concat(res.user)});
				});
			});
		});
		React.findDOMNode(this.refs.users).value = "";
	},
	render() {
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Manage Members</h1>
				</div>
				<section className="full card detailsForm">
					<form onSubmit={this.addUser} action="" className="addMembersForm">
						<div className="fieldRow">
							<label htmlFor="add" className="inline largeLabel">Add by email</label>
							<div className="inlineRow">
								<input ref="users" type="text" id="add" placeholder="enter emails"/>
								<small>Seperate emails by comma</small>
							</div>
							<button onClick={this.addUser} className="success">Add User</button>
						</div>
					</form>
					<form action="">
						<div className="fieldRow">
						<label htmlFor="search" className="inline largeLabel">Search by name or email</label>
						<input type="text" id="search"/>
						</div>
					</form>
				</section>
				<div className="container card memberWrap">
					<ul className="memberList">
						{this.state.members.map(this.renderMembers)}
					</ul>
				</div>
			</div>
			)
	}
});
