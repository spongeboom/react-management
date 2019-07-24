import React from 'react';
import './App.css';
import { Switch, Route,Redirect, BrowserRouter} from 'react-router-dom';
import ManagePage from './pages/ManagePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/404';

const PrivateRoute = ({component: Component,authed,loginstate, ...rest}) => {
  return (
      <Route {...rest} render={(props) =>
        authed ===true ? <Component login={authed} loginstate={loginstate} /> : <Redirect to={{pathname: '/login', state: { from : props.location}}} />}
      />
  )
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      authed:false
    }
  }

  LoginCurrent = async() => {
    var session = await (await fetch('/auth/logined')).json()
    this.setState({authed:session.isLogined})
  }

  componentDidMount(){
    this.LoginCurrent();
  }

  loginState = () => {
    this.LoginCurrent();
  }

  render(){
    return(
      <BrowserRouter>
          <Switch>
            <PrivateRoute authed={this.state.authed} loginstate={this.loginState} exact path="/" component={ManagePage} />
            <Route path='/login' render={(props) => <LoginPage authed={this.state.authed} location={props.location} loginstate ={this.loginState} />}/>
            <Route path='*' component={NotFoundPage}/>
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
