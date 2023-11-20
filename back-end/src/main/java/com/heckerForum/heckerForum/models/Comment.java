package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private User user;
  @ManyToOne(optional = false)
  private Post post;
  @ManyToOne(optional = true)
  private Comment replyComment;
  private LocalDateTime createDateTime;
  @Column(columnDefinition = "TEXT")
  private String content;
  @Column(columnDefinition = "TEXT")
  private String plainText;
  @JsonIgnore
  @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
  @CollectionTable(name = "comment_images", joinColumns = @JoinColumn(name = "comment_id"))
  @Column(name = "image_srcs")
  private List<String> imageSrcs;
  private Integer commentNumber;
  private Integer numberOfReply;
  private Long upvote = Long.valueOf(0);
  private Long downvote = Long.valueOf(0);
}
