(function(){
	ua=[];
	ul=ulist.length;
	ll=0;
	for(i=ul;i--;){
		tb=ulist[i].number-1000;
		if(null!=tb&&0<tb&&1000>tb){
			if(0==ll){
				ll=tb;
			}
			bs=Math.floor(tb/50);
			if(null==ua[bs]){
				ua[bs]=0;
			}
			ua[bs]+=1;
		}
	}
	for(j=ua.length;j--;){
		n=(50-ua[j])/50*100;
		console.log(50*j+"から"+(50*(j+1)-1)+"までの離職率: "+n.toFixed(2)+"%");
	}
	t=(ll-ul)/ll*100;
	console.log("全体の離職率: "+t.toFixed(2)+"%");
})();