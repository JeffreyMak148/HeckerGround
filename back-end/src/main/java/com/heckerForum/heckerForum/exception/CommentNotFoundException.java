package com.heckerForum.heckerForum.exception;

public class CommentNotFoundException extends Exception {
  private static final long serialVersionUID = -7133340773437792745L;

  public CommentNotFoundException() {
    super();
  }

  public CommentNotFoundException(String errorMessage) {
    super(errorMessage);
  }
}
