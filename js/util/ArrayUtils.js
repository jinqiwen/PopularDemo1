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
}