/**
 * 上传单一图片
 * 
 */

import React from 'react'
import { Upload, Form, Modal, InputNumber, Input, Select, Icon, Row, Col } from 'antd';
import OwnFetch from '../../api/OwnFetch';//封装请求

export default class UploadImg extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showVideo: true,
            fileList: [],
            previewVisible: false
        }
    }


    componentWillMount() {
        //有图片
        // console.info("dfsfsd",this.props.editData.imgurl)
        if (this.props.imgurl) {
            let fileList = [];
            fileList.push({ uid: -1, status: 'done', url: this.props.imgurl });
            this.setState({ fileList });
            // console.info("fileList",fileList)
        }
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

    getUrl = () => {
        let url = this.props.imgurl;
        let fileList= this.state.fileList;
        //处理图片
        if (fileList.length == 1) {
            if (fileList[0].percent == 100) {
                url = fileList[0].response;
            }
        }
        return url;
    }



    render() {

        const { previewVisible, previewImage, fileList } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (<div className="clearfix">
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
        </div>)
    }


}
