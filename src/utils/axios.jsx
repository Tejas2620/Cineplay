import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTFmMzM3NzA3OWMwN2FjN2NhYWQwZTRmMzM2OGQwMCIsIm5iZiI6MTc0NDg3ODM4NC44MTksInN1YiI6IjY4MDBiYjMwZGU1ZTRkZWM2MmFlZWYxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tuY5judNNZO46p0LLpPb0gWsoPmaZS5OYpskLInk5Vo',
  },
});

export default instance;
