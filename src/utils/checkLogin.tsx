import Cookies from 'js-cookie';

export default function checkLogin() {
  return Cookies.get('Authorization');
}
