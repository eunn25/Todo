import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <Router>
      <main className="App">
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
