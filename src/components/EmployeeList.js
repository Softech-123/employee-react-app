import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SOPList from "./SOPList";
import SaveEmployee from "./SaveEmployee";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeId, setSelectedDepartmentId, setSelectedEmployeeId } from "../Utils/employeeConfig";
import DeleteEmployee from "./DeleteEmployee";
import AddDepartment from "./AddDepartment";
import AddSOPs from "./AddSOPs";
import EmployeeSOPs from "./EmployeeSOPs";
import DepartmentSOPList from "./DepartmentSOPList";
import { setEmployeeMarks } from "../Utils/employeeMarks";
import DepartmentList from "./DepartmentList";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showEmployees, setShowEmployees] = useState(true);
  const [showEmployeesop, setShowEmployeesop] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateNewEmployee, setUpdateNewEmployee] = useState(false);
  //const [goToDepartment, setGoToDepartment] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const arrayEmployee = useSelector(
    (store) => store.employeeMarks.EmployeeMarks
  );
  console.log("arrayEmployee", arrayEmployee);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/employees")
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/empsopmarks`)
      .then((response) => dispatch(setEmployeeMarks(response.data)))
      .catch((error) => console.error("Error fetching marks:", error));
  }, []);

  const handleDepartmentClick = async (department_id) => {
    dispatch(setSelectedDepartmentId(department_id));
    localStorage.setItem('departmentId', JSON.stringify(department_id));
    navigate("/departmentSops");
  };

  const handleEmployeeClick = async (employee_id) => {
    console.log("employee", employee_id);
    dispatch(setSelectedEmployeeId(employee_id));
    localStorage.setItem('employeeId', JSON.stringify(employee_id));
    navigate("/employeeSops");
  };

  const handleSaveEmployee = () => {
    navigate("/addEmployee");
  };

  const handleAddDepartment = () => {
    navigate("/addDepartment");
  };

  const handleAddSOPs = () => {
    navigate("/addSop");
  };

  const handleSOPList = () => {
    navigate("/sopList");
  };
  const handleDepartmentList = () => {
    navigate("/deptList");
    //setGoToDepartment(true);
  };

  const handleUpdateEmployee = (employee_id) => {
    console.log("Update employee logic here for employee ID:", employee_id);
    setUpdateNewEmployee(true);
    dispatch(setEmployeeId(employee_id));
    navigate("/UpdateEmployee");
  };

  const handleDeleteEmployee = (employee_id) => {
    console.log("Delete employee logic here for employee ID:", employee_id);
    setEmployees(
      employees.filter((employee) => employee.employee_id !== employee_id)
    );
  };

  const showUpcomingDatePopup = (upcomingDate) => {
    const oneMonthBefore = new Date(upcomingDate);
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
    const currentDate = new Date();
    return (
      currentDate >= oneMonthBefore && currentDate < new Date(upcomingDate)
    );
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  console.log("selected", selectedMonth);
  const filteredEmployees = selectedMonth
    ? employees.filter((employee) => {
      const endDate = new Date(employee.end_date);
      console.log("chhutki", endDate);
      return months[endDate.getMonth()] === selectedMonth;
    })
    : employees;

  return (
    <div>
      {showEmployees && (
        <>
          <button onClick={handleSaveEmployee}>Add Employee</button>
          <button onClick={handleAddDepartment}>Add Department</button>
          <button onClick={handleAddSOPs}>Add SOPs</button>
          <button onClick={handleSOPList}>SOPList</button>
          <button onClick={handleDepartmentList}>DepartmentList</button>
          {/* {goToDepartment && <DepartmentList />} */}
          <h2>EmployeeList</h2>
          <div>
            <select value={selectedMonth} onChange={handleMonthChange}>
              <option value="">Select a month</option>
              {months.map((month) => (
                <option value={month}>{month}</option>
              ))}
            </select>
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>SI_NO.</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Previous_Date</th>
                <th>Upcoming_Date</th>
                <th>Department ID</th>
                <th>Training Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.employee_id}>
                  <td>{index + 1}</td>
                  <td>
                    <button
                      onClick={() => {
                        handleEmployeeClick(employee.employee_id);
                      }}
                    >
                      {employee.employee_id}
                    </button>
                  </td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.start_date}</td>
                  <td>
                    {showUpcomingDatePopup(employee.end_date) && (
                      <span style={{ color: "red" }}>{employee.end_date}</span>
                    )}
                    {!showUpcomingDatePopup(employee.end_date) && (
                      <span>{employee.end_date}</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDepartmentClick(employee.department.department_id)
                      }
                    >
                      {employee.department.department_id}
                    </button>
                  </td>
                  <td>
                    {arrayEmployee.filter(
                      (data) => data.employee_id === employee.employee_id
                    ).length > 0 &&
                      arrayEmployee
                        .filter(
                          (data) => data?.employee_id === employee.employee_id
                        )
                        .map((data1) => data1?.marks)
                        .every((marks) => marks >= 80)
                      ? "✅"
                      : "❌"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateEmployee(employee.employee_id)}
                    >
                      Update
                    </button>
                    <DeleteEmployee
                      employee_id={employee.employee_id}
                      onDelete={handleDeleteEmployee}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
