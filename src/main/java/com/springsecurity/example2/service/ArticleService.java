package com.springsecurity.example2.service;

import com.springsecurity.example2.dto.ArticleCreateRequestDTO;
import com.springsecurity.example2.dto.ArticleUpdateRequestDTO;
import com.springsecurity.example2.entity.Article;
import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.repository.ArticleRepository;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    @SuppressWarnings("null")
    public Article findById(long id) {
        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        return articleRepository.findById(nonNullId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
    }

    @Transactional
    public Article save(ArticleCreateRequestDTO requestDTO, String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        Article article = Article.builder()
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .author(user)
                .build();
        return articleRepository.save(Objects.requireNonNull(article));
    }

    @Transactional
    @SuppressWarnings("null")
    public Article update(long id, ArticleUpdateRequestDTO requestDTO, String loginId) {
        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        Article article = articleRepository.findById(nonNullId)
            .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        User currentUser = userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        boolean isAuthor = article.getAuthor().getLoginId().equals(loginId);
        boolean isAdmin = currentUser.getRole() == com.springsecurity.example2.entity.UserRole.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new IllegalStateException("You are not authorized to update this article.");
        }

        article.update(requestDTO.getTitle(), requestDTO.getContent());
        return article;
    }

    @Transactional
    @SuppressWarnings("null")
    public void delete(long id, String loginId) {
        User currentUser = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        Article article = articleRepository.findById(nonNullId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        // 현재 사용자가 관리자도 아니고, 게시글 작성자도 아닌 경우에만 예외 발생
        boolean isAdmin = currentUser.getRole().equals(com.springsecurity.example2.entity.UserRole.ADMIN);
        boolean isAuthor = article.getAuthor().getLoginId().equals(loginId);

        if (!isAdmin && !isAuthor) {
            throw new IllegalStateException("You are not authorized to delete this article.");
        }

        articleRepository.delete(article);
    }
}
