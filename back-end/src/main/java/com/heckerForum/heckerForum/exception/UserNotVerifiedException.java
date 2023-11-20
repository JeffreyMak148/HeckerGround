package com.heckerForum.heckerForum.exception;

public class UserNotVerifiedException extends Exception {
  private static final long serialVersionUID = 2714221755736938075L;

  public UserNotVerifiedException() {
    super();
  }

  public UserNotVerifiedException(String errorMessage) {
    super(errorMessage);
  }
}
