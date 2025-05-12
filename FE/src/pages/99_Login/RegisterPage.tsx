import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/register', values);
      message.success('登録に成功しました');
      // 登録成功後の処理をここに追加
    } catch (error) {
// 由于 error 类型为 unknown，需要先进行类型断言
if (typeof error === 'object' && error !== null && 'response' in error && error.response && (error.response as { status: number }).status === 409) {
        message.error('このメールアドレスは既に登録されています');
      } else {
        message.error('登録に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'メールアドレスを入力してください' },
          { type: 'email', message: '有効なメールアドレスを入力してください' },
        ]}
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
          登録する
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;