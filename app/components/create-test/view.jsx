import React from 'react';
import { Link , History} from 'react-router';
import LessonDetails from '../lessondetails/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import AuthMixin from '../../services/authMixin.jsx';
import coursesData from '../../services/courses.jsx';
import userData from '../../services/user.jsx';
import TestData from '../../services/tests.jsx';
import questionData from '../../services/questions.jsx'
import config from '../../services/config.jsx';
import CreateTest from './index.jsx';
import QuestionCards from '../questions/cards.jsx';
import CodeMirror from 'react-codemirror';
import Loading from '../loading/index.jsx';
import utility from '../utility.js';

export default React.createClass({
	displayName: 'ViewTest',
	mixins: [AuthMixin,History],
	getInitialState(){
		return{
			members: [],
			questions: [],
			assertions: {},
			assertionErrors: {},
			answer: {},
			user: {
				test_results: {}
			},
			isStudent: false,
			testInfo: {
				test: {}
			},
			submittedAnswers: 0,
			testSubmitted: false,
			loading: false
		}
	},
	componentDidMount() {


		TestData.addUser(this.props.params.testId)
			.then(res => {
			TestData.getTest(this.props.params.testId)
				.then(res => {
					const questions = res.test.questions;
					//handles shuffling
					for (let i = questions.length; i; i--) {
						let randomize = Math.floor(Math.random() * i);
						[questions[i - 1], questions[randomize]] = [questions[randomize], questions[i - 1]];
					}
					this.setState({
						testInfo: res,
						questions
					})
					const testResults = this.state.user.test_results || {};
					const testId = this.props.params.testId;

					if (testResults[testId] !== undefined) {
						let submittedAnswers = testResults[testId].answers.length;
						this.setState({submittedAnswers});
					}

				})
		})
		userData.getUser(config.getUserId()).then(res=>{
			if(res.user.admin === false || res.user.instructor === false) {
				this.setState({
					isStudent: true
				})
			} else {
				this.setState({
					isStudent: false
				})
			}

			this.setState({
				user: res.user
			})
		});
	},
	//Handles Codemirror implementation
	updateAnswer(userAnswer,questionId) {
		
		const ogAnswer = Object.assign({},this.state.answer)
		ogAnswer[questionId] = userAnswer

		this.setState({
			answer: ogAnswer
		})
	},
	dryrun(e,questionId) {
		e.preventDefault();
		this.setState({
			loading: true
		});
		questionData.questionDryrun(questionId, this.state.answer[questionId])
			.then(res => {
				
				const ogAss = Object.assign({}, this.state.assertions);
				const assertionErrors = Object.assign({},this.state.assertionErrors);
				ogAss[questionId] = res.results;
				assertionErrors[questionId] = '';

				this.setState({
					assertions: ogAss,
					assertionErrors,
					loading: false
				});
			}, (err) => {
				const ogAss = Object.assign({}, this.state.assertionErrors);
				ogAss[questionId] = err.responseJSON.error;
				this.setState({
					loading: false,
					assertionErrors:  ogAss
				});
			});
	}, 
	renderValidation(questionId) {
		if(this.state.assertions[questionId] || this.state.assertionErrors[questionId]) {
			return (
				<div className="console">
					{(() => {
						if(this.state.assertionErrors[questionId] !== '') {
							return (
								<pre>
									{this.state.assertionErrors[questionId]}
								</pre>
							)
						}
						else if(
							this.state.assertions[questionId]
							.testResults[0]
							.assertionResults.length === 0) {
							return (
								<pre>
									{this.state.assertions[questionId].testResults[0].message}
								</pre>
							)
						}
						else {
							return (
								<ul>
									{this.state.assertions[questionId]
										.testResults.map((test) => {
											return test.assertionResults
											.map((assertion) => {
												return <li>{assertion.status} - {assertion.title}</li>
											});
										})
									}
								</ul>
							)
						}
					})()}
					
				</div>
			)
		} 
	},
	evaluateQuestion(questionId){
		//grab the answer to the question and then submit
		let answer = {}
		let answerValue = this.state.answer[questionId];
		if (answerValue != undefined) {
			answer.questionId = questionId;
			answer.answer = answerValue;
		}
		this.setState({
			loading: true
		});
	
		TestData.evaluateTest(this.props.params.testId, answer)
		.then(item => {
			//need to save the answer state in object, then change the specific key to 'submitted' then
			let answerState = Object.assign({}, this.state.answer);
			let submittedAnswers = this.state.submittedAnswers + 1;

			answerState[questionId] = 'submitted';
			// answer: answerState 
			this.setState({
				loading: false,
				answer: answerState,
				submittedAnswers
			});
		})
		.catch(err => {
			const ogAss = Object.assign({}, this.state.assertionErrors);
			ogAss[questionId] = err.responseJSON.error;
			this.setState({
				loading: false,
				assertionErrors:  ogAss
			});
		});
	},
	submitTest() {
		if (this.state.submittedAnswers < this.state.questions.length) {
			alert(`Please submit all answers before Finishing Test. You have ${this.state.questions.length - this.state.submittedAnswers} unsubmitted questions`);
		} else {
			this.context.history.pushState(null,`/classroom/${this.props.params.courseId}/`);
		}
	},
	evaluate() {
		//grab all of the ANSWERS to the questions
		//grab the userId and the answers
		const userId = config.getUserId();
		const answerArray = []
		for(let key in this.state.answer) {
			answerArray.push({
				questionId: key,
				answer: this.state.answer[key]
			})
		}
		this.setState({
			testSubmitted: true,
			loading: true
		});
		TestData.addUser(this.props.params.testId)
			.then(res => {
				TestData.evaluateTest(this.props.params.testId, answerArray)
				.then(item => {
					this.setState({
						loading: false
					});
					//get the students test results
					this.context.history.pushState(null,`/classroom/${this.props.params.courseId}/`);
				})
			})

	},
	renderCode(question) {
	//Handles Codemirror implementation
		var options = {
			lineNumbers: true,
			mode: question.category,
			theme: 'material',
			fixedGutter: true
		};
		return (

			<div>
		 		<CodeMirror value={this.state.answer[question._id]} onChange={(newCode) =>  this.updateAnswer(newCode,question._id)} options={options} />
				<input type="submit" value="validate" className="success codeSubmit" onClick={e => this.dryrun(e,question._id)}/>		
				{this.renderValidation(question._id)}
			</div>
		)
	},
	checkDisabled(questionId){
		// if the key exists in this.state.answers then false disable if not true disable
		if (this.state.answer[questionId] === 'submitted') {
			return true;
		} else {
			return false;
		}
	},
	checkDisabledSubmit(questionId){
		// if the key exists in this.state.answers then false disable if not true disable
		if (this.state.answer[questionId] === 'submitted') {
			return true;
		} else if (this.state.answer[questionId] === undefined) {	
			return true;
		}
		else {
			return false;
		}
	},
	renderQuestions() {
		let questions = this.state.questions;
		const testId = this.props.params.testId;
		let submittedAnswers = [];
		const testResults = this.state.user.test_results || {};

		if (testResults[testId] !== undefined) {
			submittedAnswers = testResults[testId].answers;
			

			questions = questions.map((question) => {

				let userAnswer = utility
					.expect(utility
					.fold(submittedAnswers
					.filter((answer) => answer.id === question._id)), 'actual', undefined);

				return {...question, userAnswer: userAnswer };
			});
		}

		return (
			questions.map((res, i) => {
				let mc = res.multiChoice;
				return (
					<div key={i} className="full detailsForm card">
						<h3>{res.body}</h3>
						{
							(() => {
								if(res.type === "multiple choice") {
									return mc.map((item, i) => {
										return (
											<div key={i} className="fieldRow fieldRowQuestion">
												<input 
												onChange={() => this.updateAnswer(item.value, res._id)} 
												name={res._id} 
												type="radio" 
												id={item._id} 
												value={item.value}
												checked={res.userAnswer ? item.value === res.userAnswer : null} 
												disabled={item.value === res.userAnswer ? true : this.checkDisabled(res._id)}/>
												<label htmlFor={item._id}>{item.label}</label>
											</div>
										)
									});
								} else {
									return (
										<div>
											{this.renderCode(res)}
										</div>
									) 
								} 
							})()
						}
						<input 
							type="submit" 
							onClick={() => this.evaluateQuestion(res._id)}
							value="Submit Question"
							className={res.userAnswer || this.state.answer[res._id] === "submitted" ? 'answered' : null}
							disabled={this.checkDisabledSubmit(res._id)} />
					</div>
				)
			})
		)
	},
	render() {
		const testInfo = this.state.testInfo;
		let testSubmitted = (
			<h3>Test submitted!</h3>
		)

		return (
			<div className='classCard testQuestions'>
				<h2>{testInfo.test.title}</h2>
				{this.renderQuestions()}

				{(this.state.user.admin || this.state.user.instructor) ? 
					<Link className='button' to={`/edit-test/${this.state.testInfo.test._id}`}>Back</Link>
				:
					<div>
						<a className='button primary' onClick={() => this.submitTest()}>Finish Test</a>
					</div>
				}
				<Loading loading={this.state.loading} loadingText="Loading..."/>
			</div>
		)
	}	
});
