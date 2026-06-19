import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Modal } from 'antd';
import { authAction } from '~mdAuth/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import './styles.scss';
import Icon from '@components/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
type AppModalSuccessProps = {
  isVisibleModalSuccess: boolean;
  setIsVisibleModalSuccess: (isVisible: boolean) => void;
  isDetail?: boolean;
};

const AppModalSuccess: React.FC<AppModalSuccessProps> = ({
  isVisibleModalSuccess,
  setIsVisibleModalSuccess,
  isDetail = true,
}) => {
  const dispatch = useAppDispatch();
  const { lessonPurchaseData } = useAppSelector(state => state.authReducer);
  const router = useRouter();
  const onCloseModalAdd = () => {
    setIsVisibleModalSuccess(false);
    dispatch(authAction.lessonPurchaseData(undefined));
  };
  const onViewDetail = () => {
    setIsVisibleModalSuccess(false);
    dispatch(
      authAction.viewDetailTransaction({ id: lessonPurchaseData?.paymentId }),
    );
    router.replace(`/dashboard/profile?tab=${2}`);
  };

  return (
    <Modal
      open={isVisibleModalSuccess}
      onCancel={onCloseModalAdd}
      closable={false}
      footer={null}>
      <View style={styles.containerFlex}>
        {lessonPurchaseData?.status === 'success' ? (
          <>
            <Icon name="success" className="button-icon" />
            <View style={styles.centerAlignGap8}>
              <Text style={styles.titleText}>Buy Lesson Successfully</Text>
              <Text style={[styles.subTitle, styles.successText]}>
                - {lessonPurchaseData?.amount} {lessonPurchaseData?.currency}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Icon
              name="error"
              className="button-icon"
              style={styles.iconSize64}
            />

            <View style={styles.centerAlignGap8}>
              <Text style={styles.titleText}>Buy Lesson Failed</Text>
              <Text style={[styles.subTitle, styles.errorText]}>
                - {lessonPurchaseData?.amount} {lessonPurchaseData?.currency}
              </Text>
            </View>
          </>
        )}

        <View style={styles.transactionBox}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Transaction ID</Text>
            <Text style={styles.rowSubTitle} numberOfLines={1}>
              {lessonPurchaseData?.paymentId.slice(0, 20)}...
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Lesson Name </Text>
            <Text style={styles.rowSubTitle}>{lessonPurchaseData?.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Date created</Text>
            <Text style={styles.rowSubTitle}>
              {dayjs(lessonPurchaseData?.createdAt).format('HH:mm DD/MM/YY')}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onClick={onCloseModalAdd}
            type="primary"
            htmlType="submit"
            style={styles.verifyButton}>
            Confirm
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default AppModalSuccess;
