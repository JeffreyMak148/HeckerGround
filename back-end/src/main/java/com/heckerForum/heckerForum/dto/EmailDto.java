package com.heckerForum.heckerForum.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailDto implements Serializable {
  private static final long serialVersionUID = 2249704656346480838L;
  private String subject;
  private String body;
  private String recipient;
}
