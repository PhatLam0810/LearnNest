'use client';
import React from 'react';
import { Pagination, Table } from 'antd';
import type { TableProps } from 'antd';
import { Text, View } from 'react-native-web';
import { useResponsive } from '@/styles/responsive';
import styles from './styles';

// Cột "Hành động" luôn dùng đúng title này ở mọi tab (yêu cầu chung của
// skillUI.md §2 khi consolidate 5 tab quản lý nội dung) - dùng làm dấu hiệu
// để tách khỏi nhóm field hiển thị dạng nhãn:giá-trị trong card mobile,
// render riêng thành hàng nút bấm ở cuối card.
const ACTION_COLUMN_TITLE = 'Hành động';

function MobileCardList<T extends object>(props: TableProps<T>) {
  const {
    columns = [],
    dataSource = [],
    rowKey,
    locale,
    onRow,
    pagination,
  } = props;
  const dataCols = columns.filter(c => c.title !== ACTION_COLUMN_TITLE);
  const actionCol = columns.find(c => c.title === ACTION_COLUMN_TITLE);

  const getKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') return rowKey(record, index);
    if (typeof rowKey === 'string') return (record as any)[rowKey] ?? index;
    return index;
  };

  if (!dataSource.length) {
    return (
      <View style={styles.wrap}>
        {locale?.emptyText ?? <Text style={styles.emptyText}>Trống</Text>}
      </View>
    );
  }

  return (
    <View style={styles.mobileList}>
      {dataSource.map((record, index) => {
        const rowProps: any = onRow?.(record, index) ?? {};
        return (
          <View
            key={getKey(record, index)}
            style={styles.mobileCard}
            onClick={rowProps.onClick}>
            {dataCols.map((col, colIndex) => {
              const anyCol = col as any;
              const dataIndex = anyCol.dataIndex as string | undefined;
              const rawValue = dataIndex
                ? (record as any)[dataIndex]
                : undefined;
              const value = anyCol.render
                ? anyCol.render(rawValue, record, index)
                : rawValue;
              return (
                <View
                  key={(col.key as string) || colIndex}
                  style={styles.mobileField}>
                  <Text style={styles.mobileLabel}>{col.title as string}</Text>
                  <View style={styles.mobileValue}>{value as any}</View>
                </View>
              );
            })}
            {actionCol && (
              <View
                style={styles.mobileActions}
                onClick={e => e.stopPropagation()}>
                {(actionCol as any).render?.(undefined, record, index)}
              </View>
            )}
          </View>
        );
      })}
      {pagination !== false && pagination && (
        <Pagination
          size="small"
          style={styles.mobilePagination}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger={false}
          onChange={page =>
            (props.onChange as any)?.({ ...pagination, current: page }, {}, {})
          }
        />
      )}
    </View>
  );
}

function ThemedTable<T extends object>(props: TableProps<T>) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <MobileCardList {...props} />;
  }

  return (
    <View style={styles.wrap}>
      <Table
        {...props}
        components={{
          header: {
            cell: (cellProps: React.HTMLAttributes<HTMLTableCellElement>) => (
              <th
                {...cellProps}
                style={{ ...cellProps.style, ...styles.headerCell }}
              />
            ),
          },
        }}
      />
    </View>
  );
}

export default ThemedTable;
