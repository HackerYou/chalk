import React from 'react';
import Course from '../course/index.jsx';

class ClassroomContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            classrooms: [],
            hasClasses: false
        }
    }

    showClassrooms() {
        const { hasClasses } = this.state;
        if (hasClasses === false) {
            return <p className="emptyState">You're not the member of any classrooms.'</p>
        } else if (hasClasses && this.state.classrooms.length === 0) {
            return <p className="emptyState">You don't have any favourited classrooms.</p>
        } else {
            return this.state.classrooms.map((classroom, index) => {
                return <Course unFavorite={this.props.unfavoriteClass} favorite={this.props.favoriteClass} isFavorite={classroom.isFavorite} key={classroom._id} index={index} details={classroom} />
            });
        }
    }

    mergeFavorites(classrooms, userFavorites) {
        return classrooms.map((classroom) => {
            classroom.isFavorite = userFavorites.includes(classroom._id);
            return classroom;
        });
    }

    filterClasses(props) {
        const { filter } = props;    
    	let filteredClassrooms = [];
        let hasClasses = false; 
        const classroomsWithFavorites = this.mergeFavorites(props.classrooms, props.userFavorites);
    

        if (props.classrooms.length > 0) { // only filter classrooms if student is enrolled in classes
            hasClasses = true;
            if ( filter === 'SHOW_FAVORITES' ) {
                filteredClassrooms = classroomsWithFavorites.filter(classroom => classroom.isFavorite);
            } else if ( filter === 'SHOW_ALL' ) {
                filteredClassrooms = classroomsWithFavorites;
            }
        }


        this.setState({
            classrooms: filteredClassrooms,
            hasClasses
        });
        
    }

    render() {
        return (
            <section className='dashWrap'>
                {this.showClassrooms()}
            </section>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.filterClasses(nextProps);
    }


} 

export default ClassroomContainer;