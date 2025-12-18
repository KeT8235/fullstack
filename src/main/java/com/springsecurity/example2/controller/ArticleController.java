package com.springsecurity.example2.controller;

import com.springsecurity.example2.dto.ArticleCreateRequestDTO;
import com.springsecurity.example2.dto.ArticleResponseDTO;
import com.springsecurity.example2.dto.ArticleUpdateRequestDTO;
import com.springsecurity.example2.entity.Article;
import com.springsecurity.example2.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleResponseDTO>> getAllArticles() {
        List<ArticleResponseDTO> articles = articleService.findAll()
                .stream()
                .map(ArticleResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> getArticle(@PathVariable long id) {
        Article article = articleService.findById(id);
        return ResponseEntity.ok(new ArticleResponseDTO(article));
    }

    @PostMapping
    public ResponseEntity<ArticleResponseDTO> createArticle(@RequestBody ArticleCreateRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginId = authentication.getName();

        Article savedArticle = articleService.save(requestDTO, loginId);
        return ResponseEntity.ok(new ArticleResponseDTO(savedArticle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> updateArticle(@PathVariable long id, @RequestBody ArticleUpdateRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginId = authentication.getName();

        Article updatedArticle = articleService.update(id, requestDTO, loginId);
        return ResponseEntity.ok(new ArticleResponseDTO(updatedArticle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginId = authentication.getName();

        articleService.delete(id, loginId);
        return ResponseEntity.noContent().build();
    }
}
