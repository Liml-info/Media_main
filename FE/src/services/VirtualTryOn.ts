import { fetchError} from "@/store/slices/historySlice";
import axios from "axios";
import { store } from "@/store";
import { VirtualTryOnRequest } from "@/types/VirtualTryOnRequest";
import { GeneratorResponseType } from "@/types/GeneratorResponse";
const tmpHost = "http://localhost:3006";

export const fetchVirtualTryOn = async (requestBody:VirtualTryOnRequest) => {
    const { dispatch } = store;
    try {
      const response = await axios.post<GeneratorResponseType>(`${tmpHost}/api/virtual-try-on`, requestBody);
      if (response.data.code === '0') {
        //dispatch(fetchSuccessVirtualTryOn(response.data.data));
      }
    } catch (error) {
      dispatch(fetchError('获取历史记录失败'));
    }
  };