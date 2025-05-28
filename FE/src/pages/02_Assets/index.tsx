import { Button, Dropdown, Flex, MenuProps, Image , Space, Typography, Modal, Spin } from "antd";
import { DownOutlined,DownloadOutlined  } from "@ant-design/icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import videoUrl from "@/assets/images/video.jpg";
import tryonUrl from "@/assets/images/tryon.jpg";
import pictureUrl from "@/assets/images/picture.jpg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchHistory } from "@/services/getHistory";
import { VirtualTryOnHistoryItem } from "@/store/slices/VirtualTryOnSlice";
import Item from "antd/es/list/Item";
import { ImageGenerationHistoryItem } from "@/store/slices/ImageGenerationSlice";
import { ImageToVideoHistoryItem } from "@/store/slices/ImageToVideoSlice";
import { TextToVideoHistoryItem } from "@/store/slices/TextToVideoSlice";
import { MultiImageToVideoHistoryItem } from "@/store/slices/MultiImageToVideoSlice";


const VirtualTryOnHistoryItemToMediaItem = (list: VirtualTryOnHistoryItem[]) => {
  const returnList: MediaItem[] = [];
  list.forEach(item => {
    if((item.task_status ==='succeed' || item.task_status ==='submitted' || item.task_status ==='processing')){
      if(item.src.length === 0){
        returnList.push({
          id: item.id,
          taskType: 'virtualTryOn',
          type: "image_processing",
          src: "",
          prompt: "",
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      }else{
        
      item.src.forEach(img => {
        returnList.push({
          id: item.id,
          taskType: 'virtualTryOn',
          type: item.task_status === "succeed"?'image':'image_processing',
          src: img.url,
          prompt: "",
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      });
      }
    }
  });
  return returnList;
}

const ImageGenerationHistoryItemToMediaItem = (list: ImageGenerationHistoryItem[]) => {
  const returnList: MediaItem[] = [];
  list.forEach(item => {
    if((item.task_status ==='succeed' || item.task_status ==='submitted' || item.task_status ==='processing')){
      if(item.src.length === 0){
        returnList.push({
          id: item.id,
          taskType: 'imageGeneration',
          type: "image_processing",
          src: "",
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      }else{
        item.src.forEach(img => {
          returnList.push({
            id: item.id,
            taskType: 'imageGeneration',
            type: item.task_status === "succeed"?'image':'image_processing',
            src: img.url,
            prompt: item.prompt,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
          } as MediaItem);
        });
        
      }
    }
  });
  
  return returnList;
}
const ImageToVideoHistoryItemToMediaItem = (list: ImageToVideoHistoryItem[]) => {
  const returnList: MediaItem[] = [];
  list.forEach(item => {
    if((item.task_status ==='succeed' || item.task_status ==='submitted' || item.task_status ==='processing')){
      if(item.src.length === 0){
        returnList.push({
          id: item.id,
          taskType: 'image2Video',
          type: "video_processing",
          src: "",
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      }else{
        
      item.src.forEach(video => {
        returnList.push({
          id: item.id,
          taskType: 'image2Video',
          type: item.task_status === "succeed"?'video':'video_processing',
          src: video.url,
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      });
      }
    }
  });
  return returnList;
}
const TextToVideoHistoryItemToMediaItem = (list: TextToVideoHistoryItem[]) => {
  const returnList: MediaItem[] = [];
  list.forEach(item => {
    if((item.task_status ==='succeed' || item.task_status ==='submitted' || item.task_status ==='processing')){
      if(item.src.length > 0){
      item.src.forEach(video => {
        returnList.push({
          id: item.id,
          taskType: 'text2Video',
          type: item.task_status === "succeed"?'video':'video_processing',
          src: video.url,
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      });
      }else{
        returnList.push({
          id: item.id,
          taskType: 'text2Video',
          type: "video_processing",
          src: "",
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      }
    }
  });
  return returnList;
}

const MultiImageToVideoHistoryItemToMediaItem = (list: MultiImageToVideoHistoryItem[]) => {
  const returnList: MediaItem[] = [];
  list.forEach(item => {
    if((item.task_status ==='succeed' || item.task_status ==='submitted' || item.task_status ==='processing')){
      if(item.src.length === 0){
        returnList.push({
          id: item.id,
          taskType: 'multiImageToVideo',
          type: "video_processing",
          src: "",
          prompt: item.prompt,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
        } as MediaItem);
      }else{
        item.src.forEach(video => {
          returnList.push({
            id: item.id,
            taskType: 'multiImageToVideo',
            type: item.task_status === "succeed"?'video':'video_processing',
            src: video.url,
            prompt:item.prompt,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
          } as MediaItem);
        });
        
      }
    }
  });
  return returnList;
}

type MenuItem = Required<MenuProps>['items'][number];
type ShowType = 'image' | 'video' | 'image_processing' | 'video_processing';
export interface MediaItem {
  id: string;
  taskType: 'virtualTryOn' | 'imageGeneration' | 'image2Video' | 'text2Video'| 'multiImageToVideo';
  type: ShowType;
  src: string;
  prompt: string;
  createdAt: Date;
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

  const state = useSelector((rootState: RootState) => {
    return {
      virtualTryOnHistory: rootState.VirtualTryOn.virtualTryOnHistory,
      imageGenerationHistory: rootState.ImageGeneration.imageGenerationHistory,
      image2VideoHistory: rootState.ImageToVideo.imageToVideoHistory,
      text2VideoHistory: rootState.TextToVideo.textToVideoHistory,
      multiImageToVideoHistory: rootState.MultiImageToVideo.MultiImageToVideoHistory,
    };
  });

  console.log(state);
  const allHistoryItems: MediaItem[] = useMemo(()=>{
    return  [
      ...VirtualTryOnHistoryItemToMediaItem(state.virtualTryOnHistory),
     ...ImageGenerationHistoryItemToMediaItem(state.imageGenerationHistory),
     ...ImageToVideoHistoryItemToMediaItem(state.image2VideoHistory),
    ...TextToVideoHistoryItemToMediaItem(state.text2VideoHistory),
    ...MultiImageToVideoHistoryItemToMediaItem(state.multiImageToVideoHistory),
    ].sort((a,b)=>{ return b.createdAt.getTime() - a.createdAt.getTime()});
  },[state]);
  console.log(allHistoryItems);
  
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
            }else if(showFilter === "picture" && item.type.startsWith("image")){
              return true;
            }else if(showFilter === "video" && item.type.startsWith("video")){
              return true;
            }else{
              return false;
            }
          })
          .map((item,index) => (
            <Imgvideo key={index} url={item.src} text={item.prompt} type={item.type}></Imgvideo>
          ))
          
        }
      </Flex>
    </Flex>
  )
}
interface ImgClickProps {
  type:ShowType,
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
        type === "video"? 
        <VideoShow url={url}></VideoShow>
        :<Flex vertical style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
          <Spin size="large"></Spin>
        </Flex>
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
    console.error('Error downloading image:', error);
  }
}
export default Assets;