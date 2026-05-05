'use client';
import React from 'react';
import { Card } from 'antd';
import { Module } from '~mdDashboard/redux/saga/type';
import './styles.scss';

type ModuleItemProps = {
  data: Module;
  onClick?: () => void;
  haveMenu?: boolean;
  className?: string;
};
const ModuleItem: React.FC<ModuleItemProps> = ({
  data,
  onClick,
  className,
}) => {
  return (
    <>
      <Card
        className={`container ${className}`}
        onClick={onClick}
        title={data.title}>
        <div key="Library" className="title">
          Total Libraries: {data.libraries.length}
        </div>
      </Card>
    </>
  );
};

export default ModuleItem;
