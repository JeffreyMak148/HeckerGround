package com.heckerForum.heckerForum.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class VoteKey implements Serializable {
  private static final long serialVersionUID = 1741544492250105591L;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "comment_id")
  private Long commentId;
}