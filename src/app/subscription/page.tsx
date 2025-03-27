'use client';
import Image from 'next/image';
import { logo } from 'public/images';
import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native-web';
import styles from './styles';
import { Button } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { messageApi } from '@hooks';
import { useRouter } from 'next/navigation';

const subs = [
  { title: 'BASIC', amount: 10, color: '#80C4b6' },
  { title: 'STANDARD', amount: 50, color: '#756AFF' },
  { title: 'PREMIUM', amount: 100, color: '#FF9C12' },
];

const Page = () => {
  const router = useRouter();
  const [subSelected, setSubSelected] = useState<(typeof subs)[0]>();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>SUBSCRIPTION PLAN</Text>
      </View>
      <View style={styles.subWrap}>
        {subs.map((item, index) => {
          return (
            <View
              key={index}
              style={[styles.subItem, { borderColor: item.color }]}>
              <Text style={[styles.itemTitle, { color: item.color }]}>
                {item.title}
              </Text>
              <View
                style={[styles.amountWrap, { backgroundColor: item.color }]}>
                <Text style={styles.amount}>$ {item.amount}/month</Text>
              </View>
              <View style={{ flex: 1 }}></View>
              <Button
                onClick={() => {
                  setSubSelected(item);
                  setIsVisible(true);
                }}
                style={Object.assign({}, styles.button, {
                  backgroundColor: item.color,
                })}>
                <Text style={styles.buyNow}>BUY NOW</Text>
              </Button>
            </View>
          );
        })}
      </View>
      <Modal transparent visible={isVisible}>
        <View
          style={styles.modalContent}
          onClick={() => {
            setIsVisible(false);
          }}>
          <View
            style={styles.paypalButton}
            onClick={e => {
              e.stopPropagation();
            }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        value: (subSelected?.amount || 0).toString(),
                        currency_code: 'USD',
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const detail = await actions?.order?.capture();
                // router.back();
                console.log(detail);
                messageApi?.success({ content: 'Buy success' });
              }}
              onError={err => {
                setIsVisible(false);
                messageApi?.success({ content: 'Buy fail' });
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Page;
