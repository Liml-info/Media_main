import { ImageAspectRatioType, ModelType, PictureContext } from "@/contexts/PictureContext";
import { Button, Flex, message, Select, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useMemo } from "react";
import ImgUpload from "./components/ImgUpload";
import RefrenceImage from "./components/ImgUpload";
import SimpleBar from "simplebar-react";
import { ImageGenerationSchema } from "@/zod/ImageGeneration";
import { ImageGenerationRequest } from "@/types/ImageGenerationRequest";
const { Title, Text } = Typography;

const App: React.FC = () => {
  const { state, dispatch } = useContext(PictureContext);
const aspect_ratio_options = useMemo(() => {
  if(state.model_name == "kling-v1-5"){
    return[
      { value: '1:1', label: '1:1' },
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '3:2', label: '3:2' },
      { value: '3:4', label: '3:4' },
      { value: '9:16', label: '9:16' },
      { value: '21:9', label: '21:9' },
    ];
  }else{

    return [
      { value: '1:1', label: '1:1' },
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '3:2', label: '3:2' },
      { value: '3:4', label: '3:4' },
      { value: '9:16', label: '9:16' },
    ];
  }
  }, [state.model_name]);



  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", alignItems: "center",flexShrink:0 }}>
        <Space>
          <Title level={4}>画像生成</Title>
          <Select
            defaultValue="kling-v1-5"
            value={state.model_name}
            style={{ width: 150 }}
            onChange={(value) => {
              dispatch({ type: "SET_MODEL", payload: value as ModelType });
            }}
            options={[
              { value: 'kling-v1-5', label: 'モードv1.5' },
              { value: 'kling-v1', label: 'モードv1.0' },
            ]}
          />
        </Space>
      </Flex>
      <Flex vertical style={{ padding: "0px 20px", flexGrow: 1, overflow: "hidden" }}>
        <SimpleBar style={{height:"100%"}}>

        <Flex vertical style={{ margin: "10px 0px" }}>
          <Space style={{ marginBottom: "10px" }}>
            <Text>クリエイティブ・ディスクリプション（必須）</Text>
          </Space>
          <Flex vertical>
          <TextArea
              style={{ width: "100%" }}
              value={state.prompt.value}
              onChange={(e) => {
                dispatch({ type: "SET_PROMPT", payload: e.target.value });
              }}
              placeholder="生成したいビデオの内容について説明してください"
              maxLength={2500}
              autoSize={{ minRows: 3, maxRows: 5 }}></TextArea>
          </Flex>
        </Flex>
        <Flex vertical style={{ marginBottom: "10px" }}>
          <Space style={{ marginBottom: "10px" }}>
            <Text>参考画像をアップロード（オプション）</Text>
          </Space>
          <Flex vertical>
          <RefrenceImage></RefrenceImage>
          </Flex>
        </Flex>
          {
            state.negative_prompt.show ?
              <Flex vertical style={{ marginBottom: "10px" }}>
                <Space style={{ marginBottom: "10px" }}>
                  <Text>表示したくないコンテンツ（オプション）</Text>
                </Space>
                <Flex>
                  <TextArea
                    style={{ width: "100%" }}
                    value={state.negative_prompt.value}
                    onChange={(e) => {
                      dispatch({ type: "SET_NEGATIVE_PROMPT", payload: e.target.value });
                    }}
                    placeholder="ビデオに表示したくない内容を入力してください。例：アニメーション、ファジィ表現、変形加工、破壊表現、低品質素材、コラージュ..."
                    maxLength={2500}
                    autoSize={{ minRows: 3, maxRows: 5 }}></TextArea>
                </Flex>
              </Flex> : null
          }
        </SimpleBar>
      </Flex>
      <Space style={{ padding: "0px 20px", }}>
        <Select
          defaultValue="std"
          value={state.aspect_ratio.value}
          style={{ width: 150 }}
          onChange={(value) => {
            dispatch({ type: "SET_ASPECT_RATIO", payload: value as ImageAspectRatioType });
          }}
          options={aspect_ratio_options}
        />
        <Select
          defaultValue="5"
          style={{ width: 80 }}
          value={state.n.value}
          onChange={(value) => { dispatch({ type: "SET_N", payload: value }); }}
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
          ]}
        />
      </Space>
      <Flex style={{ alignItems: "center", padding: "0px 20px", height: "65px", justifyContent: "flex-end",flexShrink:0  }}>
        <Button type="primary" style={{width:"60%",height:"40px"}} onClick={()=>{
          const tmpImage = state.image_reference.value === "face"? state.face.faceImg : state.image.value;
          const tmpImageFidelity = state.image_reference.value === "face"? state.face.image_fidelity : 
          state.image_reference.value === "bgReference"? state.bgReference.image_fidelity : state.subject.image_fidelity;
          const tmpHumanFidelity = state.image_reference.value === "subject"? state.subject.human_fidelity : undefined;



          const requestBody:ImageGenerationRequest = {
            model_name: state.model_name,
            prompt: state.prompt.value,
            negative_prompt: state.negative_prompt.show?state.negative_prompt.value:undefined,
            image: tmpImage? tmpImage : undefined,
            image_reference: state.image_reference.value === "bgReference" ? undefined : state.image_reference.value, 
            image_fidelity: tmpImageFidelity?tmpImageFidelity/100:undefined,
            human_fidelity: tmpHumanFidelity?tmpHumanFidelity/100:undefined,
            aspect_ratio: state.aspect_ratio.value,
            n: Number(state.n.value),

          };
          
          const result =  ImageGenerationSchema.safeParse(requestBody);
          if(result.success){
            console.log(result.data);
          }else{
            result.error.errors.forEach((error)=>{
              message.error(error.message);
              console.log(error.path,error.message);});
          }
        }}>生成する</Button>
      </Flex>
    </Flex>
  );
}

export default App;