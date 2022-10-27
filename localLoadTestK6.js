import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 700,
  duration: '60s',
};
export default function () {
  http.get('http://localhost:28100/census/maps');
  sleep(1);
}