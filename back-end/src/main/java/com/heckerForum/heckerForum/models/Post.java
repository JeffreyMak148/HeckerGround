package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity // create table Post
@Getter
@Setter
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private User user;
  private LocalDateTime createDateTime;
  private String title;
  private Integer catId;
  // Store first comment if more metadata is needed in the future
  private Long upvote = Long.valueOf(0);
  private Long downvote = Long.valueOf(0);
  private Integer numOfReplies;

}
