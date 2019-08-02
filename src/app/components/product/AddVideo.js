import React from 'react'
import { Upload, Form, Modal, InputNumber, Input, Select, Icon, Row, Col } from 'antd'

import OwnFetch from '../../api/OwnFetch';//封装请求
import BatchImg from './BatchImg';

const FormItem = Form.Item;
const Option = Select.Option;

import MyEditor from './MyEditor';
import MyUpload from './Upload';

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
        // this.typeQuery();
    }

    // typeQuery = () => {
    //     OwnFetch("/type/query").then(res => {
    //         if (res && res.code == 200) {
    //             this.setState({ types: res.data })
    //         }
    //     })
    // }

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
        const { fileList } = this.state;

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            //不修改图片
            if (editData.imgurl && fileList.length != 0) {
                values.imgurl = editData.imgurl;
            }

            //处理图片
            if (fileList.length == 1) {
                if (fileList[0].percent == 100) {
                    values.imgurl = fileList[0].response;
                }
            }

            //处理视频上传
            if (this.state.videourl) {
                values.videourl = this.state.videourl;
            } else {
                values.videourl = editData.videourl;
            }

            let imgs = this.refs.img_rf.getImgs();
            values.imgs = imgs;
            //给说明赋值
            values.remark = this.state.html;

            //修改
            if (editData.id) {
                values.id = editData.id;
                OwnFetch("/product/update", values, "POST")
                    .then(res => {
                        if (res && res.code == '200') {
                            this.props.form.resetFields();
                            closePage(true);
                            //刷新数据    

                        }
                    })
            } else {  //新增 
                OwnFetch("/product/insert", values, "POST")
                    .then(res => {
                        if (res && res.code == '200') {
                            this.props.form.resetFields();
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


    //显示图片
    handlePreview = (file) => {
        // console.info(file)
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleCancel = () => this.setState({ previewVisible: false })


    handleChange = ({ file, fileList, event }) => {
        this.setState({ fileList })
    }

    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isGIF && !isPNG) {
            Modal.error({
                content: '必须是JPG/PNG/GIF格式文件',
            });
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isLt2M) {
            Modal.error({
                content: '图片大小不能超过 10M!',
            });
            return false;
        }
        // this.setState({imageName:file.name,imageFile:file})
        return (isJPG || isGIF || isPNG) && isLt2M;
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

        const { previewVisible, previewImage, fileList } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (<Modal
            width={'60%'}
            maskClosable={false}
            visible={this.state.visible}
            title={editData.id ? '修改视频' : '新增视频'}
            onCancel={this.onClearFrom}
            onOk={this.handleCreate}
        >
            <Form >
                <Row>
                    <Col span={6} ></Col>
                    <Col span={18} >
                        <FormItem label="上传视频主图" {...formItemLayout} >
                            <div className="clearfix">
                                <Upload
                                    action={OwnFetch.preurl + "/upload/image"}
                                    listType="picture-card"
                                    fileList={fileList}
                                    // data={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    beforeUpload={this.beforeUpload}
                                >
                                    {fileList.length == 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>


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
                    {/* <Col span={12} >
                        <FormItem label="分类" {...formItemLayout} hasFeedback >
                            {getFieldDecorator('typeId', {
                                initialValue: editData.typeId,
                                rules: [{
                                    required: true, message: '页面不能为空!'
                                }]
                            }
                            )(
                                <Select >
                                    {this.state.types.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col> */}

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


                <div style={{ padding: 20 }}>
                    <p style={{ textAlign: 'center' }}>视频说明:</p>
                    <MyEditor text={editData.remark} getText={this.getText} />
                </div>
                <div style={{ padding: 20, border: 'solid 1px #aeb2b5', borderRadius: '10px' }}>
                    <p style={{ textAlign: 'center' }}>上传视频:</p>
                    <MyUpload editData={editData} geturl={this.geturl} />
                </div>

            </Form>

        </Modal>)
    }
}