import { ControlOutlined } from "@ant-design/icons";
import { Button, Flex, Popover, Select, Slider, Space, Typography } from "antd";
import { useContext, useMemo } from "react";
import ImgUpload from "./components/ImgUpload";
import TextArea from "antd/es/input/TextArea";
import { VideoContext } from "@/contexts/VideoContext";
const { Title, Text } = Typography;

const App: React.FC = () => {
  const { state, dispatch } = useContext(VideoContext);

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
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", alignItems: "center" }}>
        <Space>
          <Title level={4}>ビデオ生成</Title>
          <Select
            defaultValue="kling-v1-6"
            value={state.model_name}
            style={{ width: 150 }}
            onChange={(value) => {
              dispatch({ type: "SET_MODEL", payload: value });
            }}
            options={[
              { value: 'kling-v1-6', label: 'モードv1.6' },
              { value: 'kling-v1-5', label: 'モードv1.5' },
              { value: 'kling-v1', label: 'モードv1.0' },
            ]}
          />
        </Space>
      </Flex>
      <Flex vertical style={{ padding: "0px 20px", flexGrow: 1, overflow: "auto", scrollbarWidth: "none" }}>
        <Flex vertical style={{ margin: "10px 0px" }}>
          <Space style={{ marginBottom: "10px" }}>
            <Text>開始・終了フレーム（必須）</Text>
          </Space>
          <Flex vertical>
            <ImgUpload></ImgUpload>
          </Flex>
        </Flex>
        <Flex vertical style={{ marginBottom: "10px" }}>
          <Space style={{ marginBottom: "10px" }}>
            <Text>画像のアイデアの説明（オプション）</Text>
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
      </Flex>
      <Space style={{ padding: "0px 20px", }}>
        <Select
          defaultValue="std"
          value={state.mode}
          style={{ width: 150 }}
          onChange={(value) => {
            dispatch({ type: "SET_QUALITY", payload: value });
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
          onChange={(value) => { dispatch({ type: "SET_DURATION", payload: value }); }}
          options={[
            { value: '5', label: '5s' },
            { value: '10', label: '10s' }
          ]}
        />
        <Popover placement="topLeft" content={cfg_scale_content}>
          <Button type="primary" icon={<ControlOutlined />} iconPosition={"end"}>
            生成自由度:{state.cfg_scale}
          </Button>
        </Popover>
      </Space>
      <Flex style={{ alignItems: "center", padding: "0px 20px", height: "65px", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={()=>{
          console.log(JSON.stringify(state));
        }}>生成する</Button>
      </Flex>
    </Flex>
  );
}

export default App;