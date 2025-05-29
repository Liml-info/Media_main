import axios from "axios";

const tmpHost = "http://43.207.196.88";
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  message: string;
  } 
interface LoginRequest  {
    username: string;
    password: string;
}
export const loginToServer = async (param:LoginRequest) => {
    try {
      const tryOnResponse = await axios.post<LoginResponse>(`${tmpHost}/api/Auth/login`,
        param
      );
      if(tryOnResponse.status !== 200){
        return tryOnResponse.data.message;
      }
      localStorage.setItem('access_token', tryOnResponse.data.access_token);
      localStorage.setItem('refresh_token', tryOnResponse.data.refresh_token);
      return "success";
    } catch (error) {
      return "failed";
    }
  };