import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Grid, Cell } from 'react-mdl';
import { Link, Redirect } from 'react-router-dom';
import { post } from 'axios';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width:'100%',
    margin: 'auto'
  },
  textfield:{
    width:'30%',
    marginBottom:'1em'
  },
  loginbanner: {
    display: 'flex',
    width: '50%',
    margin: 'auto',
    justifyContent: 'center'
  },
  logingrid: {
    textAlign: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%'
  },
  loginpaper:{
    opacity: '.8',
    width: '55%',
    height: '40%',
    margin: 'auto',
    padding: '2em',
  },
  loginhr:{
    borderTop: '5px dotted black',
    width: '50%',
    margin: 'auto'
  },
  loginh1:{
    fontSize: '66px',
    fontWeight: 'bold',
    color: 'black'
  }
})

class Login extends React.Component {
  constructor(props){
      super(props);
      this.state = {userid: '',password:'', login:0};
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleLogin = (e) => {
    e.preventDefault()
    this._Login()
      .then((response) => {
        if(response.data.authed != 1){
          if(response.data.authed === 0){
            alert('존재하기 않는 계정입니다.')
          }else{
            alert('비밀번호가 틀렸습니다.')
          }
        }else {
          alert('다시 돌아 오신것을 환영합니다, '+ response.data.userid + " 님!")
          this.props.fnc()
        }
      })
  }

  _Login = () => {
    const url = '/auth/login';
    return post(url,{id:this.state.userid, pw:this.state.password})
  }

  render(){
    const { classes } =this.props;
    let { from } = this.props.location.state || {from:{pathname:"/"}}
    if(this.props.login === true){
      return <Redirect to={from}/>
    }
    return(
      <div className={ classes.root }>
        <Grid className={classes.logingrid}>
          <Cell col={12}>
            <Paper className={classes.loginpaper}>
              <div className={classes.loginbanner}>
                <h1 className={classes.loginh1} style={{color:'#2c3e50'}}>고객관리</h1><h1 className={classes.loginh1} style={{color:'#2980b9'}}>시스템</h1>
              </div>
              <hr className={classes.loginhr}/>
                <div style={{margin:'2em'}}>
                  <div className="login-form">
                    <TextField className={classes.textfield} label="아이디" type="text" name="userid" value={this.state.id} onChange={this.handleValueChange} /><br/>
                    <TextField className={classes.textfield} label="비밀번호" type="password" name="password" value={this.state.password} onChange={this.handleValueChange} /><br/>
                  </div>
                  <Button style={{width:'30%'}} variant="contained" color="primary" onClick={this.handleLogin}>LOGIN</Button>
                </div>
                <hr className={classes.loginhr}/>
            </Paper>
          </Cell>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Login);
