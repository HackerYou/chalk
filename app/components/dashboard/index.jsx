import React from 'react';
import { Link, History } from 'react-router';
import Course from '../course/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import config from '../../services/config.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import Loading from '../loading/index.jsx';
import auth from '../../services/authentication.jsx';

export default React.createClass({
	displayName: 'Dashboard',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			courses: [],
			user: {},
			loading: true
		}
	},
	componentWillMount(){
		let user = userData.getUser(config.getUserId()).then(res => {
			if(res.error) {
				auth.logOut();
				this.props.history.pushState(null,'/');
				return;
			}
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
						courses: courses,
						loading: false
					});
				});
			} else {
				this.setState({
					user: res.user,
					courses: res.user.courses,
					loading: false
				});
			}
		});
	},
	renderCourses(key, index){
		return <Course key={index} index={index} details={this.state.courses[index]} />
	},
	renderEmpty() {
		return <p className="emptyState">You're not the member of any classrooms</p>
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
		var displayClass;
		if (this.state.courses.length < 0) {
			displayClass = this.renderEmpty()
		} else {
			displayClass = (this.state.courses).map(this.renderCourses)
		}
		return (
			<div className="container full">
				{isAdmin ? adminPanel : null}
				<div className="content">
				<Loading loading={this.state.loading} />
				<h1>Your Classrooms</h1>
					<section className="dashWrap">
						{displayClass}
					</section>
				</div>
			</div>
		)
	}
});
