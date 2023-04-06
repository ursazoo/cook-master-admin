import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Avatar,
  Upload,
  Descriptions,
  Tag,
  Skeleton,
  Link,
} from '@arco-design/web-react';
import { IconCamera, IconPlus } from '@arco-design/web-react/icon';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/header.module.less';
import { selectUserInfo } from '@/store/userSlice';
import dayjs from 'dayjs';

export default function Info({ loading }: { loading: boolean }) {
  const t = useLocale(locale);
  const userInfo = useSelector(selectUserInfo);

  const [avatar, setAvatar] = useState('');

  function onAvatarChange(_, file) {
    setAvatar(file.originFile ? URL.createObjectURL(file.originFile) : '');
  }

  useEffect(() => {
    setAvatar(userInfo?.avatar);
  }, [userInfo]);

  const loadingImg = (
    <Skeleton
      text={{ rows: 0 }}
      style={{ width: '100px', height: '100px' }}
      animation
    />
  );

  const loadingNode = <Skeleton text={{ rows: 1 }} animation />;
  return (
    <div className={styles['info-wrapper']}>
      <Upload showUploadList={false} onChange={onAvatarChange}>
        {loading ? (
          loadingImg
        ) : (
          <Avatar
            size={100}
            triggerIcon={<IconCamera />}
            className={styles['info-avatar']}
          >
            {avatar ? <img alt="avatar" src={avatar} /> : <IconPlus />}
          </Avatar>
        )}
      </Upload>
      <Descriptions
        className={styles['info-content']}
        column={2}
        colon="："
        labelStyle={{ textAlign: 'right' }}
        data={[
          {
            label: '用户名',
            value: loading ? loadingNode : userInfo?.name,
          },
          {
            label: t['userSetting.label.verified'],
            value: loading ? (
              loadingNode
            ) : (
              <span>
                {userInfo?.verified ? (
                  <Tag color="green" className={styles['verified-tag']}>
                    {t['userSetting.value.verified']}
                  </Tag>
                ) : (
                  <Tag color="red" className={styles['verified-tag']}>
                    {t['userSetting.value.notVerified']}
                  </Tag>
                )}
                <Link role="button" className={styles['edit-btn']}>
                  {t['userSetting.btn.edit']}
                </Link>
              </span>
            ),
          },
          {
            label: t['userSetting.label.accountId'],
            value: loading ? loadingNode : userInfo?.account,
          },
          {
            label: t['userSetting.label.phoneNumber'],
            value: loading ? (
              loadingNode
            ) : (
              <span>
                {userInfo?.phoneNumber}
                <Link role="button" className={styles['edit-btn']}>
                  {t['userSetting.btn.edit']}
                </Link>
              </span>
            ),
          },
          {
            label: t['userSetting.label.registrationTime'],
            value: loading
              ? loadingNode
              : dayjs(userInfo?.createdTime).format('YYYY-MM-DD HH:mm'),
          },
        ]}
      ></Descriptions>
    </div>
  );
}
