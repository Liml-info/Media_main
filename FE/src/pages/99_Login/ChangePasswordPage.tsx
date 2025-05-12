import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ChangePasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // ここにパスワード変更の API コールを追加
      // const response = await axios.post('/auth/change-password', values);
      message.success('パスワードが正常に変更されました');
    } catch (error) {
      message.error('パスワードの変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="oldPassword"
        rules={[{ required: true, message: '現在のパスワードを入力してください' }]}
      >
        <Input.Password placeholder="現在のパスワード" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        rules={[{ required: true, message: '新しいパスワードを入力してください' }]}
      >
        <Input.Password placeholder="新しいパスワード" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '新しいパスワードを再入力してください' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('入力したパスワードが一致しません'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="新しいパスワードを再入力" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          パスワードを変更
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordPage;