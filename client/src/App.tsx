import React from 'react';
import logo from './logo.svg';
import './App.css';
import MyGroups from 'src/MyGroups/MyGroups';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>

        <MyGroups/>

      </header>
    </div>
  );
};

export default App;
