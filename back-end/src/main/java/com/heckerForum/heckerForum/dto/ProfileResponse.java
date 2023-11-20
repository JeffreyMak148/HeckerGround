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
public class ProfileResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = 3589189931184493769L;
  private UserDto user;
  @JsonSerialize(using = PostDtoListSerializer.class)
  private List<PostDto> posts;

  public ProfileResponse(UserDto user, List<PostDto> posts) {
    this.user = user;
    this.posts = posts;
  }
}
