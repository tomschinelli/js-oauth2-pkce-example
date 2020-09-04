//////////////////////////////////////////////////////////////////////
// PKCE HELPER FUNCTIONS

// Generate a secure random string using the browser crypto functions
class PKCE {

    static async GetData() {
        var state = PKCE.generateRandomString();
        localStorage.setItem("pkce_state", state);

        // Create and store a new PKCE code_verifier (the plaintext random secret)
        var codeVerifier = PKCE.generateRandomString();
        localStorage.setItem("pkce_code_verifier", codeVerifier);

        // Hash and base64-urlencode the secret to use as the challenge
        var codeChallenge = await PKCE.getChallengeFromVerifier(codeVerifier);

        return {
            state,codeVerifier,codeChallenge
        }
    }
    static GetExistingData(){
        return {
            state: localStorage.getItem("pkce_state"),
            codeVerifier: localStorage.getItem("pkce_code_verifier"),
        }
    }

    static generateRandomString() {
        var array = new Uint32Array(28);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    // Calculate the SHA256 hash of the input text.
    // Returns a promise that resolves to an ArrayBuffer
    static sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    // Base64-urlencodes the input string
    static base64urlencode(str) {
        // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
        // btoa accepts chars only within ascii 0-255 and base64 encodes them.
        // Then convert the base64 encoded to base64url encoded
        //   (replace + with -, replace / with _, trim trailing =)
        return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    // Return the base64-urlencoded sha256 hash for the PKCE challenge
    static async  getChallengeFromVerifier(v) {
        const hashed = await this.sha256(v);
        return this.base64urlencode(hashed);
    }
}
