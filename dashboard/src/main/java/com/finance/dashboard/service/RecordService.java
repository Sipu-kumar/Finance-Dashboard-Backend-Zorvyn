package com.finance.dashboard.service;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.RecordRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RecordService {

    private final RecordRepository repo;
    private final UserRepository userRepo;

    public RecordService(RecordRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    /**
     * Create a record and associate it with the currently-logged-in user.
     */
    public Record createRecord(Record record, String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        record.setUser(user);
        return repo.save(record);
    }

    /**
     * Return only the records that belong to the currently-logged-in user.
     */
    public List<Record> getAllRecords(String userEmail) {
        return repo.findByUserEmail(userEmail);
    }

    /**
     * Delete a record by ID (ADMIN only — enforced at controller level).
     */
    public void deleteRecord(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
        }
        repo.deleteById(id);
    }
}