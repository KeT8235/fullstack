package com.springsecurity.example2.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springsecurity.example2.dto.BlockArticleRequestDTO;
import com.springsecurity.example2.dto.BlockDTO;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class BlockArticleService {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String basePath = "block_articles/";

    public void saveArticle(Long id, BlockArticleRequestDTO dto) throws IOException {
        Files.createDirectories(Paths.get(basePath));
        String filePath = basePath + id + ".json";
        objectMapper.writeValue(new File(filePath), dto);
    }

    public BlockArticleRequestDTO loadArticle(Long id) throws IOException {
        String filePath = basePath + id + ".json";
        return objectMapper.readValue(new File(filePath), BlockArticleRequestDTO.class);
    }

    public List<BlockDTO> loadBlocks(Long id) throws IOException {
        return loadArticle(id).getBlocks();
    }
}
