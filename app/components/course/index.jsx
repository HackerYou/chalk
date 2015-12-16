import React from 'react';
import { Link, History } from 'react-router';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Course',
	mixins: [History],
	getInitialState(){
		return {
			instructor: {}
		}
	},
	componentWillMount(){
		userData.getUser(this.props.details.instructor).then(res=>{
			this.setState({
				instructor: {
					firstName: res.user.firstName,
					lastName: res.user.lastName
				}
			});
		});
	},
	goToClass(e){
		e.preventDefault();
		this.history.pushState(null, `/classroom/${e.target.id}/edit`);
	},
	render() {
		return (
			<div to="/classroom" className="classCard">
				<article className="card ">
					<h3>{this.props.details.title}</h3>
					<h4>Instructor: {this.state.instructor.firstName + " " + this.state.instructor.lastName}</h4>
					<footer className="classCardMeta">
						<p className="red"><strong>{this.props.details.term}</strong></p>
						<button id={this.props.details._id} onClick={this.goToClass} className="primary">View Class</button>
					</footer>
				</article>
			</div>
		)
	}
});