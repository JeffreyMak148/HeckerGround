package com.heckerForum.heckerForum.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.exception.PostNotFoundException;
import com.heckerForum.heckerForum.models.Bookmark;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.BookmarkRepository;
import com.heckerForum.heckerForum.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
public class BookmarkService {

  @Autowired
  private BookmarkRepository bookmarkRepository;

  @Autowired
  private PostRepository postRepository;

  public List<PostDto> findByUserAndPagination(User user, Integer pageNo, Integer pageSize, String sortBy)
      throws Exception {

    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Order.desc(sortBy)));

    Page<Bookmark> result = bookmarkRepository.findByUser(user, paging);

    return result.hasContent() ? result.getContent()
                                       .stream()
                                       .map(bookmark -> new PostDto(bookmark.getPost()))
                                       .toList()
        : new ArrayList<PostDto>();
  }

  @Transactional
  public PostDto toggleBookmark(User user, Long postId) throws Exception {
    Bookmark bookmark = user.getBookmarkedPosts()
                            .stream()
                            .filter(b -> b.getPost().getId().equals(postId))
                            .findFirst()
                            .orElse(null);

    if (bookmark == null) {
      // Not exist (Not bookmarked)
      Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException());
      Bookmark newBookmark = new Bookmark();
      newBookmark.setUser(user);
      newBookmark.setPost(post);
      user.getBookmarkedPosts().add(newBookmark);
      post = bookmarkRepository.save(newBookmark).getPost();
      return new PostDto(post);
    } else {
      bookmarkRepository.delete(bookmark);
      user.getBookmarkedPosts().remove(bookmark);
      return new PostDto(bookmark.getPost());
    }
  }
  
  @Transactional
  public void deleteByUser(User user) throws Exception {
    bookmarkRepository.deleteByUser(user);
    user.getBookmarkedPosts().clear();
  }

}
