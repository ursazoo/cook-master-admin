import React, { useMemo } from 'react';
// import { GlobalState } from '@/store';
import { useSelector } from 'react-redux';
import authentication, { AuthParams } from '@/utils/authentication';
import { selectPermissions, selectUserInfo } from '@/store/userSlice';

type PermissionWrapperProps = AuthParams & {
  backup?: React.ReactNode;
};

const PermissionWrapper = (
  props: React.PropsWithChildren<PermissionWrapperProps>
) => {
  const { backup, requiredPermissions, oneOfPerm } = props;
  const userInfo = useSelector(selectUserInfo);
  const permissions = useSelector(selectPermissions);

  const hasPermission = useMemo(() => {
    return authentication({ requiredPermissions, oneOfPerm }, permissions);
  }, [oneOfPerm, requiredPermissions, permissions]);

  if (hasPermission) {
    return <>{convertReactElement(props.children)}</>;
  }
  if (backup) {
    return <>{convertReactElement(backup)}</>;
  }
  return null;
};

function convertReactElement(node: React.ReactNode): React.ReactElement {
  if (!React.isValidElement(node)) {
    return <>{node}</>;
  }
  return node;
}

export default PermissionWrapper;
