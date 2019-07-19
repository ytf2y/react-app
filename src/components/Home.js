/**
 * Created by apple on 2019/7/18.
 */
import React,{ Component } from 'react';
import {Menu,Icon,Button,Tabs,Table,DatePicker,InputNumber,Radio,Select} from 'antd';
import axios from 'axios';
import Cookie from 'js-cookie';
let {SubMenu} = Menu;
let {TabPane} = Tabs;
let {RangePicker } = DatePicker;
let { Option } = Select;

export default class Home extends Component{
    constructor(props){
        super(props);

        this.newTabIndex = 3;
        const panes = [{ title:'首页',content:'欢迎来到转转金融管理后台!',key:'0' }];
        this.columns = [
            {
                title: '订单编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '下单时间',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '客户名称',
                dataIndex: 'customerName',
                key: 'customerName'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: '转单类型',
                dataIndex: 'type',
                key: 'type'
            },
            {
                title: '订单金额(万元)',
                dataIndex: 'money',
                key: 'money'
            },
            {
                title: '客服',
                dataIndex: 'serviceName',
                key: 'serviceName'
            }
        ];
        this.state = {
            list:[],//原始数据
            temp_list:undefined,//存放过滤之后的数据
            info:{},//登陆用户信息
            activeKey: '0',//默认激活(打开)的标签页
            panes,//保存所有打开的标签页
            startTime:'',//订单处理时间-开始时间
            endTime:'',//订单处理时间-结束时间
            minMoney:0,//订单金额-最小值
            maxMoney:0,//订单金额-最大值
            handleState:5,//订单状态
            type:''//转单类型
        };
    }
    componentDidMount(){
        //请求用户信息
        axios.defaults.headers.common['authorization'] =Cookie.get('sessionId');

        axios.get('http://localhost:3000/api/islogin').then(res => {
            if(!res.data.code)//请求成功
            {
                this.setState({ info:res.data.info });
            }
        })
    }

    onChange = activeKey => {
        //重新请求数据
        console.log('onChange');

        //跳转路由
        if(activeKey == '1')
            this.props.history.push('/home/order/dk');
        else if(activeKey == '2')
            this.props.history.push('/home/order/zd');
        else
            this.props.history.push('/home/order/bx');

        //请求订单列表
        axios.defaults.headers.common['authorization'] =Cookie.get('sessionId');
        axios.get('http://localhost:3000/api/list?order='+activeKey).then(function (res) {
            if(!res.data.code)//登陆成功
            {
                console.log(res.data.data);
                //主动给每个对象添加key属性
                for(var i = 0 ;i < res.data.data.length;i++)
                {
                    res.data.data[i].key = i+1;
                }
                //添加key
                this.setState({ list:res.data.data });
            }
        }.bind(this));

        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = (title,key) => {
        const { panes } = this.state;

        //判断是否已经打开
        for(var i = 0;i < panes.length;i++)
        {
            if(panes[i].key == key)//已打开
            {
                this.onChange(key);
                return;
            }
        }

        //const activeKey = `${this.newTabIndex++}`;
        panes.push({ title, content: 'New Tab Pane', key});
        this.setState({ panes, activeKey:key });
    };

    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
    };

    //点击导航菜单
    handleMenuClick(e){
        //添加或者切换tab
        //传入标签页文本,标签页key
        this.add(e.item.props.children,e.key);

        //跳转路由
        if(e.key == '1')
            this.props.history.push('/home/order/dk');
        else if(e.key == '2')
            this.props.history.push('/home/order/zd');
        else
            this.props.history.push('/home/order/bx');


        //请求订单列表
        axios.defaults.headers.common['authorization'] =Cookie.get('sessionId');
        axios.get('http://localhost:3000/api/list?order='+e.key).then(function (res) {
            if(!res.data.code)//登陆成功
            {
                console.log(res.data.data);
                //主动给每个对象添加key属性
                for(var i = 0 ;i < res.data.data.length;i++)
                {
                    res.data.data[i].key = i+1;
                }
                //添加key
                this.setState({ list:res.data.data });
            }
        }.bind(this));

    }

