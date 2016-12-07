import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';
import QuestionCards from '../questions/cards.jsx';
let CodeMirror = require('react-codemirror');

let defaults = {
	markdown: '# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)',
	javascript: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
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
	displayName: 'Questions',
	mixins: [AuthMixin,History],
	getInitialState() {
		return {
			answerOption: [],
			code: defaults.markdown,
			mode: 'markdown',
			readOnly: false,
			showType: 'multiple choice',
			showCategory: 'html',
			showLevel: 'easy',
			questions: []
		}
	},
	componentWillMount() {
		const currentType = this.state.showType;
		const currentCategory = this.state.showCategory;
		const currentLevel = this.state.showLevel;
		console.log("curr",currentCategory)

		questionData.getQuestion()
			.then(data => {
				this.setState({
					questions: data.questions
				})
			})
	},

	addOption(e) {
		e.preventDefault();
		const setLabel = this.setLabel.value;
		const setValue = this.setValue.value;
		const answerArray = this.state.answerOption.slice();

		answerArray.push({
			answerLabel: setLabel,
			answerValue: setValue
		})

		this.setState({
			answerOption: answerArray
		})
		
	},
	//Handles Codemirror implementation
	changeMode(e) {
		var mode = e.target.value;
		this.setState({
			mode: mode,
			code: defaults[mode]
		});

	},
	//Handles Codemirror implementation
	updateCode(newCode) {
		this.setState({
			code: newCode
		})
	},
	//Handles Codemirror implementation
	renderCode() {
		var options = {
            lineNumbers: true,
            mode: this.state.mode
        };
		return (
			<div>
		 		<CodeMirror value={this.state.code} onChange={this.updateCode} options={options}/>
				<select onChange={this.changeMode} value={this.state.mode} className="fieldRow">
					<option value="markdown">Markdown</option>
					<option value="javascript">JavaScript</option>
				</select>
				<input type="submit" value="validate" className="success"/>
			</div>

		)
	},
	renderCards(key, index) {
		console.log(this);
		return this.state.questions.map((item,i) => {
			return <QuestionCards key={`question-${i}`} question={item} removeCard={this.removeCard}/>
		});
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
	getCategory(e) {
		const chosenCategory = e.target.value;
		this.setState({
			showCategory: chosenCategory
		})
	},
	getLevel(e) {
		const chosenLevel = e.target.value;
		console.log("testing", chosenLevel);
		this.setState({
			showLevel: chosenLevel
		})
	},
	addQuestion(e) {
		e.preventDefault();
		console.log("submited!")
		const title = this.questionTitle.value;
		const body = this.question.value;

		questionData.createQuestion({
			title: title,
			type: this.state.showType,
			body: body,
			category: this.state.showCategory,
			difficulty: this.state.showLevel
		}).then(res => {
			console.log("res",res);
			const questionsArray = Array.from(this.state.questions);
			questionsArray.push(res.question);

			console.log("lala", questionsArray)

			this.setState({
				questions: questionsArray
			})
		});
	},
	validateCode(e) {
		e.preventDefault();
		console.log("sending");
		//do some validating here
	},
	testing() {
		console.log("hello");
	},
	render() {
		return (
			<div className="classCard">
				<h2>Questions</h2>
				<section className="full detailsForm topicsForm card">
					<h3>Assign Attributes to your Question:</h3>
					<form onSubmit={this.addQuestion}>
						<div className="fieldRow">
							<label className="inline largeLabel">Title of your question:</label>
							<input type="text" ref={ref => this.questionTitle = ref}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Category</label>
							<select onChange={this.getCategory}>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">What is the Question?</label>
							<textarea className="inline largeLabel" ref={ref => this.question = ref} row="2" col="100"></textarea>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select onChange={this.getLevel}>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label htmlFor="type" className="inline largeLabel">Type</label>
							<select name="type" onChange={this.getType} value={this.state.showType}>
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
										console.log(item)
										return (
											<div key={i}>
												<label>{item.answerLabel}</label>
												<input className="inline" name="lala" type="radio" value={item.answerValue}/>
											</div>
										)
									})}
								</div>
							</div>
							<div className={this.state.showType === 'code' ? 'showType' : 'hideType'}>
								<div className="fieldRow">
									<h3>Code Based Question:</h3>
									{this.renderCode()}
								</div>
							</div>
						</div>
						<input type="submit" value="Submit" className="success"/>
					</form>
				</section>
				
				<section className="full detailsForm topicsForm card">
					<form>
						<div className="fieldRow">
							<h3>Filter Question:</h3>
							<label className="inline largeLabel">Category</label>
							<select>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">JavaScript</option>
								<option value="javascript">React</option>
							</select>
							<label className="inline largeLabel">Title</label>
							<select>
								<option value="css">Flexbox</option>
								<option value="javascript">Functions</option>
								<option value="css">CSS Advanced Selectors</option>
								<option value="javascript">React Components</option>
							</select>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Level of Difficulty</label>
							<select>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
							<label className="inline largeLabel">Type</label>
							<select>
								<option value="easy">Multiple Choice</option>
								<option value="medium">Code</option>
							</select>
							<input type="submit" value="Search" className="success"/>
						</div>
					</form>
				</section>
				<section>
					<h3>All Questions:</h3>
					<article className="questionCard__wrapper">
						{this.renderCards()}
					</article>
				</section>
			</div>
		)
	}
});
