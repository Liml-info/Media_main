import  { useState } from 'react';
import {  Form, Input, Button, Flex, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { createStyles, keyframes } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import logoUrl from '@/assets/images/logo.png';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import modal from 'antd/es/modal';

const useStyles = createStyles(({ }) => {

  const gradientMove = keyframes`
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(50%, 50%) rotate(360deg); }
    `;
  return {
    cyberBgStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(45deg, #00ff88, #09f)',
        borderRadius: '30% 70% 70% 30%/30% 30% 70% 70%',
        animation: `${gradientMove} 15s infinite alternate`,
        filter: 'blur(80px)',
        opacity: 0.3
      }
    },
    container: {

      position: "relative",
      margin: "0 auto",
      height: "416px",
      padding: "40px 20px",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(12px)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 0 40px rgba(0,255,136,0.15)",
      width: "400px",
    }
  }
});

const AuthPage = () => {
  const { styles } = useStyles();
  // const items: TabsProps['items'] = [
  //   {
  //     key: 'login',
  //     label: 'ユーザーログイン',
  //     children: <LoginForm switchTab={setActiveKey} />,
  //   },
  //   {
  //     key: 'register',
  //     label: '新規ユーザー登録',
  //     children: <RegisterForm />,
  //   },
  //   {
  //     key: 'forgot',
  //     label: 'パスワードを忘れた',
  //     children: <ForgotPasswordForm />,
  //     forceRender: true, // 強制レンダリングを有効にして、タブ切り替え時に再レンダリングされるようにします。
  //   },
  // ];
  return (
    <div className={styles.cyberBgStyle}>
      {/* 動的グラデーションレイヤー */}
      <div className="gradient-layer"></div>

      <div className={styles.container}>
        <Flex style={{ justifyContent: "center" }}>
          <img
            src={logoUrl}
            alt="Company Logo"
            style={{ height: "80px", padding: "10px" }}
          />
        </Flex>
        <LoginForm />
        {/* <Tabs 
          activeKey={activeKey}
          onChange={setActiveKey}
          centered
          tabBarStyle={{ border: 'none' }}
          items={items}
        >
        </Tabs> */}
      </div>
    </div>
  );
};
interface LoginResponse {
  data:{
    token: string;
  },
  message: string;
  } 

const tmpHost = "http://43.207.196.88:5000";
// ログインフォームコンポーネント
// interface LoginFormProps {
//   switchTab: React.Dispatch<React.SetStateAction<string>>;
// }
const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const tryOnResponse = await axios.post<LoginResponse>(`${tmpHost}/api/Auth/login`,
        {username:values.username,password:values.password}
      );
      
      if(tryOnResponse.status !== 200){
        modal.warning({ title: "ログインに失敗しました。", content: "ユーザー名またはパスワードが間違っています。", okText: "OK", onOk: () => { } });
        return;
      }
      if(tryOnResponse.data.message){
        message.error(tryOnResponse.data.message);
        return;
      }   
      navigate('/main'); // ログイン成功後にメイン画面に遷移
      await login({
        username: values.username,
        access_token: tryOnResponse.data.data.token,
        //refresh_token: tryOnResponse.data.refresh_token,
      }); // ログイン成功後にログイン状態を更新
    } catch (error) {
      message.error("ログインに失敗しました。");
      return;
    }finally{
      setLoading(false);
    }
    //fetchHistory();
  };
  return (
    <Form
      onFinish={onFinish}
    >
      <Form.Item name="username" rules={[{ required: true, message: "メールアドレスを入力してください。" }]}>
        <Input style={{ height: "40px", borderRadius: "20px" }} prefix={<UserOutlined />} placeholder="メールアドレス" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: "パスワードを入力してください。" }]}>
        <Input.Password style={{ height: "40px", borderRadius: "20px" }} prefix={<LockOutlined />} placeholder="パスワード" />
      </Form.Item>
      <Form.Item>
        <Button style={{ height: "40px", borderRadius: "20px" }} loading={loading} type="primary" htmlType="submit" block>
          ログイン
        </Button>
        {/* <div style={{ marginTop: 16 }}>
        アカウントがありませんか？ 
        <Button type="link" onClick={() => switchTab('register')}>
          今すぐ登録
        </Button>
      </div> */}
      </Form.Item>
      {/* <Form.Item>
      <Button type="link" onClick={() => switchTab('forgot')}>
        パスワードを忘れましたか？
      </Button>
    </Form.Item> */}
    </Form>
  );
}

// // 新規登録フォームコンポーネント
// const RegisterForm = () => (
//   <Form>
//     <Form.Item name="email" rules={[{ type: 'email', required: true,message:"メールアドレスを入力してください。" }]}>
//       <Input prefix={<MailOutlined />} placeholder="メールアドレス" />
//     </Form.Item>

//     <Form.Item name="password" rules={[{ required: true ,message:"パスワードを入力してください。"}]}>
//       <Input.Password prefix={<LockOutlined />} placeholder="パスワードを設定" />
//     </Form.Item>

//     <Form.Item
//       name="confirm"
//       dependencies={['password']}
//       rules={[
//         ({ getFieldValue }) => ({
//           validator(_, value) {
//             if (!value || getFieldValue('password') === value) {
//               return Promise.resolve();
//             }
//             return Promise.reject('パスワードが一致しません！');
//           }
//         })
//       ]}
//     >
//       <Input.Password prefix={<LockOutlined />} placeholder="パスワードを確認" />
//     </Form.Item>

//     <Form.Item>
//       <Button type="primary" htmlType="submit" block>
//         今すぐ登録
//       </Button>
//     </Form.Item>
//   </Form>
// );

// // パスワード再設定コンポーネント
// const ForgotPasswordForm = () => (
//   <Form>
//     <Form.Item name="email" rules={[{ type: 'email', required: true,message:"メールアドレスを入力してください。" }]}>
//       <Input prefix={<MailOutlined />} placeholder="登録メールアドレス" />
//     </Form.Item>

//     <Form.Item>
//       <Space.Compact style={{width:"100%"}}>
//         <Input style={{ width: '60%' }} placeholder="確認コード" />
//         <Button style={{ width: '40%' }}>確認コードを送信</Button>
//       </Space.Compact>
//     </Form.Item>

//     <Form.Item>
//       <Button type="primary" htmlType="submit" block>
//         パスワードをリセット
//       </Button>
//     </Form.Item>
//   </Form>
// );

export default AuthPage;