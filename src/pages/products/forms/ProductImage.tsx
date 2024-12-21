import { Form, Space, Typography, Upload, UploadProps, message } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
const ProductImage = () => {
      const [imageUrl, setImageUrl] = useState<string>();
      const [messageApi, contextHolder] = message.useMessage();

      const uploaderConfig: UploadProps = {
            name: 'file',
            multiple: false,
            showUploadList: false,
            beforeUpload: (file: File) => {
                  //validation logic
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                        // message.error('You can only upload JPG or PNG file!');
                        messageApi.error('You can only upload JPG or PNG file!');
                  }
                  //todo: size validation
                  if (file.size > 1024 * 1024 * 3) {
                        messageApi.error('Image size should be less than 3MB');
                        return false;
                  }

                  setImageUrl(URL.createObjectURL(file));
                  return false;
            },
      };
      return (
            <Form.Item
                  label=""
                  name="image"
                  rules={[
                        {
                              required: true,
                              message: 'Image is Required.',
                        },
                  ]}>
                  <Upload listType="picture-card" {...uploaderConfig}>
                        {contextHolder}
                        {imageUrl ? (
                              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                              <Space direction="vertical" size="small">
                                    <PlusOutlined />
                                    <Typography.Text>Upload</Typography.Text>
                              </Space>
                        )}
                  </Upload>
            </Form.Item>
      );
};

export default ProductImage;
