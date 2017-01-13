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
	displayName: 'EditTest',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			questions: [],
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'true',
			selectedQuestions: [],
			allQuestions: {},
			numOfQuestions: "",
			selectedCard: false,
			testQuestions: [],
			testCreated: false,
			courseId: "",
			testInfo: {
				title: ""
			}
		}
	},
	componentWillMount(){
		questionData.getQuestion()
			.then((res) => {
				this.setState({
					questions: res.questions
				})
			})
		TestData.getTest(this.props.params.testId)
			.then(res => {
					console.log("item", res)
				this.setState({
					testTitle: res.test.title,
					numOfQuestions: res.test.questions.length,
					testInfo: {
						title: res.test.title,
						courseId: res.test.course
					},
					testQuestions: (() => {
						return res.test.questions.map(question =>  question._id);
					})()
				})
			});

		//update the test here	
		// TestData.editTest(this.props.params.testId, )


		//http://localhost:3000/edit-test/586d7f32336a5b3e3a36eaec
		//GEt the test from the API based on this.params.testId
	},
	showFiltered(options) {
		this.setState(options);
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			//checka if any of the item's id's match the ones in the testQuestion array 
			const isSelected = this.state.testQuestions.includes(item._id);
			return <QuestionCards key={`question-${i}`} question={item} isSelected={this.state.selectedCard} selectCard={this.selectCard} selectButton={this.state.selectButton} classId={this.props.params.courseId} showSelected={!isSelected} removeCard={this.removeQuestion}/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	removeQuestion(e,Id) {
		const testQuestions = this.state.testQuestions;
		const index = testQuestions.indexOf(Id);

		testQuestions.splice(index, 1)
		this.setState({
			testQuestions
		})

		TestData.removeQuestion(this.props.params.testId, {
			questionId: Id
		}).then(res => {
			console.log("removed", res.test.questions)
		})
	},
	selectCard(e, selectedInfo) {
		e.preventDefault();
		const newArray = this.state.selectedQuestions.slice();
		const questionArray = [];
		const testQuestions = this.state.testQuestions;

		testQuestions.push(selectedInfo._id);

		TestData.updateTest(this.props.params.testId, {
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
				allQuestions: res.questions,
				numOfQuestions: questions.length,
				testQuestions
			})

		})
	},
	updateField(e) {
		const target = e.target
		console.log("lala", e.target);
		const ogQ = Object.assign({}, this.state.testInfo);

		ogQ[e.target.name] = e.target.value

		this.setState({
			testInfo: ogQ
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
	updateTest(e) {
		e.preventDefault();

		TestData.editTest(this.props.params.testId, {
			title: this.state.testInfo.title
		})
		.then(res => {

			// this.setState({
			// 	testId: res.test._id,
			// 	testCreated: true,
			// 	testTitle: testName
			// })

		});
	},
	render() {
		return (
			<div className="classCard">
				<h2>Test Created: {this.state.testInfo.title}</h2>
				<section className={this.state.testCreated === true ? 'cardHide' : 'full detailsForm card'}>
					<form onSubmit={this.updateTest}>
						<label>What is the name of the test?</label>
						<input type="text" name="title" onChange={this.updateField} value={this.state.testInfo.title}/>
						<input type="submit" value="Save"/>
					</form>
				</section>
				<section className='full detailsForm card'>
					<FilteredSearch questionState={this.state.questions} showFiltered={this.showFiltered}/>
				</section>
				<section className='full'>
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
					<Link onClick={this.viewTest} to={`/classroom/${this.state.testInfo.courseId}/view-test/${this.props.params.testId}`} className="primary">View Test</Link>
				</section>
			</div>
		)
	}	

	//this.state.testId

});
