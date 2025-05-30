
import axios from "axios";
import { store } from "@/store";
import {  ImageGenerationRequest, QueryImageGenerationListResponse, QueryImageGenerationSingleResponse } from "@/types/ImageGenerationRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearImageGeneration, fetchSuccessImageGeneration, ImageGenerationHistoryItem } from "@/store/slices/ImageGenerationSlice";

const tmpHost = "http://43.207.196.88:5000";

export const fetchImageGeneration = async (requestBody:ImageGenerationRequest) => {
    try {
      const tmpRequestBody:ImageGenerationRequest = {
        ...requestBody,
        image: requestBody.image,
      }
      console.log(JSON.stringify(tmpRequestBody));
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/ImagesGenerations`, tmpRequestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') 
        }
      });
      if(response.data.code.toString() === "0" && response.data.data.task_id){
        //TODO
        await fetchImageGenerationTaskList();
        fetchImageGenerationStatus(response.data.data.task_id).then((res) => {
          if(res.data.result?.task_status === "succeed"){
            fetchImageGenerationTaskList();
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

export const fetchImageGenerationStatus = async (taskId: string) => {
  return new Promise<QueryImageGenerationSingleResponse>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get<QueryImageGenerationSingleResponse>(`${tmpHost}/api/ImagesGenerations/${taskId}`,{
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

export const fetchImageGenerationTaskList = async (page: number = 0, pageSize: number = 0) => {
  try {
    const response = await axios.get<QueryImageGenerationListResponse>(`${tmpHost}/api/ImagesGenerations?pageNum=${page}&pageSize=${pageSize}`,{
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
 const responseToReducer = (response:QueryImageGenerationListResponse) => {
  const { dispatch } = store;
  
  if(response.code.toString() === "0"){
    dispatch(clearImageGeneration());
    const reducerData:Array<ImageGenerationHistoryItem> = response.data.map((item) => {
      if(item.result){
        return {
          id: item.result.task_id,
          src: item.result.task_result?.images??[],
          thumbnailSrc: item.result.task_result?.images[0]?item.result.task_result?.images[0].url:item.request.image??"",
          task_status: item.result.task_status,
          prompt: item.request.prompt,
          negative_prompt: item.request.negative_prompt,
          created_at: item.task.created_at,
        }
       
      }else{
        return {
          id: item.task.task_id,
          src: [],
          thumbnailSrc: item.request.image?item.request.image:"",
          task_status: "processing",
          prompt: item.request.prompt,
          negative_prompt: item.request.negative_prompt,
          created_at: item.task.created_at,
        }
      }
    })
    dispatch(fetchSuccessImageGeneration(reducerData));
  }
}