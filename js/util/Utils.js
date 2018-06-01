export default  class Utils{
    /**
     * 检查该item 有没有被收藏过
     * @param item
     * @param items
     * @returns {boolean} true 代表收藏过
     */
     static checkFavorite(item,items){
         //由于热门模块是id作为标示符，在趋势中是fullName作为唯一标示符
          let id =item.id?item.id.toString():item.fullName;
          for(var i=0,len=items.length ;i<len;i++){
              if(id===items[i]){
                  return true;
              }
          }
          return false;
     }
}