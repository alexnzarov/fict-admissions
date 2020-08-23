import axios from 'axios';
import cookies from 'js-cookie';

export const TEMPLATE_API = process.env.NEXT_PUBLIC_TEMPLATE_API;
export const QUEUE_API = process.env.NEXT_PUBLIC_QUEUE_API;

export const fetch = async (path) => {
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

export const put = (url, data, options = {}) => {
  return axios.put(url, data, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')}`,
    },
    ...options,
  });
};

const deleteRequest = (url, options = {}) => {
  return axios.delete(url, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')}`,
    },
    ...options,
  });
};

export { deleteRequest as delete };
