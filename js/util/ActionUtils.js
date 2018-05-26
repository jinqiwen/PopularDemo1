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

}