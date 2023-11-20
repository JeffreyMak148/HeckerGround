package com.heckerForum.heckerForum.exception;

public class NotificationNotFoundException extends Exception {
  private static final long serialVersionUID = -1608592453497985007L;

  public NotificationNotFoundException() {
    super();
  }

  public NotificationNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
