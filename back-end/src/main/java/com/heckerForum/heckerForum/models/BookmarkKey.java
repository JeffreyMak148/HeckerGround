package com.heckerForum.heckerForum.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
public class BookmarkKey implements Serializable {
  private static final long serialVersionUID = 3437297518882477571L;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "post_id")
  private Long postId;
}