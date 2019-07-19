import React from 'react';
import { BrowserRouter,Route,Switch,Redirect } from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import Login from './components/Login.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" component={Login}></Route>
          <Route component={Home} ></Route>
          {/*<Redirect to="/"></Redirect>*/}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
