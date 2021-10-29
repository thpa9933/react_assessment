import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Class from './components/class';
import Grades from './components/grades';
import Student from './components/student';

const studentData = [
  {
    city: "city_test_1",
    company: "company_test_1",
    email: "email_test_1",
    firstName: "firstName_test_1",
    grades: ["90", "80"],
    id: "1",
    lastName: "lastName_test_1",
    pic: "pic_test_1",
    skill: "skill_test_1"
  },
  {
    city: "city_test_2",
    company: "company_test_2",
    email: "email_test_2",
    firstName: "firstName_test_2",
    grades: ["60", "70"],
    id: "2",
    lastName: "lastName_test_2",
    pic: "pic_test_2",
    skill: "skill_test_2"
  }
]

test('Can render name filter', () => {
  const component = render(<Class />);
  const filter = component.getByTestId("filter_name");
  expect(filter).toHaveAttribute("placeholder", "Search by name");
});

test('Can render tag filter', () => {
  const component = render(<Class />);
  const filter = component.getByTestId("filter_tag");
  expect(filter).toHaveAttribute("placeholder", "Search by tag");
});

test('Can render student component', () => {
  const getStudentTags = jest.fn();
  const component = render(
    <Student 
    key={1}
    profile={studentData[0]}
    studentTags={getStudentTags}
    tags={[]}
  />);
 
  const studentInfo = component.getByTestId("studentInfo_test");
  expect(studentInfo.textContent).toContain("firstName_test_1");
  expect(studentInfo.textContent).toContain("company_test_1");
  expect(studentInfo.textContent).toContain("email_test_1");
  expect(studentInfo.textContent).toContain("skill_test_1");

  // test average functionality too ie: (90 + 80) / 2 == 85
  expect(studentInfo.textContent).toContain("Average: 85.00%");
});

test('Can toggle and display grade list', () => {
  const getStudentTags = jest.fn();
  const component = render(
    <Student 
    key={1}
    profile={studentData[0]}
    studentTags={getStudentTags}
    tags={[]}
  />);
 
  const studentInfo = component.getByTestId("studentInfo_test");
  const showGrades = component.getByTestId("plus_icon");

  fireEvent.click(showGrades);

  expect(studentInfo.textContent).toContain("Test 1:  90%");
  expect(studentInfo.textContent).toContain("Test 2:  80%");
});

test('Can add tag to student component', () => {
  const getStudentTags = jest.fn();
  const component = render(
    <Student 
    key={1}
    profile={studentData[0]}
    studentTags={getStudentTags}
    tags={[]}
  />);
 
  const studentInfo = component.getByTestId("studentInfo_test");
  const addTagInput = component.getByTestId("addTag_input");
  fireEvent.change(addTagInput, {
    target: {
      value: "tag_test"
    }
  });

  fireEvent.keyDown(addTagInput, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13
  });

  expect(studentInfo.textContent).toContain("tag_test");
});

test('Can filter students by name', () => {
  const component = render(<Class />);

  const getStudentTags = jest.fn();
  render(
    <Student 
    key={1}
    profile={studentData[0]}
    studentTags={getStudentTags}
    tags={[]}
  />);
  
  render(
    <Student 
    key={2}
    profile={studentData[1]}
    studentTags={getStudentTags}
    tags={[]}
  />);

  const nameFilter = component.getByTestId("filter_name");
  const studentInfo = screen.getAllByTestId("studentContainer_test");


  fireEvent.change(nameFilter, {
    target: {
      value: "firstName_test_1"
    }
  });

  // expect to see the filtered value and not to see others
  expect(studentInfo[0].textContent).toContain("firstName_test_1");
  const student2 = screen.queryByText("firstName_test_2");
  expect(student2).toBeNull();
});

test('Can filter students by tag', () => {
  const component = render(<Class />);

  const getStudentTags = jest.fn();
  const student1 = render(
    <Student 
    key={1}
    profile={studentData[0]}
    studentTags={getStudentTags}
    tags={[]}
  />);
  
  const student2 = render(
    <Student 
    key={2}
    profile={studentData[1]}
    studentTags={getStudentTags}
    tags={[]}
  />);

  const tagFilter = component.getByTestId("filter_tag");
  const studentInfo = screen.getAllByTestId("studentContainer_test");
  const addTagInput = screen.getAllByTestId("addTag_input");

  fireEvent.change(addTagInput[0], {
    target: {
      value: "tag1"
    }
  });
  fireEvent.keyDown(addTagInput[0], {
    key: 'Enter',
    code: 'Enter',
    charCode: 13
  });

  fireEvent.change(addTagInput[1], {
    target: {
      value: "tag2"
    }
  });
  fireEvent.keyDown(addTagInput[1], {
    key: 'Enter',
    code: 'Enter',
    charCode: 13
  });

  fireEvent.change(tagFilter, {
    target: {
      value: "tag1"
    }
  });

  // expect to see the filtered value and not to see others
  expect(studentInfo[0].textContent).toContain("firstName_test_1");
  const s2 = screen.queryByText("firstName_test_2");
  expect(s2).toBeNull();
});