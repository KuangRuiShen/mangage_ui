import React from 'react'
import { connect } from 'react-redux'
import { Route, Router, Redirect, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import createHistory from 'history/createHashHistory'
import { Scrollbars } from 'react-custom-scrollbars';
import SideBar from '../../app/route/sidebar';

import { allMenu } from '../../app/route/menu';

/*工具类*/
import { getSize } from '../../utils/util'

/*公用组件*/
import NavigationBar from '../navigationBar/index'
import Top from '../header/index'

/*模块*/
import Login from '../login/index'//登录
import login_tu from '../../../assets/images/login.png';

import Welcome from '../../app/components/welcome';//欢迎页
import Product from '../../app/components/product';
import Year from '../../app/components/year'
import Type from '../../app/components/type';

const { Sider, Content } = Layout;
const history = createHistory()

@connect((state) => {
    const { login, dispatch } = state
    return { login, dispatch }
})

export default class GlobalRoute extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            expandedKeys: [],
            theme: 'dark',
            isadmin: false,
        }
    }


    componentWillMount() {
        window.dispatch = this.props.dispatch;
        this.goLogin();
    }

    componentWillUpdate(newProps, newState) {
        //已经登录
        // if (newProps.login.data) {
        //     // history.replace
        //     // let user = newProps.login.data;
        //     // console.info("newProps.login.data",user
        //     let url = window.location.href.split("#")[1];
        //     if ((url === "/login") || (url === "login") || (url === "/")) {
        //         history.replace({ pathname: '/index' })
        //     }
        // } else {
        //     history.replace({ pathname: '/login' })
        // }
    }


    goLogin = () => {
        let userlogin = sessionStorage.getItem("userLogin");
        if (userlogin) {
            let url = window.location.href.split("#")[1];
            if ((url === "/login") || (url === "login") || (url === "/")) {
                history.replace({ pathname: '/welcome' })
            }
        } else {
            history.replace({ pathname: '/login' })
        }

    }


    //菜单收缩
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    changeTheme = (e) => {
        this.setState({
            theme: e
        })
    }

    // getRouts=()=>{

    // }

    render() {
        // const { SubMenu } = Menu;
        this.goLogin();

        return (
            <Router history={history}>
                <Route render={({ location }) => {
                    return (<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        <Switch location={location}>
                            <Route location={location} exact path="/" render={() => (<Redirect to="/login" />)} />
                            <Route location={location} path="/login" render={() => <Login />} />
                            <Route location={location} render={({ location }) => {
                                return (<div style={{ height: '100%' }}>
                                    <Layout style={{ minHeight: '100vh' }}>
                                        {/* 左侧菜单栏 */}
                                        <Sider
                                            trigger={null}
                                            collapsible
                                            collapsed={this.state.collapsed}
                                            width={200}
                                            className='sider_menu' >
                                            <div className="logo">
                                                {this.state.collapsed ? <img style={{ height: 64 }} src={login_tu} /> :
                                                    <span style={{ fontSize: '20px', color: 'white' }}>管理平台</span>}
                                            </div>

                                            <SideBar theme={this.state.theme} collapsed={this.state.collapsed} />

                                        </Sider>
                                        <Layout>
                                            {/* 头部公用组件 */}
                                            <Top collapsed={this.state.collapsed} toggle={this.toggle}
                                                changeTheme={this.changeTheme} />
                                            <NavigationBar allMenu={allMenu} />
                                            <Scrollbars >
                                                <Content style={{ minHeight: getSize().windowH - 128 }}>
                                                    <Switch location={location} key={location.pathname.split('/')[1]}>
                                                        <Route location={location} path="/index" render={() => <Category location={location} />} />
                                                        <Route location={location} path="/welcome" render={() => <Type location={location} />} />
                                    
                                                        <Route location={location} path="/zhu" render={() =><Product location={location} typeId={2}/>} />
                                                        <Route location={location} path="/wu" render={() => <Product location={location} typeId={3}/>} />
                                                        <Route location={location} path="/yi" render={() => <Product location={location} typeId={4}/>} />
                                                        <Route location={location} path="/ji1" render={() => <Year location={location} typeId={5}/>} />
                                                        <Route location={location} path="/ji2" render={() => <Product location={location} typeId={6}/>} />
                                                        <Route location={location} path="/mu" render={() => <Product location={location} typeId={7}/>} />
                                                        <Route location={location} render={() => <Redirect to='/login' />} />

                                                     
                                                    </Switch>
                                                </Content>
                                            </Scrollbars>
                                        </Layout>
                                    </Layout>
                                </div>
                                )
                            }} />

                        </Switch>
                    </div>
                    )
                }} />
            </Router>
        );
    }
}