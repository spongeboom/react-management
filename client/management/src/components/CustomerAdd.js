import React from 'react';
import { post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  hidden: {
    display: 'none'
  },
  formControl: {
    minWidth: '100%'
  }
})

class CustomerAdd extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      file: null,
      userName: '',
      birthday:'',
      gender:'남자',
      job:'',
      fileName:'',
      open: false,
      isNullForm: true
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault()

    const {file,fileName,userName,birthday,gender,job} = this.state;

    if(file === null || fileName === '' || fileName.length === 0 || userName === '' || userName.length === 0 ||
        birthday === '' || birthday.length === 0 || job === '' || job.length === 0){
          this.setState({isNullForm:false})
    }else{
      this.addCustomer()
          .then((response) => {
            alert('새로운 고객이 추가되었습니다.')
            this.props.stateRefresh();
      })
      .catch(err => {
        alert('오류가 발생하였습니다. 잠시후 다시 시도해주세요..')
        this.props.stateRefresh();
      })
      // 초기화
      this.setState({
        file: null,
        userName: '',
        birthday:'',
        gender:'남자',
        job:'',
        fileName:'',
        open:false,
        isNullForm: true
      })
    }
  }

  handleFileChange = (e) => {
    this.setState({isNullForm:true})
    this.setState({
      file : e.target.files[0],
      fileName : e.target.value
    })
  }

  handleValueChange = (e) => {
    this.setState({isNullForm:true})
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  addCustomer = () => {
    const url = '/api/customers';
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('name', this.state.userName);
    formData.append('birthday', this.state.birthday);
    formData.append('gender', this.state.gender);
    formData.append('job', this.state.job);

    const config = { // 파일을 전송하기 위해
      header:{
        'content-type': 'multipart/form-data'
      }
    }
    return post(url,formData,config);
  }

  handleClickOpen = () =>{
    this.setState({
      open:true
    });
  }

  handleClose = () => {
    this.setState({
      file: null,
      userName: '',
      birthday:'',
      gender:'남자',
      job:'',
      fileName:'',
      open: false,
      isNullForm: true
    })
  }

  render(){
    const { classes } = this.props;
    const jobList = ["학생","회사원","공무원","무직"];
    return(
      <div>
          <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
              고객 추가하기
          </Button>
          <Dialog open={this.state.open} onClose={this.handleClose}>
              <DialogTitle>고객 추가</DialogTitle>
              <DialogContent>
                <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/> <br/>
                <label htmlFor="raised-button-file">
                  <Button variant="contained" color="primary" component="span" name="file">
                    {this.state.fileName === "" ? "프로필 이미지 선택" : this.state.fileName}
                  </Button>
                </label>
                <br/>
                <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange} /><br/><br/>
                <TextField id="date" label="생년월일" type="date" name="birthday" InputLabelProps={{shrink:true,}} value={this.state.birthday} onChange={this.handleValueChange} /><br/><br/>
                <FormControl component="fieldset">
                <FormLabel component="legend">성별</FormLabel>
                <RadioGroup name="gender" value={this.state.gender} onChange={this.handleValueChange} row>
                  <FormControlLabel
                    value="남자"
                    control={<Radio color="primary" />}
                    label="남자"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="여자"
                    control={<Radio color="primary" />}
                    label="여자"
                    labelPlacement="start"
                  />
                </RadioGroup>
                </FormControl>
                  <FormControl className={classes.formControl}>
                  <InputLabel>직업</InputLabel>
                    <Select value={this.state.job} name="job" onChange={this.handleValueChange}>
                      {
                        jobList.map((j,i) => {
                          return <MenuItem key={i} value={j}>{j}</MenuItem>
                        })
                      }
                    </Select>
                </FormControl>
                {this.state.isNullForm === false &&
                  <Typography style={{color:'#F44336', margin:'0.6em'}} fontWeight="fontWeightMedium">빈칸을 전부 채워주세요.</Typography>
                }
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
              </DialogActions>
          </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(CustomerAdd);
