/**
 * Created by apple on 2019/7/18.
 */
import React,{ Component } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import {message} from 'antd';
import 'antd/dist/antd.css';

import '../static/font/iconfont.css';

export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            phone:'',
            password:'',
            checkcode : ''
        };
        //定义dom引用(ref)
        this.checkcodeNode = React.createRef();
    }
    handleLoginSubmit(e){
        e.preventDefault();
        //拿到表单数据
        console.log(this.state);
        //发起登陆请求
        axios.post('http://localhost:3000/api/login',this.state).then(function (res) {
            if(!res.data.code)//登陆成功
            {
                //存储sessionId到本地(localStorage,cookie)
                //console.log(res.data);
                Cookie.set('sessionId',res.data.sessionId);
                //跳转到Home组件
                this.props.history.push('/home');
                message.success(res.data.message);

            }
            else
            {
                //弹出提示框
                message.error(res.data.message);
            }
        }.bind(this));
    }
    handleCheckCode(){
        //发起获取验证码的请求
        axios.get('http://localhost:3000/api/checkcode').then(function (res) {
            if(!res.data.code)//获取验证码成功
            {
                console.log(res.data);
                //显示验证码到页面
                this.checkcodeNode.current.innerHTML = res.data.Verification;
            }
        }.bind(this));
    }
    render(){
        return (
            <div className="login-page">
                <div className="left">
                    <div className="title">Welcome</div>
                    <div className="desc">赚赚金融 开创信贷“1＋N”模式的综合互联网金融服务共享平台</div>
                </div>
                <div className="right">
                    <form action="" onSubmit={this.handleLoginSubmit.bind(this)}>

                        <div className="row"><i className="iconfont iconlogo"></i></div>
                        <div className="row">赚赚金融渠道管理系统</div>
                        <div className="row"><input type="text" placeholder="手机号" defaultValue={this.state.phone} onChange={e=>{ this.setState({ phone: e.target.value }) }}/></div>
                        <div className="row"><input type="password" placeholder="登陆密码" defaultValue={this.state.password} onChange={e=>{ this.setState({ password: e.target.value }) }}/></div>
                        <div className="row"><input type="text" placeholder="验证码" defaultValue={this.state.checkcode} onChange={e=>{ this.setState({ checkcode: e.target.value }) }}/><span className="checkcode" onClick={this.handleCheckCode.bind(this)} ref={this.checkcodeNode}>{'获取验证码'}</span></div>
                        <div className="row"><button type="submit">登陆</button></div>
                    </form>

                </div>
            </div>
        )
    }
}