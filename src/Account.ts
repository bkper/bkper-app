/**
 * 
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 * 
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transaction]]s.
 * 
 * An Account has a lower level granularity control and can be grouped by [[Group]]s.
 * 
 */
class Account {

  /**
   * @ignore
   */
  wrapped: Bkper.AccountV2Payload;

  /**
   * @ignore
   */
  book: Book;

  private normalizedName: string;

  /**
   * @returns The id of this Account
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * @returns The name of this Account
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * @returns The description of this Account
   */
  public getDescription(): string {
    return this.wrapped.description;
  }

  /**
   * @returns The name of this Account without spaces and special characters
   */
  public getNormalizedName(): string {
    if (this.normalizedName == null) {
      this.normalizedName = normalizeName(this.getName());
    }
    return this.normalizedName;
  }

  /**
   * Gets the balance based on credit nature of this Account
   *  
   * @param raw True to get the raw balance, no matter the credit nature of this Account.
   * 
   * @returns The balance of this Account
   */
  public getBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.balance);
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }

  /**
   * Gets the checked balance based on credit nature of this Account
   * 
   * @param raw True to get the raw balance, no matter the credit nature of this Account.
   * 
   * @returns The checked balance of this Account
   */
  public getCheckedBalance(raw?: boolean): number {
    var balance = 0;
    if (this.wrapped.balance != null) {
      balance = Utils_.round(this.wrapped.checkedBalance);
    }

    if (raw) {
      return balance;
    } else {
      return Utils_.getRepresentativeValue(balance, this.isCredit());
    }
  }

  /**
   * Tell this account is active
   */
  public isActive = function (): boolean {
    return this.wrapped.active;
  };

  /**
   * 
   * Tell if the account is permanent.
   * 
   * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
   *  
   * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
   * 
   * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
   * 
   * @returns True if its a permanent Account
   * 
   */
  public isPermanent(): boolean {
    return this.wrapped.permanent;
  }

  /**
   * Tell if the account has a Credit nature or Debit otherwise
   * 
   * Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
   * 
   * The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
   * 
   * ```
   *         Crediting a credit
   *   Thus ---------------------> account increases its absolute balance
   *         Debiting a debit
   * 
   * 
   *         Debiting a credit
   *   Thus ---------------------> account decreases its absolute balance
   *         Crediting a debit
   * ```
   * 
   * As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.
   * 
   */
  public isCredit(): boolean {
    return this.wrapped.credit;
  }

  /**
   * Tell if this account is in the [[Group]]
   * 
   * @param  group The Group name, id or object
   */
  public isInGroup(group: string | Group): boolean {
    if (group == null) {
      return false;
    }

    //Group object
    if (group instanceof Group) {
      return this.isInGroupObject_(group);
    }

    //id or name
    var foundGroup = this.book.getGroup(group);
    if (foundGroup == null) {
      return false;
    }
    return this.isInGroupObject_(foundGroup);
  }

  private isInGroupObject_(group: Group): boolean {
    if (this.wrapped.groupsIds == null) {
      return false;
    }

    for (var i = 0; i < this.wrapped.groupsIds.length; i++) {
      if (this.wrapped.groupsIds[i] == group.getId()) {
        return true;
      }
    }
    return false;
  }
}
