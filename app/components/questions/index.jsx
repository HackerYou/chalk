import React from 'react';
import { Link, History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from './cards.jsx';
import CodeMirror from 'react-codemirror';
import FilteredSearch from './filteredSearch.jsx';
import CodeArea from './codeArea.jsx';
require('codemirror/mode/javascript/javascript');
import Loading from '../loading/index.jsx';


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
	displayName: 'Questions',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			answerOption: [],
			code: '',
			testCode: '',
			testMode: 'javascript',
			readOnly: false,
			showType: 'code',
			questions: [],
			realAnswer: "",
			showFiltered: false,
			filteredQuestions: [],
			selectButton: 'false',
			questionId: '',
			assertions: [],
			assertionError: '',
			loading: false
		}
	},
	componentWillMount() {
		questionData.getQuestion()
			.then(data => {
				this.setState({
					questions: data.questions
				});
			});
	},

	addOption(e) {
		e.preventDefault();
		let setLabel = this.setLabel.value;
		let setValue = this.setValue.value;
		const setAnswer = this.setAnswer.value;
		const answerArray = this.state.answerOption.slice();

		if(setLabel !== '' && setValue !== '') {
			answerArray.push({
				label: setLabel,
				value: setValue,
			})

			this.setState({
				answerOption: answerArray
			})

			this.setValue.value = "";
			this.setLabel.value = ""
		}
	},
	//Handles Codemirror implementation
	changeMode(e) {
		var mode = e.target.value;
		this.setState({
			mode: mode
		});
	},
	//Handles Codemirror implementation
	updateCode(newCode) {
		this.setState({
			code: newCode
		})
	},
	updateTestCode(newCode) {
		this.setState({
			testCode: newCode
		});
	},
	//Handles Codemirror implementation
	renderCode() {
		var options = {
			lineNumbers: true,
			mode: 'javascript',
			theme: 'cobalt',
			fixedGutter: true
		};
		return (
			<CodeArea 
				code={this.state.unitTest}
				updateCode={this.updateCode}
				testCode={this.state.testCode}
				updateTestCode={this.updateTestCode}
				testMode={this.state.testMode}
				changeMode={this.changeMode}
				testMode={this.state.testMode}
				assertions={this.state.assertions}
				validateCode={this.validateCode}
				questionId={this.state.questionId}
				assertionError={this.state.assertionError}
			/>
		)
	},
	validateCode(e) {
		e.preventDefault();
		this.setState({
			loading: true
		});
		questionData.questionDryrun(this.state.questionId,this.state.testCode)
			.then((res) => {
				this.setState({
					assertions: res.results.testResults,
					assertionError: '',
					loading: false
				});
			},(err) => {
				this.setState({
					assertionError: err.responseJSON.error,
					loading: false
				});
			});
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
	editQuestion(e, questionId) {
		return <Link to={`/questions/${questionId}/edit-question`}></Link>
	},
	getType(e) {
		const chosenType = e.target.value;
		this.setState({
			showType: chosenType
		})
		//if showType is equal MC then add class
	},
	addQuestion(e) {
		e.preventDefault();
		const title = this.questionTitle.value;
		const body = this.question.value;
		const multiAnswer = this.setAnswer.value;
		const question = {
			title,
			type: this.state.showType,
			body,
			category: this.getCategory.value,
			difficulty: this.getLevel.value,
		};
		if(title !== '' && body !== '') {
			if(this.state.showType === 'code') {
				question.unitTest = this.state.code;
			}
			else {
				Object.assign(question,{
					multiChoice: this.state.answerOption,
					multiAnswer
				});
			}
			if(this.state.questionId === '') {
				questionData.createQuestion(question).then(res => {
					const questionsArray = Array.from(this.state.questions);
					questionsArray.push(res.question);
					this.setState({
						questionId: res.question._id,
						questions: questionsArray
					});
				});
			}
			else {
				//update
				questionData.editQuestion(this.state.questionId,question)
					.then(() => {
						console.log('Question updated');
					});
			}
			this.setAnswer.value = "";
		}
		else {
			alert("Make sure you add a title and body to the question!")
		}
	},
	changeQuestionView() {
		this.setState({
			showType: this.getType.value
		});
	},
	showFiltered(options) {
		this.setState(options);
	},
	render() {
		return (
			<div className="classCard">
				<h2>Questions</h2>
				<section className="full detailsForm topicsForm card">
					<h3>Assign Attributes to your Question:</h3>
					<form onSubmit={(() => {
						if(this.state.questionId === '') {
							return this.addQuestion;
						}
						else {
							return this.updateQuestion;
						}
					})()}>
						<div className="fieldRow">
							<label className="inline largeLabel">Title of your question:</label>
							<input type="text" ref={ref => this.questionTitle = ref}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Category</label>
							<select ref={ref => this.getCategory = ref} defaultValue="javascript">
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="react">React</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">What is the Question?</label>
							<textarea className="inline largeLabel" ref={ref => this.question = ref} row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select ref={ref => this.getLevel = ref}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" ref={ref => this.getType = ref} defaultValue={this.state.showType} onChange={(e) => this.changeQuestionView() }>
								<option value="multiple choice">Multiple Choice</option>
								<option value="code">Code</option>
							</select>
						</div>
						<div className="typeCard" onFocus={this.testing}>
							<div className={this.state.showType === 'multiple choice' ? 'showType' : 'hideType'}>
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
								<div className="fieldRow">
									{this.state.answerOption.map((item, i) => {
										return (
											<div className="mc-options" key={i}>
												<input className="inline" name="lala" type="radio" value={item.value}/>
												<label>{item.label}</label>
											</div>
										)
									})}
								</div>
								<div className="fieldRow">
									<label className="inline largeLabel">What is the answer?</label>
									<input type="text" ref={ref => this.setAnswer = ref}/>
								</div>
							</div>
							<div className={this.state.showType === 'code' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Code Based Question:</h3>
									{this.renderCode()}
								</div>
							</div>
						</div>
						<input type="submit" value={(() => {
							if(this.state.questionId === '') {
								return "Submit";
							}
							else {
								return "Save"
							}
						})()}
						className="success"/>
					</form>
				</section>
				
				<section className="full detailsForm topicsForm card">
					<FilteredSearch questionState={this.state.questions} showFiltered={this.showFiltered}/>
				</section>
				<section>
					<h3>All Questions:</h3>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
				</section>
				<Loading loading={this.state.loading} loadingText='Validating Question!'/>
			</div>
		)
	}
});
