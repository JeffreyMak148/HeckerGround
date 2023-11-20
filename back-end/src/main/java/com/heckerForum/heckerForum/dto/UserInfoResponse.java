package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserInfoResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = 7070130128788945388L;
  private Long id;
  private String username;
  private List<String> roles;

  public UserInfoResponse(Long id, String username, List<String> roles) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }
}
