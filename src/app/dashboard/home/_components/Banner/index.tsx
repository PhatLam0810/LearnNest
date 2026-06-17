import React from 'react';
import { Carousel, Button } from 'antd';
import './styles.scss';
import Image from 'next/image';
import {
  BannerScreen3,
  BannerScreen2,
  BannerScreen1,
} from '../../../../../../public/images';

interface BannerProps {
  onButtonClick?: (text: string) => void;
}
const mockSlides = [
  {
    id: 1,
    imageUrl: BannerScreen3,
    title: 'Chinh phục chứng chỉ MOS 👑',
    description:
      'Nâng cao kỹ năng tin học văn phòng với khóa học MOS chuyên sâu, giúp bạn tự tin đạt điểm tuyệt đối trong các kỳ thi quốc tế.',
    buttonText: 'MOS WORD',
  },
  {
    id: 2,
    imageUrl: BannerScreen2,
    title: 'Làm chủ React.js',
    description:
      'Xây dựng giao diện người dùng hiện đại, hiệu năng cao với React.js. Khóa học thực chiến giúp bạn trở thành lập trình viên Frontend thực thụ.',
    buttonText: 'HỌC REACT',
  },
  {
    id: 3,
    imageUrl: BannerScreen1,
    title: 'Khám phá kỷ nguyên AI',
    description:
      'Tiếp cận công nghệ trí tuệ nhân tạo, hiểu cách ứng dụng AI vào công việc và lập trình để gia tăng năng suất gấp nhiều lần.',
    buttonText: 'HỌC AI',
  },
];

const Banner: React.FC<BannerProps> = ({ onButtonClick }) => {
  return (
    <Carousel arrows speed={1000} waitForAnimate className="f8-banner-carousel">
      {mockSlides.map(slide => (
        <div key={slide.id}>
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            className="slide-background"
            layout="fill"
          />

          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <Button
              className="btn-action"
              onClick={() => onButtonClick(slide.buttonText)}>
              {slide.buttonText}
            </Button>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
