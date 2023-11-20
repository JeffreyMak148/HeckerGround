package com.heckerForum.heckerForum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.heckerForum.heckerForum.models.Authority;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}