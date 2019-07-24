import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Grid';
import { Redirect } from 'react-router-dom';
import { post } from 'axios';
import { withStyles } from '@material-ui/core/styles';
import ServerError from './500';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  textfield:{
    width:'30%',
  },
  loginpaper:{
    padding:'2em'
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
      this.state = {userId: '',password:'',errorIdPw:true, statusMessage:'',status:true};
  }

  handleValueChange = (e) => {
    this.setState({
      errorIdPw: true,
      statusMessage:''
    })
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleLogin = (e) => {
    e.preventDefault()
    if(this.state.userId === ''|| this.state.password === ''|| this.state.userId.length === 0 || this.state.password.length === 0){
      this.setState({
        errorIdPw: false,
        statusMessage: '아이디와 비밀번호를 입력하세요'
      })
    }else{
      this._Login()
        .then((response) => {
            if(response.data.authed !== 1){
              if(response.data.authed === 0){
                this.setState({
                  errorIdPw: false,
                  statusMessage: '존재하지 않는 계정입니다.'
                })
              }else{
                this.setState({
                  errorIdPw: false,
                  statusMessage: '비밀번호가 잘못되었습니다.'
                })
              }
            }else {
              alert('다시 돌아 오신것을 환영합니다, '+ response.data.userid + " 님!")
              this.props.loginstate()
            }
        })
        .catch(err => this.setState({status:false}));
    }
  }

  _Login = () => {
    const url = '/auth/login';
    return post(url,{id:this.state.userId, pw:this.state.password})
  }

  render(){
    const { classes } =this.props;
    let { from } = this.props.location.state || {from:{pathname:"/"}}
    if(this.props.authed === true){
      return <Redirect to={from}/>
    }
    return(
      <div>
        { this.state.status !== false ?
          <Grid container className={classes.root} style={{padding:'3em'}}>
          <Grid container justify="center" alignItems="center" item xs={12}>
            <Grid item xs={8}>
              <Paper className={classes.loginpaper}>
                <Grid container direction="row" justify="center">
                  <h1 className={classes.loginh1} style={{color:'#2c3e50'}}>고객관리</h1>
                  <h1 className={classes.loginh1} style={{color:'#2980b9'}}>시스템</h1>
                </Grid>
                  <Grid container direction="column" alignItems="center" style={{padding:'1em'}}>
                    <TextField className={classes.textfield} style={{marginBottom:'0.5em'}} label="아이디" type="text" name="userId" value={this.state.id} onChange={this.handleValueChange} />
                    <TextField className={classes.textfield} label="비밀번호" type="password" name="password" value={this.state.password} onChange={this.handleValueChange} />
                    {this.state.errorIdPw === false &&
                      <Typography style={{color:'#F44336', margin:'0.6em'}} fontWeight="fontWeightMedium">{this.state.statusMessage}</Typography>
                    }
                  </Grid>
                  <Grid container direction="column" alignItems="center" style={{padding:'1em'}}>
                    <Button style={{width:'30%', marginBottom:'1em'}} variant="contained" color="primary" onClick={this.handleLogin}>로그인</Button>
                  </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid> : <ServerError /> }
      </div>
    )
  }
}

export default withStyles(styles)(Login);
