import axios from 'axios';
import cookies from 'js-cookie';

export const API_URL = 'http://134.122.90.94:3223';

export const fetcher = async (path) => {
  const { data } = await axios.get(path, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')}`,
    },
  });

  return data;
};

export const post = (url, data, options = {}) => {
  return axios.post(url, data, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')}`,
    },
    ...options,
  });
};