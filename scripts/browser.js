class Browser{
    static  q ={
        ...this.getParameters(true),
        ...this.getParameters()
    }
    static getParameters( useHash = false){
        let result = {};

        let str = location.search;
        if(useHash){
            str =  window.location.hash
        }
        if(!str){
            return {}
        }
        str
            .substr(1)
            .split("&")
            .forEach(function (item) {

                let tmp = item.split("=");
                result[tmp[0]] = decodeURIComponent(tmp[1]);
            });
        return result;
    }
}


class JWT {
    static parse(token){
        return {
            header:this._getChunk(token,0),
            claims:this._getChunk(token,1),
            signature:this._getChunk(token,1, true),
        }
    }

    static _getChunk(token,pos, raw=false){
        var base64Url = token.split('.')[pos];
        if(raw){
            return base64Url
        }
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}


