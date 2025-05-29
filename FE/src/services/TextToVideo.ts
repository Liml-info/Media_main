
import axios from "axios";
import { store } from "@/store";
import {  QueryText2VideoListResponse, QueryText2VideoSingleResponse, TextToVideoRequest } from "@/types/TextToVideoRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearTextToVideo, fetchSuccessTextToVideo, TextToVideoHistoryItem } from "@/store/slices/TextToVideoSlice";

const tmpHost = "http://43.207.196.88";

export const fetchTextToVideo = async (requestBody:TextToVideoRequest) => {
    try {
      const tmpRequestBody:TextToVideoRequest = {
        ...requestBody,
      }
      console.log(JSON.stringify(tmpRequestBody));
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/TextToVideo`, tmpRequestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') 
        }
      });
      if(response.data.code.toString() === "0" && response.data.data.task_id){
        //TODO
        await fetchTextToVideoTaskList();
        fetchTextToVideoStatus(response.data.data.task_id).then((res) => {
          if(res.data.result?.task_status === "succeed"){
            fetchTextToVideoTaskList();
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

export const fetchTextToVideoStatus = async (taskId: string) => {
  return new Promise<QueryText2VideoSingleResponse>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get<QueryText2VideoSingleResponse>(`${tmpHost}/api/TextToVideo/${taskId}`,{
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

export const fetchTextToVideoTaskList = async (page: number = 0, pageSize: number = 0) => {
  try {
    const response = await axios.get<QueryText2VideoListResponse>(`${tmpHost}/api/TextToVideo?pageNum=${page}&pageSize=${pageSize}`,{
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
 const responseToReducer = (response:QueryText2VideoListResponse) => {
  const { dispatch } = store;
  
  if(response.code.toString() === "0"){
    dispatch(clearTextToVideo());
    const reducerData:Array<TextToVideoHistoryItem> = response.data.map((item) => {
      if(item.result){
        return {
          id: item.result.task_id,
          src: item.result.task_result?.videos??[],
          task_status: item.result.task_status,
          prompt: item.request.prompt??"",
          negativePrompt: item.request.negative_prompt??"",
          created_at: item.task.created_at,
        }
      }else{
        return {
          id: item.task.task_id,
          src: [],
          task_status: "processing",
          prompt: item.request.prompt??"",
          negativePrompt: item.request.negative_prompt??"",
          created_at: item.task.created_at,
        }
      }
    })
    dispatch(fetchSuccessTextToVideo(reducerData));
  }
}