    //处理选择的时间段
    handleDateChange(date,dateString){
        console.log(dateString);
        this.setState({startTime:dateString[0],endTime:dateString[1]});
    }

    handleSearch()
    {
        //根据当前查询条件,,筛选出符合调价的订单
        var temp_list = this.state.list.filter(item=>{
            var date = new Date(item.date).getTime();
            var startdate = new Date(this.state.startTime).getTime();
            var enddate = new Date(this.state.endTime).getTime();

            return (date > startdate && date < enddate) && (item.money >= this.state.minMoney && item.money <= this.state.maxMoney) && (this.state.handleState == 5 ? true : item.handleState == this.state.handleState) && (!this.state.type ? true : this.state.type == item.type);
        });

        this.setState({temp_list});
    }

    render(){
        return (
            <div className="home-page">
                <Menu
                    theme={'dark'}
                    onClick={this.handleClick}
                    style={{ width: 256 }}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={['1']}
                    mode="inline"
                    >
                    <div className="user">
                        <img src={'http://localhost:3000'+this.state.info.facePhoto} alt=""/>
                        <p>{this.state.info.phone}</p>
                    </div>

                    <Menu.Item key="0">首页</Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                          <span>
                            <Icon type="setting" />
                            <span>订单管理</span>
                          </span>
                        }
                        >
                        <Menu.Item key="1" onClick={ this.handleMenuClick.bind(this) }>贷款订单</Menu.Item>
                        <Menu.Item key="2" onClick={ this.handleMenuClick.bind(this) }>转单订单</Menu.Item>
                        <Menu.Item key="3" onClick={ this.handleMenuClick.bind(this) }>保险订单</Menu.Item>
                    </SubMenu>
                    {<Menu.Item key="4"><Button>退出</Button></Menu.Item>}

                </Menu>
                <div className="content">
                    <Tabs
                        hideAdd
                        onChange={this.onChange}
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                        >
                        {this.state.panes.map(pane => (
                            <TabPane tab={pane.title} key={pane.key}>
                                { pane.key == 0 && pane.content}
                                {

                                    pane.key != 0 && <div>
                                        <div className="row">
                                            处理时间:
                                            <RangePicker onChange={this.handleDateChange.bind(this)}></RangePicker>
                                            金额范围:
                                            <InputNumber defaultValue={0} onChange={(value)=>{ this.setState({ minMoney:value })}}></InputNumber>
                                            <InputNumber defaultValue={0} onChange={(value)=>{ this.setState({ maxMoney:value })}}></InputNumber>

                                        </div>
                                        <div className="row">
                                            订单状态:
                                            <Radio.Group defaultValue="5" buttonStyle="solid" onChange={(e)=>{ this.setState({handleState: parseInt(e.target.value) }) }}>
                                                <Radio.Button value="5">全部</Radio.Button>
                                                <Radio.Button value="0">新订单</Radio.Button>
                                                <Radio.Button value="1">未审核</Radio.Button>
                                                <Radio.Button value="2">已接单</Radio.Button>
                                                <Radio.Button value="3">已完成</Radio.Button>
                                                <Radio.Button value="4">暂无状态</Radio.Button>
                                            </Radio.Group>
                                            转单类型:
                                            <Select
                                                style={{width:150}}
                                                placeholder="请选择"
                                                onChange={ value => { this.setState({ type:value }); console.log(value); } }
                                                >
                                                <Option value="信用贷">信用贷</Option>
                                                <Option value="押房贷">押房贷</Option>
                                                <Option value="车乐贷">车乐贷</Option>
                                                <Option value="房乐贷">房乐贷</Option>
                                            </Select>
                                            <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
                                        </div>
                                        <Table pagination={{pageSize:5}} dataSource={this.state.temp_list?this.state.temp_list:this.state.list}  columns={this.columns}></Table>
                                    </div>
                                }
                             </TabPane>
                        ))}



                    </Tabs>

                </div>

            </div>
        )
    }
}
