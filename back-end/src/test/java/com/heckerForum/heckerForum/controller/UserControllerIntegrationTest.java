package com.heckerForum.heckerForum.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.models.User;

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@TestInstance(Lifecycle.PER_CLASS)
@ActiveProfiles({ "test" })
public class UserControllerIntegrationTest extends IntegrationBaseTest {

  private User user;
  private PostDto post;

  @BeforeAll
  public void setup() throws Exception {
    user = createUser("testUsername", "testPw", "testEmail");

    post = createPost(user, 1, "testTitle", "testContent", "testPlainText", null);
  }

  @AfterAll
  public void tearDown() {
    deleteDatasFromAllTables();
  }

  @Test
  public void testGetUserFail() throws Exception {
    MockHttpServletResponse response = getUrl("/api/profile/user/100");
    assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION));
  }

  @Test
  public void testGetUserSuccess() throws Exception {
    MockHttpServletResponse response = getUrl("/api/profile/user/" + user.getId());
    assertEquals(HttpStatus.OK.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains("testUsername"));
  }

  @Test
  public void testGetProfileFail() throws Exception {
    MockHttpServletResponse response = getUrl("/api/profile/100");
    assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION));
  }

  @Test
  public void testGetProfileSuccess() throws Exception {
    MockHttpServletResponse response = getUrl("/api/profile/" + user.getId());
    assertEquals(HttpStatus.OK.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains("testUsername"));
    assertTrue(response.getContentAsString().contains("testTitle"));
  }
}
