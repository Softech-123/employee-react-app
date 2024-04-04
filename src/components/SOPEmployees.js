import React, { useState, useEffect } from "react";
import axios from "axios";

const SopEmployees = (props) => {
  const [employees, setEmployees] = useState([]);
  const { sop_id } = props;

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/sops/${sop_id}/employees`)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, [sop_id]);
  
  return (
    <div>
      <h2>
      Employees for SOP_id: {sop_id}
      </h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Department ID</th>
            <th>Training Status</th>
            
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.employee_name}</td>
              <td>{employee.start_date}</td>
              <td>{employee.end_date}</td>
              <td>{employee.department.department_id}</td>
              <td>{employee.completed ? "✅" : "❌"}</td>
              
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SopEmployees;