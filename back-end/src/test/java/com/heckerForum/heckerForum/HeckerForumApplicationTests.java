package com.heckerForum.heckerForum;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;

import com.heckerForum.heckerForum.controller.AuthControllerIntegrationTest;
import com.heckerForum.heckerForum.controller.CommentControllerIntegrationTest;
import com.heckerForum.heckerForum.controller.PostControllerIntegrationTest;
import com.heckerForum.heckerForum.controller.UserControllerIntegrationTest;

@Suite
@SelectClasses({
  AuthControllerIntegrationTest.class,
  UserControllerIntegrationTest.class,
  PostControllerIntegrationTest.class,
  CommentControllerIntegrationTest.class
})
public class HeckerForumApplicationTests {
}
