package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.serializer.CommentDtoSerializer;
import com.heckerForum.heckerForum.serializer.PostDtoSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = -4339612508143953523L;
  private Long id;
  private UserDto user;
  @JsonSerialize(using = PostDtoSerializer.class)
  private PostDto post;
  @JsonSerialize(using = CommentDtoSerializer.class)
  private CommentDto replyComment;
  private LocalDateTime createDateTime;
  private String content;
  private String plainText;
  private Integer commentNumber;
  private Integer numberOfReply;
  private Long upvote = Long.valueOf(0);
  private Long downvote = Long.valueOf(0);
  private Boolean upvoted = false;
  private Boolean downvoted = false;

  public CommentDto(Comment comment) {
    this.id = comment.getId();
    this.user = new UserDto(comment.getUser());
    this.post = new PostDto(comment.getPost());
    this.replyComment = comment.getReplyComment() != null ? new CommentDto(comment.getReplyComment()) : null;
    this.createDateTime = comment.getCreateDateTime();
    this.content = comment.getContent();
    this.plainText = comment.getPlainText();
    this.commentNumber = comment.getCommentNumber();
    this.numberOfReply = comment.getNumberOfReply();
    this.upvote = comment.getUpvote();
    this.downvote = comment.getDownvote();
  }

}
