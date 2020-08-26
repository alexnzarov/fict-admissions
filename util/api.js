import axios from 'axios';
import cookies from 'js-cookie';

export const TEMPLATE_API = process.env.NEXT_PUBLIC_TEMPLATE_API;
export const QUEUE_API = process.env.NEXT_PUBLIC_QUEUE_API;

export const askOperator = () => {
  if (!process.browser) { return; }

  const value = parseInt(window.prompt('Введіть ваш номер оператора', getOperator() ?? ''));

  if (Number.isSafeInteger(value) && value > 0) {
    setOperator(value);
    return value;
  }

  return askOperator();  
};

export const getOperator = () => process.browser ? (localStorage.getItem('local.operator') ?? null) : null;

export const setOperator = (str) => localStorage.setItem('local.operator', str);

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
      Authorization: `Basic ${cookies.get('local.token')} ${getOperator() ?? 0}`,
    },
    ...options,
  });
};

export const put = (url, data, options = {}) => {
  return axios.put(url, data, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')} ${getOperator() ?? 0}`,
    },
    ...options,
  });
};

const deleteRequest = (url, options = {}) => {
  return axios.delete(url, {
    headers: {
      Authorization: `Basic ${cookies.get('local.token')} ${getOperator() ?? 0}`,
    },
    ...options,
  });
};

export { deleteRequest as delete };
