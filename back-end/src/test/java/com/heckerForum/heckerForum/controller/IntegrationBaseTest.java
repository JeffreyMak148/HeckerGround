package com.heckerForum.heckerForum.controller;

import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.HmacUtils;
import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.jdbc.JdbcTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.utility.DockerImageName;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.UserRepository;
import com.heckerForum.heckerForum.service.CommentService;
import com.heckerForum.heckerForum.service.PostService;

@AutoConfigureMockMvc
abstract class IntegrationBaseTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Autowired
  private HmacUtils emailHash;

  @Autowired
  private Hashids hashIds;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private PostService postService;

  @Autowired
  private CommentService commentService;

  @Autowired
  private UserRepository userRepository;

  static final MySQLContainer<?> MY_SQL_CONTAINER;

  protected static final String USER_TABLE_NAME = "users";
  protected static final String POST_TABLE_NAME = "post";
  protected static final String COMMENT_TABLE_NAME = "comment";
  protected static final String BOOKMARK_TABLE_NAME = "bookmark";
  protected static final String NOTIFICATION_TABLE_NAME = "notification";
  protected static final String VOTE_TABLE_NAME = "vote";

  private static final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

  static {
    MY_SQL_CONTAINER = new MySQLContainer<>(DockerImageName.parse("mysql:8.0.33"));
    MY_SQL_CONTAINER.start();
  }

  @DynamicPropertySource
  static void setTestProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", () -> MY_SQL_CONTAINER.getJdbcUrl());

    registry.add("spring.datasource.username", () -> MY_SQL_CONTAINER.getUsername());
    registry.add("spring.datasource.password", () -> MY_SQL_CONTAINER.getPassword());
  }

  public MockHttpServletResponse getUrl(String url) throws Exception {
    ResultActions resultActions = mockMvc.perform(
                                    MockMvcRequestBuilders
                                    .get(url));
    MvcResult mvcResult = resultActions.andReturn();
    MockHttpServletResponse response = mvcResult.getResponse();
    return response;
  }

  public MockHttpServletResponse getUrl(String url, Map<String, Object> requestBody) throws Exception {

    ObjectMapper objectMapper = new ObjectMapper();

    ResultActions resultActions = mockMvc.perform(
                                    MockMvcRequestBuilders
                                    .get(url)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(requestBody)));
    MvcResult mvcResult = resultActions.andReturn();
    MockHttpServletResponse response = mvcResult.getResponse();
    return response;
  }

  public MockHttpServletResponse postUrl(String url) throws Exception {
    ResultActions resultActions = mockMvc.perform(
                                    MockMvcRequestBuilders
                                    .post(url));
    MvcResult mvcResult = resultActions.andReturn();
    MockHttpServletResponse response = mvcResult.getResponse();
    return response;
  }

  public MockHttpServletResponse postUrl(String url, Map<String, Object> requestBody) throws Exception {

    ResultActions resultActions = mockMvc.perform(
                                    MockMvcRequestBuilders
                                    .post(url)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(requestBody)));
    MvcResult mvcResult = resultActions.andReturn();
    MockHttpServletResponse response = mvcResult.getResponse();
    return response;
  }

  public <T> T responseToObject(MockHttpServletResponse response, Class<T> object) throws Exception {
    // TODO: Map response json to object (Resolve maskedId deserializing problem)
    return objectMapper.readValue(response.getContentAsString(), object);
  }

  public User createUser(String username, String password, String email) {
    User user = new User(username, encodePassword(password), emailHash.hmacHex(email));
    user.setEnabled(true);
    return userRepository.save(user);
  }

  public PostDto createPost(User user, Integer catId, String title, String content, String plainTxt,
      List<String> imageSrcs) throws Exception {
    return postService.save(user, catId, title, content, plainTxt, imageSrcs);
  }

  public CommentDto createComment(Long postId, User user, String content, String plainText, Long replyCommentId,
      List<String> imageSrcs) throws Exception {
    return commentService.save(postId, user, content, plainText, replyCommentId, imageSrcs);
  }

  public void login(String email, String password) {
    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(hashEmail(email), password));

    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  public void login(User user) {
    UsernamePasswordAuthenticationToken authentication = 
        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  public String encodePassword(String password) {
    return passwordEncoder.encode(password);
  }

  public String hashEmail(String email) {
    return emailHash.hmacHex(email);
  }

  public String hashId(Long id) {
    return hashIds.encode(id);
  }

  protected void deleteDatasFromAllTables() {
    JdbcTestUtils.deleteFromTables(jdbcTemplate, 
        VOTE_TABLE_NAME, 
        BOOKMARK_TABLE_NAME, 
        NOTIFICATION_TABLE_NAME,
        COMMENT_TABLE_NAME, 
        POST_TABLE_NAME, 
        USER_TABLE_NAME);
  }
}
