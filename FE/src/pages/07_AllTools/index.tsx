import { Button, Flex, Select, Space, Typography } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import videoUrl from "@/assets/images/video.jpg";
import tryonUrl from "@/assets/images/tryon.jpg";
import pictureUrl from "@/assets/images/picture.jpg";
interface ClickItem {
  img: string;
  url: string;
  text:string;
}
const items: ClickItem[] = [
    {
      img: pictureUrl,
      url: "/tools/picture",
      text:"AI画像"
    },
  {
    img: videoUrl,
    url: "/tools/video",
    text:"AIビデオ"
  },
  {
    img: tryonUrl,
    url: "/tools/try-on",
    text:"バーチャル試着"
  }
]

const AllTools: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Flex style={{ height: "100%",gap:20,padding:"20px 20px",flexWrap:"wrap" }}>
        {
            items.map((item,index) => (
                <ImgClick key={index} img={item.img} onClick={() => navigate(item.url)} text={item.text}/>
            ))
        }
    </Flex>
  )
}
interface ImgClickProps {
  img: string;
  onClick: () => void;
  text:string;
}
const ImgClick: React.FC<ImgClickProps> = ({img,onClick,text}) => (
    <Flex vertical style={{
        width: "324px",
        height: "324px",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px",
        cursor: "pointer",
        justifyContent: "flex-end",
    }}
    onClick={onClick}
    >
        <Flex style={{
            justifyContent:"flex-start",
            fontSize:"20px",
            fontWeight:"600",
            color:"white",
            padding:"10px 20px",
            backgroundColor:"rgba(0,0,0,0.5)",
            }}>
        {
            text
        }
        </Flex>
  </Flex>
)

export default AllTools;