package com.heckerForum.heckerForum.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;

import org.apache.http.entity.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;

@Service
@Profile({ "local", "dev", "prod" })
public class FileService {

  @Value("${AWS_S3_IMAGE_BUCKET_NAME}")
  private String imageBucketName;

  @Value("${AWS_CLOUDFRONT_URL_SRC}")
  private String cloudfrontUrlSrc;
  
  @Value("${FILE_COMPRESSION_QUALITY}")
  private float fileCompressionQuality;

  @Autowired
  private AmazonS3 s3;

  public void save(String bucketName, 
                   String fileName, 
                   InputStream inputStream,
                   String contentType,
                   Optional<Map<String, String>> optionalMetadata) {
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentType(contentType);
    optionalMetadata.ifPresent(map -> {
      if (!map.isEmpty()) {
        map.forEach(metadata::addUserMetadata);
      }
    });

    try {
      s3.putObject(bucketName, fileName, inputStream, metadata);
    } catch (AmazonServiceException e) {
      throw new IllegalStateException("Failed to upload file to s3", e);
    }
  }

  public String uploadImage(MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Cannot upload empty file");
    }

    if (!Arrays.asList(ContentType.IMAGE_JPEG.getMimeType(), ContentType.IMAGE_PNG.getMimeType(),
        ContentType.IMAGE_GIF.getMimeType()).contains(file.getContentType())) {
      throw new IllegalArgumentException("File must be an image");
    }
    
    String filename = String.format("%s.%s", UUID.randomUUID().toString(),
        StringUtils.getFilenameExtension(file.getOriginalFilename()));
    String fileSrc = String.format("%s/%s", cloudfrontUrlSrc, filename);
    
    Iterator<ImageWriter> writers = ImageIO.getImageWritersByMIMEType(file.getContentType());
    
    if(writers.hasNext()) {
      // Compress image
      BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
      ImageWriter writer = writers.next();
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      writer.setOutput(ImageIO.createImageOutputStream(outputStream));
      ImageWriteParam params = writer.getDefaultWriteParam();
      params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
      params.setCompressionQuality(fileCompressionQuality);
      
      writer.write(null, new IIOImage(bufferedImage, null, null), params);
      writer.dispose();
      outputStream.flush();
      ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
      
      Map<String, String> metadata = new HashMap<>();
      metadata.put("Content-Type", file.getContentType());
      metadata.put("Content-Length", String.valueOf(outputStream.size()));
      save(imageBucketName, filename, inputStream, file.getContentType(), Optional.of(metadata));
      return fileSrc;
      
    } else {
      Map<String, String> metadata = new HashMap<>();
      metadata.put("Content-Type", file.getContentType());
      metadata.put("Content-Length", String.valueOf(file.getSize()));

      try {
        save(imageBucketName, filename, file.getInputStream(), file.getContentType(), Optional.of(metadata));
        return fileSrc;
      } catch (IOException e) {
        throw new IllegalStateException(e);
      }
    }

  }

}
