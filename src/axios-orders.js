import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-shop-a988.firebaseio.com/'
})

export default instance;