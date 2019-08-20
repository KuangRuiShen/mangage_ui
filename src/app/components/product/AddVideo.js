import React from 'react'
import { Form, Modal, InputNumber, Input, Select, Icon, Row, Col } from 'antd'

import OwnFetch from '../../api/OwnFetch';//封装请求
import BatchImg from './BatchImg';

const FormItem = Form.Item;

import MyEditor from './MyEditor';
import MyUpload from './Upload';
import UploadImg from './UploadImg'

@Form.create()
export default class Addvideo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            categorys: [],
            fileList: [],
            html: "",
            stars: [],
            levels: [],
            labers: [],
            videourl: undefined,
            types: [],
            loading: false,
            showVideo: true,
            showRound: false,
        }
    }



    componentWillMount() {
        //有图片
        // console.info("dfsfsd",this.props.editData.imgurl)
        if (this.props.editData.imgurl) {
            let fileList = [];
            fileList.push({ uid: -1, status: 'done', url: this.props.editData.imgurl });
            this.setState({ fileList });
            // console.info("fileList",fileList)
        }
        if (this.props.typeId == 5) {
            this.setState({ showVideo: false })
        }
        if (this.props.typeId == 2 || this.props.typeId == 3 || this.props.typeId == 4) {
            this.setState({ showRound: true })
        }


    }


    //获取富文本框内容
    getText = (html) => {
        this.setState({ html })
    }

    //获取上传的url
    geturl = (url) => {
        this.setState({ videourl: url });
    }



    //点击确定按钮
    handleCreate = () => {

        const { editData, closePage } = this.props;
        const { fileList, showRound } = this.state;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            //不修改图片
            if (editData.imgurl && fileList.length != 0) {
                values.imgurl = editData.imgurl;
            }

            let imgurl = this.refs.img_url.getUrl();
            values.imgurl = imgurl;

            if(showRound){
                let roundurl = this.refs.round_url.getUrl();
                values.roundurl = roundurl;
            }
            

            let imgs = this.refs.img_rf.getImgs();
            values.imgs = imgs;
            //给说明赋值
            values.remark = this.state.html;

            values.typeId = this.props.typeId;
            //修改
            this.setState({ loading: true }, () => {
                if (editData.id) {
                    values.id = editData.id;
                    OwnFetch("/product/update", values, "POST")
                        .then(res => {
                            if (res && res.code == '200') {
                                this.props.form.resetFields();
                                closePage(true);
                                //刷新数据    

                            }
                        }).catch(() => this.setState({ loading: false }))
                } else {  //新增 
                    OwnFetch("/product/insert", values, "POST")
                        .then(res => {
                            if (res && res.code == '200') {
                                this.props.form.resetFields();
                                closePage(true);
                            }
                        }).catch(() => this.setState({ loading: false }))
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

        const { showVideo,showRound  } = this.state;



        return (<Modal
            width={'60%'}
            maskClosable={false}
            visible={this.state.visible}
            title={editData.id ? '修改视频' : '新增视频'}
            onCancel={this.onClearFrom}
            onOk={this.handleCreate}
            confirmLoading={this.state.loading}
        >
            <Form >
                <Row>
                    <Col span={12} >
                        <FormItem label="上传轮播图" {...formItemLayout} >
                            <UploadImg imgurl={editData.roundurl} ref="round_url" />
                        </FormItem>
                    </Col>
                    <Col span={12} >
                        <FormItem label="上传视频主图" {...formItemLayout} >
                            <UploadImg imgurl={editData.imgurl} ref="img_url" />
                        </FormItem>
                    </Col>
                    <Col span={12} >
                        <FormItem label="视频名称" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('title', {
                                initialValue: editData.title,
                                rules: [{
                                    required: true, message: '视频名称不能为空!'
                                }]
                            }
                            )(
                                <Input placeholder="视频名称不能为空" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12} >
                        <FormItem label="序号" {...formItemLayout} >
                            {getFieldDecorator('serial', {
                                initialValue: editData.serial || 1,
                                rules: [{
                                    required: true, message: '序号不能为空!'
                                }]
                            }
                            )(
                                <InputNumber min={1} max={99999} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="省略图"   >
                    <BatchImg editData={editData} ref="img_rf" />
                </FormItem>

                {showVideo && <div>
                    <div style={{ padding: 20 }}>
                        <p style={{ textAlign: 'center' }}>视频说明:</p>
                        <MyEditor text={editData.remark} getText={this.getText} />
                    </div>
                    <div style={{ padding: 20, border: 'solid 1px #aeb2b5', borderRadius: '10px' }}>
                        <p style={{ textAlign: 'center' }}>上传视频:</p>
                        <MyUpload editData={editData} geturl={this.geturl} />
                    </div>
                </div>}

            </Form>

        </Modal>)
    }
}