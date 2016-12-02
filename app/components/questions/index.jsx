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
			showLevel: 'easy'
		}
	},
	componentDidMount() {
		const currentType = this.state.showType;
		const currentCategory = this.state.showCategory;
		const currentLevel = this.state.showLevel;
		console.log("curr",currentCategory)
	},

	addOption(e) {
		e.preventDefault();
		debugger;
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
				<select onChange={this.changeMode} value={this.state.mode}>
					<option value="markdown">Markdown</option>
					<option value="javascript">JavaScript</option>
				</select>
			</div>

		)
	},
	renderCards(key, index) {
		return <QuestionCards key={index} index={index}/>
	},
	getType(e) {
		const chosenType = e.target.value;
		this.setState({
			showType: chosenType
		})
	},
	getCategory(e) {
		const chosenCategory = e.target.value;
		// console.log("testing", chosenCategory);
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
		const title = this.questionTitle.value;
		const body = this.question.value;

		console.log("testing", body);
		questionData.createQuestion({
			title: title,
			type: this.state.showType
		}).then(res => {
			console.log("res",res);
			// this.history.pushState(null,`/question`);
		});
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
							<input type="submit" value="Submit" className="success"/>
						</div>
					</form>
				</section>
				<section className="full detailsForm topicsForm card">
					<form onSubmit={this.addOption}>
						<div className="fieldRow">
							<h3>Multiple Choice:</h3>
							<label className="inline largeLabel">Label of your Question</label>
							<input type="text" ref={ref => this.setLabel = ref}/>
						</div>
						<div className="fieldRow">
							<label className="inline largeLabel">Set a value</label>
							<input type="text" ref={ref => this.setValue = ref}/>
							<input type="submit" value="Add Option" className="success"/>
						</div>
						<div className="fieldRow">
							{this.state.answerOption.map((item, i) => {
								console.log(item)
								return (
									<div key={i}>
										<label>{item.answerLabel}</label>
										<input className="inline" type="radio" value={item.answerValue}/>
									</div>
								)
							})}
						</div>
					</form>
				</section>
				<section className="full detailsForm topicsForm card">
					<div className="fieldRow">
						<h3>Code Based Question:</h3>
						{this.renderCode()}
					</div>
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
					{this.renderCards()}
				</section>
			</div>
		)
	}
});
