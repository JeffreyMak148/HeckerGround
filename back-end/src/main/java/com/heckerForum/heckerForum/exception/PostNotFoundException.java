package com.heckerForum.heckerForum.exception;

public class PostNotFoundException extends Exception {
  private static final long serialVersionUID = 2687844165894289272L;

  public PostNotFoundException() {
    super();
  }

  public PostNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
