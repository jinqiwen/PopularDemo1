import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';
export var FLAG_STORAGE={flag_popular:'popular',flag_trending:'trending',flag_my:'my'}


/**
 * 此Dao用于热门，趋势，收藏模块的收藏和取消收藏
 */
//设置前缀，防止和其他标示冲突
const FAVORITE_KEY_PREFIX='favorite_';
export default  class FavoriteDao{
    constructor(flag) {
        this.flag =flag;
        this.favoriteKey =FAVORITE_KEY_PREFIX + flag;

    }

    /**
     * 收藏项目，保存收藏的项目
     * @param key
     * @param value
     * @param callback
     */
    saveFavoriteItem(key,value,callback){
     /*   alert('收藏成功 key '+ key+'value'+value);*/
        AsyncStorage.setItem(key,value,(error)=>{
            if(!error){
                this.updateFavoriteKeys(key,true);//收藏
            }
        })
    }

    /**
     * 更新FavoriteKeys集合
     * @param key
     * @param isAdd   true添加，false删除
*/
    updateFavoriteKeys(key,isAdd){
        //首先将用户操作的所有的key的集合拿出来。用户可以一下点了多个收藏
        AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
            if(!error){
                var favoriteKeys=[];//定义用户已经收藏过的集合
                if(result){//result不等于空
                    favoriteKeys=JSON.parse(result);
                }

                var index= favoriteKeys.indexOf(key);//找到用户这次点击的key 是否在已收藏的队列中
                if(isAdd){//如果是添加
                   if(index===-1){//代表用户之前没有收藏过
                       favoriteKeys.push(key)
                   }else{//如果是删除
                       if(index!==-1){
                           favoriteKeys.splice(index,1);
                       }
                   }
                    //注意存入到数据库中的数据要序列化（stringify）
                    // alert(this.favoriteKey+'----'+favoriteKeys);
                    AsyncStorage.setItem(this.favoriteKey,JSON.stringify(favoriteKeys))//将操作过的key的集合再保存到数据库中

                }
            }
        })
    }

    /**
     * 获取收藏项目对应的key
     * @returns {Promise<any> | Promise}
     */
   getFavoriteKeys(){
        return new Promise((resolve ,reject)=>{
            AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    }catch (e) {
                         reject(e);
                    }
                }else{
                    reject(error);
                }
            })
        })
   }
    /**
     * 取消收藏，移除已经收藏过的项目
     * @param key
     */
    removeFavoroteItem(key){
        AsyncStorage.removeItem(key,(error)=>{
            if(!error){
                this.updateFavoriteKeys(key,false);//删除
            }
        })
    }

    /**
     * 获取所有收藏过的项目
     * @returns {Promise<any> | Promise}
     */
    getAllItems(){
        return new Promise((resolve,reject)=>{
            //获取用户收藏的key的集合
            this.getFavoriteKeys().then((keys)=>{
                var items=[];
                if(keys){
                    AsyncStorage.multiGet(keys,(err,stores)=>{
                        try{
                            stores.map((result,i,store )=>{
                                let key=store[i][0];
                                let value=store[i][1];
                                if(value)items.push(JSON.parse(value));
                            });
                            resolve(items);
                        }catch (e) {
                            reject(e);
                        }
                    })
                }else{
                    resolve(items);
                }
            }).catch((e)=>{
                reject(e);
            })
        })
    }
    


}