import getServerUri from './getServerUri'
export type TApiRequest =[ string, RequestInit?]
export default (...[path, arg]: TApiRequest) => fetch(`${getServerUri()}/${path}`, arg)