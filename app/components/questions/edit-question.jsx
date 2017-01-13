import React from 'react';
import { Link, History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from './cards.jsx';
import FilteredSearch from './filteredSearch.jsx';
import CodeArea from './codeArea.jsx';
import NotificationSystem from 'react-notification-system';
import Loading from '../loading/index.jsx';

let defaults = {
	javascript: ''
};

function findIndex(array,key,value) {
	let index = 0;
	for(let i = 0; i< array.length; i++) {
		if(array[i][key] === value) {
			index = i;
		}
	}
	return index;
}

export default React.createClass({
	_notificationSystem: null,
	displayName: 'Questions',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			answerOption: [],
			code: defaults.javascript,
			mode: 'markdown',
			readOnly: false,
			showType: 'code',
			questions: [],
			realAnswer: "",
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'false',
			testMode: 'javascript',
			testCode: '',
			updatedQuestion: {
				title: '',
				body: '',
				category: '',
				difficulty: '',
				type: 'code',
				multiChoice: [],
				unitTest: ''
			},
			assertions: [],
			loading: false
		}
	},
	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	},
	componentWillMount() {
		questionData.getQuestionById(this.props.params.questionId)
			.then((res) => {
				this.setState({
					showType: res.question.type,
					code: res.question.unitTest,
					updatedQuestion: {
						title: res.question.title,
						body: res.question.body,
						category: res.question.category,
						difficulty: res.question.difficulty,
						type: res.question.type,
						multiChoice: res.question.multiChoice,
						unitTest: res.question.unitTest
					}
				})
			});
	},
	_successNotification: function(messageObj) {
		this._notificationSystem.addNotification({
			message: messageObj.message,
			level: messageObj.level === 'error' ? 'error' : 'success',
			dismissible: false,
			title: messageObj.title
		});
	},
	removeOption(id, index) {
		//made a copy of updatedQuestion
		const updatedObj = Object.assign({}, this.state.updatedQuestion);
		//removed the item using index
		updatedObj.multiChoice.splice(index, 1);

		this.setState({
			updatedQuestion: updatedObj
		});
	},
	addOption(e) {
		e.preventDefault();
		let setLabel = this.setLabel.value;
		let setValue = this.setValue.value;
		const setAnswer = this.setAnswer.value;
		const answerArray = this.state.updatedQuestion.multiChoice.slice();
		const updatedObj = Object.assign({}, this.state.updatedQuestion);

		if(setLabel !== '' && setValue !== '') {
			updatedObj.multiChoice.push({
				label: setLabel,
				value: setValue,
			})
			this.setState({
				updatedQuestion: updatedObj
			});
			this.setValue.value = "";
			this.setLabel.value = ""
		}
	},
	changeMode(e) {
	//Handles Codemirror implementation
		var mode = e.target.value;

		this.setState({
			mode: mode
		});

	},
	updateCode(newCode) {
	//Handles Codemirror implementation
		const originalQuestion = Object.assign({},this.state.updatedQuestion);
		originalQuestion.unitTest = newCode;
		this.setState({
			updatedQuestion: originalQuestion
		});
	},
	updateTestCode(newCode) {
	//Handles Codemirror implementation
		this.setState({
			testCode: newCode
		});
	},
	renderCode() {
	//Handles Codemirror implementation
		var options = {
			lineNumbers: true,
			mode: this.state.mode,
			theme: 'cobalt',
			fixedGutter: true
		};
		return (
			<CodeArea 
				code={this.state.updatedQuestion.unitTest}
				updateCode={this.updateCode}
				testCode={this.state.testCode}
				updateTestCode={this.updateTestCode}
				testMode={this.state.testMode}
				changeMode={this.changeMode}
				testMode={this.state.testMode}
				assertions={this.state.assertions}
				validateCode={this.validateCode}
			/>
		)
	},
	validateCode(e) {
		e.preventDefault();
		if(this.state.testCode !== '') {
			this.setState({
				loading: true
			});
			questionData.editQuestion(this.props.params.questionId, this.state.updatedQuestion)
				.then((res) => {
					questionData.questionDryrun(this.props.params.questionId,this.state.testCode)
						.then((res) => {
							this.setState({
								assertions: res.results.testResults,
								loading: false
							});
						},(err) => {
							this.setState({
								loading: false
							});
							this._successNotification({
								message: err.error,
								level:'error',
								dismissible: true,
								title: 'Error'
							});
						});
				},(err) => {
					this.setState({
						loading: false
					})
					this._successNotification({
						message: err.error,
						level:'error',
						dismissible: true,
						title: 'Error'
					});
				});
			
		}
	},
	renderCards(key, index) {
		const cardRender = (item,i) => {
			return <QuestionCards key={`question-${i}`} question={item} removeCard={this.removeCard} editCard={this.editQuestion} selectButton={this.state.selectButton} showSelected="false"/>
		};
		if(this.state.showFiltered) {
			return this.state.filteredQuestions.map(cardRender);
		}
		else {
			return this.state.questions.map(cardRender);
		}
	},
	removeCard(e,questionId) {
		e.preventDefault();
		questionData.deleteQuestion(questionId)
			.then((res) => {
				let questionsArray = Array.from(this.state.questions);
				let questionsIndex = findIndex(questionsArray,"_id",questionId);
				questionsArray.splice(questionsIndex,1);
				this.setState({
					questions: questionsArray
				});
			});
	},
	
	getType(e) {
		const chosenType = e.target.value;
		this.setState({
			showType: chosenType
		})
		//if showType is equal MC then add class
	},
	updateQuestion(e) {
		e.preventDefault();
		const updatedQuestion = this.state.updatedQuestion;

		const multiAnswer = this.setAnswer.value;

		if(this.state.updatedQuestion.type === 'code') {
			updatedQuestion.unitTest = this.state.code;
		}
		else {
			Object.assign(updatedQuestion,{
				multiChoice: this.state.updatedQuestion.multiChoice,
				multiAnswer
			});
		}
		questionData.editQuestion(this.props.params.questionId, updatedQuestion)
			.then(res => {

				this._successNotification({
				title: 'Question',
				message: 'Saved Successfully'
			});
		});

		this.setAnswer.value = "";
	},
	changeQuestionView() {
		this.setState({
			showType: this.getType.value
		});
	},
	showFiltered(options) {
		this.setState(options);
	},
	updateField(e) {
		//make a copy of the original state
		const ogQ = Object.assign({},this.state.updatedQuestion);

		ogQ[e.target.name] = e.target.value;

		this.setState({
			updatedQuestion: ogQ
		})
	},
	render() {
		return (
			<div className="classCard">
				<NotificationSystem ref="notificationSystem" style={false}/>
				<h2>Title of your question: {this.state.updatedQuestion.title}</h2>
				<section className="full detailsForm topicsForm card">
					<h3>Assign Attributes to your Question:</h3>
					<form onSubmit={this.updateQuestion}>
						<div className="fieldRow">
							<label className="inline largeLabel">Title of your question:</label>
							<input type="text" name="title" value={this.state.updatedQuestion.title} onChange={this.updateField}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Category</label>
							<select name="category" value={this.state.updatedQuestion.category} onChange={this.updateField}>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">What is the Question?</label>
							<textarea name="body" value={this.state.updatedQuestion.body} className="inline largeLabel" onChange={this.updateField}  row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select name="difficulty" value={this.state.updatedQuestion.difficulty} onChange={this.updateField}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" value={this.state.updatedQuestion.type} onChange={this.updateField}>
								<option value="multiple choice">Multiple Choice</option>
								<option value="code">Code</option>
							</select>
						</div>
						<div className="typeCard" onFocus={this.testing}>
							<div className={this.state.updatedQuestion.type === 'multiple choice' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Multiple Choice:</h3>
									<label className="inline largeLabel">Label of your Answers</label>
									<input type="text" ref={ref => this.setLabel = ref}/>
								</div>
								<div className="fieldRow">
									<label className="inline largeLabel">Set a value</label>
									<input type="text" ref={ref => this.setValue = ref}/>
									<button onClick={this.addOption} className="success">Add option</button>
								</div>
								<div className="fieldRow mcOptions">
								{(() => {
									if(this.state.updatedQuestion.multiChoice) {
										return this.state.updatedQuestion.multiChoice.map((item, i) => {
											return (
												<div className="mcOptions--duo" key={i}>
													<input className="inline" name="lala" type="radio" value={item.value}/>
													<label>{item.label}</label>
													<i onClick={() => this.removeOption(item._id, i)} className="fa fa-times"></i>
												</div>
											)
										});
									}
									else {
										return ''
									}
								})()}
								</div>
								<div className="fieldRow">
									<label className="inline largeLabel">What is the answer?</label>
									<input type="text" ref={ref => this.setAnswer = ref}/>
								</div>
							</div>
							<div className={this.state.updatedQuestion.type === 'code' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Code Based Question:</h3>
									{this.renderCode()}
								</div>
							</div>
						</div>
						<input type="submit" value="Save" className="success"/>
						<Link to={`/questions`}>Go back</Link>
					</form>
				</section>
				<Loading loading={this.state.loading} loadingText="Evaluating question" />
			</div>
		)
	}
});
