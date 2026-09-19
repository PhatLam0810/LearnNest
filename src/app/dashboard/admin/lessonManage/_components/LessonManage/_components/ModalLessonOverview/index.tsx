import { Collapse, Modal } from 'antd';

import { ScrollView, Text, View } from 'react-native-web';
import { LessonThumbnail } from '~mdDashboard/components';
import { CheckOutlined } from '@ant-design/icons';
import styles from './styles';
const ModalLessonOverview = ({ isVisible, setIsVisible, data }: any) => {
  const items =
    data?.modules?.map((m: any) => ({
      key: m._id,
      label: <div style={styles.moduleHeader}>{m.title}</div>,
      children: (
        <div>
          {m.libraries?.map((lib: any) => (
            <div key={lib._id} style={styles.libraryItem}>
              <div>{lib.title}</div>
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
      width={720}
      centered
      title={<div style={styles.modalTitle}>{data?.title}</div>}>
      <ScrollView style={styles.scroll}>
        <div style={styles.modalBody}>
          {/* HEADER */}
          <div style={styles.header}>
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
                      <CheckOutlined
                        style={{ color: 'var(--color-success)' }}
                      />
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
