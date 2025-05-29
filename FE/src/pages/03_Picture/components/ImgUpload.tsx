import { PictureAction, PictureContext } from '@/contexts/PictureContext';
import { DeleteOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import * as faceapi from '@vladmandic/face-api';
import type { UploadProps } from 'antd';
import {Button, Divider, Flex, message, Slider, Space, Spin, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useContext } from 'react';
import { FaceImgAction, FaceImgContext, FaceImgProvider } from '../contexts/FaceImgContext';

const { Dragger } = Upload;
const RefrenceImage: React.FC = () => {
  return (
    <FaceImgProvider>
      <ImgUpload></ImgUpload>
    </FaceImgProvider>
  )
}

const ImgUpload: React.FC = () => {
  const { state, dispatch } = useContext(PictureContext);
  const getClickHandl = (type?: "subject" | "face") => {
    switch (type) {
      case "subject":
      case "face":
        return () => {
          if (state.model_name !== "kling-v1-5") {
            message.info("モードをV1.5に変更しました。");
            dispatch({ type: "SET_MODEL", payload: "kling-v1-5" });
          }
          dispatch({ type: "SET_IMAGE_REFERENCE", payload: type });
        }
      default:
        return () => {
          if (state.model_name !== "kling-v1") {
            message.info("モードをV1.0に変更しました。");
            dispatch({ type: "SET_MODEL", payload: "kling-v1" });
          }
          dispatch({ type: "SET_IMAGE_REFERENCE", payload: "bgReference" });
        }
    }
  }

  return (
    <Flex vertical style={{ border: "1px solid #434343", borderRadius: "8px", gap: "10px", padding: "8px" }}>
      <Flex>
        <Space>
          <Button type={state.image_reference.value === "subject" ? "primary" : "default"} onClick={getClickHandl("subject")}>キャラ特性</Button>
          <Button type={state.image_reference.value === "face" ? "primary" : "default"} onClick={getClickHandl("face")}>容貌</Button>
          <Button type={state.image_reference.value === "bgReference" ? "primary" : "default"} onClick={getClickHandl()}>汎用レファレンス画像</Button>
        </Space>
      </Flex>
      <Flex vertical style={{ flexGrow: 1, position: "relative", height: "180px", overflow: "hidden" }}>
        {
          state.image.value === "" ?
            <DraggerComponent></DraggerComponent>
            :
            <ShowImages src={state.image.value}></ShowImages>
        }
      </Flex>
      {
        state.image_reference.value === "face" ?
          <FaceIcon></FaceIcon>
          :
          <></>
      }
      <Divider style={{ margin: 0 }} />
      <Flex>
        {
          state.image_reference.value === "subject" ?
            <CharacterFooter />
            :
            state.image_reference.value === "face" ?
              <FaceFooter />
              :
              <BgRefFooter />
        }
      </Flex>
    </Flex>
  );
};





const FaceMask = () => {
  const { stateFaceImg } = useContext(FaceImgContext);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>
      {
        stateFaceImg.FaceImgList.length === 0?
          <Flex
          style={{
            position:"absolute",
            zIndex:2,
            height:"100%",
            width:"100%",
            justifyContent:"center",
            alignItems:"center",
          }}
          >
          顔を認識できないので、他の画像をアップロードしてください。
          </Flex>
          :
        stateFaceImg.FaceImgList.map((item, index) => {
          const border = stateFaceImg.selectedIndex === index ? "4px solid green" : "4px solid white";
          const focuseBorder = stateFaceImg.focuseIndex === index ? "1px solid white" : "none";
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: item.y * stateFaceImg.zoom,
                left: item.x * stateFaceImg.zoom,
                width: item.width * stateFaceImg.zoom,
                height: item.height * stateFaceImg.zoom,
                zIndex: 2,
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                borderRadius: "10px",
                border: focuseBorder,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  width: "10px",
                  height: "10px",
                  zIndex: 3,
                  borderTopLeftRadius: "10px",
                  borderTop: border,
                  borderLeft: border
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "10px",
                  height: "10px",
                  zIndex: 3,
                  borderTopRightRadius: "10px",
                  borderTop: border,
                  borderRight: border
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "-2px",
                  width: "10px",
                  height: "10px",
                  zIndex: 3,
                  borderBottomLeftRadius: "10px",
                  borderBottom: border,
                  borderLeft: border
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "-2px",
                  width: "10px",
                  height: "10px",
                  zIndex: 3,
                  borderBottomRightRadius: "10px",
                  borderBottom: border,
                  borderRight: border
                }}
              ></div>
            </div>
          )
        })
      }

    </>
  )
}
const FaceIcon = () => {

  const { stateFaceImg, dispatchFaceImg } = useContext(FaceImgContext);
  const { dispatch } = useContext(PictureContext);
  const selectedStyle = {
    border: "2px solid green",
    borderRadius: "10px",
  }
  return (
    <>
      <Flex style={{
        gap: "10px",
        justifyContent: "center",
        overflowX: "scroll",
        scrollbarWidth: 'none'
      }}>
        {
          stateFaceImg.FaceImgList.map((item, index) => (
            <img key={index} src={item.image} alt="avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "cover",
                ...(stateFaceImg.selectedIndex === index ? selectedStyle : {})
              }}
              onMouseEnter={(e) => {
                if (stateFaceImg.selectedIndex !== index) {
                  e.currentTarget.style.border = "2px solid white";

                }
                dispatchFaceImg({ type: "SER_FocuseIndex", payload: index });
              }}
              onMouseLeave={(e) => {

                if (stateFaceImg.selectedIndex !== index) {
                  e.currentTarget.style.border = "none";

                }
                dispatchFaceImg({ type: "SER_FocuseIndex", payload: -1 });
              }}
              onClick={() => {
                dispatchFaceImg({ type: "SER_SelectedIndex", payload: index });
                dispatch({ type: "SET_FACE_IMAGE", payload: item.image });
              }}
            />
          ))
        }
      </Flex>
    </>
  )
}
const CharacterFooter: React.FC = () => {
  const { state, dispatch } = useContext(PictureContext);
  return (
    <Flex vertical style={{ width: "100%" }}>
      <Flex style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px",
        backgroundColor: "#ffffff1f",
        padding: "0 16px",
        marginBottom: "16px"
      }}>
        <span>顔のリファレンス</span>
        <Space>
          <Slider min={0} max={100} style={{ width: "200px" }}
            value={state.subject.human_fidelity}
            onChange={(value) => {
              dispatch({ type: "SET_SUBJECT_HUMAN_FIDELITY", payload: value });
            }}
          />
          <span>{state.subject.human_fidelity}</span>
        </Space>
      </Flex>
      <Flex style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px",
        backgroundColor: "#ffffff1f",
        padding: "0 16px",
      }}>
        <span>被写体参考</span>
        <Space>
          <Slider min={0} max={100} style={{ width: "200px" }}
            value={state.subject.image_fidelity}
            onChange={(value) => {
              dispatch({ type: "SET_SUBJECT_IMAGE_FIDELITY", payload: value });
            }}
          />
          <span>{state.subject.image_fidelity}</span>
        </Space>
      </Flex>
    </Flex>
  )
}
const FaceFooter: React.FC = () => {
  const { state, dispatch } = useContext(PictureContext);
  return (
    <Flex vertical style={{ width: "100%" }}>

      <Flex style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px",
        backgroundColor: "#ffffff1f",
        padding: "0 16px",
        marginBottom: "16px"
      }}>
        <span>参考強度</span>
        <Space>
          <Slider min={0} max={100} style={{ width: "200px" }}
            value={state.face.image_fidelity}
            onChange={(value) => {
              dispatch({ type: "SET_FACE_IMAGE_FIDELITY", payload: value });
            }}
          />
          <span>{state.face.image_fidelity}</span>
        </Space>
      </Flex>
    </Flex>
  )
}

