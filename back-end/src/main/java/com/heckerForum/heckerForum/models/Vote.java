package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class Vote {
  @EmbeddedId
  private VoteKey id = new VoteKey();

  @ManyToOne
  @MapsId("userId")
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @MapsId("commentId")
  @JoinColumn(name = "comment_id")
  private Comment comment;

  private LocalDateTime createDateTime = LocalDateTime.now();
  @Enumerated(EnumType.STRING)
  private VoteType type;
}
