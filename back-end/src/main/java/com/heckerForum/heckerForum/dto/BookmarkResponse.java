package com.heckerForum.heckerForum.dto;

import java.io.Serializable;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.serializer.PostDtoSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookmarkResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = 254319314683280444L;
  @JsonSerialize(using = PostDtoSerializer.class)
  private PostDto post;

  public BookmarkResponse(PostDto post) {
    this.post = post;
  }
}
