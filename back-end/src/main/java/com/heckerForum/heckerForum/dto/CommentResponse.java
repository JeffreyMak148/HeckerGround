package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.serializer.CommentDtoListSerializer;
import com.heckerForum.heckerForum.serializer.CommentDtoSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentResponse extends ResponseData implements Serializable {
  private static final long serialVersionUID = -5020715398036845327L;
  @JsonSerialize(using = CommentDtoSerializer.class)
  private CommentDto comment;
  @JsonSerialize(using = CommentDtoListSerializer.class)
  private List<CommentDto> replyComments;

  public CommentResponse(CommentDto comment, List<CommentDto> replyComments) {
    this.comment = comment;
    this.replyComments = replyComments;
  }
}
