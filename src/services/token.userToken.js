import { jwtDecode } from 'jwt-decode';

export const Usertoken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    return {
      userid : decodedToken.userid,
      username: decodedToken.username,
      fullname: decodedToken.fullname,
      email: decodedToken.email,
      nic: decodedToken.nic,
      jobrole: decodedToken.jobrole,
      contactno: decodedToken.contactno,
      address: decodedToken.address,
      city: decodedToken.city,
      loginflag: decodedToken.loginflag,
      imageUrl: decodedToken.imageUrl
    };
  }
  return null;
};
