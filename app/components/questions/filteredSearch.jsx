import React from 'react';

export default class FilteredSearch extends React.Component {

	constructor(props) {
		super(props);
	}
	filterSearch(e) {
		e.preventDefault();
		const category = this.searchCategory.value;
		const type = this.searchType.value;
		const difficulty = this.searchLevel.value;
		// const searchKey = this.searchKey.value;
		const compare = (filteredOption,key) =>  {
			return (question) => {
				return filteredOption === 'all' || question[key] === filteredOption;
			}
		}
		const questions = this.props.questionState
			.filter(compare(category,'category'))
			.filter(compare(type,'type'))
			.filter(compare(difficulty,'difficulty'));
			
		if(category !== 'all' || type !== 'all' || difficulty !== 'all') {
			this.props.showFiltered({
				showFiltered: true,
				filteredQuestions: questions
			})
		}
		else {
			this.props.showFiltered({
				showFiltered: false
			});
		}
	}
	render() {
		return (
			<form onSubmit={e => this.filterSearch.call(this,e)}>
				<div className="fieldRow">
					<h3>Filter Search:</h3>
					<label className="inline largeLabel">Category</label>
					<select ref={ref => this.searchCategory = ref}>
						<option value="all">All</option>
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="javascript">JavaScript</option>
						<option value="javascript">React</option>
					</select>
					<label className="inline largeLabel">Search keyword</label>
					<input type="text" ref={ref => this.searchKey = ref} />
				</div>
				<div className="fieldRow">
					<label className="inline largeLabel">Level of Difficulty</label>
					<select ref={ref => this.searchLevel = ref}>
						<option value="all">All</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
					<label className="inline largeLabel">Type</label>
					<select ref={ref => this.searchType = ref}>
						<option value="all">All</option>
						<option value="multiple choice">Multiple Choice</option>
						<option value="code">Code</option>
					</select>
					<input type="submit" value="Search" className="primary"/>
				</div>
			</form>
		)
		
	}
}
