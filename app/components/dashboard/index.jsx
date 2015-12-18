import React from 'react';
import { Link, History } from 'react-router';
import Course from '../course/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import config from '../../services/config.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Dashboard',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			courses: [],
			user: {}
		}
	},
	componentWillMount(){
		let user = userData.getUser(config.getUserId()).then(res=>{
			let isAdmin = res.user.admin;
			if (isAdmin) {
				this.setState({
					user: res.user
				});
				coursesData.getCourses().then(res=>{
					let courses = (res.course).filter((obj)=>{
						return obj.template === false;
					});
					this.setState({
						courses: courses
					});
				});
			} else {
				this.setState({
					user: res.user,
					courses: res.user.courses
				});
				
			}
		});	
	},
	renderCourses(key, index){
		return <Course key={index} index={index} details={this.state.courses[index]} />
	},
	render() {
		let isAdmin = this.state.user.admin;
		let adminPanel = <header className="intro">
					<h2>What would you like to do?</h2>
					<div className='buttons'>
						<Link className="linkBtn" to='/classroom/manage'><button className="primary">Classrooms</button></Link>
						<Link className="linkBtn" to='topics'><button className="primary">Topics</button></Link>
						<Link className="linkBtn" to='course-templates'><button className="primary">Course Templates</button></Link>
						<Link className="linkBtn" to='instructors'><button className="primary">Instructors</button></Link>
						<Link className="linkBtn" to='media'><button className="primary">Media</button></Link>
						<Link className="linkBtn" to='members'><button className="primary">Members</button></Link>
					</div>
				</header>;
		return (
			<div className="container full">
				{isAdmin ? adminPanel : null}
				<div className="content">
				<h1>Your Classrooms</h1>
					<section className="dashWrap">
					 {(this.state.courses).map(this.renderCourses)}
					</section>
				</div>
			</div>
		)
	}
});