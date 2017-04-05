import React from 'react';
import {  Link,  History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import IssuesCard from './card.jsx';
import issuesData from '../../services/issues.jsx';
import config from '../../services/config.jsx';

export default React.createClass({
	displayName: 'Issues',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			issues: [],
			filter: "SHOW_ALL"
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
	archiveIssue(issue) {
		issue.archived = !issue.archived;
		issue.archived_at = Date.now();
		issue.archived_by = config.getUserId();
		issuesData.updateIssueById(issue._id,issue)
			.then(() => issuesData.getAllIssues())
			.then((data) => {
				this.setState({
					issues: data.issues
				});
			});
	},
	showFilter(e,filterOption) {
		e.preventDefault();
		this.setState({
			filter: filterOption
		});
	},
	renderIssues() {
		const issues = Array.from(this.state.issues);
		return issues
			//If filters is SHOW_ALL then check and only show the issues that have archived false
			//else use the archived property to show the archived ones
			.filter((issue) => this.state.filter === "SHOW_ALL" ? issue.archived === false : issue.archived)
			.map((item) => {
				return <IssuesCard issue={item} removeIssue={this.removeIssue} key={item._id} archiveIssue={this.archiveIssue}/>
			});
	},
	render() {
		return (
			<div className="content issues-container">
				<header>
					<h1>Issues</h1>
					<nav className="issues-nav">
						<a href="" onClick={(e) => this.showFilter(e,"SHOW_ARCHIVED")}><i className={this.state.filter === "SHOW_ARCHIVED" ? "fa fa-archive redLight" : "fa fa-archive"}></i></a>
						<a href="" onClick={(e) => this.showFilter(e,"SHOW_ALL")}><i className={this.state.filter === "SHOW_ALL" ? "fa fa-th-large redLight" : "fa fa-th-large"}></i></a>
					</nav>
				</header>
				<section className="dashWrap">
					{this.renderIssues()}
				</section>
			</div>
		)
	}
})