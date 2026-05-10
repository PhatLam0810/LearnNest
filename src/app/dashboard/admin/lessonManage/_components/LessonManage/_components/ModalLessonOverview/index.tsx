import { useWindowSize } from '@hooks';
import { Collapse, Modal } from 'antd';
import React from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import { LessonThumbnail } from '~mdDashboard/components';
import { CheckOutlined } from '@ant-design/icons';
import LibraryDetailItem from '~mdDashboard/components/LibraryDetailItem';
import styles from './styles';
const ModalLessonOverview = ({ isVisible, setIsVisible, data }: any) => {
  const { width } = useWindowSize();

  const items =
    data?.modules?.map((m: any) => ({
      key: m._id,
      label: <div style={styles.moduleHeader}>{m.title}</div>,
      children: (
        <div>
          {m.libraries?.map((lib: any) => (
            <div key={lib._id} style={styles.libraryItem}>
              <LibraryDetailItem data={lib} />
            </div>
          ))}
        </div>
      ),
    })) || [];

  return (
    <Modal
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={false}
      width="85%"
      centered
      title={
        <div style={{ fontSize: 18, fontWeight: 700 }}>{data?.title}</div>
      }>
      <ScrollView style={{ height: (width * 0.85 * 9) / 16 }}>
        <div style={styles.modalBody}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.title}>{data?.title}</div>
            <div style={styles.subtitle}>
              Khám phá nội dung chi tiết của khóa học
            </div>
          </div>

          {/* BODY */}
          <div style={styles.layout}>
            {/* LEFT */}
            <div style={styles.left}>
              <div style={styles.card}>
                <Text style={styles.desc}>{data?.description}</Text>

                <div>
                  {data?.learnedSkills?.map((s: string, i: number) => (
                    <div key={i} style={styles.skillItem}>
                      <CheckOutlined style={{ color: '#52c41a' }} />
                      <Text style={styles.skillText}>{s}</Text>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.moduleCard}>
                <Collapse
                  bordered={false}
                  items={items}
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>

            {/* RIGHT (sticky preview) */}
            <div style={styles.right}>
              <div style={styles.card}>
                <div style={styles.thumbnailWrap}>
                  <LessonThumbnail thumbnail={data?.thumbnail} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollView>
    </Modal>
  );
};

export default ModalLessonOverview;
