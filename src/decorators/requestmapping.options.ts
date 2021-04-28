import { Methods } from './requestmethod.decorator';
export interface RequestOptions{
    url : string,
    method : Methods,
    authenticated? : boolean
}