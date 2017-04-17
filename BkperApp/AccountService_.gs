var AccountService_ = {

  getAccounts: function(bookId) {
    var responseJSON = API.call_("get", "accounts", bookId);
    var accountsPlain = JSON.parse(responseJSON).items;
    if (accountsPlain == null) {
      return new Array();
    }
    var accounts = Utils_.wrapObjects(new Account(), accountsPlain);
    return accounts;
  },
  
  createAccount: function(bookId, name, group, description) {
    
    var accountUpdate = new Object();
    
    accountUpdate.name = name;
    accountUpdate.group = group;
    accountUpdate.description = description;
    
    var accountUpdateJSON = JSON.stringify(accountUpdate);
    
    var responseJSON = API.call_("post", "accounts", bookId, null, accountUpdateJSON);
    
    var accountPlain = JSON.parse(responseJSON);
    var account = Utils_.wrapObject(new Account(), accountPlain);
    return account;
  }

}
