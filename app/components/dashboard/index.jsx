import React from 'react';
import { Link, History } from 'react-router';
import Course from '../course/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';
import config from '../../services/config.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import Loading from '../loading/index.jsx';
import auth from '../../services/authentication.jsx';
import ClassroomContainer from './classroom-container.jsx';
import user from '../../services/user.jsx';

export default React.createClass({
	displayName: 'Dashboard',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			courses: [],
			filter: 'SHOW_ALL',
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
			this.setState({
				filter: res.user.dashboardFilter || 'SHOW_ALL'
			})

		});
	},

	favoriteClass(id) {
		user.favoriteClass(id)
			.then((res) => {
				this.setState({user: res.user});
			});
    },

    unFavoriteClass(id) {
		user.unFavoriteClass(id)
			.then((res) => {
				this.setState({user: res.user});
			});
    },

	updateFilter(filter) {
		user.setDashboardFilter(filter);
		this.setState({
			filter
		})
	},


	render() {
		let isAdmin = this.state.user.admin;
		let adminPanel = <header className="intro">
			<h2>What would you like to do?</h2>
			<div className='buttons'>
				<Link className="linkBtn dashboardBtn" to='/classroom/manage'>
					<i className="fa fa-th-large"></i>
					<p>Classrooms</p>
				</Link>
				<Link className="linkBtn dashboardBtn" to='topics'>
					<i className="fa fa-th-list"></i>
					<p>Topics</p>
				</Link>
				<Link className="linkBtn dashboardBtn" to='course-templates'>
					<i className="fa fa-file-text"></i>
					<p>Course Templates</p>
				</Link>
				<Link className="linkBtn dashboardBtn" to='instructors'>
					<i className="fa fa-graduation-cap"></i>
					<p>Instructors</p>
				</Link>
				<Link className="linkBtn dashboardBtn" to='members'>
					<i className="fa fa-users"></i>
					<p>Members</p></Link>
				<Link className="linkBtn dashboardBtn" to='media'>
					<i className="fa fa-file-image-o"></i>
					<p>Media</p>
				</Link>
				<Link className="linkBtn dashboardBtn" to='questions'>
					<i className="fa fa-check-square-o"></i>
					<p>Questions</p>
				</Link>
					<Link className="linkBtn dashboardBtn" to='issues'>
					<i className="fa fa-inbox"></i>
					<p>Flagged Notes</p>
				</Link>
			</div>
		</header>;

		return (
			<div className="container full classroom-container">
				{isAdmin ? adminPanel : null}
				<ul className='filters'>
					<li onClick={() => this.updateFilter('SHOW_FAVORITES') } 
						className={this.state.filter === 'SHOW_FAVORITES' ? 'filter selected' : 'filter'}>
						<i className="fa fa-star" aria-hidden="true" />
					</li>
					<li onClick={() => this.updateFilter('SHOW_ALL') } 
						className={this.state.filter === 'SHOW_ALL' ? 'filter selected' : 'filter'}>
							<i className="fa fa-th-large" aria-hidden="true" />
					</li>
				</ul>
				<div className="content">
				<Loading loading={this.state.loading} />
				<h1>Your Classrooms</h1>
					<ClassroomContainer 
						filter={this.state.filter}
						favoriteClass={this.favoriteClass}
						unfavoriteClass={this.unFavoriteClass}
						userFavorites={this.state.user.favoriteClassrooms}
						classrooms={this.state.courses} 
					/>
				</div>
			</div>
		)
	}
});
