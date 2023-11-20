package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Bookmark {
  @EmbeddedId
  private BookmarkKey id = new BookmarkKey();

  @ManyToOne
  @MapsId("userId")
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @MapsId("postId")
  @JoinColumn(name = "post_id")
  private Post post;

  private LocalDateTime createDateTime = LocalDateTime.now();

}
