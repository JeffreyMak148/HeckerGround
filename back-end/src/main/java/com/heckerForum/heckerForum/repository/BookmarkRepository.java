package com.heckerForum.heckerForum.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.heckerForum.heckerForum.models.Bookmark;
import com.heckerForum.heckerForum.models.BookmarkKey;
import com.heckerForum.heckerForum.models.User;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkKey> {
  List<Bookmark> findByUser(User user);

  Page<Bookmark> findByUser(User user, Pageable pageable);

  @Query(value = "SELECT * FROM bookmark b WHERE b.user_id = ?1 AND b.post_id = ?2 ", 
          nativeQuery = true)
  Optional<Bookmark> findByUserIdAndPostId(Long userId, Long postId);

}
