import { DownOutlined } from "@ant-design/icons";
import { Anchor, Col, Dropdown, Flex, Row, Space } from "antd";
import type { MenuProps } from 'antd';
import { ReactNode, useEffect, useMemo, useState } from "react";
import SimpleBar from 'simplebar-react';
import MediaViewer from "./components/MediaViewer";
import { fetchHistory } from "@/services/getHistory";
type MenuItem = Required<MenuProps>['items'][number];
const filterItem: MenuItem[] = [
  {
    key: "all",
    label: '全部',
  },
  {
    key: "picture",
    label: '画像',
  },
  {
    key: "video",
    label: 'ビデオ',
  }
];
const ToolRight: React.FC = () => {
  const [showFilter, setShowFilter] = useState<string>("all");
  const onClick: MenuProps['onClick'] = (e) => {
    setShowFilter(e.key);
    console.log(e);
  };
  const filterTitle = useMemo(() => {
    return filterItem.find((item) => item?.key === showFilter)
  }, [showFilter]);
  return (
    <Flex vertical style={{ width: "100%", height: "100vh" }}>
      <Flex style={{ padding: "0px 20px", height: "65px", borderBottom: "1px solid", flexShrink:"0", alignItems: "center" }}>
        <Dropdown menu={{ items: filterItem, onClick: onClick }} placement="bottomLeft" >
          <Space>
            {filterTitle && "label" in filterTitle ? filterTitle.label : ""}
            <DownOutlined />
          </Space>
        </Dropdown>
      </Flex>
      <Flex style={{ width: "100%", flexGrow: 1, overflow: "hidden"}}>
        <MediaViewer></MediaViewer>
      </Flex>
    </Flex>
  );
}

export default ToolRight;