import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import $axios from "../../utils/http";

class index extends Component {
  async getData() {
    const result = await $axios.get('/config/list')
    console.log(result)
  }
  handleRouter = e => {
    this.props.history.push({pathname: '/list', search: '?from=test'})
  }
  render() {
    return (
      <div>
        首页
        <button onClick={this.getData}>请求数据</button>
        <p>控制台查看数据</p>
        <button onClick={this.handleRouter}>其他页面</button>
      </div>
    )
  }
}

export default withRouter(index)