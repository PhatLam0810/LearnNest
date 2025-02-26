import React, { useEffect, useState } from 'react';
import { Upload, Button, Modal, message, Image } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './functions'; // Hàm cắt ảnh (chúng ta sẽ cần định nghĩa nó)
import { View } from 'react-native-web';
import styles from './styles';
import { StylesProps } from '@styles';

interface ImageCropUploadProps {
  value?: string;
  containerStyle?: any;
  onChange?: (imageUrl: string) => void; // Callback trả về ảnh đã crop
}

const ImageCropUpload: React.FC<ImageCropUploadProps> = ({
  value,
  onChange,
  containerStyle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
    return false; // Ngừng upload file để xử lý crop ảnh
  };

  const handleCropComplete = async (cropArea: any, croppedAreaPixels: any) => {
    const { x, y, width, height } = croppedAreaPixels;
    if ([x, y, width, height].some(value => isNaN(value))) {
      return;
    }
    if (image) {
      try {
        const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImageUrl);
      } catch (error) {
        console.error('Crop failed', error);
        message.error('Failed to crop image. Please try again.');
      }
    }
  };

  const handleDeleteCroppedImage = () => {
    setCroppedImage(null);
    setImage(null);
  };

  useEffect(() => {
    if (value) {
      setCroppedImage(value);
    }
  }, [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      {croppedImage ? (
        <>
          <Image
            src={croppedImage}
            alt="Cropped"
            width={'100%'}
            height={'100%'}
          />
          <Button
            style={styles.buttonDeleteImage}
            type="text"
            onClick={handleDeleteCroppedImage}>
            <CloseCircleOutlined />
          </Button>
        </>
      ) : (
        <Upload
          listType="picture"
          beforeUpload={handleBeforeUpload}
          showUploadList={false} // Không hiển thị danh sách file upload
        >
          <Button type="text" icon={<UploadOutlined />}>
            Upload Image
          </Button>
        </Upload>
      )}
      <Modal
        title="Crop Image"
        open={image && isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}>
        <div style={{ position: 'relative', height: '400px', width: '100%' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
              if (onChange) {
                onChange(croppedImage);
              }
            }}>
            Save Cropped Image
          </Button>
        </div>
      </Modal>
    </View>
  );
};

export default ImageCropUpload;
