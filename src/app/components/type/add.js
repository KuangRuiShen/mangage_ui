import React from 'react'
import { Form, Modal, InputNumber, Input } from 'antd'

import OwnFetch from '../../api/OwnFetch';//封装请求
import Upload from './upload';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class Add extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {


    }


    //点击确定按钮
    handleCreate = () => {

        const { editData, closePage } = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            values.imgurl = this.refs.main.getImgUrl();
            values.logo = this.refs.logo.getImgUrl();
            values.cover = this.refs.cover.getImgUrl();

            //修改
            if (editData.id) {
                values.id = editData.id;
                OwnFetch("/type/update", values, "POST")
                    .then(res => {
                        if (res && res.code == '200') {
                            closePage(true);
                        }
                    })
            } else {  //新增 
                OwnFetch("/type/insert", values, "POST")
                    .then(res => {
                        if (res && res.code == '200') {
                            closePage(true);
                        }
                    })
            }
        });


    }


    onClearFrom = () => {
        this.props.form.resetFields();//清楚表单数据
        this.props.closePage();
    }





    render() {
        const { getFieldDecorator } = this.props.form;


        const { editData } = this.props;

        let formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };



        return (<Modal
            width={600}
            maskClosable={false}
            visible
            title={editData.id ? '编辑' : '新增'}
            onCancel={this.onClearFrom}
            onOk={this.handleCreate}
        >
            <Form >
                <FormItem label="名称" {...formItemLayout} hasFeedback>
                    {getFieldDecorator('name', {
                        initialValue: editData.name,
                        rules: [{
                            required: true, message: '名称不能为空!'
                        }, {
                            WhiteSpace: true, message: '不能存空!'
                        }]
                    }
                    )(
                        <Input placeholder="名称不能为空" />
                    )}
                </FormItem>

                <FormItem label="序号" {...formItemLayout} >
                    {getFieldDecorator('px', {
                        initialValue: editData.px || 1,
                        rules: [{
                            required: true, message: '序号不能为空!'
                        }]
                    }
                    )(
                        <InputNumber min={1} max={99999} />
                    )}
                </FormItem>


                <FormItem label="说明" {...formItemLayout} >
                    {getFieldDecorator('remark', {
                        initialValue: editData.remark
                    })(
                        <TextArea rows={4} placeholder="描述" />
                    )}
                </FormItem>

                <FormItem label="logo" {...formItemLayout} >
                    <Upload imgurl={editData.logo} ref="logo" />
                </FormItem>

                <FormItem label="主图" {...formItemLayout} >
                    <Upload imgurl={editData.imgurl} ref="main" />
                </FormItem>

                {editData.id == '1' && <FormItem label="主观图" {...formItemLayout} >
                    <Upload imgurl={editData.cover} ref="cover" />
                </FormItem>}

            </Form>

        </Modal>)
    }
}