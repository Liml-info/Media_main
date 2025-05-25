
import axios from "axios";
import { store } from "@/store";
import {  ImageGenerationRequest, QueryImageGenerationListResponse, QueryImageGenerationSingleResponse } from "@/types/ImageGenerationRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearImageGeneration, fetchSuccessImageGeneration, ImageGenerationHistoryItem } from "@/store/slices/ImageGenerationSlice";

const tmpHost = "http://localhost:5159";

export const fetchImageGeneration = async (requestBody:ImageGenerationRequest) => {
    try {
      const tmpRequestBody:ImageGenerationRequest = {
        ...requestBody,
        image: requestBody.image?.replace("data:image/png;base64,",""),
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
        await fetchTryOnTaskList();
        fetchImageGenerationStatus(response.data.data.task_id).then((res) => {
          if(res.data.response.task_status === "succeed"){
            fetchTryOnTaskList();
          }
        })
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
        if (data.data.response.task_status === "succeed"  || data.data.response.task_status === 'failed') {
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

export const fetchTryOnTaskList = async (page: number = 1, pageSize: number = 500) => {
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
      return {
        id: item.response.task_id,
        src: item.response.task_result?.images??[],
        thumbnailSrc: item.request.image?item.request.image:item.response.task_result?.images[0].url??"",
        task_status: item.response.task_status,
        prompt: item.request.prompt,
        negative_prompt: item.request.negative_prompt
      }
    })
    dispatch(fetchSuccessImageGeneration(reducerData));
  }
}