package com.heckerForum.heckerForum.exception;

public class EmailNotFoundException extends Exception {
  private static final long serialVersionUID = -6757524006944339603L;

  public EmailNotFoundException() {
    super();
  }

  public EmailNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
