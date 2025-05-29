
import axios from "axios";
import { store } from "@/store";
import {  ImageToVideoRequest, QueryImage2VideoListResponse, QueryImage2VideoSingleResponse } from "@/types/ImageToVideoRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearImageToVideo, fetchSuccessImageToVideo, ImageToVideoHistoryItem } from "@/store/slices/ImageToVideoSlice";

const tmpHost = "http://43.207.196.88";

export const fetchImageToVideo = async (requestBody:ImageToVideoRequest) => {
    try {
      const tmpRequestBody:ImageToVideoRequest = {
        ...requestBody,
        image: requestBody.image,
        image_tail: requestBody.image_tail,
      }
      console.log(JSON.stringify(tmpRequestBody));
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/ImageToVideo`, tmpRequestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') 
        }
      });
      if(response.data.code.toString() === "0" && response.data.data.task_id){
        //TODO
        await fetchImageToVideoTaskList();
        fetchImageToVideoStatus(response.data.data.task_id).then((res) => {
          if(res.data.result?.task_status === "succeed"){
            fetchImageToVideoTaskList();
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

export const fetchImageToVideoStatus = async (taskId: string) => {
  return new Promise<QueryImage2VideoSingleResponse>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get<QueryImage2VideoSingleResponse>(`${tmpHost}/api/ImageToVideo/${taskId}`,{
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

export const fetchImageToVideoTaskList = async (page: number = 0, pageSize: number = 0) => {
  try {
    const response = await axios.get<QueryImage2VideoListResponse>(`${tmpHost}/api/ImageToVideo?pageNum=${page}&pageSize=${pageSize}`,{
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
 const responseToReducer = (response:QueryImage2VideoListResponse) => {
  const { dispatch } = store;
  
  if(response.code.toString() === "0"){
    dispatch(clearImageToVideo());
    const reducerData:Array<ImageToVideoHistoryItem> = response.data.map((item) => {

      if(item.result){
       
      return {
        id: item.result.task_id,
        src: item.result.task_result?.videos??[],
        thumbnailSrc: item.request.image,
        task_status: item.result.task_status,
        prompt: item.request.prompt??"",
        negativePrompt: item.request.negative_prompt??"",
        created_at: item.task.created_at,
      }
      }else{
        return {
          id: item.task.task_id,
          src: [],
          thumbnailSrc: item.request.image,
          task_status: "processing",
          prompt: item.request.prompt??"",
          negativePrompt: item.request.negative_prompt??"",
          created_at: item.task.created_at,
        }
      }
    })
    dispatch(fetchSuccessImageToVideo(reducerData));
  }
}