import axios from 'axios';
import queryString from 'query-string';
import { CryptocurrencyInterface, CryptocurrencyGetQueryInterface } from 'interfaces/cryptocurrency';
import { GetQueryInterface } from '../../interfaces';

export const getCryptocurrencies = async (query?: CryptocurrencyGetQueryInterface) => {
  const response = await axios.get(`/api/cryptocurrencies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCryptocurrency = async (cryptocurrency: CryptocurrencyInterface) => {
  const response = await axios.post('/api/cryptocurrencies', cryptocurrency);
  return response.data;
};

export const updateCryptocurrencyById = async (id: string, cryptocurrency: CryptocurrencyInterface) => {
  const response = await axios.put(`/api/cryptocurrencies/${id}`, cryptocurrency);
  return response.data;
};

export const getCryptocurrencyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/cryptocurrencies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCryptocurrencyById = async (id: string) => {
  const response = await axios.delete(`/api/cryptocurrencies/${id}`);
  return response.data;
};
