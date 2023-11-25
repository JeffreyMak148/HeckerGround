package com.heckerForum.heckerForum.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.dto.PostResponse;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private CommentService commentService;

  @Autowired
  private Hashids hashIds;

  @Transactional
  public PostDto save(User user, Integer catId, String title, String content, String plainText, List<String> imageSrcs)
      throws Exception {
    Post post = new Post();

    post.setUser(user);
    post.setCatId(catId);
    post.setTitle(title);
    post.setCreateDateTime(LocalDateTime.now());

    // Create post
    Post createdPost = postRepository.save(post);
    // Create first comment
    PostDto postDto = commentService.save(createdPost, user, content, plainText, null, imageSrcs).getPost();

    return postDto;
  }

  public List<PostDto> findAll() {
    return postRepository.findAll().stream().map(post -> new PostDto(post)).toList();
  }

  public List<PostDto> findAllByPagination(Integer pageNo, Integer pageSize, String sortBy) {
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));

    Page<Post> result = postRepository.findAll(paging);

    if (result.hasContent()) {
      return result.getContent().stream().map(post -> new PostDto(post)).toList();
    } else {
      return new ArrayList<PostDto>();
    }
  }

  public List<PostDto> findByUser(User user) {
    return postRepository.findByUser(user).stream().map(post -> new PostDto(post)).toList();
  }

  public List<PostDto> findByUserAndPagination(User user, Pageable paging) {
    Page<Post> result = postRepository.findByUser(user, paging);
    return result.hasContent() ? result.getContent().stream().map(post -> new PostDto(post)).toList()
        : new ArrayList<PostDto>();
  }

  public Optional<PostDto> findById(Long postId) {
    return postRepository.findById(postId).map(post -> new PostDto(post));
  }

  public List<PostDto> findByPostIds(List<Long> postIds) {
    return postRepository.findAllById(postIds).stream().map(post -> new PostDto(post)).toList();
  }

  public PostResponse getPostResponseByIdAndPagination(Long postId, Integer pageStart, Integer pageEnd, Integer size,
      User loggedInUser) {
    Post post = postRepository.findById(postId).orElse(null);
    // Comments from page 0 to pageEnd
    Integer allPageSize = (pageEnd + 1) * size;
    List<CommentDto> comments = commentService.findByPostAndPagination(post, 0, allPageSize, "id", loggedInUser);
    // Filter comments from page 0 to pageStart
    Integer rangeEnd = pageStart * size;
    comments = comments.stream().filter(comment -> comment.getCommentNumber() > rangeEnd).toList();

    return new PostResponse(new PostDto(post), comments);
  }

  public List<PostDto> findByCategoryAndPagination(Integer catId, Integer pageNo, Integer pageSize, String sortBy) {
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Order.desc(sortBy)));

    Page<Post> result = postRepository.findByCatId(catId, paging);

    return result.hasContent() ? result.getContent().stream().map(post -> new PostDto(post)).toList()
        : new ArrayList<PostDto>();
  }

  public Long decodePostId(String encodedId) {
    return hashIds.decode(encodedId)[0];
  }

}
