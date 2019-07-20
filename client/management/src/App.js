import React from 'react';
import './App.css';
import { Switch, Route,Redirect, BrowserRouter} from 'react-router-dom';
import ManagePages from './pages/ManagePages';
import Login from './components/Login';
import Content from 'react-mdl';

const PrivateRoute = ({component: Component,authed, ...rest}) => {
  return (
      <Route {...rest} render={(props) =>
        authed ===true ? <Component {...props} /> : <Redirect to={{pathname: '/login', state: { from : props.location}}} />}
      />
  )
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      session:false
    }
  }

  LoginCurrent = async() => {
    var session = await (await fetch('/auth/logined')).json()
    this.setState({session:session.isLogined})
  }

  componentDidMount(){
    this.LoginCurrent();
    console.log(this.state.session);
  }

  Loginstate = () => {
    this.LoginCurrent();
    console.log(this.state.session);
  }

  render(){
    return(
      <BrowserRouter>
        <div>
        </div>
          <Switch>
            <PrivateRoute authed={this.state.session} exact path="/" component={ManagePages} />
            <Route path='/login' render={(props) => <Login login={this.state.session} location = {props.location} fnc ={this.Loginstate} />}/>
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
