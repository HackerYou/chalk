import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, Navigation, History } from 'react-router';
import Login from './login/index.jsx';
import Dashboard from './dashboard/index.jsx';
import Classroom from './classroom/index.jsx';
import Lesson from './lesson/index.jsx';
import Exercises from './exercises/index.jsx';
import Topics from './topics/index.jsx';
import LessonTopics from './lesson-topic/index.jsx';
import Footer from './footer/index.jsx';
import Media from './media/index.jsx';
import Instructors from './instructors/index.jsx';
import Headline from './headline/index.jsx';
import EditClassroom from './edit-classroom/index.jsx';
import ManageClassrooms from './manage-classrooms/index.jsx';
import EditLesson from './lesson-edit/index.jsx';
import EditTopics from './topic-edit/index.jsx';
import NewTopic from './topic/new.jsx';
import NewLesson from './lesson-edit/new.jsx';
import CourseTemplates from './course-templates/index.jsx';
import Members from './members/index.jsx';
import userData from '../services/user.jsx';
import config from '../services/config.jsx';
import auth from '../services/authentication.jsx';
import Modal from './modal/index.jsx';


let createBrowserHistory = require('history/lib/createBrowserHistory');
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

function userName(context) {
	if(auth.authenticated() === 'true' && Object.keys(context.state.user).length === 0) {
		userData.getUser(config.getUserId()).then(data => {
			userData.storeUser(data.user);
			context.setState({
				user: data.user
			});
			if(context.state.user.first_sign_up === true) {
				context.setState({
					isModalOpen: true
				});
			}
		});
	}
};



let App = React.createClass({
	displayName: 'App',
	mixins: [History],
	componentDidMount() {
		userName(this);
	},
	componentWillReceiveProps(){
		userName(this);
	},
	getInitialState(){
		return{
			user: {},
			announcement: {},
			isModalOpen: false,
			sign_up_error: ''
		}
	},
	clearUser() {
		this.setState({
			user: {}
		});
	},
	updateUser(e) {
		e.preventDefault();
		if(this.refs.password.value === this.refs.confirm.value) {
			let model = this.state.user;
			console.log(this.refs.password.value);
			model.firstName = this.refs.firstName.value;
			model.lastName = this.refs.lastName.value;
			model.password = this.refs.password.value;
			userData.updateUser(model).then((res) => {
				this.setState({
					user: res.user,
					isModalOpen: false
				});
			});	
		}
		else {
			this.setState({
				sign_up_error: 'Make sure your passwords match.'
			});
		}
	},
	render() {
		var header; 
		if (location.pathname == '/'){
			header = null;
		} else{
			header = <Headline user={this.state.user} history={this.props.history} clearUser={this.clearUser}/>;
		}
		return (
			<div className="wrapper">
				{header}
				<section className="mainContent" >
					{this.props.children || <Login />}
				</section>
				<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
					<h2>Welcome to HackerYou!</h2>
					<form action="" onSubmit={this.updateUser}>
						<h3>Tell us a bit about yourself!</h3>
						<label htmlFor="firstName">First Name</label>
						<input type="text" placeholder="First Name" ref="firstName" id="firstName"/>
						<label htmlFor="lastName">Last Name</label>
						<input type="text" placeholder="Last Name" ref="lastName" id="lastName" />
						<h3>Create New Password</h3>
						{this.state.sign_up_error}
						<label htmlFor="password">New Password</label>
						<input type="password" placeholder="New Password" ref="password"id="password"/>
						<label htmlFor="confirm">Confirm Password</label>
						<input type="password" placeholder="Confirm Password" ref="confirm" id="confirm" />
						<button>Let's Go!</button>	
					</form>					
				</Modal>
				<Footer />
			</div>
		);
	}
});


ReactDom.render(
	(<Router history={createBrowserHistory()}>
		<Route path='/' component={App}>
			<Route path='/dashboard' component={Dashboard} />
			<Route path='/classroom' component={Classroom} />
			<Route path='/classroom/edit' component={EditClassroom}/>
			<Route path='/classroom/manage' component={ManageClassrooms}/>
			<Route path='/lesson' component={Lesson} />
			<Route path='/lesson/:lessonId/edit' component={EditLesson}/>
			<Route path='/lesson/new' component={NewLesson} />
			<Route path='/topics' component={Topics} />
			<Route path='/topic/:topicId/edit' component={EditTopics} />
			<Route path='/topic/new' component={NewTopic} />
			<Route path='/exercises' component={Exercises} />
			<Route path='/instructors' component={Instructors} />
			<Route path='/media' component={Media} />
			<Route path='/course-templates' component={CourseTemplates} />
			<Route path='/members' component={Members} />
		</Route>
	</Router>)
	, document.getElementById('app'));


