import React from 'react';
import Customer from '../components/Customer';
import CustomerAdd from '../components/CustomerAdd';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { Link as RouterLink } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import ServerError from './500';

const styles = theme => ({
      root: {
        width: "100%",
        minWidth: 1080
      },
      menu: {
        marginTop: 15,
        marginBottom: 15,
        display: 'flex',
        justifyContent: 'center'
      },
      paper: {
        marginLeft: 18,
        marginRight: 18
      },
        progress: {
        margin: theme.spacing.unit * 2
      },
      grow: {
        flexGrow: 1,
      },
      tableHead: {
        fontSize: '1.0rem'
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
      },
      title: {
        display: 'none',
        marginRight:'0.5em',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit,
          width: 'auto',
        },
      },
      searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
        width: '100%',
      },
      inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: 120,
          '&:focus': {
            width: 200,
          },
        },
      }
    });


class ManagePages extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword: ''
    }
    this.stateRefresh = this.stateRefresh.bind(this);
  }

  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0,
      searchKeyword:''
    })
    this.callApi()
      .then(res => this.setState({customers: res}))
      .catch(err => this.setState({status:false}));
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed : completed >= 100 ? 0 : completed + 1});
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then(res => this.setState({customers: res}))
      .catch(err => this.setState({status:false}));
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  handleValueChanges = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  onLogout = async() => {
    const url = '/auth/logout'
    await (await fetch(url,{
      method: 'DELETE'
    }));
    this.props.loginstate()
  }

  render(){
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday}
        gender={c.gender} job={c.job} />
      });
    }
    let login = this.props.login;
    const { classes } =this.props;
    const cellList = ["번호", "프로필 이미지", "이름", "생년월일", "성별" , "직업"]
    return(
      <div className={ classes.root}>
        {this.state.status !== false ?
          <div>
            <AppBar position="static">
              <Toolbar>
                <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                  고객 관리 시스템
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="고객 검색하기"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    name ="searchKeyword"
                    value={this.state.searchKeyword}
                    onChange={this.handleValueChanges}
                  />
                </div>
                <div className={classes.grow} />
                { this.props.login === true &&
                <Button color="inherit" href="/login" onClick={this.onLogout}>로그아웃</Button>
                }
              </Toolbar>
            </AppBar>
            <div className={classes.menu}>
              <CustomerAdd stateRefresh={this.stateRefresh}/>
            </div>
            <Paper className={classes.paper}>
              <Table>
                <TableHead>
                  { cellList.map((c,i) => {
                    return <TableCell key={i} className={classes.tableHead}>{c}</TableCell>
                  })}
                </TableHead>
                <TableBody>
                  {this.state.customers ?
                    filteredComponents(this.state.customers) :
                    <TableRow>
                      <TableCell colSpan="6" align="center">
                        <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </Paper>
          </div>
          :<ServerError />
        }
      </div>
    );
  }
}

export default withStyles(styles)(ManagePages);
