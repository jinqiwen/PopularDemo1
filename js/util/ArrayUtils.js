export default  class  ArrayUtils{
    /*
     * 更新数组，若item已存在则从数组中将他移除， 否则添加数组
     */

    static updateArray(array,item){
        for(var i=0,len=array.length;i<len;i++){
            var temp =array[i];
            //如果用户的选择记录中包含此时点击的项，代表此时用户不想再收藏，所有在用户记录中删除此项

            if(temp===item){
                array.splice(i,1);
                return;
            }

        }
        array.push(item);
    }

    /**
     *
     * @param 数组
     * @return Array 新的数组
     */
    static clone(data){
    if(!data) return [];
    let newArray=[];
    for(let i=0,l=data.length;i<l;i++){
        newArray[i]=data[i];
    }
    return  newArray;
    }

    /**
     * 判断俩个数组是否相等
     * @param arr1
     * @param arr1
     */
   static isEqual(arr1,arr2){
        if(!(arr1&&arr2))return false;
        if(arr1.length!=arr2.length) return false;
        for(let i=0,l=arr1.length;i<l;i++){
            if(arr1[i]!=arr2[i])return false;
        }
        return true;
    }

    /**
     * 将数组中的指定元素移除
     * @param array
     * @param item
     */
    static remove(array,item){
     if(!array)return ;
     for(var i= 0,l=array.length;i<l;i++){
         if(item===array[i])array.splice(i,1);
     }
    }
}