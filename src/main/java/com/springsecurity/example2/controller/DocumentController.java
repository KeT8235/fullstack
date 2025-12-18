package com.springsecurity.example2.controller;

import com.springsecurity.example2.config.PrincipalDetails;
import com.springsecurity.example2.dto.DocumentDTO;
import com.springsecurity.example2.entity.Document;
import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.repository.DocumentRepository;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository; // 저자를 찾기 위해 필요

    // 문서 생성
    @PostMapping
    public ResponseEntity<DocumentDTO> createDocument(
            @RequestBody DocumentDTO documentDTO,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        User author = userRepository.findByLoginId(principalDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Document document = Document.builder()
                .title(documentDTO.getTitle())
                .content(documentDTO.getContent())
                .author(author)
                .build();

        Document savedDocument = documentRepository.save(Objects.requireNonNull(document));
        return new ResponseEntity<>(convertToDto(savedDocument), HttpStatus.CREATED);
    }

    // 사용자 자신의 모든 문서 조회
    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getMyDocuments(
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        User author = userRepository.findByLoginId(principalDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<Document> documents = documentRepository.findByAuthor(author);
        List<DocumentDTO> documentDTOS = documents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(documentDTOS);
    }

    // 특정 문서 조회 (소유자만)
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<DocumentDTO> getDocumentById(
                        @PathVariable long id,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        Document document = documentRepository.findById(nonNullId)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다."));

        if (!document.getAuthor().getLoginId().equals(principalDetails.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 권한 없음
        }
        return ResponseEntity.ok(convertToDto(document));
    }

    // 문서 수정 (소유자만)
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<DocumentDTO> updateDocument(
                        @PathVariable long id,
            @RequestBody DocumentDTO documentDTO,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        Document document = documentRepository.findById(nonNullId)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다."));

        if (!document.getAuthor().getLoginId().equals(principalDetails.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 권한 없음
        }

        document.setTitle(documentDTO.getTitle());
        document.setContent(documentDTO.getContent());
                Document updatedDocument = documentRepository.save(Objects.requireNonNull(document));
        return ResponseEntity.ok(convertToDto(updatedDocument));
    }

    // 문서 삭제 (소유자만)
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteDocument(
                        @PathVariable long id,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        @SuppressWarnings("null")
        Long nonNullId = Long.valueOf(id);

        Document document = documentRepository.findById(nonNullId)
                .orElseThrow(() -> new RuntimeException("문서를 찾을 수 없습니다."));

        if (!principalDetails.isAdmin() && !document.getAuthor().getLoginId().equals(principalDetails.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 권한 없음
        }

        documentRepository.delete(document);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private DocumentDTO convertToDto(Document document) {
        return DocumentDTO.builder()
                .id(document.getId())
                .title(document.getTitle())
                .content(document.getContent())
                .authorLoginId(document.getAuthor().getLoginId())
                .build();
    }
}
