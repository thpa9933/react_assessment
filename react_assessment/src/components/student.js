import React from 'react';
import Grades from './grades';
import plus_icon from '../images/plus_sign.png';
import minus_icon from '../images/minus_sign.png';

export default class Student extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            tags: [],
            toggleGrades: false,
            toggleImg: plus_icon,
            tagInput: ""
        }
    }

    componentDidMount = () => {
        if(this.props.profile) {
            this.setState({
                profile: this.props.profile,
                tags: this.props.tags
            });
        }
    }

    // Calculate and return average grade
    calcAverageGrade = (grades) => {
        let avg = 0;
        if(Array.isArray(grades)) {
            grades = grades.map((x) => parseInt(x));
            avg = (grades.reduce((accumulator, currVal) => accumulator + currVal, 0) / grades.length).toFixed(2);
        }
        return avg;
    }

    // Update image and state when grades are toggled
    toggleGrades = () => {
        const toggleImg = this.state.toggleGrades ? plus_icon : minus_icon ;
        this.setState({
            toggleGrades: !this.state.toggleGrades,
            toggleImg: toggleImg
        });
    }

    // Track Tag input field
    updateTagInput = (event) => {
        this.setState({
            tagInput: event.target.value
        });
    }

    // Add a tag to state.tags 
    // Clear tag input for new entry
    addTag = (event) => {
        if(event.key === 'Enter') {
            this.props.studentTags(this.state.profile.id, this.state.tagInput);
            this.setState({
                tags: [...this.state.tags, this.state.tagInput],
                tagInput: "",
            })
        }
    }

    render() {
        const studentInfo = this.state.profile;
        return (
            <div className="Student-container"  data-testid="studentContainer_test">
            <div className="Profile-picture"><img src={studentInfo.pic} alt="student"/></div>
            <div className="Student-info" data-testid="studentInfo_test">	    
                <h1>{studentInfo.firstName + ' ' + studentInfo.lastName}</h1>
                <ul>
                    <li>Email: {studentInfo.email}</li>
                    <li>Company: {studentInfo.company}</li>
                    <li>Skill: {studentInfo.skill}</li>
                    <li>Average: {this.calcAverageGrade(studentInfo.grades)}%</li>

                    <div className="student-tags">
                        {this.state.tags ? this.state.tags.map((tag, index) => {
                            return(<div id="tag" key={index}>{tag}</div>)
                        }) : null}
                    </div>
                    
                    <input
                        placeholder="Add tag"
                        value={this.state.tagInput}
                        onChange={this.updateTagInput}
                        onKeyDown={this.addTag}
                        data-testid="addTag_input"
                    />
                </ul>

                {this.state.toggleGrades ? studentInfo.grades.forEach((grade, index) => {
                    <ul>
                        <li key={index}>Test {index + 1}: {grade}</li>
                    </ul>
                }) : undefined}

                {this.state.toggleGrades ? <Grades info={studentInfo.grades} /> : null}
            </div>
            <button
                id="expand-icon"
                onClick={this.toggleGrades}
                style={{ backgroundImage: `url(${this.state.toggleImg})` }}
                data-testid="plus_icon">
            </button>
        </div>
        )
    }
}