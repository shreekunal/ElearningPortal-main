export const Front_Port = 7000;
export const Back_Port = 3008;
export const Front_Origin = `http://localhost:${Front_Port}`;
export const Back_Origin = `http://localhost:${Back_Port}`;

const Front_ENV = {
  Front_Port,
  Back_Port,
  Front_Origin,
  Back_Origin,
};

export default Front_ENV;
