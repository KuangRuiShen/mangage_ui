import React from 'react';
import { Input, Table, Row, Col, Icon, Modal, Button, Switch, Tooltip, Form, message } from 'antd';
import OwnFetch from '../../api/OwnFetch';//封装请求
import { Pagination } from '../../../utils/util'; //页面

import AddStar from './add';


export default class Type extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            dataSource: [],
            loading: false,
            editData: {},
            imgurl: "",
            showAddStar: false,
            //当前选中记录
            selects: [],
        }
    }



    nameInputChange = (e) => {

        this.setState({
            name: e.target.value
        });
    }




    componentWillMount() {
        this.initLoadData();
    }

    //默认加载数据
    initLoadData = () => {
        this.setState({ loading: true })
        OwnFetch('/type/query', { name: this.state.name }).then(res => {
            if (res && res.code == 200) {
                this.setState({ dataSource: res.data, selects: [] })
            }
            this.setState({ loading: false })
        })
    }

    //查询
    onSearch = () => {
        this.initLoadData();
    }


    //表格内修改按钮-修改角色按钮
    editOnClick = (record) => {
        this.setState({
            showAddStar: true,
            editData: record,
        })
    }

    //单一删除
    delete = (record) => {
        let ids = [];
        ids.push(record.id)
        // const deleteUsers = this.deleteUsers;
        Modal.confirm({
            title: "删除提示",
            content: "确定删除所选该类别?",
            okText: "删除",
            onOk: () => {
                this.deleteAll(ids)
            }
        })
    }


    //批量删除
    handleDelete = () => {
        if (this.state.selects.length) {
            Modal.confirm({
                title: "确定删除",
                content: "确定删除所选" + this.state.selects.length + "条的数据? 删除后不可恢复!",
                okText: "确认删除",
                cancelText: '取消',
                onOk: () => {
                    this.deleteAll(this.state.selects)
                }
            })
        } else {
            message.warning("请选择删除记录");
        }

    }

    deleteAll = (ids) => {
        OwnFetch('/type/delete', ids, "POST").then(res => {
            if (res && res.code == 200) {
                Modal.success({ title: "删除成功" })
                this.onSearch();
            }
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.info("selectedRowKeys",selectedRowKeys,selectedRows)
        this.setState({ selects: selectedRowKeys });
    }


    //关闭页面
    closePage = (flag) => {
        this.setState({
            showAddStar: false,
        })
        if (flag) {
            this.onSearch();
        }
    }


    imgOnClick = (url) => {
        if (url) {
            this.setState({ showImg: true, imgurl: url })
        }
    }

    render() {

        const columns = [{
            title: '序号',
            dataIndex: 'px'
        }, {
            title: '名称',
            dataIndex: 'name',
        }, {
            title: '主图',
            dataIndex: 'imgurl',
            render: (text, record, index) => <div style={{ height: '50px', cursor: text ? 'pointer' : '' }} onClick={() => this.imgOnClick(record.imgurl)}>
                <img style={{ height: '50px' }} src={record.imgurl} />
            </div>
        }, {
            title: '操作',
            key: 'operate',
            render: (text, record, index) => (
                <div>
                    <Tooltip title="修改">
                        <Icon type="edit" style={{ fontSize: 16, cursor: 'pointer', color: '#03aaf4', marginRight: '10px' }}
                            onClick={() => this.editOnClick(record)} />
                    </Tooltip>
                    {/* <Tooltip title="删除">
                            <Icon type="delete" style={{ fontSize: 16, cursor: 'pointer', color: '#03aaf4' }} onClick={() => this.delete(record)} />
                        </Tooltip> */}
                </div>
            ),
        }];

        const FormItem = Form.Item;


        return (<div className="new_div_context">

            <Form layout="inline" style={{ padding: '20px 0px 0px 20px' }} >
                <FormItem label="名称：">
                    <Input
                        style={{ width: '200px' }}
                        onChange={this.nameInputChange} value={this.state.name} />
                </FormItem>

                <FormItem >
                    <Button type="primary" icon="search" onClick={this.onSearch}>查询</Button>
                </FormItem>
                
            </Form>

            <div className="div_space_table" >
                <Table
                    size="small"
                    rowKey="id"
                    rowSelection={{
                        selectedRowKeys: this.state.selects,
                        onChange: this.onSelectChange
                    }}
                    dataSource={this.state.dataSource}
                    columns={columns}
                    loading={this.state.loading}
                    pagination={Pagination}
                />
            </div>

            {this.state.showAddStar && <AddStar editData={this.state.editData} closePage={this.closePage} />}

            <Modal visible={this.state.showImg} footer={null} onCancel={() => this.setState({ showImg: false })}>
                <img style={{ width: '100%' }} src={this.state.imgurl} />
            </Modal>
        </div>)
    }

}
