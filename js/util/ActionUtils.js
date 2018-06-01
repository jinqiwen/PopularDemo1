import RepositoryDetail from '../page/RepositoryDetail'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'

export default  class ActionUtils{
    /**
     * 跳转到详情页
     * @param params
     */
    static onSelecRepository(params){
        var {naivigation}= params;
        naivigation.navigate('RepositoryDetail',{
           params:{
               ...params
           }
        });

    }

    /**
     * favorite单击回调函数
     * @param favoriteDao
     * @param item
     * @param isFavorite
     * @param flag
     */
    static onFavorite(favoriteDao,item,isFavorite, flag){
        var key= flag ===FLAG_STORAGE.flag_trending?item.fullName:item.id.toString();
        if(isFavorite){
            favoriteDao.saveFavoriteItem(key,JSON.stringify(item))
        }else {
            favoriteDao.removeFavoroteItem(key);
        }
    }


}