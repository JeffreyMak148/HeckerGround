package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.serializer.CommentDtoListSerializer;
import com.heckerForum.heckerForum.serializer.PostDtoSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = -3709626573886309722L;
  @JsonSerialize(using = PostDtoSerializer.class)
  private PostDto post;
  @JsonSerialize(using = CommentDtoListSerializer.class)
  private List<CommentDto> comments;

  public PostResponse(PostDto post, List<CommentDto> comments) {
    this.post = post;
    this.comments = comments;
  }
}
