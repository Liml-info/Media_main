
import axios from "axios";
import { store } from "@/store";
import { QueryTaskListResponse, QueryTaskSingleResponse, VirtualTryOnRequest } from "@/types/VirtualTryOnRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
import { message } from "antd";
import { clearVirtualTryOn, fetchSuccessVirtualTryOn, VirtualTryOnHistoryItem } from "@/store/slices/VirtualTryOnSlice";

const tmpHost = "http://43.207.196.88";

export const fetchVirtualTryOn = async (requestBody:VirtualTryOnRequest) => {
    try {
      const tmpRequestBody:VirtualTryOnRequest = {
        model_name: requestBody.model_name,
        cloth_image: requestBody.cloth_image,
        human_image: requestBody.human_image,
      }
      console.log(JSON.stringify(tmpRequestBody));
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/VritualTryOn`, tmpRequestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') 
        }
      });
      if(response.data.code.toString() === "0" && response.data.data.task_id){
        //TODO
        await fetchTryOnTaskList();
        fetchTryOnTaskStatus(response.data.data.task_id).then((res) => {
          if(res.data.result.task_status === "succeed"){
            fetchTryOnTaskList();
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

export const fetchTryOnTaskStatus = async (taskId: string) => {
  return new Promise<QueryTaskSingleResponse>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get<QueryTaskSingleResponse>(`${tmpHost}/api/VritualTryOn/${taskId}`,{
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

export const fetchTryOnTaskList = async (page: number = 0, pageSize: number = 0) => {
  try {
    const response = await axios.get<QueryTaskListResponse>(`${tmpHost}/api/VritualTryOn?pageNum=${page}&pageSize=${pageSize}`,{
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
 const responseToReducer = (response:QueryTaskListResponse) => {
  const { dispatch } = store;
  
  if(response.code.toString() === "0"){
    dispatch(clearVirtualTryOn());
    const reducerData:Array<VirtualTryOnHistoryItem> = response.data.map((item) => {
      if(item.result){
        return {
          id: item.result.task_id,
          task_status: item.result.task_status,
          task_status_msg: item.result.task_status_msg,
          src: item.result.task_result.images?item.result.task_result.images:[],
          thumbnailSrc: item.result.task_result.images?item.result.task_result.images[0].url:"",
          created_at: item.task.created_at,
        }
      }else{
        return {
          id: item.task.task_id,
          task_status: "processing",
          task_status_msg: item.task.status_msg,
          src: [],
          thumbnailSrc: item.request.human_image,
          created_at: item.task.created_at,
        }
      }
    })
    dispatch(fetchSuccessVirtualTryOn(reducerData));
  }
}