import React from 'react';

import { Upload, Modal, Icon } from 'antd';
import OwnFetch from '../../api/OwnFetch';//封装请求


export default class UploadIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
            previewVisible: false,
            previewImage: '',
            fileList: []
        }
    }

    componentDidMount() {
        //有图片
        // console.info("dfsfsd",this.props.editData.imgurl)

        let imgurl = this.props.imgurl;
        if (imgurl) {
            let fileList = [];
            fileList.push({ uid: -1, status: 'done', url: imgurl });
            this.setState({ fileList });
        }
    }

    handlePreview = (file) => {
        // console.info(file)
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }


    handleChange = ({ file, fileList, event }) => {
        this.setState({ fileList })
    }


    handleCancel = () => this.setState({ previewVisible: false })





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


    getImgUrl = () => {
        let fileList = this.state.fileList;
        let imgurl = "";
        //处理图片
        if (fileList.length == 1) {
            if (fileList[0].percent == 100) {
                imgurl = fileList[0].response;
            } else {
                imgurl = fileList[0].url;
            }
        }
        return imgurl;
    }




    render() {

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        let { fileList, previewImage, previewVisible } = this.state;

        return (<div className="clearfix">
            <Upload
                action={OwnFetch.preurl + "/upload/image"}
                listType="picture-card"
                fileList={fileList}
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