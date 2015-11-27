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
import EditLesson from './edit-lesson/index.jsx';
import EditTopics from './topic-edit/index.jsx';
import CourseTemplates from './course-templates/index.jsx';
import Members from './members/index.jsx';
import CreateLesson from './lesson-create/index.jsx';
import userData from '../services/user.jsx';
import config from '../services/config.jsx';
import auth from '../services/authentication.jsx';


let createBrowserHistory = require('history/lib/createBrowserHistory');
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

function userName(context) {
	if(auth.authenticated() === 'true' && Object.keys(context.state.user).length === 0) {
		userData.getUser(config.getUserId()).then(data => {
			console.log(data);
			context.setState({
				user: data.user
			});
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
			announcement: {}
		}
	},
	render() {
		var header; 
		if (location.pathname == '/'){
			header = null;
		} else{
			header = <Headline user={this.state.user} history={this.props.history}/>;
		}
		return (
			<div className="wrapper">
				{header}
				<section className="mainContent">
					{this.props.children || <Login />}
				</section>
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
			<Route path='/lesson/edit' component={EditLesson}/>
			<Route path='/lesson/create' component={CreateLesson} />
			<Route path='/topics' component={Topics} />
			<Route path='/topic/edit' component={EditTopics} />
			<Route path='/exercises' component={Exercises} />
			<Route path='/instructors' component={Instructors} />
			<Route path='/media' component={Media} />
			<Route path='/course-templates' component={CourseTemplates} />
			<Route path='/members' component={Members} />
		</Route>
	</Router>)
	, document.getElementById('app'));