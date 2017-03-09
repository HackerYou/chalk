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
			questions: [],
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'true',
			selectedQuestions: [],
			testId: "",
			selectedCard: false,
			testQuestions: [],
			testCreated: false,
			testTitle: "",
			showTest: "true"

		}
	},
	updateField(e, field) {
		const val = e.target.value;
		this.setState(prevState => {
			return {
				...prevState,
				[field]: val
			}
		});
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
	removeQuestion(e,Id) {
		const testQuestions = this.state.testQuestions;
		const index = testQuestions.indexOf(Id);

		testQuestions.splice(index, 1)
		this.setState({
			testQuestions
		})

		TestData.removeQuestion(this.state.testId, {
			questionId: Id
		}).then(res => {
			console.log("removed", res.test.questions)
		})
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			//checking to see if selectedId is INCLUDED in list of all questions
			const isSelected = this.state.testQuestions.includes(item._id);
			return <QuestionCards key={`question-${i}`} question={item} selectCard={this.selectCard}  selectButton={this.state.selectButton} classId={this.props.params.courseId} showSelected={!isSelected} removeCard={this.removeQuestion}/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	//add questions
	selectCard(e, selectedInfo) {
		e.preventDefault();
		const newArray = this.state.selectedQuestions.slice();
		const questionArray = [];
		const testQuestions = this.state.testQuestions;

		TestData.updateTest(this.state.testId, {
			questionId: selectedInfo
		}).then(res => {
			const questions = res.test.questions;

			console.log('update', questions)
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
				testQuestions: questions.map((res) => res._id)
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
		const showTest = this.state.showTest

		console.log(`showtest: ${showTest}`);
		TestData.createTest({
			courseId: this.props.params.courseId,
			data: {
				title: testName,
				show: showTest
			}
		})
		.then(res => {
			this.setState({
				testId: res.test._id,
				testCreated: true,
				testTitle: testName
			})

		});
	},
	render() {
		return (
			<div className="classCard">
				<section className={this.state.testCreated === true ? 'cardHide' : 'full detailsForm card'}>
					<form onSubmit={this.createNewTest}>
						<label>What is the name of the test?</label>
						<input type="text" ref={ref => this.testName = ref}/>
						<input type="submit" />
						<div className="fieldRow">
							<label htmlFor="show">
								Show test in classroom?
							</label>
							<select value={this.state.show} onChange={e => this.updateField(e, "showTest")} id="show">
								  <option value="true">Yes</option>
								  <option value="false">No</option>
							</select>
						</div>
					</form>
				</section>
				<h2 className={this.state.testCreated === false ? 'cardHide' : null}>Test Created: {this.state.testTitle}</h2>
				<section className={this.state.testCreated === false ? 'cardHide' : 'full detailsForm card'}>
					<FilteredSearch questionState={this.state.questions} showFiltered={this.showFiltered}/>
				</section>
				<section className={this.state.testCreated === false ? 'cardHide' : 'full'}>
					<h2>Create Your Test</h2>
					<div className="full testForm">
						<ul className="testTally">
							<li>Num of questions: {this.state.testQuestions.length}</li>
							<li>Level of difficulty: 0</li>
							<li>Num of multiple choice: 0</li>
							<li>Num of code questions: 0</li>
						</ul>
					</div>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
					<br/>
					<Link onClick={this.viewTest} to={`/classroom/${this.props.params.courseId}/view-test/${this.state.testId}`} className="primary">View Test</Link>
				</section>
			</div>
		)
	}	

	//this.state.testId

});