const BgRefFooter: React.FC = () => {
  const { state, dispatch } = useContext(PictureContext);
  return (
    <Flex vertical style={{ width: "100%" }}>
      <Flex style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px",
        backgroundColor: "#ffffff1f",
        padding: "0 16px",
        marginBottom: "16px"
      }}>
        <span>参考強度</span>
        <Space>
          <Slider min={0} max={100} style={{ width: "200px" }}
            value={state.bgReference.image_fidelity}
            onChange={(value) => {
              dispatch({ type: "SET_BGREF_IMAGE_FIDELITY", payload: value });
            }}
          />
          <span>{state.bgReference.image_fidelity}</span>
        </Space>
      </Flex>
    </Flex>
  )
}

const getFaceImgAsync = async (dispatch: React.Dispatch<FaceImgAction>, dispatchPicture:React.Dispatch<PictureAction> , base64Img: string) => {
  dispatch({ type: "SET_loading", payload: true });
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  // const imghtml = document.getElementById("img");
  const imghtml = new Image();
  imghtml.src = base64Img;
  await new Promise((resolve) => (imghtml.onload = resolve));
  if (imghtml instanceof HTMLImageElement) {
    const detections = await faceapi
      .detectAllFaces(imghtml, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks();
    dispatch({ type: "DEL_FACEIMGLIST" });
    detections.forEach((detection,index) => {

      const box = detection.detection.box;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = box.width;
      canvas.height = box.height;

      if (ctx !== null) {
        ctx.drawImage(imghtml, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
      }
      const faceImageData = canvas.toDataURL('image/jpeg');
      dispatch({ type: "ADD_FACE_IMAGE", payload: { x: box.x, y: box.y, width: box.width, height: box.height, image: faceImageData } });
      if(index === 0){
        dispatchPicture({ type: "SET_FACE_IMAGE", payload: faceImageData });
      }
    }
    );
  }
  dispatch({ type: "SER_SelectedIndex", payload: 0 });
  dispatch({ type: "SET_loading", payload: false });
}


const DraggerProps: UploadProps = {
  name: 'file',
  multiple: false,
  accept: '.jpg,.jpeg,.png',
  maxCount: 1,
  showUploadList: false,
};
const ShowImages = (props: { src: string }) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const { state, dispatch } = useContext(PictureContext);
  const { stateFaceImg, dispatchFaceImg } = useContext(FaceImgContext);

  const delImg = () => {
    dispatch({ type: "SET_IMAGE", payload: "" });
    dispatchFaceImg({ type: "Init" });
  }

  const beforeUpload = (file: RcFile) => {
    const checkResult = uploadFileCheck(file);
    if (!checkResult) {
      return false;
    }
    
    dispatchFaceImg({ type: "Init" });
    fileToBase64(file).then((base64) => {
      getFaceImgAsync(dispatchFaceImg,dispatch, base64 as string);
      dispatch({ type: "SET_IMAGE", payload: base64 as string });
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
          zIndex: 99,
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
      {
        stateFaceImg.loading ?

          <Spin tip="Loading" size="large">
            {loadingContent}
          </Spin>
          :
          <>

            <img alt='background' src={props.src} style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(32px)",
              position: "absolute",
              objectPosition: "center",
            }} />
            <Flex vertical style={{
              alignItems: "center",
              position: "relative",
              width: `${imgRef.current?.clientWidth}px`,
              height: `${imgRef.current?.clientHeight}px`
            }}>
              <img id="img" ref={imgRef} alt='fronted' src={props.src} style={{
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                position: "absolute",
              }}
              onLoad={() => {
                if (imgRef.current) {
                  dispatchFaceImg({ type: "SER_Zoom", payload: imgRef.current.clientHeight / imgRef.current.naturalHeight });
                }
              }}
              />
              {
                state.image_reference.value === "face" ?
                  <FaceMask></FaceMask>
                  :
                  <></>
              }
            </Flex>
          </>
      }
    </Flex>
  )
}
const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const loadingContent = <div style={contentStyle} />;


const DraggerComponent = () => {
  const { dispatch } = useContext(PictureContext);
  const { dispatchFaceImg } = useContext(FaceImgContext);
  const beforeUpload = (file: RcFile) => {
    const checkResult = uploadFileCheck(file);
    if (!checkResult) {
      return false;
    }
    fileToBase64(file).then((base64) => {
      getFaceImgAsync(dispatchFaceImg,dispatch, base64 as string)
      dispatch({ type: "SET_IMAGE", payload: base64 as string });
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
export default RefrenceImage;