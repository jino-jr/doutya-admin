const { default: axios } = require("axios");

const SetDemoPage = () => axios.get('/auth/api/demoPage');

const RegisterUser = (data) => axios.post('/auth/api/registerUser', data);

const LoginAdmin = (data) => axios.post('/auth/api/loginAdmin', data);

const GetAllChallenges = ()=> axios.get('/home/api/getChallenges');

const GetAllTasks = ()=> axios.get('/home/api/getTasks');

// const GetTask = (id, token)=> axios.get(`/home/api/getTask/${id}`);


const GetTask = (id, token) => {

    return axios.get(`/home/api/getTask/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

const GetChallenge = (token) => {

  return axios.get(`/home/api/getChallenge`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetAllUsers = (token) => {

  return axios.get(`/home/api/getAllUsers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const GetUserData = (id, token) => {

  return axios.get(`/home/api/getUserDetail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const GetTableData = (id, token) => {

  return axios.get(`/home/api/getTableData/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};




export default {

    LoginAdmin,
    RegisterUser,
    GetAllChallenges,
    SetDemoPage,
    GetAllTasks,
    GetTask,
    GetTableData,
    GetChallenge,
    GetAllUsers,
    GetUserData
}   