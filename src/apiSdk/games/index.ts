import axios from 'axios';
import queryString from 'query-string';
import { GameInterface, GameGetQueryInterface } from 'interfaces/game';
import { GetQueryInterface } from '../../interfaces';

export const getGames = async (query?: GameGetQueryInterface) => {
  const response = await axios.get(`/api/games${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGame = async (game: GameInterface) => {
  const response = await axios.post('/api/games', game);
  return response.data;
};

export const updateGameById = async (id: string, game: GameInterface) => {
  const response = await axios.put(`/api/games/${id}`, game);
  return response.data;
};

export const getGameById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/games/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGameById = async (id: string) => {
  const response = await axios.delete(`/api/games/${id}`);
  return response.data;
};
