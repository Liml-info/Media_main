import { ControlOutlined } from "@ant-design/icons";
import { Button, Flex, message, Popover, Radio, Select, Slider, Space, Tabs, Typography } from "antd";
import { useContext, useMemo } from "react";
import ImgUpload from "./components/ImgUpload";
import TextArea from "antd/es/input/TextArea";
import { AspectRatio, Duration, InputImageType, inputType, Mode, ModelName, VideoContext } from "@/contexts/VideoContext";
import type { TabsProps } from 'antd';
import MultiImgUpload from "./components/MultiImgUpload";
import SimpleBar from "simplebar-react";
import { TextToVideoRequestSchema, TextToVideoValidationErrorMap } from "@/zod/TextToVideo";
import { ImageToVideoRequestSchema, ImageToVideoValidationErrorMap } from "@/zod/ImageToVideoRequest";
import { MultiImageToVideoRequestSchema, MultiImageToVideoValidationErrorMap } from "@/zod/MultiImageToVideo";
import { MultiImageToVideoRequest } from "@/types/MultiImageToVideoRequest";
import { ImageToVideoRequest } from "@/types/ImageToVideoRequest";
import { TextToVideoRequest } from "@/types/TextToVideoRequest";
const { Title, Text } = Typography;



const Types: TabsProps['items'] = [
  {
    key: 'text',
    label: '文生ビデオ',
  },
  {
    key: 'image',
    label: '図生ビデオ',
  }
];




