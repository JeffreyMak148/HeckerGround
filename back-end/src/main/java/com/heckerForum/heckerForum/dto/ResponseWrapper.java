package com.heckerForum.heckerForum.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseWrapper implements Serializable {
  private static final long serialVersionUID = -3581284153934010881L;
  private CurrentUserDto currentUser;
  private ResponseData data;

  public ResponseWrapper(CurrentUserDto currentUser, ResponseData data) {
    this.currentUser = currentUser;
    this.data = data;
  }
}
