import { v4 as uuidv4 } from 'uuid';

const getUserUUID = () => {
  let userUUID = localStorage.getItem('userUUID');
  if (!userUUID) {
    userUUID = uuidv4();
    localStorage.setItem('userUUID', userUUID);
  }
  return userUUID;
};

export default getUserUUID;
