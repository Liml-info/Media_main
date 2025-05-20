import { fetchError,clearHistory, fetchStart, fetchSuccessImage2Video, fetchSuccessImageGeneration, fetchSuccessText2Video, fetchSuccessVirtualTryOn } from "@/store/slices/historySlice";
import axios from "axios";
import { store } from "@/store";
const tmpHost = "http://localhost:3006";

export const fetchHistory = async () => {
    const { dispatch } = store;
    try {
      // 清空历史记录
      dispatch(clearHistory());
      // 虚拟试穿历史记录
      dispatch(fetchStart());
      const tryOnResponse = await axios.get(`${tmpHost}/create-virtual-try-on-image/history`);
      dispatch(fetchSuccessVirtualTryOn(
        tryOnResponse.data.map((item: any) => ({ 
          id: item.task_id,
          src: item.image_url,
          thumbnailSrc: item.image_url
        }))
      ));

      // 图像生成历史记录
      const imageResponse = await axios.get(`${tmpHost}/create-image/history`);
      dispatch(fetchSuccessImageGeneration(
        imageResponse.data.map((item: any) => ({
          id: item.task_id,
          src: item.image_urls,
          prompt: item.prompt,
          negativePrompt: item.negative_prompt,
          thumbnailSrc: item.image,
        }))
      ));

      // 图片转视频历史记录
      const image2VideoResponse = await axios.get(`${tmpHost}/image2video/history`);
      dispatch(fetchSuccessImage2Video(
        image2VideoResponse.data.map((item: any) => ({
          id: item.task_id,
          src: item.video_url,
          prompt: item.prompt,
          negativePrompt: item.negative_prompt,
          thumbnailSrc: item.image,
        }))
      ));

      // 文本转视频历史记录
      const text2VideoResponse = await axios.get(`${tmpHost}/text2video/history`);
      dispatch(fetchSuccessText2Video(
        text2VideoResponse.data.map((item: any) => ({
          id: item.task_id,
          src: item.video_url,
          prompt: item.prompt,
          thumbnailSrc: item.image,
        }))
      ));
    } catch (error) {
      dispatch(fetchError('获取历史记录失败'));
    }
  };