import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard page!</p>
            <div>
                <button onClick={() => alert('Button clicked!')}>Click Me</button>
            </div>
        </div>
    );
};

export default Dashboard;