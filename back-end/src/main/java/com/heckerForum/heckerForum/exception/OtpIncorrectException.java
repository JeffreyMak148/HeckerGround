package com.heckerForum.heckerForum.exception;

public class OtpIncorrectException extends Exception {
  private static final long serialVersionUID = 3671705988851538571L;

  public OtpIncorrectException() {
    super();
  }

  public OtpIncorrectException(String errorMessage) {
    super(errorMessage);
  }
}
