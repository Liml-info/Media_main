import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', values);
      message.success('ログインに成功しました');
      // ログイン成功後の処理をここに追加
    } catch (error) {
      message.error('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'メールアドレスを入力してください' }]}
      >
        <Input placeholder="メールアドレス" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'パスワードを入力してください' }]}
      >
        <Input.Password placeholder="パスワード" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          ログイン
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;