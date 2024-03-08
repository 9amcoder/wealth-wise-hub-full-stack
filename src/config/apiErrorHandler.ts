import { AxiosError } from 'axios';

interface ErrorResponse {
  error: string;
}

const handleApiError = (error:AxiosError ) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
  
      const statusCode = error.response.status;
      const data = error.response.data as ErrorResponse;

      switch (statusCode) {
        case 400:
          return `400: ${data.error}`;
        case 401:
          return `401: ${data.error}`;
        case 403:
          return `403: ${data.error}`;
        case 404:
          return `404: ${data.error}`;
        // Add more cases for other status codes as needed
        default:
          return `Error: ${statusCode} - An unexpected error occurred.`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from the server.';
    } else {
      // Something happened in setting up the request that triggered an Error
      return `Error: ${error.message}`;
    }
  };

  export default handleApiError;