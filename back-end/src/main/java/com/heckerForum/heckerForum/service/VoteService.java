package com.heckerForum.heckerForum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.models.Vote;
import com.heckerForum.heckerForum.repository.VoteRepository;

@Service
public class VoteService {

  @Autowired
  private VoteRepository voteRepository;

  public Vote save(Vote vote) {
    return voteRepository.save(vote);
  }

}
