import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import About from './pages/About'
import Home from './pages/Home.js'
import Register from './authentication/Register'
import Login from './authentication/Login'
import ActivationEmail from './authentication/ActivationEmail'
import NotFound from './pages/NotFound'

export default function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/activateEmail/:activation_token">
            <ActivationEmail />
          </Route>
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/home" component={Home} />
          <Route path="/about" component={About} />
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
