import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// 定义历史记录类型
interface HistoryItem {
  id: string;
  src: string | string[];
  thumbnailSrc?: string;
}
interface VirtualTryOnHistoryItem extends HistoryItem  {
  
}
interface ImageGenerationHistoryItem extends HistoryItem {
  prompt: string;
  negativePrompt: string;
}
interface Image2VideoHistoryItem extends HistoryItem {
  prompt: string;
  negativePrompt: string;
}
interface Text2VideoHistoryItem extends HistoryItem {
  prompt: string;
}

// 定义状态类型
interface HistoryState {
  virtualTryOnHistory: VirtualTryOnHistoryItem[];
  imageGenerationHistory: ImageGenerationHistoryItem[];
  image2VideoHistory: Image2VideoHistoryItem[];
  text2VideoHistory: Text2VideoHistoryItem[];
  loading: boolean;
  error: string | null;
}

// 定义动作类型
type HistoryAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS_VirtualTryOn'; payload: VirtualTryOnHistoryItem[] }
  | { type: 'FETCH_SUCCESS_ImageGeneration'; payload: ImageGenerationHistoryItem[] }
  | { type: 'FETCH_SUCCESS_Image2Video'; payload: Image2VideoHistoryItem[] }
  | { type: 'FETCH_SUCCESS_Text2Video'; payload: Text2VideoHistoryItem[] }
  | { type: 'FETCH_ERROR'; payload: string };

// 初始状态
const initialState: HistoryState = {
  virtualTryOnHistory: [],
  imageGenerationHistory: [],
  image2VideoHistory: [],
  text2VideoHistory: [],
  loading: true,
  error: null,
};

// Reducer 函数
const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS_VirtualTryOn':
      return {
        ...state,
        virtualTryOnHistory: action.payload,
        loading: false,
      };
    case 'FETCH_SUCCESS_ImageGeneration':
      return {
        ...state,
        imageGenerationHistory: action.payload,
        loading: false,
      };
    case 'FETCH_SUCCESS_Image2Video':
      return {
        ...state,
        image2VideoHistory: action.payload,
        loading: false,
      };
    case 'FETCH_SUCCESS_Text2Video':
      return {
       ...state,
        text2VideoHistory: action.payload,
        loading: false,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// 创建 Context
export const HistoryContext = createContext<{
  state: HistoryState;
  dispatch: React.Dispatch<HistoryAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider 组件
export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 虚拟试穿历史记录
        dispatch({ type: 'FETCH_START' });
        const tryOnResponse = await axios.get('http://localhost:3006/create-virtual-try-on-image/history');
        dispatch({
          type: 'FETCH_SUCCESS_VirtualTryOn',
          payload: tryOnResponse.data.map((item: any) => {
            return { 
              id: item.task_id,
              src: item.image_url,
              thumbnailSrc: item.image_url
             };
          }),
        });

        // 图像生成历史记录
        const imageResponse = await axios.get('http://localhost:3006/create-image/history');
        dispatch({
          type: 'FETCH_SUCCESS_ImageGeneration',
          payload: imageResponse.data.map((item: any) => {
            return {
              id: item.task_id,
              src: item.image_urls,
              prompt: item.prompt,
              negativePrompt: item.negative_prompt,
              thumbnailSrc: item.image,
            };
          }),
        });

        // 图片转视频历史记录
        const image2VideoResponse = await axios.get('http://localhost:3006/image2video/history');
        dispatch({
          type: 'FETCH_SUCCESS_Image2Video',
          payload: image2VideoResponse.data.map((item: any) => {
            return {
              id: item.task_id,
              src: item.video_url,
              prompt: item.prompt,
              negativePrompt: item.negative_prompt,
              thumbnailSrc: item.image,
            };
          }),
        });

        // 文本转视频历史记录
        const text2VideoResponse = await axios.get('http://localhost:3006/text2video/history');
        dispatch({
          type: 'FETCH_SUCCESS_Text2Video',
          payload: text2VideoResponse.data.map((item: any) => {
            return {
              id: item.task_id,
              src: item.video_url,
              prompt: item.prompt,
              thumbnailSrc: item.image,
            };
          }),
        });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: '获取历史记录失败' });
      }
    };

    fetchHistory();
  }, []);

  return (
    <HistoryContext.Provider value={{ state, dispatch }}>
      {children}
    </HistoryContext.Provider>
  );
};