package com.heckerForum.heckerForum.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GenericWrapper implements Serializable {
  private static final long serialVersionUID = -8496262768590095758L;
  private CurrentUserDto currentUser;
  private Object data;

  public GenericWrapper(CurrentUserDto currentUser, Object data) {
    this.currentUser = currentUser;
    this.data = data;
  }
}
