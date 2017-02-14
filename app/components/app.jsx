import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, Navigation, History } from 'react-router';
import Login from './login/index.jsx';
import Dashboard from './dashboard/index.jsx';
import Classroom from './classroom/index.jsx';
import EditClassroom from './classroom/edit.jsx';
import Lesson from './lesson/index.jsx';
import Exercises from './exercises/index.jsx';
import Topics from './topics/index.jsx';
import LessonTopics from './lesson-topic/index.jsx';
import Footer from './footer/index.jsx';
import Media from './media/index.jsx';
import Instructors from './instructors/index.jsx';
import Headline from './headline/index.jsx';
import ManageClassrooms from './manage-classrooms/index.jsx';
import EditLesson from './lesson-edit/index.jsx';
import EditTopics from './topic-edit/index.jsx';
import NewTopic from './topic/new.jsx';
import NewLesson from './lesson-edit/new.jsx';
import CourseTemplates from './course-templates/index.jsx';
import EditTemplate from './course-templates/edit.jsx';
import Members from './members/index.jsx';
import userData from '../services/user.jsx';
import config from '../services/config.jsx';
import auth from '../services/authentication.jsx';
import Modal from './modal/index.jsx';
import Questions from './questions/index.jsx';
import CreateTest from './create-test/index.jsx';
import ViewTest from './create-test/view.jsx';
import EditTest from './create-test/edit-test.jsx';
import EditQuestion from './questions/edit-question.jsx';
import TestResults from './classroom/test-results.jsx';


let createBrowserHistory = require('history/lib/createBrowserHistory');
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');


function userName(context) {
	return new Promise((resolve, reject) => {

		if(auth.authenticated() === 'true') {

			userData.getUser(config.getUserId()).then(data => {
				if(data.error) {
					auth.logOut();
					context.context.history.pushState(null,'/');
					context.setState({
						sign_up_error: 'Error'
					});
				}

				userData.storeUser(data.user);

				context.setState({
					user: data.user
				});

				if(data.user && data.user.first_sign_up === true) {
					context.setState({
						isModalOpen: true
					});
				}
				resolve();
			}, err => {
				auth.logOut();
				reject();
			});
		}
	});
};



let App = React.createClass({
	displayName: 'App',
	mixins: [History],
	componentDidMount() {
		this.updateUserState();
	},
	componentWillReceiveProps(){
		this.updateUserState();
	},
	getInitialState(){
		return{
			user: {},
			isModalOpen:false,
			sign_up_error: ''
		}
	},
	clearUser() {
		this.setState({
			user: {}
		});
	},
	updateUserState() {
		return userName(this);
	},
	updateUser(e) {
		e.preventDefault();
		if(this.refs.password.value === this.refs.confirm.value) {
			let model = this.state.user;

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
			header = <Headline history={this.props.history} clearUser={this.clearUser}/>;
		}
		return (
			<div className="wrapper">
				{header}
				<section className="mainContent" >
					{this.props.children || <Login updateUserState={this.updateUserState} />}
				</section>
				<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
					<div className="modalBody--small card loginModal">
						<h2>Welcome to HackerYou!</h2>
						<form action="" onSubmit={this.updateUser}>
							<h3>Tell us a bit about yourself!</h3>
							<div className="inlineFieldRow">
								<div className="fieldGroup">
									<label htmlFor="firstName">First Name</label>
									<input type="text" placeholder="First Name" ref="firstName" id="firstName"/>
								</div>
								<div className="fieldGroup">
									<label htmlFor="lastName">Last Name</label>
									<input type="text" placeholder="Last Name" ref="lastName" id="lastName" />
								</div>
							</div>
							<h4>Create New Password</h4>
							{this.state.sign_up_error}
							<div className="inlineFieldRow">
								<div className="fieldGroup">
									<label htmlFor="password">New Password</label>
									<input type="password" placeholder="New Password" ref="password"id="password"/>
								</div>
								<div className="fieldGroup">
									<label htmlFor="confirm">Confirm Password</label>
									<input type="password" placeholder="Confirm Password" ref="confirm" id="confirm" />
								</div>
							</div>
							<button className="button primary">Let's Go!</button>
						</form>
					</div>
				</Modal>
				<Footer />
			</div>
		);
	}
});


ReactDom.render(
	(<Router history={createBrowserHistory()} onUpdate={() => window.scrollTo(0, 0)}>
		<Route path='/' component={App}>
			<Route path='/dashboard' component={Dashboard}/>
			<Route path='/classroom/manage' component={ManageClassrooms}/>
			<Route path='/classroom/:courseId' component={Classroom}/>
			<Route path='/classroom/:courseId/create-test' component={CreateTest} />
			<Route path='/classroom/:courseId/view-test/:testId' component={ViewTest} />
			<Route path='/classroom/:courseId/test-results' component={TestResults} />
			<Route path='/edit-test/:testId' component={EditTest} />
			<Route path='/classroom/:courseId/edit' component={EditClassroom} />
			<Route path='/lesson/:lessonId/:classroomId' component={Lesson} />
			<Route path='/lesson/:lessonId/:classroomId/edit' component={EditLesson}/>
			<Route path='/lesson/:classroomId/:sectionId/new' component={NewLesson} />
			<Route path='/topics' component={Topics} />
			<Route path='/topic/:topicId/edit' component={EditTopics} />
			<Route path='/topic/new' component={NewTopic} />
			<Route path='/exercises' component={Exercises} />
			<Route path='/instructors' component={Instructors} />
			<Route path='/media' component={Media} />
			<Route path='/course-templates' component={CourseTemplates} />
			<Route path='/course-templates/:templateId/edit' component={EditTemplate}/>
			<Route path='/members' component={Members} />
			<Route path='/questions' component={Questions}  />
			<Route path='/questions/:questionId/edit-question' component={EditQuestion}  />
		</Route>
	</Router>)
	, document.getElementById('app'));
