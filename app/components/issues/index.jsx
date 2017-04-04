import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import IssuesCard from './card.jsx';
import issuesData from '../../services/issues.jsx';

export default React.createClass({
	displayName: 'Issues',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			issues: []
		}
	},
	componentDidMount() {
		issuesData.getAllIssues()
			.then((data) => {
				this.setState({
					issues: data.issues
				});
			});
	},
	removeIssue(id) {
		issuesData.removeIssueById(id)
			.then((data) => {
				this.setState({
					issues: data.issues
				});
			});
	},
	render() {
		return (
			<div className="content">
				<h1></h1>
				<section className="dashWrap">
					{this.state.issues.map((item) => {
						return <IssuesCard issue={item} removeIssue={this.removeIssue}/>
					})}
				</section>
			</div>
		)
	}
})