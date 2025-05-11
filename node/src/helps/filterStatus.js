
const filter =(query)=>{
   let  filterStatus= [
        {
           name:"Tat ca",
           status:"",
           class:""
        },
        {
           name:"Hoat dong",
           status :"active",
           class:""
        },
        {
           name:"Dung hoat dong",
           status :'inactive',
           class :""
        }
    ];
    
    
    
       if(query){
           const index= filterStatus.findIndex(item =>item.status==query);
           filterStatus[index].class="active"
       }else{
            const index= filterStatus.findIndex(item =>item.status=="");
           filterStatus[index].class="active"
       }
       return filterStatus;
}

module.exports =filter;


