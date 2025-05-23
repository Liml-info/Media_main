import { Button, Flex, message, Select, Space, Typography } from "antd";
import { useContext } from "react";
import { TryOnContext } from "@/contexts/TryOnContext";
import ImgUpload from "./components/ImgUpload";
import SimpleBar from "simplebar-react";
import { TryOnModelType } from "@/types/VirtualTryOnRequest";
import { validationErrorMap, VirtualTryOnRequestSchema } from "@/zod/VirtualTryOn";
const { Title, Text } = Typography;

const App: React.FC = () => {
  const { state, dispatch } = useContext(TryOnContext);
  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", alignItems: "center" , flexShrink: 0}}>
        <Space>
          <Title level={4}>バーチャル試着</Title>
          <Select
            defaultValue="kling-v1-6"
            value={state.model_name}
            style={{ width: 150 }}
            onChange={(value) => {
              dispatch({ type: "SET_MODEL", payload: value as TryOnModelType });
            }}
            options={[
              { value: 'kolors-virtual-try-on-v1-5', label: 'モードv1.5' },
              { value: 'kolors-virtual-try-on-v1', label: 'モードv1.0' },
            ]}
          />
        </Space>
      </Flex>
      <Flex vertical style={{ padding: "0px 20px", flexGrow: 1, overflow: "hidden" }}>
        <SimpleBar style={{ height: "100%" }}>

          <Flex vertical style={{ margin: "10px 0px" }}>
            <Space style={{ marginBottom: "10px" }}>
              <Text>人物モデル</Text>
            </Space>
            <Flex vertical>
              <ImgUpload type="human"></ImgUpload>
            </Flex>
          </Flex>
          <Flex vertical style={{ margin: "10px 0px" }}>
            <Space style={{ marginBottom: "10px" }}>
              <Text>アパレル</Text>
            </Space>
            <Flex vertical>
              <ImgUpload type="clothes"></ImgUpload>
            </Flex>
          </Flex>
        </SimpleBar>
      </Flex>
      <Flex style={{ alignItems: "center", padding: "0px 20px", height: "65px", justifyContent: "flex-end" , flexShrink: 0 }}>
        <Button type="primary"  style={{width:"60%",height:"40px"}} onClick={() => {
          console.log(state);
          
          const result =  VirtualTryOnRequestSchema.safeParse(state,{ errorMap: validationErrorMap });
          if (result.success) {
            alert("画像をアップロードしてください");
            return;
          }else{
            result.error.errors.forEach((error)=>{
              message.error(error.message);
              console.log(error.path,error.message);})
          }
        }}>生成する</Button>
      </Flex>
    </Flex>
  );
}

export default App;