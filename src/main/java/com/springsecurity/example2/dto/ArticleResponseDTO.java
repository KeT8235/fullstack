package com.springsecurity.example2.dto;

import com.springsecurity.example2.entity.Article;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ArticleResponseDTO {
    private final Long id;
    private final String title;
    private final String content;
    private final String authorLoginId;
    private final String authorNickname;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ArticleResponseDTO(Article article) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.content = article.getContent();
        this.authorLoginId = article.getAuthor().getLoginId();
        this.authorNickname = article.getAuthor().getNickname();
        this.createdAt = article.getCreatedAt();
        this.updatedAt = article.getUpdatedAt();
    }
}
