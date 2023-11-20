package com.heckerForum.heckerForum.exception;

public class UserNotFoundException extends Exception {
  private static final long serialVersionUID = 6701617941775553845L;

  public UserNotFoundException() {
    super();
  }

  public UserNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
