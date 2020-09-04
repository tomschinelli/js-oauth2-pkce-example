# OAuth2 + PKCE flow

Basic example for OAuth2.1 + OpenId Connect 


## Provider (keycloak)
I used keycloak to for this example, but you can use what ever you want.

### TL;DR

1. run ```docker-compose up```
    
2. create a provider or change the config to match your provider.

3. Open the website

### STEP 0: run your webserver

I use a jetbrains IDEA which has a built-in webserver.

**TODO**: simple webserver.


### Step 1: install
To install it simply run the docker compose file with

    docker-compose up

 
### Step 2: create new realm 

To create a new realm, hover over master and select **Add realm**

name it **myrealm** to match the example.

### STEP 3: setup client

To create a client go to **clients** > **Create**

1. name it **my-client** to follow the example and enter the url of your website (STEP 0)
2. make sure the **Access Type** is **public** and **Standard Flow Enabled** is ON.

### STEP 4: Create a user to log-in

To create a user, go under  *Users > Add User*

1. fill the required fields. 
    - **Email Verified** must be ON 
2. Credentials > choose a password
    - **Temporary** must by OFF

### STEP 5: Endpoints 

If you named your realm **myrealm** and your client **my-client** you can skip this step.

You can find your endpoint in your admin console under :

    Realm Settings > General > Endpoints > OpenID Endpoint Configuration
    
e.g. 

    {
        issuer: "http://localhost:8080/auth/realms/master",
        authorization_endpoint: "http://localhost:8080/auth/realms/master/protocol/openid-connect/auth",
        token_endpoint: "http://localhost:8080/auth/realms/master/protocol/openid-connect/token",
        introspection_endpoint: "http://localhost:8080/auth/realms/master/protocol/openid-connect/token/introspect",
        userinfo_endpoint: "http://localhost:8080/auth/realms/master/protocol/openid-connect/userinfo",
        end_session_endpoint: "http://localhost:8080/auth/realms/master/protocol/openid-connect/logout",
        
        ...
        
        
### STEP 6: Try it

go to your website and click login. 
