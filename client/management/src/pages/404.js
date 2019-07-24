import React from 'react';
import Button from '@material-ui/core/Button';


 const NotFoundPage = () => {
    return(
      <div style={{textAlign:'center', marginTop:'5em'}}>
        <h1 style={{fontSize:'200px',color:'#315991'}}>404</h1>
        <h2>페이지를 찾지 못하였습니다</h2>
        <Button variant="outlined" color="primary" href='/'>홈으로 돌아가기</Button>
      </div>
    )
}

export default NotFoundPage;
