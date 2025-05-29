
import axios from "axios";
import { store } from "@/store";
import {  MultiImageToVideoRequest, QueryMultiImage2VideoListResponse, QueryMultiImage2VideoSingleResponse } from "@/types/MultiImageToVideoRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearMultiImageToVideo, fetchSuccessMultiImageToVideo, MultiImageToVideoHistoryItem } from "@/store/slices/MultiImageToVideoSlice";

const tmpHost = "http://43.207.196.88";

export const fetchMultiMultiImageToVideo = async (requestBody:MultiImageToVideoRequest) => {
    try {
      const tmpRequestBody:MultiImageToVideoRequest = {
        ...requestBody,
        image_list: requestBody.image_list.map((item) => {
         return {
          image: item.image,
         }
        })
      }
      console.log(JSON.stringify(tmpRequestBody));
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/MultiImageToVideo`, tmpRequestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') 
        }
      });
      if(response.data.code.toString() === "0" && response.data.data.task_id){
        //TODO
        await fetchMultiImageToVideoTaskList();
        fetchMultiMultiImageToVideoStatus(response.data.data.task_id).then((res) => {
          if(res.data.result?.task_status === "succeed"){
            fetchMultiImageToVideoTaskList();
          }
        })
      }else{
        message.error(response.data.message);
      }
      return response.data;
    } catch (error) {
      message.error("请求server失败");
      return {
        code: 500,
        message: "请求server失败",
      }
    }
  };

export const fetchMultiMultiImageToVideoStatus = async (taskId: string) => {
  return new Promise<QueryMultiImage2VideoSingleResponse>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get<QueryMultiImage2VideoSingleResponse>(`${tmpHost}/api/MultiImageToVideo/${taskId}`,{
          headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('access_token')
          }
        });
        const data = response.data;
        // 当状态为成功或失败时终止轮询
        if (data.data.result?.task_status === "succeed"  || data.data.result?.task_status === 'failed') {
          clearInterval(intervalId);
          resolve(data);
        }
      } catch (error) {
        clearInterval(intervalId);
        message.error("请求server失败");
        reject(error);
      }
    };
    // 立即执行第一次查询，然后每隔60秒（1分钟）轮询
    checkStatus();
    const intervalId = setInterval(checkStatus, 60000);
  });
};

export const fetchMultiImageToVideoTaskList = async (page: number = 0, pageSize: number = 0) => {
  try {
    const response = await axios.get<QueryMultiImage2VideoListResponse>(`${tmpHost}/api/MultiImageToVideo?pageNum=${page}&pageSize=${pageSize}`,{
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('access_token')
      }
    });
    responseToReducer(response.data);
  }
  catch (error) {
    console.log(error);
    
    message.error("请求server失败");
  }
}
 const responseToReducer = (response:QueryMultiImage2VideoListResponse) => {
  const { dispatch } = store;
  
  if(response.code.toString() === "0"){
    dispatch(clearMultiImageToVideo());
    const reducerData:Array<MultiImageToVideoHistoryItem> = response.data.map((item) => {
      const thumbnailSrc = item.request.image_list.filter((item) => item.image);
      if(item.result){
      return {
        id: item.result.task_id,
        src: item.result.task_result?.videos??[],
        thumbnailSrc: thumbnailSrc[0].image??"",
        task_status: item.result.task_status,
        prompt: item.request.prompt??"",
        negativePrompt: item.request.negative_prompt??"",
        created_at: item.task.created_at,
      }
      }else{
        return {
          id: item.task.task_id,
          src: [],
          thumbnailSrc: thumbnailSrc[0].image??"",
          task_status: "processing",
          prompt: item.request.prompt??"",
          negativePrompt: item.request.negative_prompt??"",
          created_at: item.task.created_at,
        }
      }
    })
    dispatch(fetchSuccessMultiImageToVideo(reducerData));
  }
}