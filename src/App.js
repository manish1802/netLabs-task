import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import ResponsiveLayout from './navber/SidebarLayout';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <ResponsiveLayout />
      </div>
    </Router>
  );
}

export default App;
