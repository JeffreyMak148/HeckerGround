package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotificationResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = -7475330982708416893L;
  private List<NotificationDto> notifications;

  public NotificationResponse(List<NotificationDto> notifications) {
    this.notifications = notifications;
  }
}
