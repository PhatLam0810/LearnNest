import React from 'react';
import { Module } from '~mdDashboard/redux/saga/type';
import './styles.scss';

type DragModuleItemProps = {
  data: Module;
};
const DragModuleItem: React.FC<DragModuleItemProps> = ({ data }) => {
  return (
    <button className="container">
      <div className="title">{data.title}</div>
      <div className="sub-title">{data.durations}</div>
      <div className="sub-title">Total SubLesson {data.subLessons.length}</div>
    </button>
  );
};

export default DragModuleItem;
