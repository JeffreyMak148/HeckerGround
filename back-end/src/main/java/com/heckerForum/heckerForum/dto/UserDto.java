package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.heckerForum.heckerForum.models.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = -6193789355741767583L;
  private Long id;
  private LocalDateTime createDateTime;
  private String username;

  public UserDto(User user) {
    this.id = user.getId();
    this.createDateTime = user.getCreateDateTime();
    this.username = user.getUsername();
  }
}
