(function(){
	ua=[];
	ul=ulist.length;
	ll=0;
	yl=0;
	yc=0;
	es=20;
	log='';
	for(i=ul;i--;){
		tb=ulist[i].number;
		if(null!=tb&&tb<2000){
			if(tb<1000) {
				tb*=1;
				if(0==yl) yl=tb;
				yc++;
			} else {
				tb-=1000;
			}
			if(0==ll) ll=tb;
			bs=Math.floor((tb-1)/es);
			if(null==ua[bs]) ua[bs]=0;
			ua[bs]+=1;
		}
	}
	for(j=ua.length;j--;){
		em=((es*(j+1))>ll)?(ll-es*j):es;
		n=(em-ua[j])/em*100;
		log+=((es*j)+1)+"から"+((es*j)+em)+"までの離職率: "+n.toFixed(2)+"%"+"\n";
	}
	t=(ll-ul)/ll*100;
	log+="全体の離職率: "+t.toFixed(2)+"%"+"\n";
console.log(yc+" "+yl);
	t=yc/yl*100;
	log+="取締役の離職率: "+t.toFixed(2)+"%"+"\n";
	console.log(log);
	alert(log);
})();