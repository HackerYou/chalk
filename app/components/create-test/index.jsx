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
import ViewTest from '../create-test/view.jsx';
import TestData from '../../services/tests.jsx';

export default React.createClass({
	displayName: 'CreateTest',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			course: {},
			topics: [],
			members: [],
			questions: [],
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'true',
			selectedQuestions: [],
			tests: [],
			testId: "",
			allQuestions: {},
			numOfQuestions: "",
			selectedCard: false
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
		this.setState(options);
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			// console.log("item", item);
			return <QuestionCards key={`question-${i}`} question={item} isSelected={this.state.selectedCard} selectCard={this.selectCard} selectButton={this.state.selectButton} classId={this.props.params.courseId} showSelected="true"/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	selectCard(e, selectedInfo) {
		e.preventDefault();
		const newArray = this.state.selectedQuestions.slice();
		const questionArray = [];

		TestData.updateTest(this.state.testId, {
			questionId: selectedInfo
		}).then(res => {
			const questions = res.test.questions;

			if(this.state.selectCard) {
				this.setState({
					selectCard: false
				})
			} else {
				this.setState({
					selectCard: true
				})
			}

			this.setState({
				allQuestions: res.questions,
				numOfQuestions: questions.length
			})

		})

	},
	viewTest() {
		TestData.getTest(this.state.testId)
		.then(res => {
			console.log("whats this", res.test.questions);
		})

		//takes you to another view 
		//view tests
	},
	createNewTest(e) {
		e.preventDefault();
		const testName = this.testName.value;

		TestData.createTest({
			courseId: this.props.params.courseId,
			data: {
				title: testName
			}
		})
		.then(res => {
			console.log("lala", res);
	
			this.setState({
				testId: res.test._id
			})

		});
	},
	render() {
		return (
			<div className="classCard">
				<section className="full detailsForm card">
					<form onSubmit={this.createNewTest}>
						<label>What is the name of the test?</label>
						<input type="text" ref={ref => this.testName = ref}/>
						<input type="submit" />
					</form>
				</section>
				<section className="full detailsForm card">
					<FilteredSearch questionState={this.state.questions} showFiltered={this.showFiltered}/>
				</section>
				<section>
					<h2>Create Your Test</h2>
					<div className="full testForm">
						<ul className="testTally">
							<li>Num of questions: {this.state.numOfQuestions}</li>
							<li>Level of difficulty: 0</li>
							<li>Num of multiple choice: 0</li>
							<li>Num of code questions: 0</li>
						</ul>
					</div>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
					<br/>
					<Link onClick={this.viewTest} to={`/classroom/${this.props.params.courseId}/create-test/${this.state.testId}/view-test`} className="primary">View Test</Link>
				</section>
			</div>
		)
	}	

	//this.state.testId

});
