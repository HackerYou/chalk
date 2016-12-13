import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx'
import config from '../../services/config.jsx';
import QuestionCards from '../questions/cards.jsx';
import FilteredSearch from '../questions/filteredSearch.jsx';

export default React.createClass({
	displayName: 'CreateTest',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			user: {},
			course: {},
			sections: [],
			isModalOpen: false,
			topics: [],
			members: [],
			questions: [],
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'true'
		}
	},
	componentWillMount(){
		questionData.getQuestion()
			.then((res) => {
				this.setState({
					questions: res.questions
				})
			})
	},
	showFiltered(options) {
		console.log("options",options)
		this.setState(options);
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			return <QuestionCards key={`question-${i}`} question={item} selectCard={this.selectCard} selectButton={this.state.selectButton} classId={this.props.params.courseId} path={this.props.location.pathname}/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	selectCard() {

		const linkLoc = this.context.router;
		console.log("selected", linkLoc);

	},
	render() {
		return (
			<div className="classCard">
				<section className="full detailsForm topicsForm card">
					<FilteredSearch questionState={this.state.questions} showFiltered={this.showFiltered}/>
				</section>
				<section>
					<h2>Create Your Test</h2>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
				</section>
			</div>
		)
	}	

});
