import React,{ useContext } from 'react';
import Authed from "../TestContext";
import { Switch, Route, Redirect } from 'react-router-dom';
import ManagePages from '../pages/ManagePages';
import Login from './Login';

const PrivateRoute = ({component: Component,authed, ...rest}) => {
  return (
      <Route {...rest} render={(props) =>
        authed ===true ? <Component {...props} /> : <Redirect to={{pathname: '/login', state: { from : props.location}}} />}
      />
  )
}

const Main = (props) => {
  const session = useContext(Authed);
  return (
    <Switch>
      <PrivateRoute authed={session} exact path="/" component={ManagePages} />
      <Route path='/login' render={(props) => <Login login={session} location = {props.location} fnc={props.fnc}/>}/>
    </Switch>
  )
}

export default Main;
