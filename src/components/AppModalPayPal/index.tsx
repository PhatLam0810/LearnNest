import React, { useEffect, useState } from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import { Button, message, Modal } from 'antd';
import { LessonDetailDataResponse } from '~mdDashboard/redux/saga/type';
import { LessonContent, VerifyOtpModal } from './components';
import { authAction, authQuery } from '~mdAuth/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import './styles.css';
import { ethers } from 'ethers';
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWriteContract,
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Hash } from 'viem';
import { CounterContract } from '@/types/contract';
type AppModalPayPalProps = {
  isVisibleModalBuy: boolean;
  setIsVisibleModalBuy: (isVisible: boolean) => void;
  data: Partial<LessonDetailDataResponse>;
  accessLesson: boolean;
};

const AppModalPayPal: React.FC<AppModalPayPalProps> = ({
  isVisibleModalBuy,
  setIsVisibleModalBuy,
  data,
  accessLesson,
}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [sendOtp] = authQuery.useSendTransactionOtpMutation();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address, connector } = useAccount();

  const { writeContractAsync } = useWriteContract();
  const { verifyInfo } = useAppSelector(state => state.authReducer);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();
  const [isVisibleVerify, setIsVisibleVerify] = useState(false);
  const hexId = data._id.toString();
  const lessonId = ethers.toBigInt('0x' + hexId);
  const lessonPrice = ethers.parseEther(data.price?.toString());
  const contractAddress = CounterContract.address;

  const handleSendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await sendOtp({ email: email, type: 1 });
      if (response.data) {
        messageApi.open({
          type: 'success',
          content: `Otp code has been send to your ${userProfile?.email}`,
          duration: 10,
        });
        setIsVisibleVerify(true);
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error); // In ra lỗi
      messageApi.error(error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };
  const connectWallet = async () => {
    // Kiểm tra xem MetaMask có sẵn không
    if (typeof window.ethereum === 'undefined') {
      alert('Bạn cần cài đặt MetaMask để sử dụng tính năng này!');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
  };

  const createTransaction = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
      const abi = CounterContract.abi;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
      const access = await contract.checkAccess(userAddress, lessonId);
      if (access) {
        messageApi.info('You already own this lesson.');
        return;
      }

      const tx = await contract.buyLesson(lessonId, {
        value: lessonPrice,
      });

      await tx.wait();
      handlePurchaseSuccess(tx.hash, 'success');
    } catch (error) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        messageApi.error(
          'Bạn không có đủ ETH trong ví để thực hiện giao dịch.',
        );
        // handlePurchaseSuccess(Math.random().toString(32), 'failed');
      } else if (error.code === 'ACTION_REJECTED') {
        // handlePurchaseSuccess(Math.random().toString(32), 'failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createConnection = async () => {
    setIsLoading(true);
    try {
      const res = await connect({ connector: connectors[0] });
    } catch (error) {
      messageApi.error('Bạn đã từ chối kết nối ví.');
      handlePurchaseSuccess(Math.random().toString(32), 'failed');
    } finally {
      setIsLoading(false);
    }
  };

  const createTransactionQR = async () => {
    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: contractAddress.toString() as `0x${string}`,
        abi: CounterContract.abi,
        functionName: 'buyLesson',
        args: [lessonId],
        value: BigInt(ethers.parseEther(data.price.toString())),
        chainId: sepolia.id,
        chain: undefined,
        account: address,
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        pollingInterval: 5000,
        timeout: 180_000, // 3 phút
      });

      if (receipt.status === 'success') {
        handlePurchaseSuccess(tx, 'success');
      } else {
        handlePurchaseSuccess(tx, 'failed');
      }
    } catch (err) {
      handlePurchaseSuccess(Math.random().toString(32), 'failed');
    } finally {
      await disconnect();
      setIsLoading(false);
    }
  };

  const handlePurchaseSuccess = (hash: string, status: string) => {
    dispatch(
      authAction.lessonPurchase({
        _id: data._id,
        email: userProfile?.email,
        userId: userProfile?._id,
        paymentId: hash,
        title: data.title,
        amount: data.price,
        currency: 'ETH',
        status: status,
      }),
    );
  };
  const onCloseModalAdd = () => {
    setIsVisibleModalBuy(false);
  };
  const onCloseModalVerify = () => {
    setIsVisibleVerify(false);
  };

  useEffect(() => {
    if (verifyInfo) {
      onCloseModalVerify();
    }
  }, [verifyInfo]);

  useEffect(() => {
    if (isConnected) {
      createTransactionQR();
    }
  }, [isConnected]);

  return (
    <Modal
      open={isVisibleModalBuy}
      onCancel={onCloseModalAdd}
      closable={false}
      zIndex={1}
      onClose={onCloseModalAdd}
      footer={null}>
      <View style={{ flex: 1 }}>
        {contextHolder}
        <LessonContent data={data} accessLesson={accessLesson} />
        {verifyInfo ? (
          <View style={styles.buttonGroup}>
            <Button
              type="primary"
              style={styles.button}
              onClick={createTransaction}
              loading={isLoading}>
              Continue with MetaMask
            </Button>
            <Button
              type="primary"
              style={styles.button}
              onClick={createConnection}
              loading={isLoading}>
              Continue with WalletConnect
            </Button>
          </View>
        ) : (
          <Button
            type="primary"
            style={styles.button}
            onClick={() => handleSendOtp(userProfile?.email)}
            loading={isLoading}>
            Verify OTP
          </Button>
        )}
      </View>
      <VerifyOtpModal
        isVisible={isVisibleVerify}
        setIsVisible={onCloseModalVerify}
        email={userProfile?.email}
      />
    </Modal>
  );
};

export default AppModalPayPal;
