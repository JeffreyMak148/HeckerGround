package com.heckerForum.heckerForum.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
  private String encodedPostId;
  private String content;
  private String plainText;
  private Long replyCommentId;
  private List<String> imageSrcs;
}
