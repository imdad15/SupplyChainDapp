pragma solidity >0.4.24;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
  struct Role {
    mapping (address => bool) bearer;
  }

  /**
   * @dev give an account access to this role
   */
  function add(Role storage role, address account) internal {
    require(account != address(0), "Need a valid address to add a role.");
    require(!has(role, account), "Account address is already registered with this role.");

    role.bearer[account] = true;
  }

  /**
   * @dev remove an account's access to this role
   */
  function remove(Role storage role, address account) internal {
    require(account != address(0), "Require a valid address to remove account.");
    require(has(role, account), "Account address is not assigned to this role");

    role.bearer[account] = false;
  }

  /**
   * @dev check if an account has this role
   * @return bool
   */
  function has(Role storage role, address account) internal view
    returns (bool) {
      require(account != address(0), "Account check requires valid address");
      return role.bearer[account];
  }
}