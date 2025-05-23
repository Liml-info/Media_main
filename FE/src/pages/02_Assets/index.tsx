import { Button, Dropdown, Flex, MenuProps, Image , Space, Typography, Modal } from "antd";
import { DownOutlined,DownloadOutlined  } from "@ant-design/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { TryOnModelType, TryOnContext } from "@/contexts/TryOnContext";
import { useNavigate } from "react-router-dom";
import videoUrl from "@/assets/images/video.jpg";
import tryonUrl from "@/assets/images/tryon.jpg";
import pictureUrl from "@/assets/images/picture.jpg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchHistory } from "@/services/getHistory";


type MenuItem = Required<MenuProps>['items'][number];
export interface MediaItem {
  id: string;
  taskType: 'virtualTryOn' | 'imageGeneration' | 'image2Video' | 'text2Video';
  type: 'image' | 'video';
  src: string[];
  prompt: string;
}

const filterItem: MenuItem[] = [
  {
    key: "all",
    label: '全部',
  },
  {
    key: "picture",
    label: '画像',
  },
  {
    key: "video",
    label: 'ビデオ',
  }
];
const Assets: React.FC = () => {
  const [showFilter, setShowFilter] = useState<string>("all");
  const onClick: MenuProps['onClick'] = (e) => {
    setShowFilter(e.key);
  };
  
  useEffect(() => {
    fetchHistory();
  }, []);

  const state = useSelector((rootState: RootState) => rootState.history);



  const allHistoryItems: MediaItem[] = useMemo(()=>{
    return  [
      ...state.virtualTryOnHistory.map(item => ({
        id: item.id,
        taskType: 'virtualTryOn',
        type: 'image',
        src: Array.isArray(item.src)? item.src : [item.src],
        prompt: ""
      } as MediaItem)),
      ...state.imageGenerationHistory.map(item => ({
        id: item.id,
        taskType: 'imageGeneration',
        type: 'image',
        src: Array.isArray(item.src)? item.src : [item.src],
        prompt: item.prompt || ""
      } as MediaItem)),
      ...state.image2VideoHistory.map(item => ({
        id: item.id,
        taskType: 'image2Video',
        type: 'video',
        src: Array.isArray(item.src)? item.src : [item.src],
        prompt: item.prompt || ""
      } as MediaItem)),
      ...state.text2VideoHistory.map(item => ({
        id: item.id,
        taskType: 'text2Video',
        type: 'video',
        src: Array.isArray(item.src)? item.src : [item.src],
        prompt: item.prompt || ""
      } as MediaItem))
    ];
  },[state]);

  const filterTitle = useMemo(() => {
    return filterItem.find((item) => item?.key === showFilter)
  }, [showFilter]);
  return (
    <Flex vertical style={{ height: "100%",padding:"20px 20px" }}>
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", flexShrink:"0", alignItems: "center" }}>
        種類： <Dropdown menu={{ items: filterItem, onClick: onClick }} placement="bottomLeft" >
          <Space>
            {filterTitle && "label" in filterTitle ? filterTitle.label : ""}
           <DownOutlined />
          </Space>
        </Dropdown>
      </Flex>
      <Flex style={{gap:20 , flexWrap:"wrap"}}>
        {
          allHistoryItems.filter((item) => {
            if(showFilter === "all"){
              return true;
            }else if(showFilter === "picture" && item.type === "image"){
              return true;
            }else if(showFilter === "video" && item.type === "video"){
              return true;
            }else{
              return false;
            }
          })
          .map((item,index) => (
            <Imgvideo key={index} url={item.src[0]} text={item.prompt} type={item.type}></Imgvideo>
          ))
          
        }
      </Flex>
    </Flex>
  )
}
interface ImgClickProps {
  type:"image"|"video",
  url: string,
  text: string
}
const Imgvideo: React.FC<ImgClickProps> = ({type,url,text}) => (
    <Flex vertical style={{
        width: "225.7px",
        height: "225.7px",
        position:"relative",
        backgroundColor:"rgba(255, 255, 255, 0.08)"
    }}
    >
      {
        type === "image"? <Image src={url} style={{
          width: "225.7px",
          height: "225.7px",
          objectFit:"contain"}}/>:
        <VideoShow url={url}></VideoShow>
      }
        <Flex style={{
            position:"absolute",
            bottom:"0",
            left:"0",
            width:"100%",
            justifyContent:"flex-start",
            color:"white",
            padding:"10px 20px",
            backgroundColor:"rgba(0,0,0,0.5)",
            zIndex:"1"
            }}>
        <Flex style={{width:"100%", justifyContent:"space-between"}}>
          <span 
          style={{
            wordBreak:"keep-all",
            overflow:"hidden",
            textOverflow:"ellipsis",
            whiteSpace:"nowrap",
          }}
          >{text}</span>
          <DownloadOutlined style={{fontSize:"20px"}}  onClick={()=>{
            downloadImage(url,text.slice(0,10)??"バーチャル試着");
          }}></DownloadOutlined>
        </Flex>
        </Flex>
  </Flex>
)
const VideoShow = (props:{url:string}) => {
  const {url} = props;
  const [open, setOpen] = useState<boolean>(false);
  return <>
  <video src={url} onClick={() => setOpen(true)} style={{width:"100%",height:"100%",objectFit:"contain"}}></video>
  <Modal
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={"60%"}
      > 
      <video src={url} controls style={{width:"100%",height:"100%",objectFit:"contain"}}></video>
      </Modal>
  </>;
}
async function downloadImage(url:string, filename:string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'image.jpg';
    link.click();
    
    URL.revokeObjectURL(blobUrl); // 释放内存
  } catch (error) {
    console.error('下载失败:', error);
  }
}
export default Assets;