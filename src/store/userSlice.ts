import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: JSON.parse(localStorage.getItem('user-info')) || null,
    permissions: {},
  },
  reducers: {
    setUserInfo: (state, action) => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // 并不是真正的改变 state 因为它使用了 immer 库
      // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的
      // 不可变的 state
      state.userInfo = action.payload;
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    // decrement: state => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // }
  },
});

export const { setUserInfo, setPermissions } = userSlice.actions;
export const selectUserInfo = (state) => state.user.userInfo;

export const selectPermissions = (state) => state.user.permissions;

export default userSlice.reducer;
