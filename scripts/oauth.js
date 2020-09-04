
class Oauth2 {
    Scope = ''

    tokens = null;

    config = {
        client_id: "my-client", // todo
        redirect_uri: window.location.origin+window.location.pathname,// todo
        requested_scopes: "open id offline_access", // todo
        authorization_endpoint: "/auth", //todo
        token_endpoint: "/token", // todo
        introspection_endpoint: "/introspect", //todo
        userinfo_endpoint: "/userinfo", // todo
        logout_endpoint: "/logout", // todo
    };

    /**
     *
     */
    logout(){
        const url = this.config.logout_endpoint+"?redirect_uri="+encodeURIComponent(config.redirect_uri);
        window.location =url;
    }

    /**
     * login
     * @returns {Promise<void>}
     */
    async loginPKCE() {
        const {state,codeChallenge} = await PKCE.GetData()
        const url = config.authorization_endpoint
            + "?response_type=code"
            + "&client_id=" + encodeURIComponent(config.client_id)
            + "&state=" + encodeURIComponent(state)
            + "&scope=" + encodeURIComponent(config.requested_scopes)
            + "&redirect_uri=" + encodeURIComponent(config.redirect_uri)
            + "&code_challenge=" + encodeURIComponent(codeChallenge)
            + "&code_challenge_method=S256"
        ;

        // Redirect to the authorization server
        window.location = url;
    }

    /**
     * verify code response
     * @returns {string}
     */
    getLastState(){
        const {state} = PKCE.GetExistingData()
        return state;
    }

    /**
     * todo refresh if needed
     */
    async acquireTokens(code) {
        const {codeVerifier} = PKCE.GetExistingData()
        const queryString = new URLSearchParams({
            grant_type :"authorization_code",
            code :code,
            redirect_uri :this.config.redirect_uri,
            client_id :this.config.client_id,
            code_verifier :codeVerifier,
        }).toString()
        const tokenData = await this.__postData(this.config.token_endpoint, queryString)
        console.log(tokenData)
        if (tokenData.error) {
            return [null,tokenData];
        }
        this.tokens = tokenData;
        return [tokenData,null]
    }

    async fetchUserInfo() {
        const data = await this.__postData(this.config.userinfo_endpoint, "",{
            Authorization: "bearer "+this.tokens.access_token
        })
        return data;
    }

    constructor(config) {
        this.config = config;
    }


    async __postData(url = '', data, headers = {}) {
        // Default options are marked with *
        const useHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: useHeaders,
            body: data
        });
        return response.json();
    }


}

