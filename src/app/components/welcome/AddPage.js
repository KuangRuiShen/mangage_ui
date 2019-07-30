import React from 'react'
import { Form, Modal, InputNumber, Select } from 'antd'

import OwnFetch from '../../api/OwnFetch';//封装请求

const FormItem = Form.Item;

@Form.create()
export default class AddPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        OwnFetch("/welcome/products").then(res => {
            if (res && res.code == 200) {
                this.setState({ products: res.data })
            }
        })
    }





    //点击确定按钮
    handleCreate = () => {

        const { closePage } = this.props;


        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            OwnFetch("/welcome/insert", values, "post").then(res => {
                if (res && res.code == '200') {
                    closePage(true);
                }
            })
        })


    }


    onClearFrom = () => {
        this.props.form.resetFields();//清楚表单数据
        this.props.closePage();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const Option = Select.Option;

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
            title={"添加产品"}
            onCancel={this.onClearFrom}
            onOk={this.handleCreate}
        >
            <Form >
                <FormItem label="产品" {...formItemLayout} hasFeedback>
                    {getFieldDecorator('productId', {
                        // initialValue: editData.productId,
                        rules: [{
                            required: true, message: '产品不能为空!'
                        }]
                    }
                    )(
                        <Select >
                            {this.state.products.map((item) => {
                                return <Option key={item.id} value={item.id}>{item.title}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>

                <FormItem label="序号" {...formItemLayout} >
                    {getFieldDecorator('order', {
                        initialValue: 1,
                        rules: [{
                            required: true, message: '序号不能为空!'
                        }]
                    }
                    )(
                        <InputNumber min={1} max={99999} />
                    )}
                </FormItem>

            </Form>

        </Modal>)
    }
}