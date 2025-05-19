import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Checkbox, Space, Flex } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { createStyles,keyframes } from 'antd-style';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchHistory } from '@/services/getHistory';
import logoUrl from '@/assets/images/logo.png';

const useStyles = createStyles(({ }) => {
  
  const gradientMove = keyframes`
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(50%, 50%) rotate(360deg); }
    `;
  return{
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
  const [activeKey, setActiveKey] = useState('login');
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
        <Flex style={{justifyContent:"center"}}>
        <img
              src={logoUrl}
              alt="Company Logo"
              style={{  height: "80px", padding: "10px" }}
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

// ログインフォームコンポーネント
interface LoginFormProps {
  switchTab: React.Dispatch<React.SetStateAction<string>>;
}
const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    navigate('/main'); // ログイン成功後にメイン画面に遷移
    //fetchHistory();
  };
return (
  <Form 
  onFinish={onFinish}
  >
    <Form.Item name="username" rules={[{ required: true,message:"メールアドレスを入力してください。" }]}>
      <Input style={{height:"40px",borderRadius:"20px"}} prefix={<UserOutlined />} placeholder="メールアドレス" />
    </Form.Item>
    
    <Form.Item name="password" rules={[{ required: true,message:"パスワードを入力してください。"}]}>
      <Input.Password style={{height:"40px",borderRadius:"20px"}} prefix={<LockOutlined />} placeholder="パスワード" />
    </Form.Item>
    <Form.Item>
      <Button style={{height:"40px",borderRadius:"20px"}} type="primary" htmlType="submit" block>
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