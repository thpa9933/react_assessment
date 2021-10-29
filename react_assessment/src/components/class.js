import React from 'react';
import Student from './student';
require('dotenv').config();

export default class Class extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            students: {},
            studentInput: "",
            tagInput: "",
            studentTags: [],
            hasError: false
        }
    }

    componentDidMount = () => {
        this.fetchData();
    }

    // Get data from API
    fetchData = async () => {
        const url = process.env.API_URL;
        
        const response = await fetch(url);
        const data = await response.json();

        if(data) {
            this.setState({
                students: data.students,
                loading: false
            });
        }
        else {
            this.setState({
                hasError: true
            });
        }
    }

    // Track Name filter
    inputFilterStudent = (event) => {
        this.setState({
            studentInput: event.target.value
        });
    }

    // Track Tag filter
    inputFilterTag = (event) => {
        this.setState({
            tagInput: event.target.value
        });
    }

    // In order to filter on tags, the class component needs access tags of each child
    // Child passes up data via this call back in the form of a prop
    getStudentTags = (studentId, tag) => {
        if(studentId && tag) {
            const hasTag = this.state.studentTags.some((student) => student.studentId === studentId);

            // If student has tags already, add the new tag to their taglist
            // Else, add them by Id to state.studentTags
            if(hasTag) {
                this.state.studentTags.forEach((student) => {
                    if (student.studentId === studentId) {
                        student.tagList.push(tag);
                    }
                });
            }
            else {
                const tagList = [tag];
                const tagObj = {studentId, tagList};
                this.setState({
                    studentTags: [...this.state.studentTags, tagObj]
                });
            }
        }
    }

    // Return true if the student's tags contain the input from the tag filter
    hasTag = (id, tag) => {
        let hasTag = false;
        const containsStudent = this.state.studentTags.find((s) => s.studentId === id);
        if(containsStudent) {
            hasTag = containsStudent.tagList.find((t) => t.startsWith(tag));
        }

        return hasTag;
    }

    // Filter students based on the name and tag filter
    getFilteredStudents = () => {
        let studentListByName = [];
        let studentListByTag = [];

        Object.values(this.state.students).forEach((student) => {
            const studentInput = this.state.studentInput.toLowerCase();
            const firstName = student.firstName.toLowerCase();
            const lastName = student.lastName.toLowerCase();

            if (studentInput === '' || firstName.startsWith(studentInput) || lastName.startsWith(studentInput)) {
                studentListByName.push(student);
            }
        });

        Object.values(this.state.students).forEach((student) => {
            const tagInput = this.state.tagInput.toLowerCase();
            const hasTag = this.hasTag(student.id, tagInput);

            if (tagInput === '' || hasTag) {
                studentListByTag.push(student);
            }
        });

        // Return intersection of filtered lists
        return studentListByName.filter((student) => studentListByTag.includes(student));
    }

    render() {
        const errorMsg = this.state.hasError ? <div> Error fetching data, please reload page to try again. </div> : undefined;
        const students = this.getFilteredStudents();

        return(
            <div>
                {errorMsg}
                <div className="profile-filter">
                    <input
                        placeholder="Search by name"
                        value={this.state.studentInput}
                        onChange={this.inputFilterStudent}
                        data-testid="filter_name"
                    />

                <input
                        placeholder="Search by tag"
                        value={this.state.tagInput}
                        onChange={this.inputFilterTag}
                        data-testid="filter_tag"
                    />
                </div>
                {
                    students.map((studentInfo) => {
                        let tag = [];
                        let tagList = [];
                        if(this.state.studentTags.length > 0) {
                            tag = this.state.studentTags.find((x) => x.studentId === studentInfo.id);
                            if(tag) {
                                tagList = tag.tagList;
                            }
                        }

                        return(<Student 
                            key={studentInfo.id}
                            profile={studentInfo}
                            studentTags={this.getStudentTags}
                            tags={tagList}
                            />)
                    })
                }
            </div>
        )
    }

}