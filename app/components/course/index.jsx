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
		},(err) => {
			console.error(err);
		});
	},
	goToClass(e){
		e.preventDefault();
		if (e.target.dataset.classid !== undefined) {
			this.history.pushState(null, `/classroom/${e.target.dataset.classid}`);
		}
	},
	render() {
		return (
			<div to="/classroom" className="classCard">
				<article className="card" onClick={this.goToClass} data-classid={this.props.details._id}>
					<h3>{this.props.details.title}</h3>
					<h4>Instructor: {this.state.instructor.firstName + " " + this.state.instructor.lastName}</h4>
					<footer className="classCardMeta">
						<p className="red"><strong>{this.props.details.term}</strong></p>
						<button data-classid={this.props.details._id} onClick={this.goToClass} className="primary">View Class</button>
					</footer>
				</article>
			</div>
		)
	}
});