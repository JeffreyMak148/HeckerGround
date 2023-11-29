package com.heckerForum.heckerForum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.CommentRequest;
import com.heckerForum.heckerForum.dto.CommentResponse;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.CommentService;
import com.heckerForum.heckerForum.service.PostService;

@RestController
@RequestMapping("/api/comments")
public class CommentController extends BaseController {

  @Autowired
  private CommentService commentService;

  @Autowired
  private PostService postService;

  @PostMapping("{encodedPostId}")
  public ResponseEntity<?> createComments(@RequestBody CommentRequest commentRequest,
      @AuthenticationPrincipal User loggedInUser) throws Exception {
    Long postId = postService.decodePostId(commentRequest.getEncodedPostId());
    CommentDto newComment = commentService.save(postId, loggedInUser, commentRequest.getContent(),
        commentRequest.getPlainText(), commentRequest.getReplyCommentId(), commentRequest.getImageSrcs());
    return generateResponseEntity(newComment);
  }

  @GetMapping("{commentId}")
  public ResponseEntity<?> getCommentById(@PathVariable Long commentId, @AuthenticationPrincipal User loggedInUser) throws Exception {
    CommentResponse commentResponse = commentService.findByCommentId(commentId, loggedInUser);
    return generateResponseEntity(commentResponse);
  }

  @PostMapping("/upvote/{commentId}")
  public ResponseEntity<?> upvoteCommentById(@PathVariable Long commentId, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    return generateResponseEntity(commentService.saveUpvote(commentId, loggedInUser));
  }

  @PostMapping("/downvote/{commentId}")
  public ResponseEntity<?> downvoteCommentById(@PathVariable Long commentId, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    return generateResponseEntity(commentService.saveDownvote(commentId, loggedInUser));
  }

}
