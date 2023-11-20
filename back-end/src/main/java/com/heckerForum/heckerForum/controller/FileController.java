package com.heckerForum.heckerForum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.heckerForum.heckerForum.service.FileService;

@RestController
@RequestMapping("/api/file")
@Profile({ "local", "dev", "prod" })
public class FileController extends BaseController {

  @Autowired
  private FileService fileService;

  @PostMapping(
      path = "", 
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> uploadFiles(@RequestParam("file") MultipartFile req) throws Exception {
    String fileSrc = fileService.uploadImage(req);
    return generateResponseEntity(fileSrc);
  }

}
