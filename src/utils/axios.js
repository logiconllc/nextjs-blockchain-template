import axios from "axios";
const ApiConnection = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_APP_URL,
});

export default ApiConnection;