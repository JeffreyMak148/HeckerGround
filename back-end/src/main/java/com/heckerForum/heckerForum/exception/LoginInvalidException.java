package com.heckerForum.heckerForum.exception;

public class LoginInvalidException extends Exception {
  private static final long serialVersionUID = 3578303790354178931L;

  public LoginInvalidException() {
    super();
  }

  public LoginInvalidException(String errorMessage) {
    super(errorMessage);
  }
}
