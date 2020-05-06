
let API_KEY_: string;
let OAUTH_TOKEN_PROVIDER_: OAuthTokenProvider;

/**
 * Interface to provide OAuth2 tokens upon calling the API.
 * 
 * Implement your own if you need to use one other than the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken).
 * 
 * Its specially usefull on environments where you can use the built-in ScriptApp services such as [Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions).
 * 
 * Learn more how to [OAuth 2 library](https://github.com/gsuitedevs/apps-script-oauth2) for Google Apps Script
 * 
 * @public
 */
interface OAuthTokenProvider {

  /**
   * A valid OAuth2 access token with **email** scope authorized.
   */
  getOAuthToken(): string;
}

/**
 * Sets the API key to identify the agent.
 * 
 * API keys are intended for agent identification only, not for authentication. [Learn more](https://cloud.google.com/endpoints/docs/frameworks/java/when-why-api-key)
 * 
 * See how to create your api key [here](https://cloud.google.com/docs/authentication/api-keys).
 *
 * @param key The key from GCP API &  Services Credentials console.
 * 
 * @public
 */
function setApiKey(key: string): void {
  API_KEY_ = key;
}

/**
 * Sets the [[OAuthTokenProvider]]. 
 * 
 * If none set, the default built-in [ScriptApp](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken) will be used.
 * 
 * @param tokenProvider The [[OAuthTokenProvider]] implementation.
 * 
 * @public
 */
function setOAuthTokenProvider(tokenProvider: OAuthTokenProvider) {
  OAUTH_TOKEN_PROVIDER_ = tokenProvider;
}


class HttpRequest {
  private url: string;
  protected method: "get" | "delete" | "patch" | "post" | "put" = "get";
  protected headers: any;
  protected params: any;
  protected contentType: string;
  protected payload: any;
  protected validateHttpsCertificates = true;
  protected followRedirects = true;
  protected muteHttpExceptions = false;
  protected escaping = true;

  constructor(url: string) {
    let parts = url.split('?');
    this.url = parts[0];
    if (parts.length == 2) {
      let params = parts[1].split('&');
      params.forEach(param => {
        let keyValue = param.split('=');
        if (keyValue.length == 2) {
          this.addParam(keyValue[0], keyValue[1])
        }
      });
    }
  }

  public setMethod(method: "get" | "delete" | "patch" | "post" | "put"): HttpRequest {
    this.method = method;
    return this;
  }
  

  public addHeader(name: string, value: string): HttpRequest {
    if (this.headers == null) {
      this.headers = new Object();
    }
    this.headers[name] = value;
    return this;
  }

  public addParam(name: string, value: any): HttpRequest {
    if (this.params == null) {
      this.params = new Object();
    }
    this.params[name] = value;
    return this;
  }

  public setContentType(contentType: string): HttpRequest {
    this.contentType = contentType;
    return this;
  }

  public setPayload(payload: any): HttpRequest {
    this.payload = payload;
    return this;
  }

  public setValidateHttpsCertificates(validateHttpsCertificates: boolean): HttpRequest {
    this.validateHttpsCertificates = validateHttpsCertificates;
    return this;
  }

  public setFollowRedirects(followRedirects: boolean): HttpRequest {
    this.followRedirects = followRedirects;
    return this;
  }

  public setMuteHttpExceptions(muteHttpExceptions: boolean): HttpRequest {
    this.muteHttpExceptions = muteHttpExceptions;
    return this;
  }

  public getUrl(): string {
    let url = this.url;
    if (this.params != null) {
      let i = 0
      if (url.indexOf('?') < 0) {
        url += '?';
      } else {
        i++;
      }
      for (var prop in this.params) {
        if (this.params.hasOwnProperty(prop)) {
          if (i > 0) {
            url += "&";
          }
          var key = prop;
          var value = this.params[prop];          
          if (value != null) {
            url += key + "=" + encodeURIComponent(value);
            i++;
          }
        }
      }      

    }
    return url
  }

  public fetch(): GoogleAppsScript.URL_Fetch.HTTPResponse {
  
    let options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {};

    if (this.headers != null) {
      options.headers = this.headers;
    }
    
    if (this.contentType != null) {
      options.contentType = this.contentType;
    }
    
    if (this.method != null) {
      options.method = this.method;
    }
    
    if (this.payload != null) {
      options.payload = this.payload;
    }

    options.validateHttpsCertificates = this.validateHttpsCertificates
    options.followRedirects = this.followRedirects;
    options.muteHttpExceptions = this.muteHttpExceptions;
    options.escaping = this.escaping;

    return UrlFetchApp.fetch(this.getUrl(), options);
    
  }; 



}


class HttpApiRequest extends HttpRequest {
  constructor(path: string) {
    super(`https://app.bkper.com/_ah/api/bkper/v2/${path}`)
  }

  fetch(): GoogleAppsScript.URL_Fetch.HTTPResponse {
    if (OAUTH_TOKEN_PROVIDER_ == null) {
      OAUTH_TOKEN_PROVIDER_ = ScriptApp;
    }

    if (API_KEY_ == null) {
      API_KEY_ = CachedProperties_.getCachedProperty(CacheService.getScriptCache(), PropertiesService.getScriptProperties(), 'API_KEY');
    }

    this.addHeader('Authorization', `Bearer ${OAUTH_TOKEN_PROVIDER_.getOAuthToken()}`);
    this.addParam('key', API_KEY_);
    if (this.contentType == null) {
      this.setContentType('application/json; charset=UTF-8')
    }
    this.setMuteHttpExceptions(true);

    var retries = 0;
    var sleepTime = 1000;
    while (true) {
      var response = super.fetch();
      if (response.getResponseCode() >= 200 && response.getResponseCode() < 300) {
        //OK
        return response;      
      } else {
        //ERROR
        let responseText = response.getContentText();
        let error = JSON.parse(responseText).error;
        if (response.getResponseCode() >= 500) {
          //Retry in case of server error
          if (retries > 4) {
            throw error.message;
          } else {
            Logger.log("Retrying in " + (sleepTime / 1000) + " secs...");
            Utilities.sleep(sleepTime);
            sleepTime = sleepTime * 2;
            retries++;
          }
        } else {
          throw error.message;
        }
      }
    }
    
  }
}

class HttpBooksApiRequest extends HttpApiRequest {
  constructor(service: string) {
    super(`ledgers/${service}`)
  }
}
