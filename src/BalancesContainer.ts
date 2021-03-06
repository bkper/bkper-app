/**
 * The container of balances of an [[Account]], [[Group]] or #hashtag
 * 
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 * 
 * @public
 */
interface BalancesContainer {

  /**
   * The parent BalancesReport of the container
   */
  getBalancesReport(): BalancesReport;

  /**
   * The [[Account]] name, [[Group]] name
   */
  getName(): string;



  /**
   * The [[Group]] associated with this container
   */
  getGroup(): Group;

  /**
   * The [[Account]] associated with this container
   */
  getAccount(): Account;

  /**
   * All [[Balances]] of the container
   */
  getBalances(): Balance[];


  /**
   * The parent BalanceContainer
   */
  getParent(): BalancesContainer;

  /**
   * Gets the credit nature of the BalancesContainer, based on [[Account]], [[Group]] or #hashtag this container represents.
   * 
   * For [[Account]], the credit nature will be the same as the one from the Account
   * 
   * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
   * 
   * For #hashtag, the credit nature will be true.
   */
  isCredit(): boolean;

  /**
   * Tell if this balance container if from an [[Account]] 
   */
  isFromAccount(): boolean;

  /**
   * Tell if this balance container if from a [[Group]] 
   */
  isFromGroup(): boolean;

  /**
   * Tell if the balance container is from a parent group
   */
  hasGroupBalances(): boolean;

  /**
   * The cumulative balance to the date.
   */
  getCumulativeBalance(): Amount;

  /**
   * The cumulative raw balance to the date.
   */
  getCumulativeBalanceRaw(): Amount;

  /**
   * The cumulative credit to the date.
   */
  getCumulativeCredit(): Amount;

  /**
   * The cumulative debit to the date.
   */
  getCumulativeDebit(): Amount;

  /**
   * The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeBalanceText(): string;

  /**
   * The cumulative raw balance formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeBalanceRawText(): string;

  /**
   * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeCreditText(): string;

  /**
   * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
   */
  getCumulativeDebitText(): string;


  /**
   * The balance on the date period.
   */
  getPeriodBalance(): Amount;

  /**
   * The raw balance on the date period.
   */
  getPeriodBalanceRaw(): Amount;

  /**
   * The credit on the date period.
   */
  getPeriodCredit(): Amount;

  /**
   * The debit on the date period.
   */
  getPeriodDebit(): Amount;

  /**
   * The balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodBalanceText(): string;

  /**
   * The raw balance on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodBalanceRawText(): string;

  /**
   * The credit on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodCreditText(): string;

  /**
   * The debit on the date period formatted according to [[Book]] decimal format and fraction digits
   */
  getPeriodDebitText(): string;


  /**
   * Gets all child [[BalancesContainers]].
   * 
   * **NOTE**: Only for Group balance containers. Accounts returns null.
   */
  getBalancesContainers(): BalancesContainer[]

  /**
   * Gets a specific [[BalancesContainer]].
   * 
   * **NOTE**: Only for Group balance containers. Accounts returns null.
   */
  getBalancesContainer(name: string): BalancesContainer;

  /**
   * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
   */
  createDataTable(): BalancesDataTableBuilder;

  /**
   * Gets the custom properties stored in this Account or Group.
   */  
   getProperties(): {[key: string]: string};
   
  /**
   * 
   * Gets the property value for given keys. First property found will be retrieved
   * 
   * @param keys The property key
   */
   getProperty(...keys: string[]): string;
}
//###################### ACCOUNT BALANCE CONTAINER ######################

class AccountBalancesContainer implements BalancesContainer {

  private wrapped: bkper.AccountBalances;
  private balancesReport: BalancesReport;
  private parent: BalancesContainer;


  constructor(parent: BalancesContainer, balancesReport: BalancesReport, balancePlain: bkper.AccountBalances) {
    this.parent = parent;
    this.balancesReport = balancesReport
    this.wrapped = balancePlain;
  }

  getParent(): BalancesContainer {
    return this.parent;
  }

  getGroup(): Group {
    return this.balancesReport.getBook().getGroup(this.getName());
  }

  getAccount(): Account {
    return this.balancesReport.getBook().getAccount(this.getName())
  }

  isFromAccount(): boolean {
    return true;
  }

  isFromGroup(): boolean {
    return false;
  }

  public hasGroupBalances(): boolean {
    return false;
  }

  public getBalancesReport(): BalancesReport {
    return this.balancesReport;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public isCredit() {
    return this.wrapped.credit;
  }

  public getCumulativeBalance(): Amount {
    return Utils_.getRepresentativeValue(new Amount(this.wrapped.cumulativeBalance), this.isCredit());
  }

  public getCumulativeBalanceRaw(): Amount {
    return new Amount(this.wrapped.cumulativeBalance);
  }

  public getCumulativeCredit(): Amount {
    return new Amount(this.wrapped.cumulativeCredit);
  }

  public getCumulativeDebit(): Amount {
    return new Amount(this.wrapped.cumulativeDebit);
  }

  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }

  public getCumulativeBalanceRawText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalanceRaw());
  }

  public getCumulativeCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
  }
  public getCumulativeDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
  }


  public getPeriodBalance(): Amount {
    return Utils_.getRepresentativeValue(new Amount(this.wrapped.periodBalance), this.isCredit());
  }
  public getPeriodBalanceRaw(): Amount {
    return new Amount(this.wrapped.periodBalance);
  }
  public getPeriodCredit(): Amount {
    return new Amount(this.wrapped.periodCredit);
  }
  public getPeriodDebit(): Amount {
    return new Amount(this.wrapped.periodDebit);
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }
  public getPeriodBalanceRawText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalanceRaw());
  }
  public getPeriodCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
  }
  public getPeriodDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
  }

  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable(): BalancesDataTableBuilder {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
  }

  public getBalancesContainers(): BalancesContainer[] {
    return [];
  }

  public getProperties(): { [key: string]: string } {
    return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
  }

   public getProperty(...keys: string[]): string {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.wrapped.properties != null ?  this.wrapped.properties[key] : null 
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return null;
  }  

  public getBalancesContainer(name: string): BalancesContainer {
    return null;
  }
}



