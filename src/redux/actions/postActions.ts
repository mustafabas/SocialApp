
import { Dispatch } from "redux";
import { fetchImageService } from "../services/user";
import { LOGIN_LOADING, UPDATE_LOCATION, GET_POSTS, GET_POSTS_LOADING, CREATE_POST } from "../../constants/actionConstants";
import { showSimpleMessage } from "../../components/showMessage";
import axios from "../services/axiosBase";
import { API_GET_POSTS_BY_LOCATIONS, API_CREATE_POST } from "../../constants/apiConstants";
import { strings, errorMessages } from "../../constants/Localizations";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "../services/NavigationService";
import { NavigationEvents } from "react-navigation";


export interface IPOST {
    title: string;
    active: boolean;
    longitude: number;
    created_date: string;
    updated_date: string;
    latitude: number;
    user_id: number;
    distance_km: number;
    id: number;
    user_name : string;
}


export function createPost(lat : number , long :number ,title: string) {
    return (dispatch: any) => {

        dispatch(loadingCreatePost(true))
        // console.log( axios.defaults.headers)
        axios().post(API_CREATE_POST, {
            latitude: lat,
            longitude: long,
            title: title,
            userId: global.USER_ID
        }).then((res) => {
            console.log(res)
            dispatch(loadingCreatePost(false))
            if(res.data.isSuccess) {
                showSimpleMessage(strings.createPostSucceed,"success");
                dispatch(getPostByLocations(lat,long));
                NavigationService.navigate('Home')
            }
            else {
                showSimpleMessage(strings.createPostUnSucceed,"danger");

            }
            
        }
        ).catch(e => {
            console.log(e)
            dispatch(loadingCreatePost(false))
            showSimpleMessage(strings.createPostUnSucceed,"danger");

        })



    };
}
 export function getPostByLocations(lat: number, long: number) {
    return (dispatch: Dispatch) => {

        dispatch(loading(true))
        axios().get(API_GET_POSTS_BY_LOCATIONS + `?latitude=${lat.toString()}&longtitude=${long.toString()}&userId=${global.USER_ID}`, {

        }).then((res) => {
            dispatch(loading(false));
            console.log(res, "res")
            if (res.data.isSuccess && res.data.result && res.data.result.length > 0) {
                var list = [];

                res.data.result.forEach((element: IPOST) => {
                    list.push({
                        title: element.title,
                        active: element.active,
                        longitude: element.latitude,
                        created_date: element.created_date,
                        updated_date: element.updated_date,
                        latitude: element.latitude,
                        user_id: element.user_id,
                        distance_km: element.distance_km,
                        id: element.distance_km,
                        user_name : element.user_name
                    })

                });
                dispatch(getPostsSucceed(list));



            } else {
                dispatch(loading(false))


            }
        }
        ).catch(e => {
            console.log(e)
            dispatch(loading(false))

        })



    };
}





export const loadingCreatePost = (loader: boolean) => ({
    type: CREATE_POST,
    payload: loader
});



export const getPostsSucceed = (list: IPOST[]) => ({
    type: GET_POSTS,
    payload: list
})

export const loading = (loader: boolean) => ({
    type: GET_POSTS_LOADING,
    payload: loader
});
