//公共js函数库
function ismoney(v){
	var userreg=/^[1-9]{1}\d*([.]{1}[0-9]{1,2})?$/; 
	var userreg2=/^[0-9]{1}([.]{1}[0-9]{1,2})?$/; 
	return userreg.test(v)||userreg2.test(v)?1:0;
}

var money_words="零壹贰叁肆伍陆柒捌玖";
var money_subunits="角分";
var money_units="元拾佰仟万拾佰仟亿拾佰仟万";

function num2word(num){
	//判定num为钱数ismoney
	var strnum=num+"";
	if(!ismoney(strnum))return "";
	
	arr=strnum.split(".");
	if(arr.length>1){
		rs=getintegerword(arr[0])+getdecimalword(arr[1]);
	}
	else{
		rs=getintegerword(arr[0]);
	}
	return rs+"整";
}

function getdecimalword(strnum){
	if(1==strnum.length)strnum+="0";
	var tmp="";
	for(i=0;i<2;i++){
		tnum=strnum.substr(i,1);
		if(0==i){
			if("0"==tnum){
				tmp+=money_words.substr(tnum,1);
				continue;
			}
		}
		
		if(1==i){
			if("0"==tnum){
				if(tmp==money_words.substr(0,1)){
					return "";
				}
				else{
					return tmp;
				}
			}
		}
		tmp+=money_words.substr(tnum,1)+money_subunits.substr(i,1);
	}
	return tmp;
}

function getintegerword(strnum){
	var tmp="";
	for(i=strnum.length-1;i>=0;i--){
		tnum=strnum.substr(strnum.length-i-1,1);
		if(0==i%4){
			//删除前零
			haszero=false;
			while(tmp.substr(tmp.length-1,1)==money_words.substr(0,1)){
				tmp=tmp.substr(0,tmp.length-1);
				haszero=true;
			}
			if("0"!=tnum && haszero){
				tmp+=money_words.substr(0,1);
			} 
		}
		
		if("0"==tnum){
			if(0==i%4){
				tmp+=money_units.substr(i,1);
			}
			else{
				tmp+=money_words.substr(tnum,1);
			}
		}
		else{
			tmp+=money_words.substr(tnum,1)+money_units.substr(i,1);
		}
	}
	if(tmp==money_units.substr(0,1)){
		tmp=money_words.substr(0,1)+tmp;
	}
	return tmp;
}

function addcomma(num){
	strnum=num+"";
	if(!ismoney(strnum))return "";
	
	arr=strnum.split(".");
	strnum=arr[0];
	var tmp="";
	count=0;
	for(i=strnum.length-1;i>=0;i--){
		if(count>0 && 0==count%3){
			tmp=","+tmp;
		}
		tnum=strnum.substr(i,1);
		tmp=tnum+tmp;
		count++;
	}
	tmp="￥"+tmp;
	if(arr.length>1){
		return tmp+"."+arr[1];
	}
	else{
		return tmp;
	}
}