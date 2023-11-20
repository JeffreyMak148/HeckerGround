package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.serializer.PostDtoListSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TopicResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = -5581806410275013360L;
  private UserDto user;
  @JsonSerialize(using = PostDtoListSerializer.class)
  private List<PostDto> topics;

  public TopicResponse(UserDto user, List<PostDto> topics) {
    this.user = user;
    this.topics = topics;
  }

  public TopicResponse(List<PostDto> topics) {
    this.topics = topics;
  }
}
