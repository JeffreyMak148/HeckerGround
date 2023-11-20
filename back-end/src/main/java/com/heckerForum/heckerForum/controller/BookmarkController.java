package com.heckerForum.heckerForum.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.BookmarkResponse;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.dto.TopicResponse;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.BookmarkService;
import com.heckerForum.heckerForum.service.PostService;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController extends BaseController {

  @Autowired
  private BookmarkService bookmarkService;

  @Autowired
  private PostService postService;

  @GetMapping("")
  public ResponseEntity<?> getBookmarkByPagination(@RequestParam(name = "page", defaultValue = "0") Integer page,
      @RequestParam(name = "size", defaultValue = "20") Integer size, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    if (loggedInUser == null) {
      return generateResponseEntity(null);
    }
    List<PostDto> bookmarkedPosts = bookmarkService.findByUserAndPagination(loggedInUser, page, size, "id");
    TopicResponse response = new TopicResponse();
    response.setTopics(bookmarkedPosts);
    return generateResponseEntity(response);
  }

  @PostMapping("/{encodedPostId}")
  public ResponseEntity<?> toggleBookmark(@PathVariable String encodedPostId,
      @AuthenticationPrincipal User loggedInUser) throws Exception {
    if (loggedInUser == null || encodedPostId == null) {
      return generateResponseEntity(null);
    }

    Long postId = postService.decodePostId(encodedPostId);

    return generateResponseEntity(new BookmarkResponse(bookmarkService.toggleBookmark(loggedInUser, postId)));
  }

}
