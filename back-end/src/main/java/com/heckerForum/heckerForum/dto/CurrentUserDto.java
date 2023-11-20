package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

import com.heckerForum.heckerForum.models.Authority;
import com.heckerForum.heckerForum.models.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CurrentUserDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = 1258349437811649452L;
  private Long id;
  private LocalDateTime createDateTime;
  private String username;
  private boolean enabled;
  private boolean locked;
  private Long unreadNotification;
  private Set<Authority> authorities;

  public CurrentUserDto(User user) {
    this.id = user.getId();
    this.createDateTime = user.getCreateDateTime();
    this.username = user.getUsername();
  }
}
