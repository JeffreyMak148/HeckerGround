package com.heckerForum.heckerForum.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.dto.PostRequest;
import com.heckerForum.heckerForum.dto.PostResponse;
import com.heckerForum.heckerForum.dto.TopicResponse;
import com.heckerForum.heckerForum.enums.PostCategoryEnum;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.CommentService;
import com.heckerForum.heckerForum.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController extends BaseController {

  @Autowired
  private PostService postService;

  @Autowired
  private CommentService commentService;

  @PostMapping("")
  public ResponseEntity<?> createPosts(@RequestBody PostRequest postRequest, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    PostDto newPost = postService.save(loggedInUser, postRequest.getCatId(), postRequest.getTitle(),
        postRequest.getContent(), postRequest.getPlainText(), postRequest.getImageSrcs());
    return generateResponseEntity(newPost);
  }

  @GetMapping("{encodedPostId}")
  public ResponseEntity<?> getPostByIdAndPagination(@PathVariable String encodedPostId,
      @RequestParam(name = "page", defaultValue = "0") Integer page,
      @RequestParam(name = "size", defaultValue = "20") Integer size, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    Long postId = postService.decodePostId(encodedPostId);
    PostDto postDto = postService.findById(postId).orElse(null);
    List<CommentDto> comments = commentService.findByPostIdAndPagination(postId, page, size, "id", loggedInUser);
    return generateResponseEntity(new PostResponse(postDto, comments));
  }

  @GetMapping("/{encodedPostId}/range")
  public ResponseEntity<?> getPostByIdAndPaginationRange(@PathVariable String encodedPostId,
      @RequestParam(name = "pageStart", defaultValue = "0") Integer pageStart,
      @RequestParam(name = "pageEnd", defaultValue = "0") Integer pageEnd,
      @RequestParam(name = "size", defaultValue = "20") Integer size, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    Long postId = postService.decodePostId(encodedPostId);
    return generateResponseEntity(
        postService.getPostResponseByIdAndPagination(postId, pageStart, pageEnd, size, loggedInUser));
  }

  @GetMapping("/category")
  public ResponseEntity<?> getPostCategory() {
    return generateResponseEntity(PostCategoryEnum.values());
  }

  @GetMapping("/category/{catId}")
  public ResponseEntity<?> getPostByCategoryAndPagination(@PathVariable Integer catId,
      @RequestParam(name = "page", defaultValue = "0") Integer page,
      @RequestParam(name = "size", defaultValue = "10") Integer size) {
    return generateResponseEntity(new TopicResponse(postService.findByCategoryAndPagination(catId, page, size, "id")));
  }

}
