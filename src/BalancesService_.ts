namespace BalancesService_ {

  export function getBalances(bookId: string, query: string) {
    var params =
        {
          "query" : query,
          "time" : Date.now()
        };
    var responseJSON = API_.call_("get", "balances", bookId, params);
    var report = JSON.parse(responseJSON);
    return report;
  }
  
}

