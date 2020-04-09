import React from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import routes from './routes.js';

class BasicRoute extends React.Component{
    render(){
        return (
            <HashRouter>
                <Switch>
                    {routes.map(ele => <Route render={(props) => <ele.component {...props}/>} key={ele.path} path={ele.path} />)}
                    <Redirect from="/" exact to="/index" />
                    <Redirect to="/404" />
                </Switch>
            </HashRouter>
        )
    }
}


export default BasicRoute;