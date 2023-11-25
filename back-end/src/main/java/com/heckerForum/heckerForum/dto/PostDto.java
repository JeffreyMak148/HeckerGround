package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.serializer.PostIdSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = -7544455466440929438L;
  @JsonSerialize(using = PostIdSerializer.class)
  private Long id;
  private UserDto user;
  private LocalDateTime createDateTime;
  private String title;
  private Integer catId;
  private Long upvote;
  private Long downvote;
  private Integer numOfReplies;
  private Boolean bookmarked = false;

  public PostDto(Post post) {
    this.id = post.getId();
    this.user = new UserDto(post.getUser());
    this.createDateTime = post.getCreateDateTime();
    this.title = post.getTitle();
    this.catId = post.getCatId();
    this.upvote = post.getUpvote();
    this.downvote = post.getDownvote();
    this.numOfReplies = post.getNumOfReplies();
  }

}
