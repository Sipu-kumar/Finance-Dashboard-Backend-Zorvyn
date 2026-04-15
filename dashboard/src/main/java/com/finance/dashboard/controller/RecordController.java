package com.finance.dashboard.controller;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.service.RecordService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/records")
public class RecordController {

    private final RecordService service;

    public RecordController(RecordService service) {
        this.service = service;
    }

    /** ADMIN and ANALYST can add records. */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Record create(@RequestBody Record record, Authentication auth) {
        return service.createRecord(record, auth.getName());
    }

    /** All authenticated roles can view records — scoped to their own data. */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping
    public List<Record> getAll(Authentication auth) {
        return service.getAllRecords(auth.getName());
    }

    /** Only ADMIN can delete records. */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteRecord(id);
    }
}