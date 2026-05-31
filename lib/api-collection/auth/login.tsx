import axios from 'axios';

export default function login(data: any) {
  return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, data);
}
