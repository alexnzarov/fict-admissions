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

export const getAuth = (op) => {
  return op ? `Basic ${cookies.get('local.token')} ${getOperator() ?? 0}` : `Basic ${cookies.get('local.token')}`;
};

export const fetch = async (path) => {
  const { data } = await axios.get(path, {
    headers: {
      Authorization: getAuth(false),
    },
  });

  return data;
};

export const post = (url, data, options = {}, op = true) => {
  return axios.post(url, data, {
    headers: {
      Authorization: getAuth(op),
    },
    ...options,
  });
};

export const put = (url, data, options = {}, op = true) => {
  return axios.put(url, data, {
    headers: {
      Authorization: getAuth(op),
    },
    ...options,
  });
};

const deleteRequest = (url, options = {}, op = true) => {
  return axios.delete(url, {
    headers: {
      Authorization: getAuth(op),
    },
    ...options,
  });
};

export { deleteRequest as delete };
