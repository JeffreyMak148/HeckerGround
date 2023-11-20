package com.heckerForum.heckerForum.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.models.Vote;
import com.heckerForum.heckerForum.models.VoteKey;

public interface VoteRepository extends JpaRepository<Vote, VoteKey> {
  List<Vote> findByUser(User user);

  @Query(value = "SELECT * FROM vote v WHERE v.user_id = ?1 AND v.comment_id = ?2 ", 
          nativeQuery = true)
  Optional<Vote> findByUserIdAndCommentId(Long userId, Long commentId);

}
