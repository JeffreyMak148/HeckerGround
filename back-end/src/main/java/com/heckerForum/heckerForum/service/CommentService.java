package com.heckerForum.heckerForum.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.CommentResponse;
import com.heckerForum.heckerForum.exception.CommentNotFoundException;
import com.heckerForum.heckerForum.exception.PostNotFoundException;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.models.Vote;
import com.heckerForum.heckerForum.models.VoteType;
import com.heckerForum.heckerForum.repository.CommentRepository;
import com.heckerForum.heckerForum.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
public class CommentService {

  @Autowired
  private CommentRepository commentRepository;

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private VoteService voteService;

  @Transactional
  public CommentDto save(Post post, User user, String content, String plainText, Long replyCommentId,
      List<String> imageSrcs) throws Exception {
    Comment comment = new Comment();
    if(post == null) {
      throw new PostNotFoundException();
    }
    Comment replyComment = null;
    if (replyCommentId != null) {
      replyComment = commentRepository.findById(replyCommentId).orElse(null);
      replyComment.setNumberOfReply(replyComment.getNumberOfReply() + 1);
      replyComment = commentRepository.save(replyComment);
    }
    Set<Comment> allComments = commentRepository.findByPost(post);

    post.setNumOfReplies(allComments.size() + 1);
    post = postRepository.save(post);

    comment.setUser(user);
    comment.setPost(post);
    comment.setContent(content);
    comment.setPlainText(plainText);
    comment.setCreateDateTime(LocalDateTime.now());
    comment.setReplyComment(replyComment);
    comment.setCommentNumber(allComments.size() + 1);
    comment.setNumberOfReply(0);
    // TODO: set schedule task to clear any image src in s3 bucket that is not
    // associated with any comments
    comment.setImageSrcs(imageSrcs);

    comment = commentRepository.save(comment);

    if (replyCommentId == null || replyComment.getCommentNumber() == 1) {
      // Replying to post
      // Send notification to post owner
      // Comment poster is not post owner
      if (!comment.getUser().getId().equals(post.getUser().getId())) {
        notificationService.createAndSaveReplyPostNotification(post.getUser(), post, comment);
      }

    } else {
      // Replying to comment
      // Send notification to comment owner
      notificationService.createAndSaveReplyCommentNotification(replyComment.getUser(), post, replyComment);
      if (!replyComment.getUser().getId().equals(post.getUser().getId())) {
        // Comment poster is not post owner
        // Send notification to post owner
        notificationService.createAndSaveReplyPostNotification(post.getUser(), post, comment);
      }
    }

    return new CommentDto(comment);
  }

  @Transactional
  public CommentDto save(Long postId, User user, String content, String plainText, Long replyCommentId,
      List<String> imageSrcs) throws Exception {
    Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException());
    return save(post, user, content, plainText, replyCommentId, imageSrcs);
  }

  @Transactional
  public CommentDto saveUpvote(Long commentId, User user) throws Exception {
    if (user.getVotedComments().stream().anyMatch(v -> v.getComment().getId().equals(commentId))) {
      // Already voted comment;
      return new CommentDto();
    }
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CommentNotFoundException(ErrorMessageConstant.COMMENT_NOT_FOUND));
    comment.setUpvote(comment.getUpvote() + 1);
    comment = commentRepository.save(comment);

    Vote vote = new Vote();
    vote.setUser(user);
    vote.setComment(comment);
    vote.setType(VoteType.UPVOTE);
    user.getVotedComments().add(vote);
    vote = voteService.save(vote);
    // Send notification
    if (comment.getCommentNumber() == 1) {
      Post post = comment.getPost();
      post.setUpvote(comment.getUpvote());
      postRepository.save(post);
      notificationService.createAndSaveUpvotePostNotification(comment.getUser(), comment.getPost(), comment);
    } else {
      notificationService.createAndSaveUpvoteCommentNotification(comment.getUser(), comment);
    }
    return new CommentDto(comment);
  }

  @Transactional
  public CommentDto saveDownvote(Long commentId, User user) throws Exception {
    if (user.getVotedComments().stream().anyMatch(v -> v.getComment().getId().equals(commentId))) {
      // Already voted comment;
      return new CommentDto();
    }
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CommentNotFoundException(ErrorMessageConstant.COMMENT_NOT_FOUND));
    comment.setDownvote(comment.getDownvote() + 1);
    comment = commentRepository.save(comment);
    Vote vote = new Vote();
    vote.setUser(user);
    vote.setComment(comment);
    vote.setType(VoteType.DOWNVOTE);
    user.getVotedComments().add(vote);
    vote = voteService.save(vote);
    // Send notification
    if (comment.getCommentNumber() == 1) {
      Post post = comment.getPost();
      post.setDownvote(comment.getDownvote());
      postRepository.save(post);
      notificationService.createAndSaveDownvotePostNotification(comment.getUser(), comment.getPost(), comment);
    } else {
      notificationService.createAndSaveDownvoteCommentNotification(comment.getUser(), comment);
    }
    return new CommentDto(comment);
  }

  public List<CommentDto> findAllByPagination(Integer pageNo, Integer pageSize, String sortBy, User loggedInUser) {
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));

    Page<Comment> result = commentRepository.findAll(paging);

    if (result.hasContent()) {
      return result.getContent().stream().map(comment -> new CommentDto(comment)).toList();
    } else {
      return new ArrayList<CommentDto>();
    }
  }

  public CommentResponse findByCommentId(Long commentId, User loggedInUser) {
    Comment comment = commentRepository.findById(commentId).orElse(null);
    List<CommentDto> replyComments = new ArrayList<CommentDto>();
    if (comment != null) {
      replyComments = commentRepository.findByReplyComment(comment).stream()
          .map(replyComment -> new CommentDto(replyComment)).toList();
    }
    return new CommentResponse(new CommentDto(comment), replyComments);
  }

  public List<CommentDto> findByPostIdAndPagination(Long postId, Integer pageNo, Integer pageSize, Sort sortBy,
      User loggedInUser) {
    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return null;
    }
    Pageable paging = PageRequest.of(pageNo, pageSize, sortBy);
    Page<Comment> result = commentRepository.findByPost(post, paging);
    return result.hasContent() ? result.getContent().stream().map(comment -> new CommentDto(comment)).toList()
        : new ArrayList<CommentDto>();
  }

  public List<CommentDto> findByPostAndPagination(Post post, Integer pageNo, Integer pageSize, Sort sortBy,
      User loggedInUser) {
    if (post == null) {
      return null;
    }
    Pageable paging = PageRequest.of(pageNo, pageSize, sortBy);
    Page<Comment> result = commentRepository.findByPost(post, paging);
    return result.hasContent() ? result.getContent().stream().map(comment -> new CommentDto(comment)).toList()
        : new ArrayList<CommentDto>();
  }

}