//###################### GROUP BALANCE CONTAINER ######################

class GroupBalancesContainer implements BalancesContainer {

  private wrapped: bkper.GroupBalances
  private parent: BalancesContainer;
  private accountBalances: AccountBalancesContainer[];
  private groupBalances: GroupBalancesContainer[];

  private balancesReport: BalancesReport;

  constructor(parent: BalancesContainer, balancesReport: BalancesReport, groupBalancesPlain: bkper.GroupBalances) {
    this.parent = parent;
    this.balancesReport = balancesReport;
    this.wrapped = groupBalancesPlain;
  }

  getParent(): BalancesContainer {
    return this.parent;
  }

  getGroup(): Group {
    return this.balancesReport.getBook().getGroup(this.getName());
  }

  getAccount(): Account {
    return this.balancesReport.getBook().getAccount(this.getName())
  }

  isFromAccount(): boolean {
    return false;
  }

  isFromGroup(): boolean {
    return true;
  }

  public hasGroupBalances(): boolean {
    return this.getGroupBalances() != null && this.getGroupBalances().length > 0;
  }

  public getBalancesReport(): BalancesReport {
    return this.balancesReport;
  }

  public getName(): string {
    return this.wrapped.name;
  }

  public isCredit(): boolean {
    return this.wrapped.credit;
  }

  public getCumulativeBalance(): Amount {
    return Utils_.getRepresentativeValue(new Amount(this.wrapped.cumulativeBalance), this.isCredit());
  }

  public getCumulativeBalanceRaw(): Amount {
    return new Amount(this.wrapped.cumulativeBalance);
  }

  public getCumulativeCredit(): Amount {
    return new Amount(this.wrapped.cumulativeCredit);
  }

  public getCumulativeDebit(): Amount {
    return new Amount(this.wrapped.cumulativeDebit);
  }

  public getCumulativeBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
  }
  public getCumulativeBalanceRawText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeBalanceRaw());
  }
  public getCumulativeCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
  }
  public getCumulativeDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
  }


  public getPeriodBalance(): Amount {
    return Utils_.getRepresentativeValue(new Amount(this.wrapped.periodBalance), this.isCredit());
  }
  public getPeriodBalanceRaw(): Amount {
    return new Amount(this.wrapped.periodBalance);
  }
  public getPeriodCredit(): Amount {
    return new Amount(this.wrapped.periodCredit);
  }
  public getPeriodDebit(): Amount {
    return new Amount(this.wrapped.periodDebit);
  }

  public getPeriodBalanceText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
  }
  public getPeriodBalanceRawText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodBalanceRaw());
  }
  public getPeriodCreditText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
  }
  public getPeriodDebitText(): string {
    return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
  }

  public getBalances(): Balance[] {
    if (!this.wrapped.balances) {
      return new Array<Balance>();
    }
    return this.wrapped.balances.map(balancePlain => new Balance(this, balancePlain));
  }

  public createDataTable() {
    return new BalancesDataTableBuilder(this.balancesReport.getBook(), this.getBalancesContainers(), this.balancesReport.getPeriodicity());
  }

  public getBalancesContainers(): BalancesContainer[] {
    var containers = new Array<BalancesContainer>();
    const groupBalances = this.getGroupBalances();
    if (groupBalances && groupBalances.length > 0) {
      containers = containers.concat(groupBalances);
    }
    const accountBalances = this.getAccountBalances();
    if (accountBalances && accountBalances.length > 0) {
      containers = containers.concat(accountBalances);
    }
    return containers;
  }

  private getAccountBalances(): AccountBalancesContainer[] {
    var accountBalances = this.wrapped.accountBalances;
    if (this.accountBalances == null && accountBalances != null) {
      this.accountBalances = [];
      for (var i = 0; i < accountBalances.length; i++) {
        var accountBalance = accountBalances[i];
        this.accountBalances.push(new AccountBalancesContainer(this, this.balancesReport, accountBalance));
      }
    }
    return this.accountBalances;
  }

  private getGroupBalances(): GroupBalancesContainer[] {
    var groupBalances = this.wrapped.groupBalances;
    if (this.groupBalances == null && groupBalances != null) {
      this.groupBalances = [];
      for (var i = 0; i < groupBalances.length; i++) {
        var groupBalance = groupBalances[i];
        this.groupBalances.push(new GroupBalancesContainer(this, this.balancesReport, groupBalance));
      }
    }
    return this.groupBalances;
  }

  public getProperties(): { [key: string]: string } {
    return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
  }
  
  public getProperty(...keys: string[]): string {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.wrapped.properties != null ?  this.wrapped.properties[key] : null 
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return null;
  }   

  getBalancesContainer(name: string): BalancesContainer {
    if (name == null) {
      return null;
    }
    return this.searchTree(this, name);
  }

  private searchTree(element: BalancesContainer, name: string): BalancesContainer {
    if (element.getName() == name) {
      return element;
    } else if (element.getBalancesContainers() != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.getBalancesContainers().length; i++) {
        result = this.searchTree(element.getBalancesContainers()[i], name);
      }
      return result;
    }
    return null;
  }

  


}
