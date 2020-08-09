import api from './api'
export default (userId: string, channelId: string) => {
  let rawUsers = localStorage.getItem('users')
  if (!rawUsers) {
    console.log('rawUsers does\'nt exist on LocalStorage. make new user data.')
    localStorage.setItem('users', '[]')
    rawUsers = '[]'
  }
  
  const users = JSON.parse(rawUsers)
  console.log(users)
  // console.log(users.filter(e => e.id === userId))
}