const App: React.FC = () => {
  const { state, dispatch } = useContext(VideoContext);
  const { model_name, input_type, input_image_type } = state;
  const isTextInput = input_type === "text";
  const isAspectRatioShow = input_type === "text" || (input_type === "image" && input_image_type === "mulitple");

  const model_name_options = useMemo(() => {
    if (input_type == "text") {
      return [
        { value: 'kling-v2-master', label: 'モードv2.0' },
        { value: 'kling-v1-6', label: 'モードv1.6' },
        { value: 'kling-v1', label: 'モードv1.0' },
      ];
    } else if (input_type == "image" && input_image_type == "mulitple") {
      return [
        { value: 'kling-v1-6', label: 'モードv1.6' },
      ];
    } else {
      return [
        { value: 'kling-v2-master', label: 'モードv2.0' },
        { value: 'kling-v1-6', label: 'モードv1.6' },
        { value: 'kling-v1-5', label: 'モードv1.5' },
        { value: 'kling-v1', label: 'モードv1.0' },
      ]
    }
  }, [input_type, input_image_type]);
  /**
   * 生成自由度のスライダー
   */
  const cfg_scale_content = useMemo(() => {
    return (
      <Space>
        <span>0</span>
        <Slider min={0} max={100} style={{ width: "200px" }}
          tooltip={{
            formatter: (value) => {
              if (value === 100) {
                return '1（数値が大きい）、ピクチャと記述内容の衝突によるピクチャエラーが小さい確率で発生する';
              }
              return `${(value ?? 0) / 100}`;
            }
          }}
          value={state.cfg_scale * 100}
          onChange={(value) => {
            dispatch({ type: "SET_CFG_SCALE", payload: value / 100 });
          }}
        // defaultValue={50} 
        />
        <span>1</span>
      </Space>
    )
  }, [state.cfg_scale])


  return (
    <Flex vertical style={{ height: "100%" }}>
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", alignItems: "center",flexShrink:0 }}>
        <Space>
          <Title level={4}>ビデオ生成</Title>
          <Select
            defaultValue="kling-v1-6"
            value={model_name}
            style={{ width: 150 }}
            onChange={(value) => {
              dispatch({ type: "SET_MODELNAME", payload: value as ModelName });
            }}
            options={model_name_options}
          />
        </Space>
      </Flex>
      <Flex vertical style={{ padding: "0px 20px", flexGrow: 1, overflow: "hidden" }}>
        <SimpleBar style={{height:"100%"}}>
          <Flex>
            <Tabs activeKey={input_type} style={{ width: "100%" }} items={Types} onChange={(key: string) => {
              if (key === "text" && model_name == "kling-v1-5") {
                dispatch({ type: "SET_MODELNAME", payload: "kling-v1-6" });
                message.info("モードをV1.6に変更しました。");
              } else if (key === "image" && input_image_type == "mulitple" && model_name != "kling-v1-6") {
                dispatch({ type: "SET_MODELNAME", payload: "kling-v1-6" });
                message.info("モードをV1.6に変更しました。");
              }
              dispatch({ type: "SET_INPUT_TYPE", payload: key as inputType });
            }} />
          </Flex>
          {
            isTextInput ? undefined :

              <Flex>
                <Radio.Group value={input_image_type} onChange={
                  (e) => {
                    if (e.target.value === "mulitple" && model_name != "kling-v1-6") {
                      dispatch({ type: "SET_MODELNAME", payload: "kling-v1-6" });
                      message.info("モードをV1.6に変更しました。");
                    }
                    dispatch({ type: "SET_INPUT_IMAGE_TYPE", payload: e.target.value as InputImageType });
                  }
                } style={{ marginBottom: 16 }}>
                  <Radio.Button value="firstend">開始・終了フレーム</Radio.Button>
                  <Radio.Button value="mulitple">　複数画像参考　　</Radio.Button>
                </Radio.Group>
              </Flex>
          }
          {
            isTextInput ? undefined :

              <Flex vertical style={{ margin: "10px 0px" }}>

                {
                  input_image_type == "firstend" ?
                    <>

                      <Space style={{ marginBottom: "10px" }}>
                        <Text>開始・終了フレーム（必須）</Text>
                      </Space>
                      <Flex vertical>
                        <ImgUpload></ImgUpload>
                      </Flex>
                    </>
                    :
                    <MultiImgUpload></MultiImgUpload>
                }
              </Flex>
          }
          <Flex vertical style={{ marginBottom: "10px" }}>
            <Space style={{ marginBottom: "10px" }}>
              <Text>{isTextInput ? "クリエイティブな説明" : "クリエイティブな説明（オプション）"}</Text>
            </Space>
            <Flex>
              <TextArea
                style={{ width: "100%" }}
                value={state.prompt}
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
              <Text>表示したくないコンテンツ（オプション）</Text>
            </Space>
            <Flex>
              <TextArea
                style={{ width: "100%" }}
                value={state.negative_prompt}
                onChange={(e) => {
                  dispatch({ type: "SET_NEGATIVE_PROMPT", payload: e.target.value });
                }}
                placeholder="ビデオに表示したくない内容を入力してください。例：アニメーション、ファジィ表現、変形加工、破壊表現、低品質素材、コラージュ..."
                maxLength={2500}
                autoSize={{ minRows: 3, maxRows: 5 }}></TextArea>
            </Flex>
          </Flex>
        </SimpleBar>
      </Flex>
      <Space style={{ padding: "0px 20px", }}>
        <Select
          defaultValue="std"
          value={state.mode}
          style={{ width: 150 }}
          onChange={(value) => {
            dispatch({ type: "SET_MODEL", payload: value as Mode });
          }}
          options={[
            { value: 'std', label: '標準モード' },
            { value: 'pro', label: '高品質モード' },
          ]}
        />
        <Select
          defaultValue="5"
          style={{ width: 80 }}
          value={state.duration}
          onChange={(value) => { dispatch({ type: "SET_DURATION", payload: value as Duration }); }}
          options={[
            { value: '5', label: '5s' },
            { value: '10', label: '10s' }
          ]}
        />
        {
          isAspectRatioShow ?
            <Select
              defaultValue="5"
              style={{ width: 80 }}
              value={state.aspect_ratio}
              onChange={(value) => { dispatch({ type: "SET_ASPECT_RATIO", payload: value as AspectRatio }); }}
              options={[
                { value: '16:9', label: '16:9' },
                { value: '9:16', label: '9:16' },
                { value: '1:1', label: '1:1' },
              ]}
            /> :
            undefined
        }
        <Popover placement="topLeft" content={cfg_scale_content}>
          <Button type="primary" icon={<ControlOutlined />} iconPosition={"end"}>
            生成自由度:{state.cfg_scale}
          </Button>
        </Popover>
      </Space>
      <Flex style={{ alignItems: "center", padding: "0px 20px", height: "65px", justifyContent: "flex-end",flexShrink:0 }}>
        <Button type="primary" style={{width:"60%",height:"40px"}} onClick={() => {
          if (input_type === "text") {
            const tmpRequest:TextToVideoRequest = {
              model_name: state.model_name === "kling-v1-5" ? undefined : state.model_name  ,
              prompt: state.prompt,
              negative_prompt: state.negative_prompt,
              mode: state.mode,
              duration: state.duration,
              aspect_ratio: state.aspect_ratio,
              cfg_scale: state.cfg_scale,
            }
            const result =  TextToVideoRequestSchema.safeParse(tmpRequest,{ errorMap: TextToVideoValidationErrorMap });
            if (result.success) {
              console.log(result.data);
              return;
            }else{
              result.error.errors.forEach((error)=>{
                message.error(error.message);
                console.log(error.path,error.message);})
            }
          }else{
            if (input_image_type == "firstend") {
              const tmpRequest:ImageToVideoRequest = {
                model_name: state.model_name,
                prompt: state.prompt,
                negative_prompt: state.negative_prompt,
                mode: state.mode,
                duration: state.duration,
                aspect_ratio: state.aspect_ratio,
                image: state.image,
                cfg_scale: state.cfg_scale,
                image_tail: state.image_tail?state.image_tail:undefined,
              }
            const result =  ImageToVideoRequestSchema.safeParse(tmpRequest,{ errorMap: ImageToVideoValidationErrorMap });
            if (result.success) {
              console.log(result.data);
              return;
            }else{
              result.error.errors.forEach((error)=>{
                message.error(error.message);
                console.log(error.path,error.message);})
            }
            }else{
              const tmpImage_list = state.image_list.filter((item)=>item!=undefined && item.image);
              const tmpRequest:MultiImageToVideoRequest = {
                model_name: 'kling-v1-6',
                prompt: state.prompt,
                negative_prompt: state.negative_prompt,
                mode: state.mode,
                duration: state.duration,
                aspect_ratio: state.aspect_ratio,
                image_list: tmpImage_list,
              }
              const result =  MultiImageToVideoRequestSchema.safeParse(tmpRequest,{ errorMap: MultiImageToVideoValidationErrorMap });
            if (result.success) {
              console.log(result.data);
              return;
            }else{
              result.error.errors.forEach((error)=>{
                message.error(error.message);
                console.log(error.path,error.message);})
            }
            }
          }
        }}>生成する</Button>
      </Flex>
    </Flex>
  );
}

export default App;