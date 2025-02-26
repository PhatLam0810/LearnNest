'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Button } from 'antd';
import { adminQuery } from '~mdAdmin/redux';

const Bulk = () => {
  const [bulkLibraryFromYoutube, { isLoading: isLoadingBulkYoutube }] =
    adminQuery.useBulkLibraryFromYoutubeMutation();

  const [bulkLibraryFromGoogleDrive, { isLoading: isLoadingBulkGG }] =
    adminQuery.useBulkLibraryFromGoogleDriveMutation();
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Bulk library from Youtube</Text>
        <Button
          loading={isLoadingBulkYoutube}
          style={{ alignSelf: 'flex-start' }}
          onClick={() => bulkLibraryFromYoutube()}>
          Bulk from Youtube
        </Button>
      </View>

      <View>
        <Text style={styles.title}>Bulk library from Google Drive</Text>
        <Button
          loading={isLoadingBulkGG}
          style={{ alignSelf: 'flex-start' }}
          onClick={() => bulkLibraryFromGoogleDrive()}>
          Bulk from Google Drive
        </Button>
      </View>
    </View>
  );
};

export default Bulk;
