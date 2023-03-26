import React, { useState, useEffect } from 'react';
import { Card, Form, Typography, Message } from '@arco-design/web-react';

import { useRequest } from 'ahooks';
import {
  createBaseMaterial,
  editBaseMaterial,
  getBaseMaterialList,
} from '@/common/apis/material/base';

const { Title, Paragraph } = Typography;

function DashboardPage() {
  //

  const { run: handleCreateBaseMaterial } = useRequest(createBaseMaterial, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        Message.success(result?.message);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <Card>
      <Title heading={6}>总览</Title>
      {/* <SearchForm
        onSearch={handleSearch}
        primaryMaterialList={primaryMaterialList}
      /> */}
    </Card>
  );
}

export default DashboardPage;
