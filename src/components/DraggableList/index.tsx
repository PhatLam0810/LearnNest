'use client';
import React, { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

type ScrollableDragListProps = {
  data: any[];
  renderItem: (data: any) => React.ReactNode;
  keyExtractor: (data: any) => string;
  handleUpdatedList: (data: any[]) => void;
  style?: any;
};
const ScrollableDragList: React.FC<ScrollableDragListProps> = ({
  data = [],
  renderItem,
  keyExtractor,
  handleUpdatedList,
  style,
}) => {
  const [listItem, setListItem] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setListItem(data);
    } else {
      setListItem([]);
    }
  }, [data]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(item => keyExtractor(item) === active.id);
      const newIndex = data.findIndex(item => keyExtractor(item) === over?.id);

      const updatedData = Array.from(data);
      const [movedItem] = updatedData.splice(oldIndex, 1);
      updatedData.splice(newIndex, 0, movedItem);

      handleUpdatedList(updatedData);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={listItem.map(keyExtractor)}
        strategy={verticalListSortingStrategy}>
        <div
          style={Object.assign(
            {
              maxHeight: '100%',
              overflowY: 'auto',
              paddingBottom: 100,
            },
            style,
          )}>
          {listItem.map((item, index) => (
            <SortableItem key={keyExtractor(item)} id={keyExtractor(item)}>
              {renderItem({ item, index })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ScrollableDragList;
