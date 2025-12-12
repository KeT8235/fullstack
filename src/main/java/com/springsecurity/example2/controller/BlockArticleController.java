package com.springsecurity.example2.controller;

import com.springsecurity.example2.dto.BlockArticleRequestDTO;
import com.springsecurity.example2.service.BlockArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/block-articles")
@RequiredArgsConstructor
public class BlockArticleController {
    private final BlockArticleService blockArticleService;

    @PostMapping("/{id}")
    public ResponseEntity<String> saveBlockArticle(@PathVariable Long id, @RequestBody BlockArticleRequestDTO dto) {
        try {
            blockArticleService.saveArticle(id, dto);
            return ResponseEntity.ok("저장 성공");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlockArticleRequestDTO> getBlockArticle(@PathVariable Long id) {
        try {
            BlockArticleRequestDTO dto = blockArticleService.loadArticle(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
