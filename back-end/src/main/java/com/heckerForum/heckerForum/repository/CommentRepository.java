package com.heckerForum.heckerForum.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  Set<Comment> findByUser(User user);

  Set<Comment> findByPost(Post post);

  @Query(value = "SELECT * FROM comment c WHERE c.id = ?1 LIMIT 1", 
          nativeQuery = true)
  Optional<Comment> findById(Long id);

  Page<Comment> findByPost(Post post, Pageable pageable);

  List<Comment> findByReplyComment(Comment replyComment);

  @Query(value = "SELECT COUNT(*) FROM comment c1 INNER JOIN comment r1 ON c1.id = r1.reply_comment_id"
          + " WHERE c1.id = ?1", 
          nativeQuery = true)
  Integer findNumberOfReplyComment(Long id);

}
