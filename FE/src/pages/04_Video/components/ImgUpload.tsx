import React, { useContext } from 'react';
import { DeleteOutlined, InboxOutlined, PlusSquareOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Avatar, Flex, message, Space, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { VideoContext } from '@/contexts/VideoContext';

const { Dragger } = Upload;

const ImgUpload: React.FC = () => {
  const { state, dispatch } = useContext(VideoContext);
  const [showFirstImg, setShowFirstImg] = React.useState<boolean>(true);
  const ShowHeader = () => {
    if (showFirstImg) {
      if (state.image) {
        return <ShowImages src={state.image} isFirst={true}></ShowImages>;
      }
    } else {
      if (state.image_tail) {
        return <ShowImages src={state.image_tail} isFirst={false}></ShowImages>
      }
    }
    return <DraggerComponent showfirst={showFirstImg}></DraggerComponent>;
  }
  const ShowFooter = () => {
    const swapClick = () => {
      const temp = state.image;
      dispatch({ type: "SET_IMAGE", payload: state.image_tail });
      dispatch({ type: "SET_IMAGE_TAIL", payload: temp });
    }
    return (
      <Flex style={{ justifyContent: "center", marginTop: "10px", gap: "10px" }}>
        {
          !!state.image ?
            <FooterBtnWithImg url={state.image} selected={showFirstImg} showfirstImg={true} setShowFirstImg={setShowFirstImg} ></FooterBtnWithImg>
            :
            <FooterBtnWithOutImg showfirstImg={true}  selected={showFirstImg}  setShowFirstImg={setShowFirstImg} ></FooterBtnWithOutImg>
        }
        <SwapOutlined style={{ fontSize: "25px" }} onClick={swapClick} />
        {
          !!state.image_tail ?
            <FooterBtnWithImg url={state.image_tail} selected={!showFirstImg} showfirstImg={false} setShowFirstImg={setShowFirstImg} ></FooterBtnWithImg>
            :
            <FooterBtnWithOutImg showfirstImg={false} selected={!showFirstImg} setShowFirstImg={setShowFirstImg} ></FooterBtnWithOutImg>
        }
      </Flex>
    )
  }
  return (
    <Flex vertical style={{ border: "1px solid #434343", borderRadius: "8px", padding: "8px" }}>
      <Flex vertical style={{ flexGrow: 1, position: "relative", height: "180px", overflow: "hidden" }}>
        <ShowHeader></ShowHeader>
      </Flex>
      {
        !!state.image || !!state.image_tail ?

          <ShowFooter></ShowFooter>
          : undefined
      }
    </Flex>
  );
};

const FooterBtnWithImg = (props: {
  url: string,
  showfirstImg: boolean,
  setShowFirstImg: React.Dispatch<React.SetStateAction<boolean>>,
  selected?: boolean, // 選択状態を表すプロパティを追加することで、選択状態を表現できるようにします。
}) => {
  const click = () => {
    props.setShowFirstImg(props.showfirstImg);
  }
  return (
    <Space size={"small"} onClick={click} style={{ border: props.selected?"1px solid white":"1px solid #434343",width:"140px", borderRadius: "8px", padding: "2px" }}>
      <Avatar shape="square" size={32} src={<img src={props.url} alt="avatar" />} />
      <div></div>
      {props.showfirstImg ? "開始フレーム" : "終了フレーム"}
    </Space>
  )
}

const FooterBtnWithOutImg = (props: {
  showfirstImg: boolean,
  setShowFirstImg: React.Dispatch<React.SetStateAction<boolean>>,
  selected?: boolean, // 選択状態を表すプロパティを追加することで、選択状態を表現できるようにします。
}) => {
  const click = () => {
    props.setShowFirstImg(props.showfirstImg);
  }
  const title = props.showfirstImg ? "開始フレーム" : "終了フレーム";
  return (
    <Tooltip title={title}>
      <Space size={"small"} onClick={click} style={{ border: props.selected?"1px solid white":"1px solid #434343", width:"140px", borderRadius: "8px", padding: "2px" }}>
        <Avatar shape="square" icon={<PlusSquareOutlined />} />
        {title}
      </Space>
    </Tooltip>
  )
}

const DraggerProps: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.jpg,.jpeg,.png',
  maxCount: 1,
  showUploadList: false,
};
const ShowImages = (props: { src: string, isFirst: boolean }) => {
  const { dispatch } = useContext(VideoContext);

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




const DraggerComponent = (props: { showfirst: boolean }) => {
  const { dispatch } = useContext(VideoContext);
  const beforeUpload = (file: RcFile) => {
    const checkResult = uploadFileCheck(file);
    if (!checkResult) {
      return false;
    }
    fileToBase64(file).then((base64) => {
      if (props.showfirst) {
        dispatch({ type: "SET_IMAGE", payload: base64 as string });
      } else {
        dispatch({ type: "SET_IMAGE_TAIL", payload: base64 as string });
      }
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