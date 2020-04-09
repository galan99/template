import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class index extends Component {
  backHome = e => {
    this.props.history.push('/')
  }
  render() {
    return (
      <div>
        404页面
        <div>
          <button onClick={this.backHome}>返回首页</button>
        </div>
      </div>
    )
  }
}

export default withRouter(index)
