import { Methods } from './types/method';
export interface RequestOptions{
    url : string,
    method : Methods,
    authenticated? : boolean
}