import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending'
export var FLAG_STORAGE={flag_popular:'popular',flag_trending:'trending',flag_my:'my'}
import {FLAG_LANGUAGE} from "./LanguageDao";
export default  class DataRepository{
    constructor(flag) {
        this.flag = flag;
         if(flag===FLAG_STORAGE.flag_trending)this.trending=new GitHubTrending();

    }
    /**
     * 数据获取策略（先本地，后远程）
     * @param url
     */
    fetchRepository(url){
    /*   return new Promise((resolve,reject)=>{
           this.fetchLocalRepository(url).then((wrapData)=>{
               if(wrapData){
                   resolve(wrapData,true);
               }else{
                   this.fetchNetRepository(url).then((data)=>{
                       resolve(data);
                   }).catch((error)=>{
                       reject(error);
                   })
               }
           }).catch((error)=>{
               this.fetchNetRepository(url).then((data)=>{
                   resolve(data);
               }).catch((error=>{
                   reject(error);
               }))
           })
       })*/
        return new Promise((resolve, reject)=> {
            this.fetchLocalRepository(url).then((wrapData)=> {
                if (wrapData) {
                    resolve(wrapData, true);
                } else {
                    this.fetchNetRepository(url).then((data)=> {
                        resolve(data);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                this.fetchNetRepository(url).then((data)=> {
                    resolve(data);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }
    /**
     * 获取本地数据库内容
     * @param url 请求地址
     * @returns {Promise<any> | Promise}
     */
    fetchLocalRepository(url){
     return new Promise((resolve,reject)=>{
         AsyncStorage.getItem(url,(error,result)=>{
             if(!error){
                  try{
                      resolve(JSON.parse(result))
                  }catch (e) {
                      reject(e);
                      console.error(e);
                  }
             }else{
                 reject(error);
                 console.error(error);
             }

         })
     })
    }

    /**
     * 将远程获取到的内容存储到本地
     * @param url 请求地址
     * @param items 获取到的内容
     * @param callback
     */
    saveRepository(url,items,callback){
    if(!items||!url)return;
    let wrapData;
    if(this.flag===FLAG_STORAGE.flag_my){
    wrapData={item:items,update:new Date().getTime()};
    }else {
        wrapData={item:items}
    }
    AsyncStorage.setItem(url,JSON.stringify(wrapData),callback);
    }
    /**
     * 远程获取内容,并且保存到本地数据库中
     * @param url 请求地址
     * @returns {Promise<any> | Promise}
     */
     fetchNetRepository(url){
         return new Promise((resolve,reject)=>{
             if(this.flag===FLAG_STORAGE.flag_trending){
                 this.trending.fetchTrending(url)
                     .then(result=>{
                         if(!result){
                             reject(new Error('response is null'))
                         }
                         this.saveRepository(url,result);
                          resolve(result);
                     })
             }else {
                 fetch(url)
                     .then(response => response.json())
                     .then(result => {
                         if (!result) {
                             reject(new Error('responseData is null'));
                             return
                         }
                         this.saveRepository(url, result.items);
                         resolve(result)
                     })
                     .catch(error => {
                         reject(error)
                     })
             }
         })

     }
    /**
     * 时间检查函数，用于检查数据是否过时(自定义)
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */
    checkData(longTime){
         let cDate=new Date();
         let tDate=new Date()
        tDate.setTime(longTime);
         if(cDate.getMonth()!==tDate.getMonth())return false;
         if(cDate.getDay()!==tDate.getDay())return false;
         if(cDate.getHours()-tDate.getHours()>4) return false;
         return true;

     }
}