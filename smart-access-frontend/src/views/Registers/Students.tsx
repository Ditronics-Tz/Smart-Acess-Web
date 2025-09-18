import React from 'react';

const Students: React.FC = () => {
    const students = [
        { id: 1, name: 'Alice Smith', grade: 'A' },
        { id: 2, name: 'Bob Johnson', grade: 'B' },
        { id: 3, name: 'Charlie Brown', grade: 'C' },
    ];

    return (
        <div>
            <h2>Student Register</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Students;