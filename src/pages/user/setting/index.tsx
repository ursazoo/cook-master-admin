import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Tabs } from '@arco-design/web-react';
import InfoHeader from './header';
import InfoForm from './info';
import Security from './security';
// import './mock';
// import Verified from './verified';

function UserInfo() {
  const loading = useSelector((state: any) => state.userLoading);
  const [activeTab, setActiveTab] = useState('basic');
  return (
    <div>
      <Card style={{ padding: '14px 20px' }}>
        <InfoHeader loading={loading} />
      </Card>
      <Card style={{ marginTop: '16px' }}>
        <Tabs activeTab={activeTab} onChange={setActiveTab} type="rounded">
          <Tabs.TabPane key="basic" title={'基本设置'}>
            <InfoForm loading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane key="security" title={'安全设置'}>
            <Security />
          </Tabs.TabPane>
          {/*<Tabs.TabPane key="verified" title={t['userSetting.label.verified']}>*/}
          {/*  <Verified />*/}
          {/*</Tabs.TabPane>*/}
        </Tabs>
      </Card>
    </div>
  );
}

export default UserInfo;
