package com.heckerForum.heckerForum.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {
  private String username;
  private String code;
}
