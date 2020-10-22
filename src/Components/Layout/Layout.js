import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'
class Layout extends Component{
    state = {
        showSidDrawer: true
    }
    sideDrawerClosedHandler = ()=>{
        this.setState({showSidDrawer: false})
    }

    render(){
        return(
            <Aux>
                <Toolbar/>
                <SideDrawer open ={this.state.showSidDrawer}closed = {this.sideDrawerClosedHandler}/>
                <main className ={classes.Content}>
                    {this.props.children}
                </main>

            </Aux>
        );
    }
    
};
   

export default Layout;