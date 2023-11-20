package com.heckerForum.heckerForum.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;

public interface PostRepository extends JpaRepository<Post, Long> {
  List<Post> findByUser(User user);

  Page<Post> findByUser(User user, Pageable pageable);

  List<Post> findByCatId(Integer catId);

  Page<Post> findByCatId(Integer catId, Pageable pageable);
}
