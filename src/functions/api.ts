import getServerUri from './getServerUri'
export default (path: string, arg?: RequestInit) => fetch(`${getServerUri()}/${path}`, arg)