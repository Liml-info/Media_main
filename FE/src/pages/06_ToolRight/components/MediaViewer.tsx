import React, { useState, useRef, useEffect, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Flex, Space, Spin ,Typography  } from 'antd';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
const { Paragraph } = Typography;

export interface MediaItem {
  id: string;
  taskType: 'virtualTryOn' | 'imageGeneration' | 'image2Video' | 'text2Video'|'multiImageToVideo';
  type: 'image' | 'video' | 'image_processing' | 'video_processing';
  src: string[];
  thumbnailSrc: string;
  prompt: string;
  createdAt: Date;
}

interface MediaViewerProps {
  filterType?: 'all' | 'picture' | 'video';
}


const MediaViewer: React.FC<MediaViewerProps> = (props) => {
  const { filterType = 'all' } = props;
  const state = useSelector((rootState: RootState) => {
    return {
      virtualTryOnHistory: rootState.VirtualTryOn.virtualTryOnHistory.filter(
        (item) => item.src && (item.task_status === 'succeed'
        || item.task_status ==='submitted'
        || item.task_status ==='processing'
        )),
      imageGenerationHistory: rootState.ImageGeneration.imageGenerationHistory.filter(
        (item) => item.src && (item.task_status === 'succeed'
        || item.task_status ==='submitted'
        || item.task_status ==='processing'
        )),
      image2VideoHistory: rootState.ImageToVideo.imageToVideoHistory.filter(
        (item) => item.src && (item.task_status === 'succeed'
        || item.task_status ==='submitted'
        || item.task_status ==='processing'
        )),
      text2VideoHistory: rootState.TextToVideo.textToVideoHistory.filter(
        (item) => item.src && (item.task_status === 'succeed'
        || item.task_status ==='submitted'
        || item.task_status ==='processing'
        )),
      multiImageToVideoHistory: rootState.MultiImageToVideo.MultiImageToVideoHistory.filter(
        (item) => item.src && (item.task_status === 'succeed'
        || item.task_status ==='submitted'
        || item.task_status ==='processing'
        )),
    };
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);

  const allHistoryItems: MediaItem[] = useMemo(() => {
   if (filterType === 'picture') {
      return [
        ...state.virtualTryOnHistory.map(item => ({
          id: item.id,
          taskType: 'virtualTryOn',
          type: item.task_status === "succeed"?'image':"image_processing",
          src: item.src.map(item => item.url),
          thumbnailSrc: item.thumbnailSrc || item.src,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
          prompt: ""
        } as MediaItem)),
        ...state.imageGenerationHistory.map(item => ({
          id: item.id,
          taskType: 'imageGeneration',
          type: item.task_status === "succeed"?'image':"image_processing",
          src: item.src.map(item => item.url),
          thumbnailSrc: item.thumbnailSrc || item.src,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
          prompt: item.prompt || "",
        } as MediaItem))].sort((a,b)=>{ return b.createdAt.getTime() - a.createdAt.getTime()});
    }
    else if (filterType === 'video') {
      return [
        
        ...state.image2VideoHistory.map(item => ({
          id: item.id,
          taskType: 'image2Video',
          type: item.task_status === "succeed"?'video':"video_processing",
          src: item.src.map(item => item.url),
          thumbnailSrc: item.thumbnailSrc || item.src,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
          prompt: item.prompt || "",
        } as MediaItem)),
        ...state.text2VideoHistory.map(item => ({
          id: item.id,
          taskType: 'text2Video',
          type:  item.task_status === "succeed"?'video':"video_processing",
          src: item.src.map(item => item.url),
          thumbnailSrc: item.thumbnailSrc || item.src,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
          prompt: item.prompt || "",
        } as MediaItem)),
        ...state.multiImageToVideoHistory.map(item => ({
          id: item.id,
          taskType: 'multiImageToVideo',
          type:  item.task_status === "succeed"?'video':"video_processing",
          src: item.src.map(item => item.url),
          thumbnailSrc: item.thumbnailSrc || item.src,
          createdAt: item.created_at?new Date(item.created_at):new Date(),
          prompt: item.prompt || "",
        } as MediaItem))
      ].sort((a,b)=>{ return b.createdAt.getTime() - a.createdAt.getTime()});
    }else {
        return [
          ...state.virtualTryOnHistory.map(item => ({
            id: item.id,
            taskType: 'virtualTryOn',
            type: item.task_status === "succeed"?'image':"image_processing",
            src: item.src.map(item => item.url),
            thumbnailSrc: item.thumbnailSrc || item.src,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
            prompt: ""
          } as MediaItem)),
          ...state.imageGenerationHistory.map(item => ({
            id: item.id,
            taskType: 'imageGeneration',
            type: item.task_status === "succeed"?'image':"image_processing",
            src: item.src.map(item => item.url),
            thumbnailSrc: item.thumbnailSrc || item.src,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
            prompt: item.prompt || "",
          } as MediaItem)),
          ...state.image2VideoHistory.map(item => ({
            id: item.id,
            taskType: 'image2Video',
            type: item.task_status === "succeed"?'video':"video_processing",
            src: item.src.map(item => item.url),
            thumbnailSrc: item.thumbnailSrc || item.src,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
            prompt: item.prompt || "",
          } as MediaItem)),
          ...state.text2VideoHistory.map(item => ({
            id: item.id,
            taskType: 'text2Video',
            type:  item.task_status === "succeed"?'video':"video_processing",
            src: item.src.map(item => item.url),
            thumbnailSrc: item.thumbnailSrc || item.src,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
            prompt: item.prompt || "",
          } as MediaItem)),
          ...state.multiImageToVideoHistory.map(item => ({
            id: item.id,
            taskType: 'multiImageToVideo',
            type:  item.task_status === "succeed"?'video':"video_processing",
            src: item.src.map(item => item.url),
            thumbnailSrc: item.thumbnailSrc || item.src,
            createdAt: item.created_at?new Date(item.created_at):new Date(),
            prompt: item.prompt || "",
          } as MediaItem))
        ].sort((a,b)=>{ return b.createdAt.getTime() - a.createdAt.getTime()});
      
    }

  },[state, filterType])
  
  
  

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (leftContainerRef.current) {
      const targetElement = leftContainerRef.current.children[index] as HTMLElement;
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(leftContainerRef.current?.children || []).indexOf(entry.target as HTMLElement);
            setSelectedIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (leftContainerRef.current) {
      Array.from(leftContainerRef.current.children).forEach((child) => {
        observer.observe(child as HTMLElement);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ display: 'flex', width:"100%" , padding:"24px 32px 10px" }}>
      <div style={{ flex: 2, overflow: 'hidden' }}>
        <SimpleBar style={{ height: '100%' }}>
          <div ref={leftContainerRef}>
            {allHistoryItems.map((item, index) => (
              <Flex key={item.id + index} style={{flexDirection:"column", justifyContent:"center", marginBottom:"16px"}}>
              <Flex vertical>
                <Space>
                    <div style={{
                      fontSize:"16px",
                      fontWeight:"600",
                      lineHeight:"26px",
                    }}>

                      {
                        item.taskType === 'virtualTryOn' ? "バーチャル試着" :
                          item.taskType === 'imageGeneration' ? "画像" :
                            item.taskType === 'image2Video' ? "画像から動画" :
                              item.taskType === 'text2Video' ? "テキストから動画" :
                                item.taskType === 'multiImageToVideo' ? "複数画像から動画" : ""
                      }
                    </div>
                </Space>
                  <Paragraph 
                    ellipsis={{ rows: 2, expandable: true, symbol: '展開',tooltip: item.prompt.substring(0,200)  }}
                  >
                    {
                      item.prompt
                    }
                  </Paragraph >
              </Flex>
                 <Flex key={item.id} style={{
                  justifyContent:"center",
                  backgroundColor:"#ffffff14",
                  borderRadius:"8px",
                  overflow:"hidden",
                  flexWrap:"wrap",
                  }}>
                {
                  
                item.type === 'image' ? (
                  item.src.map((src, index) => (
                    <img key={index} src={src} alt={`Media ${index}`} 
                    style={{ 
                      width: `${100/item.src.length}%`,
                      minWidth:"25%",
                      maxHeight:"50vh",
                      objectFit:"contain"
                     }} />
                  ))
                ) : 
                item.type === 'video'? 
                (
                  item.src.map((src, index) => (
                    <video key={index} controls src={src} style={{ 
                      width: `${100/item.src.length}%`,
                      maxHeight:"50vh" }} />
                  ))
                )
                :
                (
                  <Flex style={{width:"100%",height:"50vh",justifyContent:"center",alignItems:"center"}}>
                    <Spin size="large" />
                  </Flex>
                )
              }
                </Flex>
              </Flex>
            ))}
          </div>
        </SimpleBar>
      </div>
      <div style={{ width:"64px", overflow: 'hidden',marginLeft:"32px" }}>
        <SimpleBar style={{ height: '100%' }}>
          <div ref={rightContainerRef}>
            {allHistoryItems.map((item, index) => (
              <div
                key={item.id + index}
                onClick={() => handleThumbnailClick(index)}
                style={{
                  border: index === selectedIndex ? '2px solid green' : '2px solid transparent',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  width:"64px",
                  height:"64px",
                  borderRadius:"4px",
                  overflow:"hidden"
                }}
              >
                {
                  item.taskType === "imageGeneration" && item.type === "image_processing"? (
                    
                  <Flex style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                  <Spin size="large" />
                </Flex>
                  ):
                  
                <img src={item.thumbnailSrc} alt={`Thumbnail ${index}`} 
                style={{ width:"100%",height:"100%", objectFit:"cover",borderRadius:"4px" }} />
                }
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default MediaViewer;