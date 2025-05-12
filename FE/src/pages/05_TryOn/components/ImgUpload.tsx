import React, { useContext } from 'react';
import { DeleteOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Avatar, Flex, message, Space, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { VideoContext } from '@/contexts/VideoContext';
import { createStyles } from 'antd-style';
import { TryOnContext } from '@/contexts/TryOnContext';

const { Dragger } = Upload;
const useStyles = createStyles(({ token }) => ({
  dynamicBtn: {
    backgroundColor: token.colorPrimary,
    '&:hover': { opacity: 0.8 }
  },
}));

const ImgUpload: React.FC = () => {
  const { state, dispatch } = useContext(TryOnContext);
  const ShowHeader = () => {
    if (state.human_image) {
      return <ShowImages src={state.human_image} isFirst={true}></ShowImages>;
    }
    return <DraggerComponent></DraggerComponent>;
  }
  return (
    <Flex vertical style={{ border: "1px solid #434343", borderRadius: "8px", padding: "8px" }}>
      <Flex vertical style={{ flexGrow: 1, position: "relative", height: "180px", overflow: "hidden" }}>
        <ShowHeader></ShowHeader>
      </Flex>
    </Flex>
  );
};


const DraggerProps: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.jpg,.jpeg,.png',
  maxCount: 1,
  showUploadList: false,
};
const ShowImages = (props: { src: string, isFirst: boolean }) => {
  const { state, dispatch } = useContext(VideoContext);

  const delImg = () => {
    if (props.isFirst) {
      dispatch({ type: "SET_IMAGE", payload: "" });
    } else {
      dispatch({ type: "SET_IMAGE_TAIL", payload: "" });
    }
  }

  const beforeUpload = (file: RcFile) => {
    const checkResult = uploadFileCheck(file);
    if (!checkResult) {
      return false;
    }
    fileToBase64(file).then((base64) => {
      if (props.isFirst) {
        dispatch({ type: "SET_IMAGE", payload: base64 as string });
      } else {
        dispatch({ type: "SET_IMAGE_TAIL", payload: base64 as string });
      }
    });
    return false;
  }
  return (
    <Flex
      onMouseEnter={() => {
        const mark = document.getElementById("mark") as HTMLDivElement;
        mark.style.display = "flex";
      }}
      onMouseLeave={() => {
        const mark = document.getElementById("mark") as HTMLDivElement;
        mark.style.display = "none";
      }}
      style={{ justifyContent: "center", borderRadius: "8px", position: "relative", height: "100%" }}>
      <Flex id="mark" style={
        {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          color: "#fff",
          display: "none",
        }}>
        <Upload {...DraggerProps} beforeUpload={beforeUpload} >
          <Tooltip title={"変更"}>
            <UploadOutlined style={{ fontSize: "30px" }} />
          </Tooltip>
        </Upload>
        <Tooltip title={"削除"}>
          <DeleteOutlined style={{ fontSize: "30px" }} onClick={delImg} />
        </Tooltip>
      </Flex>
      <img src={props.src} style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "blur(32px)",
        position: "absolute",
        objectPosition: "center",
      }} />
      <img src={props.src} style={{
        width: "100%",
        height: "100%",
        objectPosition: "center",
        objectFit: "contain",
        position: "absolute"
      }} />
    </Flex>
  )
}




const DraggerComponent = () => {
  const { dispatch } = useContext(TryOnContext);
  const beforeUpload = (file: RcFile) => {
    const checkResult = uploadFileCheck(file);
    if (!checkResult) {
      return false;
    }
    fileToBase64(file).then((base64) => {
      dispatch({ type: "SET_HUMAN_IMAGE", payload: base64 as string });
    });
    return false;
  }
  return (
    <Dragger {...DraggerProps} beforeUpload={beforeUpload}>
      <Flex vertical style={{ height: 145 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">クリックまたはファイルをここにドラッグ</p>
        <p className="ant-upload-hint">
          JPEG/PNG/JPG形式、10MB以下のファイルをアップロードできます
        </p>
      </Flex>
    </Dragger>
  );
}

function uploadFileCheck(file: RcFile) {
  const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isValidType) {
    message.error('JPG/JPEG/PNG形式のファイルのみアップロード可能です');
    return false;
  }
  if (!isLt10M) {
    message.error('ファイルサイズは10MB以下にしてください');
    return false;
  }
  return true;
}

function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export default ImgUpload;