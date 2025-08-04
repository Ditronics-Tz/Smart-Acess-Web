import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/themes/themes';
import Layout from './components/layout/Layout';
import Home from './views/Home';
import './styles/global.css';

function App() {
  const handleLogin = () => {
    // Add your login navigation logic here
    console.log('Navigate to login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onLoginClick={handleLogin}>
        <Home />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
