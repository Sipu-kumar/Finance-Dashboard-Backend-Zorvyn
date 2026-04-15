package com.finance.dashboard.repository;

import com.finance.dashboard.model.Record;
import com.finance.dashboard.model.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findByCategory(String category);

    List<Record> findByType(RecordType type);

    // Per-user fetch
    List<Record> findByUserEmail(String email);

    // Global aggregates (kept for backward compat)
    @Query("SELECT SUM(r.amount) FROM Record r WHERE r.type = com.finance.dashboard.model.RecordType.INCOME")
    Double getTotalIncome();

    @Query("SELECT SUM(r.amount) FROM Record r WHERE r.type = com.finance.dashboard.model.RecordType.EXPENSE")
    Double getTotalExpense();

    // Per-user aggregates
    @Query("SELECT SUM(r.amount) FROM Record r WHERE r.type = com.finance.dashboard.model.RecordType.INCOME AND r.user.email = :email")
    Double getTotalIncomeByUser(@Param("email") String email);

    @Query("SELECT SUM(r.amount) FROM Record r WHERE r.type = com.finance.dashboard.model.RecordType.EXPENSE AND r.user.email = :email")
    Double getTotalExpenseByUser(@Param("email") String email);
}