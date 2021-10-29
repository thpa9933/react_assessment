import React from "react";

const Grades = (props) => {

    let grades = [];
    if(props.info) {
        grades = props.info;
    }

    return (
        <div className="student-grades">
            {grades.map((grade, index) => {
                return (
                <ul>
                    <li key={index}>Test {index + 1}: &emsp;{grade}%</li>
                </ul>
                )
            })}
        </div>
    )
}

export default Grades;