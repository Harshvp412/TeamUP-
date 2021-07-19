import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useDispatch, useSelector } from "react-redux";
import { upload } from "../../redux/mentor/mentorActions";

const AvatarUploader = () => {
    const loading = useSelector((state) => state.mentor.updateInfoState.isUploading);

    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    function beforeUpload(file) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        setAvatar(file);
        return isJpgOrPng && isLt2M;
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload Avatar</div>
        </div>
    );
    return (
        <>
            <ImgCrop rotate>
                <Upload
                    name="avatar"
                    customRequest={() => dispatch(upload("avatar", avatar))}
                    listType="picture-card"
                    className="avatar-uploader"
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={beforeUpload}>
                    {/* {imageURL ? <img src={imageURL} alt="avatar" style={{ width: "100%" }} /> : uploadButton} */}
                    {uploadButton}
                </Upload>
            </ImgCrop>
        </>
    );
};

export default AvatarUploader;
