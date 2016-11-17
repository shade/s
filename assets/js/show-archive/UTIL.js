/*
*	UTIL UTIL
*	This is the main module, it defines what all other modules should contain
*	Also, any helper/utility functions should be here.
*/

UTIL	=	{
	helper	:	{
		color	:	{},
		localStorage	:	{}
	}
}



/*
*	UTIL Helper Color	:	 The module used to create uniform color
*
*		@method	bgColor	->	Outputs a hex for a bright, cool, background color based on a string seed
*			@param {String}	seed	
*/
var AVG_CONSTANT = 225;	

var COLORS = [
	'#D64541',
	'#663399',
	'#4183D7',
	'#26A65B',
	'#F2784B',
	'#F5AB35',
	'#019875'
]
var used =  {}

UTIL.helper.color   =   (function(UTIL){
		return {
			bgColor:function(seed){
				if (!used[seed]) {
					used[seed] = COLORS[Object.keys(used).length]
				}
				return used[seed]
				//return randomColor({luminosity:"normal",format:"hex",seed:parseInt(seed,36)});           
			}
		};
})(UTIL);


/*
*	UTIL Helper Element	:	The module used to help making HTML elements
*	
*		@method	editStyle	->	changes multiple styles for a provided element
*			@param	{Node}	element
*			@param	{JSON Object}	// Accepts input as {style:'value',color:'green'...}
*
*		@method create	->	creates an html of the provided type with attributes
*			@param	{String}	type	//	e.g. 'div'
*			@param	{JSON Object}	attributes //	If html is provided, the inner html is replaced with the value
*/

UTIL.helper.element =  (function(UTIL){
		return {
				editStyle:function(element,styles){
						for(var attributes in styles)
								element.style[attributes]=styles[attributes];
				},
				create:function(type,attributes){
						var element =   document.createElement(type);
						if(attributes.html!==undefined){
							element.innerHTML	=	attributes.html;
							delete attributes.html;
						}
						for(var attributeName in attributes)
								element.setAttribute(attributeName,attributes[attributeName]);
						return element;
				}
		}
})(UTIL);


/*
*	UTIL Helper Time	:	The module used to help with dealing with time
*
*		@method convert -> converts the time in minutes to a standard HH:MM am/pm
*			@param {Integer} time
*
*		@method	inTime	->	checks if 2 timeblocks intersect
*			@param	{Integer}	start	//The starting time (in minutes) of the first time block
*			@param	{Integer}	end
*			@param	{Integer}	start2
*			@param	{Integer}	end2
*
*		@method	sameDay	->	checks if 2 day arrays intersect in anyway
*			@param	{Array}	day1	//	accepts the days in an array as 0,1,2 for Monday,Tuesday,Wednesday respectively
*			@param	{Array}	day2
*/
UTIL.helper.time	=	(function(UTIL){
	return {
		convert:function(time){
			var hours = (~~(time/60)%12||12).toFixed(0);
			var minutes = (time%60).toFixed(0);
			minutes = (minutes === '0'?'00':minutes);
			var ampm = (time>720?'pm':'am');
			
			return hours+':'+minutes+' '+ampm;
		},
		inTime:function(start,end,start2,end2){
				if(start==0||start2==0)
						return false;
				if((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
						return true;
				return false;
		},
		sameDay:function(day1,day2){
				if(day1[0]==-1||day2[0]==-1)
								return false;
				for (var i = 0; i < day1.length; i++) {
						if (day2.indexOf(day1[i]) > -1) {
								return true;
						}
				}
				return false;
		}
	};
})(UTIL);


/*
*	UTIL Helper Array	:	Module used to help with array manipulation
*	
*		@method	hasFieldValue	->	searches an array of json objects for a field with a certain value
*															returns false if not found, or the json element if found
*			@param	{Array}	array		//	the array of JSON Objects
*			@param	{String}	field	//	the name of the json field
*			@param	{Mixed}	value		//	the value of the field
*
*		@method uniq	->	removes any duplicates in an array
*
*			@param	{Array}	array	//the array that needs uniqifying
*
*/

UTIL.helper.array	=(function(UTIL){
	return {
		hasFieldValue:function(array,field,value){
			for(var i = 0;i<array.length;i++){
				if(array[i][field]==value)
					return array[i];
			}
			return false;
		},
		uniq:function(array){
		
		 var u = {}, a = [];
		 for(var i = 0, l = array.length; i < l; ++i){
				if(u.hasOwnProperty(array[i])) {
					 continue;
				}
				a.push(array[i]);
				u[array[i]] = 1;
		 }
		 return a;
		}
	};
})(UTIL);




/*
*	UTIL Helper LocalStorage	:	Module used to help with localStorage TTL
*
*		@method	get	->	gets a non-expired value from key, returns false if expired or Non-existent
*			@param	{String}	key	//	the key of the object
*
*		@method set	->	sets a value to a certain key as well as establishing a time to live
*			@param	{String}	key	//	the key used to look this up
*			@param	{Mixed}		value	//the value being stored
*			@param	{Number}	ttl		//the time to live in ms
*/
UTIL.helper.localStorage	=	(function(window) {
  return {
    set: function(key, value	,	ttl) {
			//If no ttl is set, do it infinitely, i.e. 32 years
			ttl	=	ttl||Date.now()+1E12
			//Store the value into the localStorage
      window.localStorage[key] = JSON.stringify(value);
			//Append the max future expiry date so we don't have to check it again
			
			window.localStorage[key]	+= (Date.now()+ttl);
			
    },
    get: function(key) {
			
			var _value	=	window.localStorage[key];

			//incase the key is bad
			if(!_value)
				return 0;
			
			//grab the timestamp, the following code is only good for another 200ish years
			var _expiryDate	=	parseInt(_value.substr(-13));
			//This returns false if data expired
			if(_expiryDate<=Date.now())
				return !(delete window.localStorage[key]);
			
			//This is to get rid of the get and set object methods
			try{
				return JSON.parse(_value.slice(0,-13));
			}catch(e){
				//So this isn't json...
				//Ahh, just pass it
				return _value.slice(0,-13);
			}
			
			
    }
  }
})(window);






/*
*
*	Random Helper functions
*
*/

window.getParam = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


Node.prototype.listen	=	function(obj){
	for(var event in obj){
		this.addEventListener(event,obj[event]);
	}
}

