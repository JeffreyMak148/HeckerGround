package com.heckerForum.heckerForum.exception;

public class RegisterInvalidException extends Exception {
  private static final long serialVersionUID = 3102625167489237217L;

  public RegisterInvalidException() {
    super();
  }

  public RegisterInvalidException(String errorMessage) {
    super(errorMessage);
  }
}
